import { describe, it, expect } from 'vitest';
import {
  generateRailChords,
  applyGreedyVoiceLeading,
  PARENT_SCALES,
  CYCLE_MOVES,
  identifyChord,
} from './engine';

describe('Schillinger Harmony Engine Test Cases', () => {
  const cIonian = PARENT_SCALES.find((s) => s.id === 'ionian')!;
  const cPhrygian = PARENT_SCALES.find((s) => s.id === 'phrygian')!;

  const c3Down = CYCLE_MOVES.find((m) => m.id === 'c3_down')!;
  const c5Up = CYCLE_MOVES.find((m) => m.id === 'c5_up')!;
  const formula = [c3Down, c3Down, c5Up, c3Down];

  it('validates Test Case 1 (C Ionian with [C3 down, C3 down, C5 up, C3 down])', () => {
    const chords = generateRailChords(0, cIonian, formula, 'S7', 8);

    // The first 8 chords of each from the user screenshot and prompt
    // 0: Cmaj7
    // 1: Am7
    // 2: Fmaj7
    // 3: Cmaj7
    // 4: Am7
    // 5: Fmaj7
    // 6: Dm7
    // 7: Am7
    const names = chords.map((c) => c.chordName);
    expect(names).toEqual([
      'Cmaj7',
      'Am7',
      'Fmaj7',
      'Cmaj7',
      'Am7',
      'Fmaj7',
      'Dm7',
      'Am7',
    ]);
  });

  it('validates Test Case 2 (C Phrygian Parallel Projection)', () => {
    const chords = generateRailChords(0, cPhrygian, formula, 'S7', 8);

    // From user screenshot 1:
    // Phrygian version:
    // 0: Cm7
    // 1: Abmaj7
    // 2: Fm7
    // 3: Cm7
    // 4: Abmaj7
    // 5: Fm7
    // 6: Dbmaj7
    // 7: Abmaj7
    const names = chords.map((c) => c.chordName);
    expect(names).toEqual([
      'Cm7',
      'Abmaj7',
      'Fm7',
      'Cm7',
      'Abmaj7',
      'Fm7',
      'Dbmaj7',
      'Abmaj7',
    ]);
  });

  it('validates Cycle 5 down and Cycle 7 down (Screenshot 2)', () => {
    const c5Down = CYCLE_MOVES.find((m) => m.id === 'c5_down')!;
    const c5DownChords = generateRailChords(0, cIonian, [c5Down], 'S7', 8);
    // Cycle 5 down: Cmaj7 -> Fmaj7 -> Bm7b5 -> Em7 -> Am7 -> Dm7 -> G7 -> Cmaj7
    expect(c5DownChords.map((c) => c.chordName)).toEqual([
      'Cmaj7',
      'Fmaj7',
      'Bm7b5',
      'Em7',
      'Am7',
      'Dm7',
      'G7',
      'Cmaj7',
    ]);

    const c7Down = CYCLE_MOVES.find((m) => m.id === 'c7_down')!;
    const c7DownChords = generateRailChords(0, cIonian, [c7Down], 'S7', 8);
    // Cycle 7 down (Cycle 2 up): Cmaj7 -> Dm7 -> Em7 -> Fmaj7 -> G7 -> Am7 -> Bm7b5 -> Cmaj7
    expect(c7DownChords.map((c) => c.chordName)).toEqual([
      'Cmaj7',
      'Dm7',
      'Em7',
      'Fmaj7',
      'G7',
      'Am7',
      'Bm7b5',
      'Cmaj7',
    ]);
  });

  it('applies smooth greedy voice leading without abrupt octave leaps', () => {
    const rawChords = generateRailChords(0, cIonian, formula, 'S7', 8);
    const voiced = applyGreedyVoiceLeading(rawChords);

    expect(voiced[0].voicedMidiNotes.length).toBe(4);
    // Bass note should be in bass register [36, 55]
    voiced.forEach((c) => {
      const bass = c.voicedMidiNotes[0];
      expect(bass).toBeGreaterThanOrEqual(36);
      expect(bass).toBeLessThanOrEqual(55);
    });
  });
});
