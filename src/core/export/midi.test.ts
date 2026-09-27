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
});
