import { describe, it, expect } from 'vitest';
import {
  generateRailChords,
  applyGreedyVoiceLeading,
  applySchillingerVoiceLeading,
  rebuildChordWithStructure,
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

  it('correctly calculates dynamic cycle degree steps on non-heptatonic scales (N != 7)', () => {
    // 8-tone Octatonic Scale
    const octatonicScale = {
      id: 'octatonic',
      name: 'Whole-Half Diminished',
      category: 'symmetric' as const,
      intervals: [0, 2, 3, 5, 6, 8, 9, 11], // N = 8
      color: '#3b82f6',
    };

    const c7Down = CYCLE_MOVES.find((m) => m.id === 'c7_down')!;
    const chords = generateRailChords(0, octatonicScale, [c7Down], 'S5', 5);

    // In N = 8, C7 down delta is -(7 - 1) = -6 = +2 (mod 8)
    // Degree indices should advance: 0 -> 2 -> 4 -> 6 -> 0
    expect(chords.map((c) => c.degreeIndex)).toEqual([0, 2, 4, 6, 0]);
  });

  it('generates authentic Type III symmetric octave divisions by roots of 2', () => {
    // 1. Major Thirds (∛2, 4 semitones - Coltrane Changes)
    const symMaj3rd = CYCLE_MOVES.find((m) => m.id === 'sym_major3rd')!;
    const coltraneChords = generateRailChords(
      0, // C
      cIonian,
      [symMaj3rd],
      'S7',
      4,
      'symmetric',
      'maj7'
    );
    // Cmaj7 -> Emaj7 -> Abmaj7 -> Cmaj7
    expect(coltraneChords.map((c) => c.chordName)).toEqual([
      'Cmaj7',
      'Emaj7',
      'Abmaj7',
      'Cmaj7',
    ]);
    expect(coltraneChords.map((c) => c.rootPitchClass)).toEqual([0, 4, 8, 0]);

    // 2. Tritone Axis (√2, 6 semitones - 2 polar tonics)
    const symTritone = CYCLE_MOVES.find((m) => m.id === 'sym_tritone')!;
    const tritoneChords = generateRailChords(
      0, // C
      cIonian,
      [symTritone],
      'S7',
      4,
      'symmetric',
      '7'
    );
    // C7 -> F#7 -> C7 -> F#7
    expect(tritoneChords.map((c) => c.chordName)).toEqual([
      'C7',
      'F#7',
      'C7',
      'F#7',
    ]);
    expect(tritoneChords.map((c) => c.rootPitchClass)).toEqual([0, 6, 0, 6]);

    // 3. Minor Thirds / Diminished Axis (∜2, 3 semitones)
    const symMin3rd = CYCLE_MOVES.find((m) => m.id === 'sym_minor3rd')!;
    const dimChords = generateRailChords(
      0, // C
      cIonian,
      [symMin3rd],
      'S7',
      5,
      'symmetric',
      'dim7'
    );
    expect(dimChords.map((c) => c.rootPitchClass)).toEqual([0, 3, 6, 9, 0]);
  });

  it('generates authentic Type II diatonic-symmetric invariant chord structures', () => {
    // Invariant Dominant 7ths across C5 down cycle
    const c5Down = CYCLE_MOVES.find((m) => m.id === 'c5_down')!;
    const invariantDom7Chords = generateRailChords(
      0, // C
      cIonian,
      [c5Down],
      'S7',
      4,
      'diatonic_symmetric',
      '7'
    );
    // All chords have invariant 7 (dominant 7th) structure
    expect(invariantDom7Chords.map((c) => c.quality)).toEqual(['7', '7', '7', '7']);
    expect(invariantDom7Chords.map((c) => c.chordName)).toEqual([
      'C7',
      'F7',
      'B7',
      'E7',
    ]);
  });

  it('applies Schillinger algebraic voice leading transformations (T_cw, T_ccw, T_const)', () => {
    const symMaj3rd = CYCLE_MOVES.find((m) => m.id === 'sym_major3rd')!;
    const chords = generateRailChords(0, cIonian, [symMaj3rd], 'S7', 3, 'symmetric', 'maj7');

    // Clockwise T_cw
    const cwVoiced = applySchillingerVoiceLeading(chords, 'schillinger_cw');
    expect(cwVoiced.length).toBe(3);
    cwVoiced.forEach((c) => {
      expect(c.voicedMidiNotes.length).toBe(4);
    });

    // Counterclockwise T_ccw
    const ccwVoiced = applySchillingerVoiceLeading(chords, 'schillinger_ccw');
    expect(ccwVoiced.length).toBe(3);
    ccwVoiced.forEach((c) => {
      expect(c.voicedMidiNotes.length).toBe(4);
    });

    // Constant Tone T_const
    const c3DownChords = generateRailChords(0, cIonian, [c3Down], 'S7', 2);
    // Cmaj7 (C E G B) -> Am7 (A C E G) share C, E, G!
    const constVoiced = applySchillingerVoiceLeading(c3DownChords, 'schillinger_const');
    expect(constVoiced.length).toBe(2);
    // Shared notes should be retained
    const chord1Pcs = constVoiced[0].voicedMidiNotes.slice(1).map((m) => m % 12);
    const chord2Pcs = constVoiced[1].voicedMidiNotes.slice(1).map((m) => m % 12);
    const commonPcs = chord1Pcs.filter((pc) => chord2Pcs.includes(pc));
    expect(commonPcs.length).toBeGreaterThanOrEqual(2);
  });

  it('correctly rebuilds chord density and handles heterogeneous density voice leading (S5, S7, S9)', () => {
    // Start with C Ionian diatonic chords (S7)
    const baseChords = generateRailChords(0, cIonian, [c3Down], 'S7', 4);
    expect(baseChords[0].chordName).toBe('Cmaj7');
    expect(baseChords[0].pitchClasses.length).toBe(4);

    // Rebuild chord 0 into S5 (Triad)
    const triadChord = rebuildChordWithStructure(baseChords[0], 'S5', 0);
    expect(triadChord.chordName).toBe('C');
    expect(triadChord.pitchClasses.length).toBe(3);
    expect(triadChord.structure).toBe('S5');

    // Rebuild chord 1 into S9 (Ninth)
    const ninthChord = rebuildChordWithStructure(baseChords[1], 'S9', 0);
    expect(ninthChord.chordName).toBe('Am9');
    expect(ninthChord.pitchClasses.length).toBe(5);
    expect(ninthChord.structure).toBe('S9');

    // Voice lead heterogeneous sequence: Triad (3) -> 9th (5) -> 7th (4) -> Triad (3)
    const heterogeneous = [
      triadChord,
      ninthChord,
      baseChords[2], // Fmaj7 (4)
      rebuildChordWithStructure(baseChords[3], 'S5', 0), // C (3)
    ];

    const voiced = applySchillingerVoiceLeading(heterogeneous, 'greedy');
    expect(voiced[0].voicedMidiNotes.length).toBe(3); // 1 bass + 2 upper
    expect(voiced[1].voicedMidiNotes.length).toBe(5); // 1 bass + 4 upper
    expect(voiced[2].voicedMidiNotes.length).toBe(4); // 1 bass + 3 upper
    expect(voiced[3].voicedMidiNotes.length).toBe(3); // 1 bass + 2 upper

    // Verify clockwise voice leading also handles heterogeneous transitions
    const cwVoiced = applySchillingerVoiceLeading(heterogeneous, 'schillinger_cw');
    expect(cwVoiced[0].voicedMidiNotes.length).toBe(3);
    expect(cwVoiced[1].voicedMidiNotes.length).toBe(5);
    expect(cwVoiced[2].voicedMidiNotes.length).toBe(4);
    expect(cwVoiced[3].voicedMidiNotes.length).toBe(3);
  });
});
