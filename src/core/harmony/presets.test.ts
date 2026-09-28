import { describe, it, expect } from 'vitest';
import {
  SCHILLINGER_HARMONY_PRESETS,
  getHarmonyPresetById,
  getCycleMovesForPreset,
} from './presets';

describe('Harmony Cycle Presets', () => {
  it('loads all harmony presets with valid metadata', () => {
    expect(SCHILLINGER_HARMONY_PRESETS.length).toBeGreaterThanOrEqual(23);
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

  it('correctly provides the 12 Book V presets with authentic cycle formulas', () => {
    // 1. Wagner's Parsifal Cycle
    const wagner = getHarmonyPresetById('wagner_parsifal');
    expect(wagner).toBeDefined();
    expect(wagner?.category).toBe('Composer Style');
    expect(wagner?.totalChords).toBe(8);
    expect(wagner?.cycleFormula[0].stepOffset).toBe(5);

    // 2. Grail Combined Cadence
    const grail = getHarmonyPresetById('grail_cadence');
    expect(grail).toBeDefined();
    expect(grail?.category).toBe('Composer Style');
    expect(grail?.totalChords).toBe(4);
    expect(grail?.cycleFormula.length).toBe(3);

    // 3. Bach's Contrapuntal Step
    const bach = getHarmonyPresetById('bach_contrapuntal');
    expect(bach).toBeDefined();
    expect(bach?.category).toBe('Composer Style');
    expect(bach?.cycleFormula.map((f) => f.stepOffset)).toEqual([1, 1, 3]);

    // 4. Beethoven Dominant Drive
    const beethoven = getHarmonyPresetById('beethoven_dominant_drive');
    expect(beethoven).toBeDefined();
    expect(beethoven?.category).toBe('Composer Style');
    expect(beethoven?.cycleFormula[0].stepOffset).toBe(3);

    // 5-8. Recurrence Cycles (21, 35, 56, 70 chords)
    const bin21 = getHarmonyPresetById('binomial_2c5_c7');
    expect(bin21?.totalChords).toBe(21);
    expect(bin21?.cycleFormula.length).toBe(3);

    const bin35 = getHarmonyPresetById('binomial_3c5_2c7');
    expect(bin35?.totalChords).toBe(35);
    expect(bin35?.cycleFormula.length).toBe(5);

    const tri56 = getHarmonyPresetById('trinomial_4c3_c5_3c7');
    expect(tri56?.totalChords).toBe(56);
    expect(tri56?.cycleFormula.length).toBe(8);

    const res70 = getHarmonyPresetById('resultant_70_chord');
    expect(res70?.totalChords).toBe(70);
    expect(res70?.cycleFormula.length).toBe(10);

    // 9. Classical Full Cadence
    const cadence = getHarmonyPresetById('classical_full_cadence');
    expect(cadence?.category).toBe('Diatonic Cadence');
    expect(cadence?.totalChords).toBe(4);

    // 10-11. Type II Invariant
    const impressionist = getHarmonyPresetById('impressionist_parallel_maj7');
    expect(impressionist?.category).toBe('Type II Invariant');
    expect(impressionist?.harmonySystem).toBe('diatonic_symmetric');
    expect(impressionist?.invariantStructureQuality).toBe('maj7');

    const hardBop = getHarmonyPresetById('hard_bop_minor_9ths');
    expect(hardBop?.category).toBe('Type II Invariant');
    expect(hardBop?.harmonySystem).toBe('diatonic_symmetric');
    expect(hardBop?.chordStructure).toBe('S9');

    // 12. Petrushka Tritone Axis
    const petrushka = getHarmonyPresetById('petrushka_tritone_axis');
    expect(petrushka?.category).toBe('Type III Symmetric');
    expect(petrushka?.harmonySystem).toBe('symmetric');
    expect(petrushka?.totalChords).toBe(6);
    expect(petrushka?.cycleFormula[0].semitoneOffset).toBe(6);
  });
});
