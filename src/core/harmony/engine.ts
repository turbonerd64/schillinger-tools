export const NOTE_NAMES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'] as const;
export const NOTE_NAMES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'] as const;

export type NoteName = typeof NOTE_NAMES[number];

export type ChordStructureType = 'S5' | 'S7' | 'S9'; // Triad (3), Seventh (4), Ninth (5)

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
  stepOffset: number; // in scale degrees modulo N
}

export const CYCLE_MOVES: CycleMove[] = [
  { id: 'c3_down', name: 'C3 ↓', alias: '3rd Down (or 6th Up)', stepOffset: 5 }, // -2 in 7-tone: (i - 2 + 7) % 7 = +5
  { id: 'c3_up', name: 'C3 ↑', alias: '3rd Up', stepOffset: 2 },                 // +2 in 7-tone
  { id: 'c5_down', name: 'C5 ↓', alias: '5th Down (Circle of 5ths)', stepOffset: 3 }, // -4 in 7-tone: (i - 4 + 7) % 7 = +3
  { id: 'c5_up', name: 'C5 ↑', alias: '5th Up', stepOffset: 4 },                   // +4 in 7-tone
  { id: 'c7_down', name: 'C7 ↓', alias: 'Step Up (Cycle 2 Up)', stepOffset: 1 },    // -6 in 7-tone: (i + 1) % 7 = +1
  { id: 'c7_up', name: 'C7 ↑', alias: 'Step Down (Cycle 2 Down)', stepOffset: 6 },  // +6 in 7-tone: (i - 1 + 7) % 7 = +6
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
  voicedMidiNotes: number[]; // Result of greedy voice leading
  romanNumeral: string;
  sourceScaleId: string;
  sourceScaleName: string;
  sourceColor: string;
  isCustomBorrowed?: boolean;
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
export function generateRailChords(
  tonicRoot: number,
  scaleDef: ScaleDefinition,
  formula: CycleMove[],
  structure: ChordStructureType,
  totalChordsCount: number
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
  const formulaLen = Math.max(1, formula.length);

  for (let step = 0; step < totalChordsCount; step++) {
    const rootPC = scalePitches[currentDegree];
    const pitchClasses = buildChord(scalePitches, currentDegree, structure);
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
    });

    // Advance degree by formula move across any N-tone scale:
    const move = formula[step % formulaLen];
    // Moving by an interval of k scale degrees down: delta = -(k - 1)
    // Moving by an interval of k scale degrees up:   delta = +(k - 1)
    let stepDelta = 0;
    if (move.id === 'c3_down') stepDelta = -(3 - 1);
    else if (move.id === 'c3_up') stepDelta = +(3 - 1);
    else if (move.id === 'c5_down') stepDelta = -(5 - 1);
    else if (move.id === 'c5_up') stepDelta = +(5 - 1);
    else if (move.id === 'c7_down') stepDelta = -(7 - 1);
    else if (move.id === 'c7_up') stepDelta = +(7 - 1);
    else if (move.stepOffset !== undefined) stepDelta = move.stepOffset;

    currentDegree = ((currentDegree + stepDelta) % N + N) % N;
  }

  return chords;
}

/**
 * Greedy Minimal-Distance Voice-Leading Algorithm
 * Voices chords with anchored bass register [36, 55] (C2-G3)
 * and upper voices [55, 79] (G3-G5) to minimize total semitone leap distance.
 */
export function applyGreedyVoiceLeading(chords: ChordItem[]): ChordItem[] {
  let prevUpperVoicing: number[] | null = null;

  return chords.map((chord, chordIdx) => {
    const pcs = chord.pitchClasses;
    if (!pcs || pcs.length === 0) return chord;

    // Bass note: root in [36, 55] (C2 to G3)
    const rootPc = pcs[0];
    let bassMidi = rootPc + 3 * 12; // Octave 3 (MIDI 36-47)
    if (bassMidi < 36) bassMidi += 12;
    if (bassMidi > 55) bassMidi -= 12;

    const upperPcs = pcs.slice(1);
    let upperMidi: number[] = [];

    if (!prevUpperVoicing || chordIdx === 0) {
      // First chord: place upper notes around Middle C (MIDI 60) in range [55, 79]
      upperMidi = upperPcs.map((pc) => {
        let midi = pc + 4 * 12; // Octave 4 (48-59)
        while (midi < 55) midi += 12;
        while (midi > 76) midi -= 12;
        return midi;
      });
    } else {
      // Greedy minimal distance assignment
      upperMidi = upperPcs.map((pc, idx) => {
        const targetPitch = prevUpperVoicing![idx % prevUpperVoicing!.length];
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

    prevUpperVoicing = upperMidi;

    return {
      ...chord,
      voicedMidiNotes: [bassMidi, ...upperMidi],
    };
  });
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

