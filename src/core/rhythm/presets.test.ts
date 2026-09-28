import { describe, it, expect } from 'vitest';
import { RHYTHM_PRESETS, getPresetById, calculatePresetResultant } from './presets';

describe('Rhythm Presets and Genre Profiles', () => {
  it('loads all 21 rhythmic presets with valid metadata', () => {
    expect(RHYTHM_PRESETS.length).toBe(21);
    RHYTHM_PRESETS.forEach((preset) => {
      expect(preset.name).toBeTruthy();
      expect(preset.genre).toBeTruthy();
      expect(preset.description).toBeTruthy();
      expect(preset.timeSignature).toBeTruthy();
      expect(preset.baseUnit).toBeTruthy();
      expect(preset.durations.length).toBeGreaterThan(0);
    });
  });

  it('correctly calculates custom resultants for Afro-Cuban, Jazz, and Tango presets', () => {
    const rhumba = getPresetById('rhumba_tresillo');
    expect(rhumba).toBeDefined();
    if (rhumba) {
      const res = calculatePresetResultant(rhumba);
      expect(res.totalLength).toBe(8);
      expect(res.durations).toEqual([3, 3, 2]);
      expect(res.lanes.length).toBe(3);
    }

    const charleston = getPresetById('charleston');
    expect(charleston).toBeDefined();
    if (charleston) {
      const res = calculatePresetResultant(charleston);
      expect(res.totalLength).toBe(8);
      expect(res.durations).toEqual([5, 3]);
    }

    const tango = getPresetById('tango_square');
    expect(tango).toBeDefined();
    if (tango) {
      const res = calculatePresetResultant(tango);
      expect(res.totalLength).toBe(16);
      expect(res.durations).toEqual([1, 2, 1, 2, 4, 2, 1, 2, 1]);
      expect(res.accentIndices).toEqual([0, 3, 6]);
    }

    const swing = getPresetById('swing_core');
    expect(swing).toBeDefined();
    if (swing) {
      const res = calculatePresetResultant(swing);
      expect(res.totalLength).toBe(9);
      expect(res.durations).toEqual([4, 1, 4]);
    }

    const rock = getPresetById('rock_straight_8');
    expect(rock).toBeDefined();
    if (rock) {
      const res = calculatePresetResultant(rock);
      expect(res.totalLength).toBe(16);
      expect(res.durations).toEqual([2, 2, 2, 2, 2, 2, 2, 2]);
    }

    const blues = getPresetById('blues_shuffle');
    expect(blues).toBeDefined();
    if (blues) {
      const res = calculatePresetResultant(blues);
      expect(res.totalLength).toBe(12);
      expect(res.durations).toEqual([2, 1, 2, 1, 2, 1, 2, 1]);
    }

    const country = getPresetById('country_boom_chick');
    expect(country).toBeDefined();
    if (country) {
      const res = calculatePresetResultant(country);
      expect(res.totalLength).toBe(16);
      expect(res.accentIndices).toEqual([1, 3, 5, 7]);
    }
  });
});
