/**
 * Schillinger System - Book II & Book V Foundations
 * Prepared for modular integration into Schillinger Tools Suite
 */

export type HarmonySystemType =
  | 'diatonic'            // Functional classical harmony (Type I)
  | 'diatonic_symmetric'  // Hybrid Diatonic-Symmetric (Type II)
  | 'symmetric'           // Symmetric System: C0, C3, C4, C5, C7 (Type III)
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
  code: string; // e.g. "C3", "C5", "C0"
  system: HarmonySystemType;
  intervalStep: number; // root movement interval (e.g. 3 for thirds, 4 for fourths)
  tonicsCount: 1 | 2 | 3 | 4 | 6 | 12;
  description: string;
}

export const SCHILLINGER_HARMONY_CYCLES: HarmonyCycle[] = [
  {
    id: 'c3',
    name: 'Cycle of Thirds (C3)',
    code: 'C3',
    system: 'symmetric',
    intervalStep: 3,
    tonicsCount: 4,
    description: 'Symmetric root progression moving by minor or major thirds, dividing the octave symmetrically into 4 tonics.',
  },
  {
    id: 'c5',
    name: 'Cycle of Fifths / Fourths (C5/C4)',
    code: 'C5',
    system: 'diatonic',
    intervalStep: 7,
    tonicsCount: 1,
    description: 'Diatonic root progression moving by fourths/fifths, foundational to classical functional cadence.',
  },
  {
    id: 'c2',
    name: 'Cycle of Seconds (C2)',
    code: 'C2',
    system: 'diatonic_symmetric',
    intervalStep: 2,
    tonicsCount: 6,
    description: 'Stepwise motion across scale degrees producing passing harmonic continuities.',
  },
  {
    id: 'c0',
    name: 'Symmetric Zero Cycle (C0)',
    code: 'C0',
    system: 'symmetric',
    intervalStep: 0,
    tonicsCount: 1,
    description: 'Static root with symmetric internal voice-leading and chromatic transformation of chord structures.',
  },
  {
    id: 'c_tritone',
    name: 'Tritone Symmetrical Cycle (C6)',
    code: 'C6',
    system: 'symmetric',
    intervalStep: 6,
    tonicsCount: 2,
    description: 'Bipolar two-tonic harmonic polarity dividing the octave exactly in half.',
  }
];
