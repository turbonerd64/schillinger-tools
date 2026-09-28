import { describe, it, expect } from 'vitest';
import { buildMidiFile, buildMultiTrackMidiFile } from './midi';

describe('Standard MIDI File Builder', () => {
  it('generates a valid MIDI binary byte array with MThd and MTrk chunks', () => {
    const notes = [
      { durationUnits: 3, isAccented: true },
      { durationUnits: 1, isAccented: false },
      { durationUnits: 2, isAccented: false },
    ];

    const bytes = buildMidiFile(notes, 120, 'Test Track');
    expect(bytes.length).toBeGreaterThan(20);

    // MThd header magic bytes: 0x4D 0x54 0x68 0x64
    expect(bytes[0]).toBe(0x4d); // M
    expect(bytes[1]).toBe(0x54); // T
    expect(bytes[2]).toBe(0x68); // h
    expect(bytes[3]).toBe(0x64); // d

    // Check track header presence
    const str = String.fromCharCode(...bytes.slice(0, 30));
    expect(str).toContain('MTrk');
  });

  it('generates polyphonic simultaneous chord events at delta 0', () => {
    const chords = [
      { durationUnits: 16, pitches: [48, 55, 60, 64], isAccented: false },
      { durationUnits: 16, pitches: [45, 52, 57, 60], isAccented: false },
    ];

    const bytes = buildMidiFile(chords, 100, 'Schillinger Chords');
    expect(bytes.length).toBeGreaterThan(40);

    // Verify all four pitches of chord 1 appear in Note ON events (0x90)
    expect(Array.from(bytes)).toEqual(expect.arrayContaining([0x90, 48]));
    expect(Array.from(bytes)).toEqual(expect.arrayContaining([0x90, 55]));
    expect(Array.from(bytes)).toEqual(expect.arrayContaining([0x90, 60]));
    expect(Array.from(bytes)).toEqual(expect.arrayContaining([0x90, 64]));

    // Verify all four pitches appear in Note OFF events (0x80)
    expect(Array.from(bytes)).toEqual(expect.arrayContaining([0x80, 48]));
    expect(Array.from(bytes)).toEqual(expect.arrayContaining([0x80, 55]));
    expect(Array.from(bytes)).toEqual(expect.arrayContaining([0x80, 60]));
    expect(Array.from(bytes)).toEqual(expect.arrayContaining([0x80, 64]));
  });

  it('generates a multi-track SMF Format 1 file with separate channels', () => {
    const tracks = [
      {
        name: 'Bass Ground',
        channel: 1,
        notes: [
          { tick: 0, durationUnits: 4, pitches: [36], velocity: 100 },
          { tick: 4, durationUnits: 4, pitches: [40], velocity: 100 },
        ],
      },
      {
        name: 'Rhythmic Chords',
        channel: 0,
        notes: [
          { tick: 0, durationUnits: 3, pitches: [60, 64, 67], velocity: 90 },
          { tick: 3, durationUnits: 1, pitches: [60, 64, 67], velocity: 80 },
        ],
      },
      {
        name: 'Percussion',
        channel: 9, // GM Drums
        notes: [
          { tick: 0, durationUnits: 1, pitches: [76], velocity: 110 },
          { tick: 3, durationUnits: 1, pitches: [75], velocity: 95 },
        ],
      },
    ];

    const bytes = buildMultiTrackMidiFile(tracks, 110, 'Full Arrangement');
    expect(bytes.length).toBeGreaterThan(100);

    // MThd header format check: bytes 8 and 9 should be 0x00 0x01 (Format 1)
    expect(bytes[8]).toBe(0x00);
    expect(bytes[9]).toBe(0x01);

    // Track count check: 1 conductor + 3 tracks = 4 tracks (bytes 10 and 11: 0x00 0x04)
    expect(bytes[10]).toBe(0x00);
    expect(bytes[11]).toBe(0x04);

    // Check channel note events
    // Bass on Channel 1 (status 0x91)
    expect(Array.from(bytes)).toEqual(expect.arrayContaining([0x91, 36]));
    // Chords on Channel 0 (status 0x90)
    expect(Array.from(bytes)).toEqual(expect.arrayContaining([0x90, 60]));
    // Drums on Channel 9 (status 0x99)
    expect(Array.from(bytes)).toEqual(expect.arrayContaining([0x99, 76]));
  });
});

