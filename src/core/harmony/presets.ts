import { ChordStructureType, CycleMove, CYCLE_MOVES, HarmonySystemType } from './engine';

export type HarmonyPresetCategory =
  | 'Diatonic Cycle'
  | 'Compound / Cadential'
  | 'Symmetric Root System'
  | 'Composer Style'
  | 'Recurrence Cycle'
  | 'Diatonic Cadence'
  | 'Type II Invariant'
  | 'Type III Symmetric';

export interface HarmonyCyclePreset {
  id: string;
  name: string;
  category: HarmonyPresetCategory;
  description: string;
  defaultScale: string;
  defaultScaleId: string;
  chordStructure: ChordStructureType; // 'S5' = Triads, 'S7' = Sevenths, 'S9' = Ninths
  harmonySystem?: HarmonySystemType;
  invariantStructureQuality?: string;
  totalChords?: number;
  cycleFormula: {
    label: string;
    stepOffset?: number; // in 0-indexed scale steps
    semitoneOffset?: number; // in chromatic semitones
  }[];
}

export const SCHILLINGER_HARMONY_PRESETS: HarmonyCyclePreset[] = [
  // 1. Diatonic Cycles
  {
    id: 'functional_c5',
    name: 'Functional Circle of Fifths (C5 ↓)',
    category: 'Diatonic Cycle',
    description: 'The classical functional circle of fifths descending through all 7 scale degrees',
    defaultScale: 'Ionian',
    defaultScaleId: 'ionian',
    chordStructure: 'S7',
    totalChords: 8,
    cycleFormula: [
      { label: 'C5 ↓', stepOffset: 3 }, // -4 mod 7 = +3
    ],
  },
  {
    id: 'mediant_c3',
    name: 'Mediant Fall (C3 ↓)',
    category: 'Diatonic Cycle',
    description: 'Descending cycle of thirds; maximum common-tone smoothness between chords',
    defaultScale: 'Ionian',
    defaultScaleId: 'ionian',
    chordStructure: 'S7',
    totalChords: 8,
    cycleFormula: [
      { label: 'C3 ↓', stepOffset: 5 }, // -2 mod 7 = +5
    ],
  },
  {
    id: 'stepwise_c7',
    name: 'Stepwise Ascending (C7 ↓ / Step ↑)',
    category: 'Diatonic Cycle',
    description: 'Cycle of sevenths descending (moving up by 2nds); zero common tones between adjacent chords',
    defaultScale: 'Ionian',
    defaultScaleId: 'ionian',
    chordStructure: 'S5',
    totalChords: 8,
    cycleFormula: [
      { label: 'C7 ↓ (Step ↑)', stepOffset: 1 },
    ],
  },

  // 2. Compound / Cadential
  {
    id: 'romanesca',
    name: 'Canon / Romanesca Ground',
    category: 'Compound / Cadential',
    description: 'Alternating cycle of descending fifth followed by ascending third (I - IV - vi - ii...)',
    defaultScale: 'Ionian',
    defaultScaleId: 'ionian',
    chordStructure: 'S5',
    totalChords: 8,
    cycleFormula: [
      { label: 'C5 ↓', stepOffset: 3 },
      { label: 'C3 ↑', stepOffset: 2 },
    ],
  },
  {
    id: 'cadential_turn',
    name: 'Classical Cadential Turn',
    category: 'Compound / Cadential',
    description: 'Stepwise shift to pre-dominant followed by fifth cycle resolution (I -> ii -> V -> I)',
    defaultScale: 'Ionian',
    defaultScaleId: 'ionian',
    chordStructure: 'S7',
    totalChords: 8,
    cycleFormula: [
      { label: 'C7 ↓ (Step ↑)', stepOffset: 1 },
      { label: 'C5 ↓', stepOffset: 3 },
      { label: 'C5 ↓', stepOffset: 3 },
    ],
  },
  {
    id: 'kozlov_28',
    name: "Kozlov's 28-Chord Cyclic Matrix",
    category: 'Compound / Cadential',
    description: 'A 4-move formula (C3↓ -> C3↓ -> C5↑ -> C3↓) that shifts root each cycle to close across 28 chords',
    defaultScale: 'Ionian',
    defaultScaleId: 'ionian',
    chordStructure: 'S7',
    totalChords: 28,
    cycleFormula: [
      { label: 'C3 ↓', stepOffset: 5 },
      { label: 'C3 ↓', stepOffset: 5 },
      { label: 'C5 ↑', stepOffset: 4 },
      { label: 'C3 ↓', stepOffset: 5 },
    ],
  },
  {
    id: 'hungarian_drift',
    name: 'Hungarian Minor Mediant Drift',
    category: 'Compound / Cadential',
    description: 'Cycle of thirds projected through Hungarian Minor (1+3+1), generating exotic augmented chords',
    defaultScale: 'Hungarian Minor',
    defaultScaleId: 'hungarian_minor',
    chordStructure: 'S7',
    totalChords: 12,
    cycleFormula: [
      { label: 'C3 ↓', stepOffset: 5 },
      { label: 'C3 ↓', stepOffset: 5 },
      { label: 'C5 ↑', stepOffset: 4 },
    ],
  },

  // 3. Symmetric Root Systems (Type III: Octave Divisions by Roots of 2)
  {
    id: 'coltrane_3roots',
    name: 'Coltrane Changes (∛2: 3 Tonics)',
    category: 'Symmetric Root System',
    description: 'Symmetric major thirds cycle dividing the octave into 3 equal centers (4 semitones: C -> E -> Ab)',
    defaultScale: 'Ionian (Major)',
    defaultScaleId: 'ionian',
    chordStructure: 'S7',
    harmonySystem: 'symmetric',
    invariantStructureQuality: 'maj7',
    totalChords: 6,
    cycleFormula: [
      { label: 'C4 (∛2)', semitoneOffset: 4 },
    ],
  },
  {
    id: 'tritone_2roots',
    name: 'Tritone Bipolar Axis (√2: 2 Tonics)',
    category: 'Symmetric Root System',
    description: 'Symmetric division into 2 equal polar tonics (6 semitones, e.g. C - F#)',
    defaultScale: 'Ionian (Major)',
    defaultScaleId: 'ionian',
    chordStructure: 'S7',
    harmonySystem: 'symmetric',
    invariantStructureQuality: '7',
    totalChords: 4,
    cycleFormula: [
      { label: 'C6 (√2)', semitoneOffset: 6 },
    ],
  },
  {
    id: 'diminished_4roots',
    name: 'Diminished Axis (∜2: 4 Tonics)',
    category: 'Symmetric Root System',
    description: 'Symmetric division of the octave by minor thirds (3 semitones: C -> Eb -> F# -> A)',
    defaultScale: 'Octatonic (Half-Whole)',
    defaultScaleId: 'octatonic_hw',
    chordStructure: 'S7',
    harmonySystem: 'symmetric',
    invariantStructureQuality: 'dim7',
    totalChords: 8,
    cycleFormula: [
      { label: 'C3 (∜2)', semitoneOffset: 3 },
    ],
  },
  {
    id: 'whole_tone_symmetric',
    name: 'Whole-Tone Symmetric Division (⁶√2)',
    category: 'Symmetric Root System',
    description: 'Symmetric whole-tone axis dividing the octave into 6 equal centers (2 semitones)',
    defaultScale: 'Whole-Tone',
    defaultScaleId: 'whole_tone',
    chordStructure: 'S7',
    harmonySystem: 'symmetric',
    invariantStructureQuality: '7',
    totalChords: 6,
    cycleFormula: [
      { label: 'C2 (⁶√2)', semitoneOffset: 2 },
    ],
  },

  // 4. Composer Style (Wagner, Bach, Beethoven)
  {
    id: 'wagner_parsifal',
    name: "Wagner's Parsifal Cycle",
    category: 'Composer Style',
    description: "Continuous mediant fall ([C3↓]) from Wagner's Parsifal with rich, chromatic voice leading (p. 373, Fig. 19)",
    defaultScale: 'Ionian (Major)',
    defaultScaleId: 'ionian',
    chordStructure: 'S7',
    totalChords: 8,
    cycleFormula: [
      { label: 'C3 ↓', stepOffset: 5 },
    ],
  },
  {
    id: 'grail_cadence',
    name: 'Grail Combined Cadence',
    category: 'Composer Style',
    description: 'Wagnerian Grail motif cadence via threefold descending thirds closing to tonic: I → VI → III → I (p. 373, Fig. 21)',
    defaultScale: 'Ionian (Major)',
    defaultScaleId: 'ionian',
    chordStructure: 'S5',
    totalChords: 4,
    cycleFormula: [
      { label: 'C3 ↓', stepOffset: 5 },
      { label: 'C3 ↓', stepOffset: 4 },
      { label: 'C3 ↓', stepOffset: 5 },
    ],
  },
  {
    id: 'bach_contrapuntal',
    name: "Bach's Contrapuntal Step",
    category: 'Composer Style',
    description: "Bach's compound cycle pairing two ascending steps with a descending fifth cadence: [C7↓, C7↓, C5↓] (p. 374, Fig. 22)",
    defaultScale: 'Ionian (Major)',
    defaultScaleId: 'ionian',
    chordStructure: 'S7',
    totalChords: 8,
    cycleFormula: [
      { label: 'C7 ↓ (Step ↑)', stepOffset: 1 },
      { label: 'C7 ↓ (Step ↑)', stepOffset: 1 },
      { label: 'C5 ↓', stepOffset: 3 },
    ],
  },
  {
    id: 'beethoven_dominant_drive',
    name: 'Beethoven Dominant Drive',
    category: 'Composer Style',
    description: 'Relentless circle-of-fifths drive ([C5↓] continuous) propelling forward momentum and dominant tension resolution (p. 374)',
    defaultScale: 'Ionian (Major)',
    defaultScaleId: 'ionian',
    chordStructure: 'S7',
    totalChords: 8,
    cycleFormula: [
      { label: 'C5 ↓', stepOffset: 3 },
    ],
  },

  // 5. Recurrence & Resultant Cycles (Closed Diatonic Permutations)
  {
    id: 'binomial_2c5_c7',
    name: 'Binomial 2C5 + C7',
    category: 'Recurrence Cycle',
    description: 'Schillinger binomial recurrence cycle combining two fifth falls with a step shift; closes in 21 chords (p. 365, Fig. 5)',
    defaultScale: 'Ionian (Major)',
    defaultScaleId: 'ionian',
    chordStructure: 'S7',
    totalChords: 21,
    cycleFormula: [
      { label: 'C5 ↓', stepOffset: 3 },
      { label: 'C5 ↓', stepOffset: 3 },
      { label: 'C7 ↓ (Step ↑)', stepOffset: 1 },
    ],
  },
  {
    id: 'binomial_3c5_2c7',
    name: 'Binomial 3C5 + 2C7',
    category: 'Recurrence Cycle',
    description: 'Schillinger 5-move binomial recurrence cycle (3C5 + 2C7) spanning 35 chords to achieve complete diatonic closure (p. 365, Fig. 5)',
    defaultScale: 'Ionian (Major)',
    defaultScaleId: 'ionian',
    chordStructure: 'S7',
    totalChords: 35,
    cycleFormula: [
      { label: 'C5 ↓', stepOffset: 3 },
      { label: 'C5 ↓', stepOffset: 3 },
      { label: 'C5 ↓', stepOffset: 3 },
      { label: 'C7 ↓ (Step ↑)', stepOffset: 1 },
      { label: 'C7 ↓ (Step ↑)', stepOffset: 1 },
    ],
  },
  {
    id: 'trinomial_4c3_c5_3c7',
    name: 'Trinomial 4C3 + C5 + 3C7',
    category: 'Recurrence Cycle',
    description: 'Schillinger 8-move trinomial cycle (4C3 + C5 + 3C7) spanning 56 chords to complete a full permutation matrix (p. 367, Fig. 8)',
    defaultScale: 'Ionian (Major)',
    defaultScaleId: 'ionian',
    chordStructure: 'S7',
    totalChords: 56,
    cycleFormula: [
      { label: 'C3 ↓', stepOffset: 5 },
      { label: 'C3 ↓', stepOffset: 5 },
      { label: 'C3 ↓', stepOffset: 5 },
      { label: 'C3 ↓', stepOffset: 5 },
      { label: 'C5 ↓', stepOffset: 3 },
      { label: 'C7 ↓ (Step ↑)', stepOffset: 1 },
      { label: 'C7 ↓ (Step ↑)', stepOffset: 1 },
      { label: 'C7 ↓ (Step ↑)', stepOffset: 1 },
    ],
  },
  {
    id: 'resultant_70_chord',
    name: 'Resultant 70-Chord Cycle',
    category: 'Recurrence Cycle',
    description: 'Schillinger master 10-move resultant recurrence cycle; requires 7 full revolutions (70 chords) to achieve complete diatonic closure (p. 367, Fig. 9)',
    defaultScale: 'Ionian (Major)',
    defaultScaleId: 'ionian',
    chordStructure: 'S7',
    totalChords: 70,
    cycleFormula: [
      { label: 'C7 ↓ (Step ↑)', stepOffset: 1 },
      { label: 'C7 ↓ (Step ↑)', stepOffset: 1 },
      { label: 'C3 ↓', stepOffset: 5 },
      { label: 'C3 ↓', stepOffset: 5 },
      { label: 'C5 ↓', stepOffset: 3 },
      { label: 'C7 ↓ (Step ↑)', stepOffset: 1 },
      { label: 'C3 ↓', stepOffset: 5 },
      { label: 'C3 ↓', stepOffset: 5 },
      { label: 'C5 ↓', stepOffset: 3 },
      { label: 'C5 ↓', stepOffset: 3 },
    ],
  },

  // 6. Diatonic Cadences
  {
    id: 'classical_full_cadence',
    name: 'Classical Full Cadence',
    category: 'Diatonic Cadence',
    description: 'Fundamental classical functional cadence: Tonic → Subdominant → Dominant → Tonic (I → IV → V → I) (p. 363)',
    defaultScale: 'Ionian (Major)',
    defaultScaleId: 'ionian',
    chordStructure: 'S5',
    totalChords: 4,
    cycleFormula: [
      { label: 'C5 ↑ (to IV)', stepOffset: 3 },
      { label: 'C5 ↓ (to V)', stepOffset: 1 },
      { label: 'C5 ↓ (to I)', stepOffset: 3 },
    ],
  },

  // 7. Type II Invariant Structures (Diatonic-Symmetric)
  {
    id: 'impressionist_parallel_maj7',
    name: 'Impressionist Parallel Maj7s',
    category: 'Type II Invariant',
    description: 'Type II Diatonic-Symmetric: Roots move along descending diatonic thirds ([C3↓]) with an invariant Major 7th structure (Ch. 4, p. 393)',
    defaultScale: 'Ionian (Major)',
    defaultScaleId: 'ionian',
    chordStructure: 'S7',
    harmonySystem: 'diatonic_symmetric',
    invariantStructureQuality: 'maj7',
    totalChords: 8,
    cycleFormula: [
      { label: 'C3 ↓', stepOffset: 5 },
    ],
  },
  {
    id: 'hard_bop_minor_9ths',
    name: 'Hard-Bop Invariant Minor 9ths',
    category: 'Type II Invariant',
    description: 'Type II Diatonic-Symmetric: Invariant minor ninth structures (m9/S9) propelled through the circle of fifths ([C5↓]) (Ch. 4, p. 393)',
    defaultScale: 'Dorian',
    defaultScaleId: 'dorian',
    chordStructure: 'S9',
    harmonySystem: 'diatonic_symmetric',
    invariantStructureQuality: 'm',
    totalChords: 8,
    cycleFormula: [
      { label: 'C5 ↓', stepOffset: 3 },
    ],
  },

  // 8. Type III Symmetric
  {
    id: 'petrushka_tritone_axis',
    name: 'Petrushka Tritone Axis',
    category: 'Type III Symmetric',
    description: "Stravinsky's Type III symmetric tritone axis (√2 C ↔ F#) with dominant auxiliary turnaround chords (Ch. 5, p. 397)",
    defaultScale: 'Ionian (Major)',
    defaultScaleId: 'ionian',
    chordStructure: 'S7',
    harmonySystem: 'symmetric',
    invariantStructureQuality: '7',
    totalChords: 6,
    cycleFormula: [
      { label: 'C6 (√2)', semitoneOffset: 6 },
      { label: 'V Aux (↑5th)', semitoneOffset: 7 },
      { label: 'Tonic Return (↓5th)', semitoneOffset: 5 },
    ],
  },
];

export function getHarmonyPresetById(id: string): HarmonyCyclePreset | undefined {
  return SCHILLINGER_HARMONY_PRESETS.find((p) => p.id === id);
}

/**
 * Maps a preset's cycleFormula entries into standard CycleMove objects
 */
export function getCycleMovesForPreset(preset: HarmonyCyclePreset): CycleMove[] {
  return preset.cycleFormula.map((step, idx) => {
    if (step.semitoneOffset !== undefined) {
      const matched = CYCLE_MOVES.find((m) => m.semitoneOffset === step.semitoneOffset);
      if (matched) return { ...matched, name: step.label, alias: step.label };
      return {
        id: `sym_step_${idx}`,
        name: step.label,
        alias: step.label,
        system: 'symmetric',
        semitoneOffset: step.semitoneOffset,
      };
    }
    const matched = CYCLE_MOVES.find((m) => m.stepOffset === step.stepOffset);
    if (matched) return { ...matched, name: step.label, alias: step.label };
    return {
      id: `step_${idx}`,
      name: step.label,
      alias: step.label,
      system: 'diatonic',
      stepOffset: step.stepOffset,
    };
  });
}
