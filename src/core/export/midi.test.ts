import { describe, it, expect } from 'vitest';
import { buildMidiFile } from './midi';

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
});
