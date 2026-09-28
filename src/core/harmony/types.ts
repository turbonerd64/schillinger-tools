/**
 * Schillinger System - Book II & Book V Foundations
 * Prepared for modular integration into Schillinger Tools Suite
 */

export type HarmonySystemType =
  | 'diatonic'            // Type I: Diatonic System (Book V, Ch. 2) - C3, C5, C7 within a scale
  | 'diatonic_symmetric'  // Type II: Diatonic-Symmetric (Book V, Ch. 4) - Invariant chord structures over diatonic cycles
  | 'symmetric'           // Type III: Symmetric System (Book V, Ch. 5) - Symmetric octave divisions by roots of 2
  | 'chromatic'           // Chromatic System
  | 'strata';             // Strata Harmony (Book IX)

export interface ParentScale {
  id: string;
  name: string;
  book: 'Book II: Theory of Pitch-Scales';
  intervals: number[]; // semitone steps from root
  formula: string;     // e.g. "1 2 3 4 5 6 7" or symmetrical division
  group: 'diatonic' | 'expansion' | 'symmetric' | 'multi_octave';
}

export interface HarmonyCycle {
  id: string;
  name: string;
  code: string; // e.g. "C3", "C5", "C7", "C0"
  system: HarmonySystemType;
  intervalStep: number; // root movement interval (e.g. 3 for thirds, 5 for fifths, 6 for tritone)
  tonicsCount: 1 | 2 | 3 | 4 | 6 | 12;
  description: string;
}

export const SCHILLINGER_HARMONY_CYCLES: HarmonyCycle[] = [
  // Type I: Diatonic System (Book V, Chapter 2) - Root progression in scale steps
  {
    id: 'c3',
    name: 'Cycle of Thirds (C3)',
    code: 'C3',
    system: 'diatonic',
    intervalStep: 3,
    tonicsCount: 1,
    description: 'Diatonic root progression moving by thirds within the parent scale; maximum common-tone smoothness between chords.',
  },
  {
    id: 'c5',
    name: 'Cycle of Fifths / Fourths (C5)',
    code: 'C5',
    system: 'diatonic',
    intervalStep: 5,
    tonicsCount: 1,
    description: 'Diatonic root progression moving by fifths/fourths, foundational to functional cadence and circle of fifths.',
  },
  {
    id: 'c7',
    name: 'Cycle of Sevenths / Steps (C7)',
    code: 'C7',
    system: 'diatonic',
    intervalStep: 7,
    tonicsCount: 1,
    description: 'Diatonic stepwise root motion across scale degrees producing sequential harmonic continuities.',
  },
  {
    id: 'c2',
    name: 'Cycle of Seconds (C7 / Steps)',
    code: 'C7/C2',
    system: 'diatonic',
    intervalStep: 2,
    tonicsCount: 1,
    description: 'Stepwise motion across scale degrees producing passing harmonic continuities.',
  },

  // Type III: Symmetric System (Book V, Chapter 5) - Octave Divisions by Roots of 2
  {
    id: 'c0',
    name: 'Symmetric Zero Cycle (C0)',
    code: 'C0',
    system: 'symmetric',
    intervalStep: 0,
    tonicsCount: 1,
    description: 'Static root with symmetric internal voice-leading transformations of chord structures.',
  },
  {
    id: 'c_tritone',
    name: 'Tritone Symmetrical Cycle (√2: 2 Tonics)',
    code: 'C6',
    system: 'symmetric',
    intervalStep: 6,
    tonicsCount: 2,
    description: 'Bipolar two-tonic harmonic polarity dividing the octave into 2 equal parts of 6 semitones.',
  },
  {
    id: 'c_major_thirds',
    name: 'Major Thirds Symmetrical Cycle (∛2: 3 Tonics)',
    code: 'C4',
    system: 'symmetric',
    intervalStep: 4,
    tonicsCount: 3,
    description: 'Tri-tonic augmented axis dividing the octave symmetrically into 3 equal parts of 4 semitones.',
  },
  {
    id: 'c_minor_thirds',
    name: 'Minor Thirds Symmetrical Cycle (∜2: 4 Tonics)',
    code: 'C3_sym',
    system: 'symmetric',
    intervalStep: 3,
    tonicsCount: 4,
    description: 'Quad-tonic diminished axis dividing the octave symmetrically into 4 equal parts of 3 semitones.',
  },
  {
    id: 'c_whole_tone',
    name: 'Whole-Tone Symmetrical Cycle (⁶√2: 6 Tonics)',
    code: 'C2_sym',
    system: 'symmetric',
    intervalStep: 2,
    tonicsCount: 6,
    description: 'Hexa-tonic symmetrical root motion dividing the octave into 6 equal parts of 2 semitones.',
  },
];
