import { ChordStructureType, CycleMove, CYCLE_MOVES, HarmonySystemType } from './engine';

export interface HarmonyCyclePreset {
  id: string;
  name: string;
  category: 'Diatonic Cycle' | 'Compound / Cadential' | 'Symmetric Root System';
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
      if (matched) return matched;
      return {
        id: `sym_step_${idx}`,
        name: step.label,
        alias: step.label,
        system: 'symmetric',
        semitoneOffset: step.semitoneOffset,
      };
    }
    const matched = CYCLE_MOVES.find((m) => m.stepOffset === step.stepOffset);
    if (matched) return matched;
    return {
      id: `step_${idx}`,
      name: step.label,
      alias: step.label,
      system: 'diatonic',
      stepOffset: step.stepOffset,
    };
  });
}
