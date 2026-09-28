import { describe, it, expect } from 'vitest';
import {
  SCHILLINGER_HARMONY_PRESETS,
  getHarmonyPresetById,
  getCycleMovesForPreset,
} from './presets';

describe('Harmony Cycle Presets', () => {
  it('loads all harmony presets with valid metadata', () => {
    expect(SCHILLINGER_HARMONY_PRESETS.length).toBeGreaterThanOrEqual(11);
    SCHILLINGER_HARMONY_PRESETS.forEach((preset) => {
      expect(preset.name).toBeTruthy();
      expect(preset.category).toBeTruthy();
      expect(preset.description).toBeTruthy();
      expect(preset.defaultScale).toBeTruthy();
      expect(preset.defaultScaleId).toBeTruthy();
      expect(['S5', 'S7', 'S9']).toContain(preset.chordStructure);
      expect(preset.cycleFormula.length).toBeGreaterThan(0);
    });
  });

  it('correctly maps cycleFormula to CycleMove objects for presets', () => {
    const c5Preset = getHarmonyPresetById('functional_c5');
    expect(c5Preset).toBeDefined();
    if (c5Preset) {
      const moves = getCycleMovesForPreset(c5Preset);
      expect(moves.length).toBe(1);
      expect(moves[0].stepOffset).toBe(3); // C5 Down
    }

    const kozlov = getHarmonyPresetById('kozlov_28');
    expect(kozlov).toBeDefined();
    if (kozlov) {
      const moves = getCycleMovesForPreset(kozlov);
      expect(moves.length).toBe(4);
      expect(moves[0].stepOffset).toBe(5); // C3 Down
      expect(moves[1].stepOffset).toBe(5); // C3 Down
      expect(moves[2].stepOffset).toBe(4); // C5 Up
      expect(moves[3].stepOffset).toBe(5); // C3 Down
    }

    const romanesca = getHarmonyPresetById('romanesca');
    expect(romanesca).toBeDefined();
    if (romanesca) {
      const moves = getCycleMovesForPreset(romanesca);
      expect(moves.length).toBe(2);
      expect(moves[0].stepOffset).toBe(3); // C5 Down
      expect(moves[1].stepOffset).toBe(2); // C3 Up
    }

    const coltrane = getHarmonyPresetById('coltrane_3roots');
    expect(coltrane).toBeDefined();
    if (coltrane) {
      const moves = getCycleMovesForPreset(coltrane);
      expect(moves.length).toBe(1);
      expect(moves[0].semitoneOffset).toBe(4); // Major 3rd
      expect(moves[0].system).toBe('symmetric');
    }
  });
});
