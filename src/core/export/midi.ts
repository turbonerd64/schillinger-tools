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

export interface MultiTrackNote {
  tick: number; // in atomic time units (e.g. 1 unit = 16th note, 4 units = quarter note)
  durationUnits: number;
  pitches: number[];
  velocity?: number;
  gateRatio?: number;
}

export interface MultiTrackDefinition {
  name: string;
  channel: number; // 0 to 15 (e.g. 0 = chords, 1 = bass, 9 = GM drums)
  notes: MultiTrackNote[];
}

/**
 * Builds a multi-track Standard MIDI File (SMF Format 1) with separated channels
 */
export function buildMultiTrackMidiFile(
  tracks: MultiTrackDefinition[],
  bpm: number = 120,
  masterName: string = 'Schillinger Studio Arrangement'
): Uint8Array {
  const ticksPerQuarter = 480;
  const ticksPerUnit = ticksPerQuarter / 4; // 120 ticks per atomic unit

  const allChunks: number[] = [];

  // Track 0: Conductor Track (Tempo, Time Signature, Master Name)
  const conductorEvents: number[] = [];
  const masterNameBytes = strToBytes(masterName);
  conductorEvents.push(0x00, 0xff, 0x03, masterNameBytes.length, ...masterNameBytes);

  // Time signature 4/4 (Delta 0, FF 58 04 04 02 18 08)
  conductorEvents.push(0x00, 0xff, 0x58, 0x04, 0x04, 0x02, 0x18, 0x08);

  // Set Tempo (FF 51 03)
  const microsecondsPerQuarter = Math.round(60000000 / bpm);
  conductorEvents.push(
    0x00,
    0xff,
    0x51,
    0x03,
    (microsecondsPerQuarter >> 16) & 0xff,
    (microsecondsPerQuarter >> 8) & 0xff,
    microsecondsPerQuarter & 0xff
  );

  // End of Conductor Track
  conductorEvents.push(0x00, 0xff, 0x2f, 0x00);

  const conductorChunk = [
    ...strToBytes('MTrk'),
    ...write32(conductorEvents.length),
    ...conductorEvents,
  ];

  // Build each instrument track
  const instrumentChunks: number[][] = [];

  for (const trk of tracks) {
    const trkEvents: number[] = [];
    const trkNameBytes = strToBytes(trk.name);
    trkEvents.push(0x00, 0xff, 0x03, trkNameBytes.length, ...trkNameBytes);

    // Collect discrete note ON and note OFF events
    interface RawEvent {
      tick: number;
      isOff: boolean;
      pitch: number;
      velocity: number;
    }

    const rawList: RawEvent[] = [];

    for (const note of trk.notes) {
      const startTick = Math.round(note.tick * ticksPerUnit);
      const totalTicks = Math.max(10, Math.round(note.durationUnits * ticksPerUnit));
      const gateTicks = Math.max(10, Math.round(totalTicks * (note.gateRatio ?? 0.85)));
      const endTick = startTick + gateTicks;
      const vel = note.velocity ?? 85;

      for (const p of note.pitches) {
        rawList.push({ tick: startTick, isOff: false, pitch: p, velocity: vel });
        rawList.push({ tick: endTick, isOff: true, pitch: p, velocity: 0 });
      }
    }

    // Sort events by tick time (note OFFs precede note ONs if at identical tick)
    rawList.sort((a, b) => {
      if (a.tick !== b.tick) return a.tick - b.tick;
      if (a.isOff !== b.isOff) return a.isOff ? -1 : 1;
      return a.pitch - b.pitch;
    });

    let lastTick = 0;
    const channelNibble = trk.channel & 0x0f;

    for (const ev of rawList) {
      const delta = Math.max(0, ev.tick - lastTick);
      trkEvents.push(...writeVarLen(delta));
      if (ev.isOff) {
        trkEvents.push(0x80 | channelNibble, ev.pitch, 0x00);
      } else {
        trkEvents.push(0x90 | channelNibble, ev.pitch, ev.velocity);
      }
      lastTick = ev.tick;
    }

    // End of Track
    trkEvents.push(0x00, 0xff, 0x2f, 0x00);

    instrumentChunks.push([
      ...strToBytes('MTrk'),
      ...write32(trkEvents.length),
      ...trkEvents,
    ]);
  }

  // Header chunk: Format 1, (1 conductor + tracks.length) tracks
  const totalTrackCount = 1 + tracks.length;
  const headerChunk = [
    ...strToBytes('MThd'),
    ...write32(6),
    ...write16(1), // Format 1
    ...write16(totalTrackCount),
    ...write16(ticksPerQuarter),
  ];

  allChunks.push(...headerChunk);
  allChunks.push(...conductorChunk);
  for (const ic of instrumentChunks) {
    allChunks.push(...ic);
  }

  return new Uint8Array(allChunks);
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

/**
 * Initiates browser download of multi-track MIDI file (SMF Format 1)
 */
export function downloadMultiTrackMidiFile(
  tracks: MultiTrackDefinition[],
  filename: string,
  bpm: number = 120,
  masterName?: string
) {
  const bytes = buildMultiTrackMidiFile(tracks, bpm, masterName);
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

