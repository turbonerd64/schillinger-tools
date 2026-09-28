export const NOTE_NAMES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'] as const;
export const NOTE_NAMES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'] as const;

export type NoteName = typeof NOTE_NAMES[number];

export type ChordStructureType = 'S5' | 'S7' | 'S9'; // Triad (3), Seventh (4), Ninth (5)

export type HarmonySystemType =
  | 'diatonic'            // Type I: Diatonic System (Book V, Ch. 2)
  | 'diatonic_symmetric'  // Type II: Diatonic-Symmetric (Book V, Ch. 4)
  | 'symmetric'           // Type III: Symmetric System (Book V, Ch. 5)
  | 'chromatic'           // Chromatic System
  | 'strata';             // Strata Harmony (Book IX)

export interface ScaleDefinition {
  id: string;
  name: string;
  category: 'diatonic' | 'synthetic' | 'symmetric';
  intervals: number[];
  color: string;
}

export const PARENT_SCALES: ScaleDefinition[] = [
  // Church Modes (Diatonic)
  { id: 'ionian', name: 'Ionian (Major)', category: 'diatonic', intervals: [0, 2, 4, 5, 7, 9, 11], color: '#c84b31' },
  { id: 'dorian', name: 'Dorian', category: 'diatonic', intervals: [0, 2, 3, 5, 7, 9, 10], color: '#0284c7' },
  { id: 'phrygian', name: 'Phrygian', category: 'diatonic', intervals: [0, 1, 3, 5, 7, 8, 10], color: '#d97706' },
  { id: 'lydian', name: 'Lydian', category: 'diatonic', intervals: [0, 2, 4, 6, 7, 9, 11], color: '#059669' },
  { id: 'mixolydian', name: 'Mixolydian', category: 'diatonic', intervals: [0, 2, 4, 5, 7, 9, 10], color: '#7c3aed' },
  { id: 'aeolian', name: 'Aeolian (Minor)', category: 'diatonic', intervals: [0, 2, 3, 5, 7, 8, 10], color: '#e11d48' },
  { id: 'locrian', name: 'Locrian', category: 'diatonic', intervals: [0, 1, 3, 5, 6, 8, 10], color: '#475569' },

  // Synthetic / Altered Scales
  { id: 'harmonic_minor', name: 'Harmonic Minor', category: 'synthetic', intervals: [0, 2, 3, 5, 7, 8, 11], color: '#b45309' },
  { id: 'melodic_minor', name: 'Melodic Minor', category: 'synthetic', intervals: [0, 2, 3, 5, 7, 9, 11], color: '#2563eb' },
  { id: 'hungarian_minor', name: 'Hungarian Minor', category: 'synthetic', intervals: [0, 2, 3, 6, 7, 8, 11], color: '#be123c' },
  { id: 'double_harmonic', name: 'Double Harmonic', category: 'synthetic', intervals: [0, 1, 4, 5, 7, 8, 11], color: '#9333ea' },
  { id: 'neapolitan_minor', name: 'Neapolitan Minor', category: 'synthetic', intervals: [0, 1, 3, 5, 7, 8, 11], color: '#0d9488' },

  // Symmetric Scales
  { id: 'whole_tone', name: 'Whole-Tone', category: 'symmetric', intervals: [0, 2, 4, 6, 8, 10], color: '#4f46e5' },
  { id: 'octatonic_hw', name: 'Octatonic (Half-Whole)', category: 'symmetric', intervals: [0, 1, 3, 4, 6, 7, 9, 10], color: '#c026d3' },
  { id: 'octatonic_wh', name: 'Octatonic (Whole-Half)', category: 'symmetric', intervals: [0, 2, 3, 5, 6, 8, 9, 11], color: '#0891b2' },
];

export interface CycleMove {
  id: string;
  name: string;
  alias: string;
  stepOffset?: number; // scale degrees modulo N (Type I Diatonic)
  semitoneOffset?: number; // absolute semitones in chromatic space (Type III Symmetric)
  system?: 'diatonic' | 'symmetric';
}

export const CYCLE_MOVES: CycleMove[] = [
  // Type I: Diatonic Cycles (in parent scale degrees)
  { id: 'c3_down', name: 'C3 ↓', alias: '3rd Down (or 6th Up)', system: 'diatonic', stepOffset: 5 },
  { id: 'c3_up', name: 'C3 ↑', alias: '3rd Up', system: 'diatonic', stepOffset: 2 },
  { id: 'c5_down', name: 'C5 ↓', alias: '5th Down (Circle of 5ths)', system: 'diatonic', stepOffset: 3 },
  { id: 'c5_up', name: 'C5 ↑', alias: '5th Up', system: 'diatonic', stepOffset: 4 },
  { id: 'c7_down', name: 'C7 ↓', alias: '7th Down (Step Up)', system: 'diatonic', stepOffset: 1 },
  { id: 'c7_up', name: 'C7 ↑', alias: '7th Up (Step Down)', system: 'diatonic', stepOffset: 6 },

  // Type III: Symmetric Cycles (dividing the 12-semitone octave by roots of 2)
  { id: 'sym_tritone', name: 'C6 (√2)', alias: 'Tritone Axis (6 semitones: 2 tonics)', system: 'symmetric', semitoneOffset: 6 },
  { id: 'sym_major3rd', name: 'C4 (∛2)', alias: 'Maj 3rd / Aug Axis (4 semitones: 3 tonics)', system: 'symmetric', semitoneOffset: 4 },
  { id: 'sym_minor3rd', name: 'C3 (∜2)', alias: 'Min 3rd / Dim Axis (3 semitones: 4 tonics)', system: 'symmetric', semitoneOffset: 3 },
  { id: 'sym_wholetone', name: 'C2 (⁶√2)', alias: 'Whole-Tone Axis (2 semitones: 6 tonics)', system: 'symmetric', semitoneOffset: 2 },
  { id: 'sym_semitone', name: 'C1 (¹²√2)', alias: 'Chromatic Axis (1 semitone: 12 tonics)', system: 'symmetric', semitoneOffset: 1 },
  { id: 'sym_zero', name: 'C0', alias: 'Zero Cycle (Static Root with voice permutation)', system: 'symmetric', semitoneOffset: 0 },
];

export const CHORD_QUALITY_MAP: Record<string, string> = {
  // Triads (3 notes)
  "0,4,7": "",          // Major
  "0,3,7": "m",         // Minor
  "0,3,6": "dim",       // Diminished
  "0,4,8": "aug",       // Augmented
  "0,2,7": "sus2",
  "0,5,7": "sus4",
  // Seventh Chords (4 notes)
  "0,4,7,11": "maj7",
  "0,4,7,10": "7",
  "0,3,7,10": "m7",
  "0,3,6,10": "m7b5",   // Half-diminished
  "0,3,6,9":  "dim7",   // Full diminished
  "0,3,7,11": "m(maj7)",
  "0,4,8,11": "maj7#5",
  "0,4,8,10": "7#5",
  "0,3,6,11": "dim(maj7)",
  "0,4,6,10": "7b5",
  "0,2,7,10": "7sus2",
  "0,5,7,10": "7sus4",
  // Ninth Chords (5 notes)
  "0,2,4,7,11": "maj9",
  "0,2,4,7,10": "9",
  "0,2,3,7,10": "m9",
  "0,1,3,7,10": "m7b9",
  "0,1,3,6,10": "m7b5b9",
  "0,2,3,6,10": "m9b5",
  "0,2,4,8,11": "maj9#5",
  "0,2,4,8,10": "9#5",
  "0,1,4,7,10": "7b9",
  "0,3,4,7,10": "7#9",
  "0,1,3,6,9":  "dim7b9",
};

export interface ChordItem {
  id: string;
  stepIndex: number;
  degreeIndex: number;
  rootPitchClass: number;
  rootName: string;
  chordName: string;
  quality: string;
  pitchClasses: number[];
  voicedMidiNotes: number[]; // Result of voice leading
  romanNumeral: string;
  sourceScaleId: string;
  sourceScaleName: string;
  sourceColor: string;
  isCustomBorrowed?: boolean;
  structure?: ChordStructureType;
  isCustomDensity?: boolean;
}

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * Identify chord quality and symbol from pitch classes
 */
export function identifyChord(
  pitchClasses: number[],
  preferFlat: boolean = false
): { quality: string; fullName: string } {
  if (!pitchClasses || pitchClasses.length === 0) return { quality: '', fullName: '' };

  const names = preferFlat ? NOTE_NAMES_FLAT : NOTE_NAMES;
  const root = pitchClasses[0];
  const rootName = names[root];

  const deltas = Array.from(
    new Set(pitchClasses.map((pc) => (pc - root + 12) % 12))
  ).sort((a, b) => a - b);

  const key = deltas.join(',');
  const quality = CHORD_QUALITY_MAP[key];

  if (quality !== undefined) {
    return { quality, fullName: `${rootName}${quality}` };
  }

  // Fallback for exotic/altered scales
  const noteList = pitchClasses.map((pc) => names[pc]).join(', ');
  return { quality: 'exotic', fullName: `${rootName} [${noteList}]` };
}

/**
 * Build chord pitch classes from parent scale degrees tertian style
 */
export function buildChord(
  scalePitches: number[],
  degreeIndex: number,
  structure: ChordStructureType
): number[] {
  const N = scalePitches.length;
  const numNotes = structure === 'S5' ? 3 : structure === 'S7' ? 4 : 5;
  const notes: number[] = [];

  for (let i = 0; i < numNotes; i++) {
    const idx = (degreeIndex + i * 2) % N;
    notes.push(scalePitches[idx]);
  }

  return notes;
}

/**
 * Generate sequence of chords along a cycle formula for a specific parent scale
 */
export type VoiceLeadingMode = 'greedy' | 'schillinger_cw' | 'schillinger_ccw' | 'schillinger_const';

/**
 * Generate sequence of chords along a cycle formula for a specific parent scale
 * Supports Type I (Diatonic in-scale), Type II (Diatonic-Symmetric invariant structure),
 * and Type III (Symmetric octave divisions by roots of 2).
 */
export function generateRailChords(
  tonicRoot: number,
  scaleDef: ScaleDefinition,
  formula: CycleMove[],
  structure: ChordStructureType,
  totalChordsCount: number,
  harmonySystem: HarmonySystemType = 'diatonic',
  invariantStructureQuality?: string, // e.g. 'maj7', 'm7', '7', '', 'm'
  voiceLeadingMode: VoiceLeadingMode = 'greedy'
): ChordItem[] {
  if (!formula || formula.length === 0) {
    return [];
  }

  const N = scaleDef.intervals.length;
  const scalePitches = scaleDef.intervals.map((int) => (tonicRoot + int) % 12);
  const chords: ChordItem[] = [];

  const isFlatScale = ['phrygian', 'aeolian', 'dorian', 'locrian', 'harmonic_minor', 'neapolitan_minor'].includes(scaleDef.id) || [1, 3, 5, 8, 10].includes(tonicRoot);
  const names = isFlatScale ? NOTE_NAMES_FLAT : NOTE_NAMES;

  let currentDegree = 0; // Starts on Degree I (Root)
  let currentPitchClass = scalePitches[0];
  const formulaLen = Math.max(1, formula.length);

  for (let step = 0; step < totalChordsCount; step++) {
    const move = formula[step % formulaLen];
    const isSymmetricStep = harmonySystem === 'symmetric' || move?.system === 'symmetric' || move?.semitoneOffset !== undefined;

    let rootPC: number;
    let pitchClasses: number[];

    if (isSymmetricStep) {
      // Type III Symmetric System: Root moves in chromatic semitone space dividing octave by roots of 2
      rootPC = currentPitchClass;
      const deltas = invariantStructureQuality === 'm' || invariantStructureQuality === 'm7'
        ? (structure === 'S5' ? [0, 3, 7] : structure === 'S7' ? [0, 3, 7, 10] : [0, 3, 7, 10, 14])
        : invariantStructureQuality === '7'
        ? (structure === 'S5' ? [0, 4, 7] : [0, 4, 7, 10])
        : (structure === 'S5' ? [0, 4, 7] : structure === 'S7' ? [0, 4, 7, 11] : [0, 4, 7, 11, 14]);
      pitchClasses = deltas.map((d) => (rootPC + d) % 12);
    } else if (harmonySystem === 'diatonic_symmetric') {
      // Type II Diatonic-Symmetric System: Root moves along diatonic scale degrees with invariant chord structure
      rootPC = scalePitches[currentDegree];
      const deltas = invariantStructureQuality === 'm' || invariantStructureQuality === 'm7'
        ? (structure === 'S5' ? [0, 3, 7] : structure === 'S7' ? [0, 3, 7, 10] : [0, 3, 7, 10, 14])
        : invariantStructureQuality === '7'
        ? (structure === 'S5' ? [0, 4, 7] : [0, 4, 7, 10])
        : (structure === 'S5' ? [0, 4, 7] : structure === 'S7' ? [0, 4, 7, 11] : [0, 4, 7, 11, 14]);
      pitchClasses = deltas.map((d) => (rootPC + d) % 12);
    } else {
      // Type I Diatonic System: Tertian chords built strictly from parent scale degrees
      rootPC = scalePitches[currentDegree];
      pitchClasses = buildChord(scalePitches, currentDegree, structure);
    }

    const { quality, fullName } = identifyChord(pitchClasses, isFlatScale);

    // Roman numeral
    const baseRoman = ROMAN_NUMERALS[currentDegree % ROMAN_NUMERALS.length] || `${currentDegree + 1}`;
    let roman = baseRoman;
    if (quality === 'm' || quality === 'm7' || quality === 'm9') {
      roman = baseRoman.toLowerCase();
    } else if (quality === 'dim' || quality === 'm7b5' || quality === 'dim7') {
      roman = quality === 'm7b5' ? `${baseRoman.toLowerCase()}ø` : `${baseRoman.toLowerCase()}°`;
    }

    chords.push({
      id: `${scaleDef.id}-${step}-${currentDegree}`,
      stepIndex: step,
      degreeIndex: currentDegree,
      rootPitchClass: rootPC,
      rootName: names[rootPC],
      chordName: fullName,
      quality,
      pitchClasses,
      voicedMidiNotes: [], // Filled during voice leading
      romanNumeral: roman,
      sourceScaleId: scaleDef.id,
      sourceScaleName: scaleDef.name,
      sourceColor: scaleDef.color,
      structure,
    });

    // Advance root for next step
    if (move.semitoneOffset !== undefined) {
      currentPitchClass = (currentPitchClass + move.semitoneOffset + 12) % 12;
      const nearestDeg = scalePitches.indexOf(currentPitchClass);
      if (nearestDeg !== -1) currentDegree = nearestDeg;
    } else {
      let stepDelta = 0;
      if (move.id === 'c3_down') stepDelta = -(3 - 1);
      else if (move.id === 'c3_up') stepDelta = +(3 - 1);
      else if (move.id === 'c5_down') stepDelta = -(5 - 1);
      else if (move.id === 'c5_up') stepDelta = +(5 - 1);
      else if (move.id === 'c7_down') stepDelta = -(7 - 1);
      else if (move.id === 'c7_up') stepDelta = +(7 - 1);
      else if (move.stepOffset !== undefined) stepDelta = move.stepOffset;

      currentDegree = ((currentDegree + stepDelta) % N + N) % N;
      currentPitchClass = scalePitches[currentDegree];
    }
  }

  return applySchillingerVoiceLeading(chords, voiceLeadingMode);
}

/**
 * Rebuilds a chord item with a new density / structure (S5 Triad, S7 Seventh, S9 Ninth)
 * Preserves root pitch class and modal source while updating pitch classes and symbol.
 */
export function rebuildChordWithStructure(
  chord: ChordItem,
  newStructure: ChordStructureType,
  tonicRoot: number,
  harmonySystem: HarmonySystemType = 'diatonic',
  invariantStructureQuality?: string
): ChordItem {
  const scaleDef = PARENT_SCALES.find((s) => s.id === chord.sourceScaleId) || PARENT_SCALES[0];
  const scalePitches = scaleDef.intervals.map((int) => (tonicRoot + int) % 12);
  const isFlatScale = ['phrygian', 'aeolian', 'dorian', 'locrian', 'harmonic_minor', 'neapolitan_minor'].includes(scaleDef.id) || [1, 3, 5, 8, 10].includes(tonicRoot);
  const names = isFlatScale ? NOTE_NAMES_FLAT : NOTE_NAMES;

  let pitchClasses: number[];
  const rootPC = chord.rootPitchClass;

  if (harmonySystem === 'symmetric' || harmonySystem === 'diatonic_symmetric') {
    const deltas = invariantStructureQuality === 'm' || invariantStructureQuality === 'm7'
      ? (newStructure === 'S5' ? [0, 3, 7] : newStructure === 'S7' ? [0, 3, 7, 10] : [0, 3, 7, 10, 14])
      : invariantStructureQuality === '7'
      ? (newStructure === 'S5' ? [0, 4, 7] : newStructure === 'S7' ? [0, 4, 7, 10] : [0, 4, 7, 10, 14])
      : (newStructure === 'S5' ? [0, 4, 7] : newStructure === 'S7' ? [0, 4, 7, 11] : [0, 4, 7, 11, 14]);
    pitchClasses = deltas.map((d) => (rootPC + d) % 12);
  } else {
    // Type I Diatonic
    pitchClasses = buildChord(scalePitches, chord.degreeIndex, newStructure);
  }

  const { quality, fullName } = identifyChord(pitchClasses, isFlatScale);
  const baseRoman = ROMAN_NUMERALS[chord.degreeIndex % ROMAN_NUMERALS.length] || `${chord.degreeIndex + 1}`;
  let roman = baseRoman;
  if (quality === 'm' || quality === 'm7' || quality === 'm9') {
    roman = baseRoman.toLowerCase();
  } else if (quality === 'dim' || quality === 'm7b5' || quality === 'dim7' || quality.includes('dim')) {
    roman = quality === 'm7b5' ? `${baseRoman.toLowerCase()}ø` : `${baseRoman.toLowerCase()}°`;
  }

  return {
    ...chord,
    structure: newStructure,
    pitchClasses,
    chordName: fullName,
    quality,
    romanNumeral: roman,
    isCustomDensity: true,
  };
}

/**
 * Schillinger Algebraic Voice-Leading Engine (Book V, Chapter 2 Sections C, D, E)
 * Supports heterogeneous chord densities (S5, S7, S9) smoothly across transitions:
 * - 'schillinger_cw': Clockwise permutation transformation (T_cw: 1 -> 3 -> 5 -> 7 -> 1)
 * - 'schillinger_ccw': Counterclockwise permutation transformation (T_ccw: 1 -> 7 -> 5 -> 3 -> 1)
 * - 'schillinger_const': Constant function transformation (T_const: common tones held static in voice)
 * - 'greedy': Minimal-distance Euclidean nearest neighbor
 */
export function applySchillingerVoiceLeading(
  chords: ChordItem[],
  mode: VoiceLeadingMode = 'greedy'
): ChordItem[] {
  if (chords.length === 0) return [];

  let prevVoicing: number[] | null = null;

  return chords.map((chord, chordIdx) => {
    const pcs = chord.pitchClasses;
    if (!pcs || pcs.length === 0) return chord;

    // Bass voice: root in [36, 55] (C2 to G3)
    const rootPc = pcs[0];
    let bassMidi = rootPc + 3 * 12;
    while (bassMidi < 36) bassMidi += 12;
    while (bassMidi > 55) bassMidi -= 12;

    const upperPcs = pcs.slice(1);
    if (upperPcs.length === 0) {
      return { ...chord, voicedMidiNotes: [bassMidi] };
    }

    let upperMidi: number[] = [];

    if (!prevVoicing || chordIdx === 0) {
      // First chord: place upper notes around Middle C (MIDI 60) in range [55, 76]
      upperMidi = upperPcs.map((pc) => {
        let midi = pc + 4 * 12;
        while (midi < 55) midi += 12;
        while (midi > 76) midi -= 12;
        return midi;
      });
      prevVoicing = [bassMidi, ...upperMidi];
      return { ...chord, voicedMidiNotes: prevVoicing };
    }

    const prevUpper = prevVoicing.slice(1);
    const numUpper = upperPcs.length;

    if (mode === 'schillinger_cw') {
      // Clockwise Transformation (T_cw):
      // Each voice cyclically shifts its factor role forward: 1 -> 3 -> 5 -> 7 -> 1
      upperMidi = upperPcs.map((_, idx) => {
        const targetPc = upperPcs[(idx + 1) % numUpper];
        const prevNote = prevUpper[idx % prevUpper.length];
        let bestMidi = targetPc + 4 * 12;
        let minDiff = 999;
        for (let oct = 3; oct <= 6; oct++) {
          const cand = targetPc + oct * 12;
          if (cand >= 50 && cand <= 84) {
            const diff = Math.abs(cand - prevNote);
            if (diff < minDiff) {
              minDiff = diff;
              bestMidi = cand;
            }
          }
        }
        return bestMidi;
      });
    } else if (mode === 'schillinger_ccw') {
      // Counterclockwise Transformation (T_ccw):
      // Each voice cyclically shifts its factor role backward: 1 -> 7 -> 5 -> 3 -> 1
      upperMidi = upperPcs.map((_, idx) => {
        const targetPc = upperPcs[(idx - 1 + numUpper) % numUpper];
        const prevNote = prevUpper[idx % prevUpper.length];
        let bestMidi = targetPc + 4 * 12;
        let minDiff = 999;
        for (let oct = 3; oct <= 6; oct++) {
          const cand = targetPc + oct * 12;
          if (cand >= 50 && cand <= 84) {
            const diff = Math.abs(cand - prevNote);
            if (diff < minDiff) {
              minDiff = diff;
              bestMidi = cand;
            }
          }
        }
        return bestMidi;
      });
    } else if (mode === 'schillinger_const') {
      // Constant Tone Transformation (T_const):
      // Retain common pitch classes statically in the exact same voice pitch
      const assignedPrevNotes = new Set<number>();
      upperMidi = upperPcs.map((targetPc) => {
        const matchingPrev = prevUpper.find(
          (prevNote) => (prevNote % 12) === targetPc && !assignedPrevNotes.has(prevNote)
        );
        if (matchingPrev !== undefined) {
          assignedPrevNotes.add(matchingPrev);
          return matchingPrev; // Retain constant pitch
        }
        return -1;
      });

      // Fill remaining voices smoothly
      upperMidi = upperMidi.map((note, vIdx) => {
        if (note !== -1) return note;
        const targetPc = upperPcs[vIdx];
        const prevNote = prevUpper[vIdx % prevUpper.length];
        let bestMidi = targetPc + 4 * 12;
        let minDiff = 999;
        for (let oct = 3; oct <= 6; oct++) {
          const cand = targetPc + oct * 12;
          if (cand >= 50 && cand <= 84) {
            const diff = Math.abs(cand - prevNote);
            if (diff < minDiff) {
              minDiff = diff;
              bestMidi = cand;
            }
          }
        }
        return bestMidi;
      });
    } else {
      // Greedy minimal distance assignment
      upperMidi = upperPcs.map((pc, idx) => {
        const targetPitch = prevUpper[idx % prevUpper.length];
        let bestMidi = pc + 4 * 12;
        let minDiff = 999;

        for (let oct = 3; oct <= 6; oct++) {
          const candidate = pc + oct * 12;
          if (candidate >= 52 && candidate <= 84) {
            const diff = Math.abs(candidate - targetPitch);
            if (diff < minDiff) {
              minDiff = diff;
              bestMidi = candidate;
            }
          }
        }
        return bestMidi;
      });
    }

    prevVoicing = [bassMidi, ...upperMidi];

    return {
      ...chord,
      voicedMidiNotes: prevVoicing,
    };
  });
}

export function applyGreedyVoiceLeading(chords: ChordItem[]): ChordItem[] {
  return applySchillingerVoiceLeading(chords, 'greedy');
}

/**
 * Formats a chord progression string into Chord Symbols, Roman Numerals, or Nashville Numbers
 */
export function formatProgression(
  chords: ChordItem[],
  tonicRoot: number,
  format: 'symbols' | 'roman' | 'nashville'
): string {
  if (format === 'symbols') {
    return chords.map((c) => c.chordName).join(' - ');
  }

  if (format === 'roman') {
    return chords.map((c) => c.romanNumeral).join(' - ');
  }

  // Nashville Number System
  const NASHVILLE_STEPS: Record<number, string> = {
    0: '1',
    1: 'b2',
    2: '2',
    3: 'b3',
    4: '3',
    5: '4',
    6: 'b5',
    7: '5',
    8: 'b6',
    9: '6',
    10: 'b7',
    11: '7',
  };

  return chords
    .map((c) => {
      const semitonesFromTonic = (c.rootPitchClass - tonicRoot + 12) % 12;
      const stepNum = NASHVILLE_STEPS[semitonesFromTonic] || `${semitonesFromTonic}`;
      const q = c.quality;
      let suffix = '';
      if (q === 'm') suffix = 'm';
      else if (q === 'm7') suffix = 'm7';
      else if (q === 'maj7') suffix = 'maj7';
      else if (q === '7') suffix = '7';
      else if (q === 'm7b5') suffix = 'ø';
      else if (q === 'dim' || q === 'dim7') suffix = '°';
      else if (q && q !== 'exotic') suffix = q;

      return `${stepNum}${suffix}`;
    })
    .join(' - ');
}

