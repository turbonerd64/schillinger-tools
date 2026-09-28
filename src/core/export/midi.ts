/**
 * Pure TypeScript Standard MIDI File (SMF Format 0) Builder
 * Zero external dependencies. Generates valid .mid binary files directly in-browser.
 */

// Helper to encode variable length values as used in MIDI specs
function writeVarLen(value: number): number[] {
  let buffer = value & 0x7f;
  const bytes: number[] = [];

  while ((value >>= 7)) {
    buffer <<= 8;
    buffer |= (value & 0x7f) | 0x80;
  }

  while (true) {
    bytes.push(buffer & 0xff);
    if (buffer & 0x80) {
      buffer >>= 8;
    } else {
      break;
    }
  }

  return bytes;
}

// Convert string to ascii bytes
function strToBytes(str: string): number[] {
  return str.split('').map((c) => c.charCodeAt(0));
}

// Write 16-bit big-endian integer
function write16(val: number): number[] {
  return [(val >> 8) & 0xff, val & 0xff];
}

// Write 32-bit big-endian integer
function write32(val: number): number[] {
  return [(val >> 24) & 0xff, (val >> 16) & 0xff, (val >> 8) & 0xff, val & 0xff];
}

export interface MidiNoteEvent {
  durationUnits: number; // in atomic time units (e.g. 1 unit = 16th note, 4 units = quarter note)
  isAccented?: boolean;
  pitch?: number; // Single note pitch (GM 0-127)
  pitches?: number[]; // Polyphonic chord pitches triggered simultaneously
  velocity?: number; // Custom velocity override (default 85, or 120 if accented)
  gateRatio?: number; // Sustain gate ratio (e.g. 0.95 for sustained chords, 0.85 for percussion)
}

/**
 * Builds a standard MIDI file for the given durations sequence (supports monophonic and polyphonic chords)
 */
export function buildMidiFile(
  notes: MidiNoteEvent[],
  bpm: number = 120,
  trackName: string = 'Schillinger Resultant',
  midiPitch: number = 75 // Claves / Woodblock in General MIDI
): Uint8Array {
  const ticksPerQuarter = 480;
  // If 1 beat (quarter note) = 4 time units, then 1 unit = 120 ticks
  const ticksPerUnit = ticksPerQuarter / 4;

  const trackEvents: number[] = [];

  // Track Name meta event: Delta 0, FF 03 len text
  const nameBytes = strToBytes(trackName);
  trackEvents.push(0x00, 0xff, 0x03, nameBytes.length, ...nameBytes);

  // Set Tempo meta event: Delta 0, FF 51 03 microsecondsPerQuarter
  const microsecondsPerQuarter = Math.round(60000000 / bpm);
  trackEvents.push(
    0x00,
    0xff,
    0x51,
    0x03,
    (microsecondsPerQuarter >> 16) & 0xff,
    (microsecondsPerQuarter >> 8) & 0xff,
    microsecondsPerQuarter & 0xff
  );

  // Notes sequence
  let pendingDelta = 0;

  for (const note of notes) {
    const noteDurationTicks = Math.round(note.durationUnits * ticksPerUnit);
    const velocity = note.velocity ?? (note.isAccented ? 120 : 85);
    const pitches = note.pitches && note.pitches.length > 0 
      ? note.pitches 
      : [note.pitch ?? midiPitch];
    const gateRatio = note.gateRatio ?? (note.pitches && note.pitches.length > 1 ? 0.95 : 0.85);

    // Gate duration for note articulation
    const gateTicks = Math.max(10, Math.round(noteDurationTicks * gateRatio));
    const restTicks = Math.max(0, noteDurationTicks - gateTicks);

    // Note ON for all pitches simultaneously
    pitches.forEach((pitch, i) => {
      const delta = i === 0 ? pendingDelta : 0;
      trackEvents.push(...writeVarLen(delta));
      trackEvents.push(0x90, pitch, velocity);
    });

    // Note OFF for all pitches after gateTicks
    pitches.forEach((pitch, i) => {
      const delta = i === 0 ? gateTicks : 0;
      trackEvents.push(...writeVarLen(delta));
      trackEvents.push(0x80, pitch, 0x00);
    });

    pendingDelta = restTicks;
  }

  // End of Track meta event: Delta pendingDelta, FF 2F 00
  trackEvents.push(...writeVarLen(pendingDelta), 0xff, 0x2f, 0x00);

  // Header chunk: 'MThd' [4 bytes len = 6] [format 0] [1 track] [division = 480]
  const headerChunk = [
    ...strToBytes('MThd'),
    ...write32(6),
    ...write16(0), // Format 0
    ...write16(1), // 1 track
    ...write16(ticksPerQuarter),
  ];

  // Track chunk: 'MTrk' [4 bytes len] [trackEvents]
  const trackChunk = [
    ...strToBytes('MTrk'),
    ...write32(trackEvents.length),
    ...trackEvents,
  ];

  return new Uint8Array([...headerChunk, ...trackChunk]);
}

/**
 * Initiates browser download of MIDI file
 */
export function downloadMidiFile(
  notes: MidiNoteEvent[],
  filename: string,
  bpm: number = 120,
  trackName?: string
) {
  const bytes = buildMidiFile(notes, bpm, trackName);
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'audio/midi' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.mid') ? filename : `${filename}.mid`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
