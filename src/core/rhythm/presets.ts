import { ResultantOutput, DurationBlock, GeneratorLane, SyncMode } from './types';

export interface GenrePreset {
  id: string;
  name: string;
  genre: string;
  description: string;
  timeSignature: string;
  baseUnit: string;
  durations: number[];
  accents?: number[]; // indices of accented attacks
  generators?: {
    a: number;
    b: number;
    mode: SyncMode;
    c?: number;
  };
  isCustomDuration?: boolean;
}

export const RHYTHM_PRESETS: GenrePreset[] = [
  // 1. Polyrhythmic Fundamentals
  {
    id: 'hemiola',
    name: 'Basic Hemiola (3 ÷ 2)',
    genre: 'Polyrhythmic Fundamental',
    description: 'Standard binary synchronization of 3 against 2',
    timeSignature: '3/4 or 6/8',
    baseUnit: 'eighth note (in 6/8) or quarter note (in 3/2)',
    durations: [2, 1, 1, 2],
    accents: [0],
    generators: { a: 3, b: 2, mode: 'binary' },
  },
  {
    id: 'matrix_4_3',
    name: 'Polyrhythmic Matrix (4 ÷ 3)',
    genre: 'Polyrhythmic Fundamental',
    description: 'Standard binary synchronization of 4 against 3',
    timeSignature: '4/4 or 12/8',
    baseUnit: '16th note or dotted 8th subdivision',
    durations: [3, 1, 2, 2, 1, 3],
    accents: [0],
    generators: { a: 4, b: 3, mode: 'binary' },
  },
  {
    id: 'quintuple_5_2',
    name: 'Balkan / Quintuple (5 ÷ 2)',
    genre: 'Polyrhythmic Fundamental',
    description: 'Asymmetric 5 against 2 quintuple synchronization',
    timeSignature: '5/8 or 5/4',
    baseUnit: 'eighth note',
    durations: [2, 2, 1, 1, 2, 2],
    accents: [0],
    generators: { a: 5, b: 2, mode: 'binary' },
  },
  {
    id: 'harmonic_5_3',
    name: 'Harmonic Contrast (5 ÷ 3)',
    genre: 'Polyrhythmic Fundamental',
    description: 'Complex binary synchronization of 5 against 3',
    timeSignature: '15/8',
    baseUnit: 'eighth note',
    durations: [3, 2, 1, 3, 1, 2, 3],
    accents: [0],
    generators: { a: 5, b: 3, mode: 'binary' },
  },
  {
    id: 'metric_5_4',
    name: 'Metric Tension (5 ÷ 4)',
    genre: 'Polyrhythmic Fundamental',
    description: 'High-density 5 against 4 polyrhythm',
    timeSignature: '5/4 or 20/16',
    baseUnit: '16th note',
    durations: [4, 1, 3, 2, 2, 3, 1, 4],
    accents: [0],
    generators: { a: 5, b: 4, mode: 'binary' },
  },
  {
    id: 'asymmetric_7_4',
    name: 'Asymmetric 28-Pulse (7 ÷ 4)',
    genre: 'Polyrhythmic Fundamental',
    description: 'Extended 7 against 4 septuple interference cycle',
    timeSignature: '7/4 or 28/16',
    baseUnit: '16th note',
    durations: [4, 3, 1, 4, 2, 2, 4, 1, 3, 4],
    accents: [0],
    generators: { a: 7, b: 4, mode: 'binary' },
  },
  {
    id: 'fibonacci_8_5',
    name: 'Fibonacci Ratio (8 ÷ 5)',
    genre: 'Polyrhythmic Fundamental',
    description: 'Golden ratio approximation of 8 against 5',
    timeSignature: '40/16',
    baseUnit: '16th note',
    durations: [5, 3, 2, 5, 1, 4, 4, 1, 5, 2, 3, 5],
    accents: [0],
    generators: { a: 8, b: 5, mode: 'binary' },
  },

  // 2. Afro-Cuban & Latin
  {
    id: 'rhumba_tresillo',
    name: 'Rhumba / Tresillo Bass',
    genre: 'Afro-Cuban / Latin',
    description: 'Bass resultant from a 4-place instrumental cycle interfered by a 2+1+1 duration group',
    timeSignature: '4/4 or 8/8',
    baseUnit: 'eighth note',
    durations: [3, 3, 2],
    accents: [0],
    isCustomDuration: true,
  },
  {
    id: 'rhumba_clave',
    name: 'Rhumba Clave Cell',
    genre: 'Afro-Cuban / Latin',
    description: 'Symmetric syncopated cell from fractional continuity in the 8/8 series',
    timeSignature: '4/4 or 8/8',
    baseUnit: 'eighth note',
    durations: [3, 2, 3],
    accents: [0],
    isCustomDuration: true,
  },

  // 3. Jazz, Swing & Dance
  {
    id: 'charleston',
    name: 'Charleston Rhythm',
    genre: 'Early Jazz / Dance',
    description: 'Unbalanced binomial created by unit-of-deviation shift from a balanced 4+4 bar',
    timeSignature: '4/4 or 8/8',
    baseUnit: 'eighth note',
    durations: [5, 3],
    accents: [0],
    isCustomDuration: true,
  },
  {
    id: 'swing_core',
    name: 'Swing Core Cell',
    genre: 'Swing / Big Band',
    description: 'Characteristic syncopated swing trinomial projected on a 12/12 triplet base',
    timeSignature: '4/4 (12/8 triplet feel)',
    baseUnit: 'triplet eighth note',
    durations: [4, 1, 4],
    accents: [0],
    isCustomDuration: true,
  },
  {
    id: 'tango_square',
    name: 'Tango Distributive Square',
    genre: 'Tango / Argentine',
    description: 'Distributive square of the trinomial (1 + 2 + 1) squared',
    timeSignature: '4/4',
    baseUnit: '16th note',
    durations: [1, 2, 1, 2, 4, 2, 1, 2, 1],
    accents: [0, 3, 6],
    isCustomDuration: true,
  },

  // 4. Fractional Continuity
  {
    id: 'fractioned_3_2',
    name: 'Fractioned Balance 3÷2',
    genre: 'Classical / Pedagogical',
    description: 'Resultant with fractioning around the axis of symmetry (3² = 9)',
    timeSignature: '9/8 or 3/4',
    baseUnit: 'eighth note',
    durations: [2, 1, 1, 1, 1, 1, 2],
    accents: [0],
    generators: { a: 3, b: 2, mode: 'fractioned' },
  },
  {
    id: 'fractioned_4_3',
    name: 'Fractioned Balance 4÷3',
    genre: 'Classical / Pedagogical',
    description: 'Resultant with fractioning around the axis of symmetry (4² = 16)',
    timeSignature: '4/4',
    baseUnit: '16th note',
    durations: [3, 1, 2, 1, 1, 1, 1, 2, 1, 3],
    accents: [0],
    generators: { a: 4, b: 3, mode: 'fractioned' },
  },
];

export function getPresetById(id: string): GenrePreset | undefined {
  return RHYTHM_PRESETS.find((p) => p.id === id);
}

/**
 * Calculates a complete ResultantOutput structure for custom duration presets
 */
export function calculatePresetResultant(preset: GenrePreset): ResultantOutput {
  const totalLength = preset.durations.reduce((sum, d) => sum + d, 0);
  const accentSet = new Set(preset.accents || [0]);

  // Build Resultant attack points and blocks
  const resultantBlocks: DurationBlock[] = [];
  const resultantAttacks: number[] = [0];
  let currTick = 0;

  preset.durations.forEach((dur, idx) => {
    resultantBlocks.push({
      index: idx,
      startTick: currTick,
      duration: dur,
      isAccented: accentSet.has(idx),
      generatorSource: 'resultant',
    });
    currTick += dur;
    resultantAttacks.push(currTick);
  });

  // Calculate measure boundaries and metric pulse
  let barStep = 4;
  if (totalLength % 4 === 0) barStep = 4;
  else if (totalLength % 3 === 0) barStep = 3;
  else barStep = Math.max(2, Math.floor(totalLength / 2));

  const pulsePeriod = barStep <= 4 ? 2 : 4;
  const aAttacks: number[] = [];
  const aBlocks: DurationBlock[] = [];
  let aIdx = 0;
  for (let t = 0; t <= totalLength; t += pulsePeriod) {
    aAttacks.push(t);
  }
  for (let i = 0; i < aAttacks.length - 1; i++) {
    aBlocks.push({
      index: aIdx++,
      startTick: aAttacks[i],
      duration: aAttacks[i + 1] - aAttacks[i],
      isAccented: aAttacks[i] % barStep === 0,
      generatorSource: 'a',
    });
  }

  // Component syncopation lane (b)
  const bAttacks = [...resultantAttacks];
  const bBlocks: DurationBlock[] = resultantBlocks.map((b) => ({
    ...b,
    generatorSource: 'b',
  }));

  const measureBars: number[] = [];
  for (let m = 0; m <= totalLength; m += barStep) {
    measureBars.push(m);
  }
  if (!measureBars.includes(totalLength)) {
    measureBars.push(totalLength);
  }

  const lanes: GeneratorLane[] = [
    {
      id: 'a',
      name: `Metric Pulse (${pulsePeriod} units)`,
      symbol: 'a',
      period: pulsePeriod,
      totalLength,
      blocks: aBlocks,
      attackTicks: aAttacks,
      color: '#0284c7',
    },
    {
      id: 'b',
      name: `Pattern Generator`,
      symbol: 'b',
      period: 0,
      totalLength,
      blocks: bBlocks,
      attackTicks: bAttacks,
      color: '#e11d48',
    },
    {
      id: 'resultant',
      name: `Resultant r (${preset.name})`,
      symbol: 'r',
      period: totalLength,
      totalLength,
      blocks: resultantBlocks,
      attackTicks: resultantAttacks,
      color: '#c84b31',
    },
  ];

  return {
    generators: {
      a: pulsePeriod,
      b: preset.durations[0] || 2,
    },
    mode: 'binary',
    metricGrouping: 'ab',
    totalLength,
    subdivisions: totalLength,
    durations: [...preset.durations],
    accentIndices: [...(preset.accents || [0])],
    formulaString: `${preset.durations.join(' + ')} (${totalLength} units)`,
    measureBars,
    lanes,
  };
}
