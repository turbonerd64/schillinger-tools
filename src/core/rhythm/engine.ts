import {
  SyncMode,
  MetricGrouping,
  ResultantOutput,
  GeneratorLane,
  DurationBlock,
} from './types';

/**
 * Computes greatest common divisor
 */
export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * Computes least common multiple
 */
export function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

/**
 * Standard binary synchronization (a ÷ b)
 * Length = a * b
 */
export function computeBinarySync(
  a: number,
  b: number,
  metricGrouping: MetricGrouping = 'ab'
): {
  totalLength: number;
  durations: number[];
  accentIndices: number[];
  aAttacks: number[];
  bAttacks: number[];
  allAttacks: number[];
} {
  const totalLength = a * b;
  const aAttacks: number[] = [];
  const bAttacks: number[] = [];

  for (let t = 0; t <= totalLength; t += a) {
    aAttacks.push(t);
  }
  for (let t = 0; t <= totalLength; t += b) {
    bAttacks.push(t);
  }

  const attackSet = new Set<number>([...aAttacks, ...bAttacks]);
  const sortedAttacks = Array.from(attackSet).sort((x, y) => x - y);

  const durations: number[] = [];
  const accentIndices: number[] = [];

  const aSet = new Set(aAttacks);
  const bSet = new Set(bAttacks);

  for (let i = 0; i < sortedAttacks.length - 1; i++) {
    const currentTick = sortedAttacks[i];
    const dur = sortedAttacks[i + 1] - currentTick;
    durations.push(dur);

    // Schillinger Accents (Book I, Chapter 2 & Chapter 8):
    // 1. Phase coincidence: Simultaneous strike of both generators (t = 0 and common multiples)
    // 2. Metric downbeat accents:
    //    - When grouping by a: every attack of major generator a marks a primary metric accent
    //    - When grouping by b: every attack of minor generator b marks a primary metric accent
    //    - When grouping by ab (macro cycle): generator a attacks mark the internal structural metric pulses
    let isAccented = false;
    if (aSet.has(currentTick) && bSet.has(currentTick)) {
      isAccented = true;
    } else if (metricGrouping === 'a' && aSet.has(currentTick)) {
      isAccented = true;
    } else if (metricGrouping === 'b' && bSet.has(currentTick)) {
      isAccented = true;
    } else if (metricGrouping === 'ab' && aSet.has(currentTick)) {
      isAccented = true;
    }

    if (isAccented) {
      accentIndices.push(i);
    }
  }

  return {
    totalLength,
    durations,
    accentIndices,
    aAttacks,
    bAttacks,
    allAttacks: sortedAttacks,
  };
}

/**
 * Synchronization with fractioning around axis of symmetry (a ÷ b̲)
 * Length = a^2
 * Number of b-groups = a - b + 1
 * Each b-group k starts at k * a and fires 'a' attacks of length 'b'
 */
export function computeFractionedSync(a: number, b: number): {
  totalLength: number;
  durations: number[];
  accentIndices: number[];
  aAttacks: number[];
  bGroupsAttacks: number[][];
  allAttacks: number[];
} {
  const totalLength = a * a;
  const aAttacks: number[] = [];
  for (let t = 0; t <= totalLength; t += a) {
    aAttacks.push(t);
  }

  const numBGroups = a - b + 1;
  const bGroupsAttacks: number[][] = [];
  const allBAttacks: number[] = [];

  for (let k = 0; k < numBGroups; k++) {
    const startTick = k * a;
    const groupAttacks: number[] = [];
    for (let step = 0; step <= a; step++) {
      const tick = startTick + step * b;
      if (tick <= totalLength) {
        groupAttacks.push(tick);
        allBAttacks.push(tick);
      }
    }
    bGroupsAttacks.push(groupAttacks);
  }

  const attackSet = new Set<number>([...aAttacks, ...allBAttacks]);
  const sortedAttacks = Array.from(attackSet).sort((x, y) => x - y);

  const durations: number[] = [];
  const accentIndices: number[] = [];

  const aSet = new Set(aAttacks);
  const bCombinedSet = new Set(allBAttacks);

  for (let i = 0; i < sortedAttacks.length - 1; i++) {
    const currentTick = sortedAttacks[i];
    durations.push(sortedAttacks[i + 1] - currentTick);

    // Accent occurs at coincidence of major generator phase and any minor generator attack
    if (aSet.has(currentTick) && bCombinedSet.has(currentTick)) {
      accentIndices.push(i);
    }
  }

  return {
    totalLength,
    durations,
    accentIndices,
    aAttacks,
    bGroupsAttacks,
    allAttacks: sortedAttacks,
  };
}

/**
 * Three-generator synchronization (a ÷ b ÷ c) from Book I Chapter 6
 * Length = a * b * c (common product)
 * Produces theme r and countertheme r' (from complementary factors)
 */
export function computeTrinomialSync(a: number, b: number, c: number): {
  totalLength: number;
  durations: number[];
  accentIndices: number[];
  aAttacks: number[];
  bAttacks: number[];
  cAttacks: number[];
  allAttacks: number[];
  counterthemeDurations: number[];
} {
  const totalLength = a * b * c;
  const aAttacks: number[] = [];
  const bAttacks: number[] = [];
  const cAttacks: number[] = [];

  for (let t = 0; t <= totalLength; t += a) aAttacks.push(t);
  for (let t = 0; t <= totalLength; t += b) bAttacks.push(t);
  for (let t = 0; t <= totalLength; t += c) cAttacks.push(t);

  const attackSet = new Set<number>([...aAttacks, ...bAttacks, ...cAttacks]);
  const sortedAttacks = Array.from(attackSet).sort((x, y) => x - y);

  const durations: number[] = [];
  const accentIndices: number[] = [];

  for (let i = 0; i < sortedAttacks.length - 1; i++) {
    durations.push(sortedAttacks[i + 1] - sortedAttacks[i]);
    const tick = sortedAttacks[i];
    const matchCount = (tick % a === 0 ? 1 : 0) + (tick % b === 0 ? 1 : 0) + (tick % c === 0 ? 1 : 0);
    if (matchCount >= 2) {
      accentIndices.push(i);
    }
  }

  // Countertheme r' from complementary factors: cfA = L/a, cfB = L/b, cfC = L/c
  const cfA = totalLength / a;
  const cfB = totalLength / b;
  const cfC = totalLength / c;
  const cfAttacks = new Set<number>();
  for (let t = 0; t <= totalLength; t += cfA) cfAttacks.add(t);
  for (let t = 0; t <= totalLength; t += cfB) cfAttacks.add(t);
  for (let t = 0; t <= totalLength; t += cfC) cfAttacks.add(t);

  const sortedCf = Array.from(cfAttacks).sort((x, y) => x - y);
  const counterthemeDurations: number[] = [];
  for (let i = 0; i < sortedCf.length - 1; i++) {
    counterthemeDurations.push(sortedCf[i + 1] - sortedCf[i]);
  }

  return {
    totalLength,
    durations,
    accentIndices,
    aAttacks,
    bAttacks,
    cAttacks,
    allAttacks: sortedAttacks,
    counterthemeDurations,
  };
}

/**
 * Calculates metric grouping measure boundaries
 */
export function getMeasureBars(
  totalLength: number,
  metricGrouping: MetricGrouping,
  a: number,
  b: number
): number[] {
  const bars: number[] = [];
  let step = totalLength;

  if (metricGrouping === 'ab') {
    step = totalLength;
  } else if (metricGrouping === 'a') {
    step = a;
  } else if (metricGrouping === 'b') {
    step = b;
  }

  for (let t = 0; t <= totalLength; t += step) {
    bars.push(t);
  }

  return bars;
}

/**
 * Converts attack ticks into duration blocks for visual lane rendering
 */
function attacksToBlocks(
  attacks: number[],
  totalLength: number,
  generatorSource: 'a' | 'b' | 'c' | 'resultant',
  accentSet?: Set<number>
): DurationBlock[] {
  const blocks: DurationBlock[] = [];
  for (let i = 0; i < attacks.length - 1; i++) {
    const startTick = attacks[i];
    const dur = attacks[i + 1] - startTick;
    blocks.push({
      index: i,
      startTick,
      duration: dur,
      isAccented: accentSet ? accentSet.has(startTick) : i === 0,
      generatorSource,
    });
  }
  return blocks;
}

/**
 * Master generator calculation for Schillinger Book I Rhythm
 */
export function calculateSchillingerRhythm(
  a: number,
  b: number,
  mode: SyncMode = 'binary',
  metricGrouping: MetricGrouping = 'ab',
  c?: number
): ResultantOutput {
  // Validate constraints
  if (a <= 0 || b <= 0) {
    throw new Error('Generators must be positive integers');
  }

  if (mode !== 'trinomial' && a <= b) {
    throw new Error('Major generator (a) must be strictly greater than minor generator (b)');
  }

  const measureBars = getMeasureBars(
    mode === 'fractioned' ? a * a : mode === 'trinomial' && c ? a * b * c : a * b,
    metricGrouping,
    a,
    b
  );

  if (mode === 'fractioned') {
    const res = computeFractionedSync(a, b);
    const accentSet = new Set(res.accentIndices.map((idx) => res.allAttacks[idx]));

    const aBlocks = attacksToBlocks(res.aAttacks, res.totalLength, 'a');
    
    // In Schillinger's system (Book I, Chapter 5), each fraction group is a distinct sub-generator
    // starting at phase 0, a, 2a, etc. Displaying each on its own lane eliminates visual block overlap!
    const bLanes: GeneratorLane[] = res.bGroupsAttacks.map((group, gIdx) => {
      const gBlocks: DurationBlock[] = [];
      for (let i = 0; i < group.length - 1; i++) {
        gBlocks.push({
          index: i,
          startTick: group[i],
          duration: group[i + 1] - group[i],
          isAccented: i === 0,
          generatorSource: 'b',
        });
      }
      return {
        id: `b_${gIdx + 1}`,
        name: `Fractioned Minor (b̲${gIdx + 1} = ${b})`,
        symbol: `b̲${gIdx + 1}`,
        period: b,
        totalLength: res.totalLength,
        blocks: gBlocks,
        attackTicks: group,
        color: gIdx === 0 ? '#e11d48' : '#f43f5e',
      };
    });

    const resultantBlocks = attacksToBlocks(res.allAttacks, res.totalLength, 'resultant', accentSet);

    const lanes: GeneratorLane[] = [
      {
        id: 'a',
        name: `Major Generator (a = ${a})`,
        symbol: 'a',
        period: a,
        totalLength: res.totalLength,
        blocks: aBlocks,
        attackTicks: res.aAttacks,
        color: '#0284c7',
      },
      ...bLanes,
      {
        id: 'resultant',
        name: `Resultant (r a÷b̲)`,
        symbol: 'r',
        period: 0,
        totalLength: res.totalLength,
        blocks: resultantBlocks,
        attackTicks: res.allAttacks,
        color: '#c84b31',
      },
    ];

    const formulaString = `r = ${res.durations.join(' + ')}`;

    return {
      generators: { a, b },
      mode,
      metricGrouping,
      totalLength: res.totalLength,
      subdivisions: res.totalLength,
      durations: res.durations,
      accentIndices: res.accentIndices,
      formulaString,
      measureBars,
      lanes,
    };
  }

  if (mode === 'trinomial' && c) {
    const res = computeTrinomialSync(a, b, c);
    const accentSet = new Set(res.accentIndices.map((idx) => res.allAttacks[idx]));

    const aBlocks = attacksToBlocks(res.aAttacks, res.totalLength, 'a');
    const bBlocks = attacksToBlocks(res.bAttacks, res.totalLength, 'b');
    const cBlocks = attacksToBlocks(res.cAttacks, res.totalLength, 'c');
    const resultantBlocks = attacksToBlocks(res.allAttacks, res.totalLength, 'resultant', accentSet);

    const lanes: GeneratorLane[] = [
      {
        id: 'a',
        name: `Generator 1 (a = ${a})`,
        symbol: 'a',
        period: a,
        totalLength: res.totalLength,
        blocks: aBlocks,
        attackTicks: res.aAttacks,
        color: '#00e5ff',
      },
      {
        id: 'b',
        name: `Generator 2 (b = ${b})`,
        symbol: 'b',
        period: b,
        totalLength: res.totalLength,
        blocks: bBlocks,
        attackTicks: res.bAttacks,
        color: '#ff5376',
      },
      {
        id: 'c',
        name: `Generator 3 (c = ${c})`,
        symbol: 'c',
        period: c,
        totalLength: res.totalLength,
        blocks: cBlocks,
        attackTicks: res.cAttacks,
        color: '#b388ff',
      },
      {
        id: 'resultant',
        name: `Theme (r a÷b÷c)`,
        symbol: 'r',
        period: 0,
        totalLength: res.totalLength,
        blocks: resultantBlocks,
        attackTicks: res.allAttacks,
        color: '#ffb300',
      },
    ];

    return {
      generators: { a, b, c },
      mode,
      metricGrouping,
      totalLength: res.totalLength,
      subdivisions: res.totalLength,
      durations: res.durations,
      accentIndices: res.accentIndices,
      formulaString: `r = ${res.durations.join(' + ')}`,
      measureBars,
      lanes,
      counterthemeDurations: res.counterthemeDurations,
    };
  }

  // Standard Binary (a ÷ b)
  const res = computeBinarySync(a, b, metricGrouping);
  const accentSet = new Set(res.accentIndices.map((idx) => res.allAttacks[idx]));

  const aBlocks = attacksToBlocks(res.aAttacks, res.totalLength, 'a');
  const bBlocks = attacksToBlocks(res.bAttacks, res.totalLength, 'b');
  const resultantBlocks = attacksToBlocks(res.allAttacks, res.totalLength, 'resultant', accentSet);

  const lanes: GeneratorLane[] = [
    {
      id: 'a',
      name: `Major Generator (a = ${a})`,
      symbol: 'a',
      period: a,
      totalLength: res.totalLength,
      blocks: aBlocks,
      attackTicks: res.aAttacks,
      color: '#00e5ff',
    },
    {
      id: 'b',
      name: `Minor Generator (b = ${b})`,
      symbol: 'b',
      period: b,
      totalLength: res.totalLength,
      blocks: bBlocks,
      attackTicks: res.bAttacks,
      color: '#ff5376',
    },
    {
      id: 'resultant',
      name: `Resultant (r a÷b)`,
      symbol: 'r',
      period: 0,
      totalLength: res.totalLength,
      blocks: resultantBlocks,
      attackTicks: res.allAttacks,
      color: '#ffb300',
    },
  ];

  const formulaString = `r = ${res.durations.join(' + ')}`;

  return {
    generators: { a, b },
    mode,
    metricGrouping,
    totalLength: res.totalLength,
    subdivisions: res.totalLength,
    durations: res.durations,
    accentIndices: res.accentIndices,
    formulaString,
    measureBars,
    lanes,
  };
}

/**
 * Apply rhythm variations (Retrograde, Rotation)
 */
export function applyRhythmVariations(
  durations: number[],
  accentIndices: number[],
  reverse: boolean,
  rotationOffset: number
): { durations: number[]; accentIndices: number[] } {
  let result = [...durations];
  let accents = new Set(accentIndices);

  // Map accents to boolean array
  let accentMap = durations.map((_, i) => accents.has(i));

  // Reverse (Retrograde)
  if (reverse) {
    result.reverse();
    accentMap.reverse();
  }

  // Circular permutation (Rotate)
  if (rotationOffset !== 0) {
    const n = result.length;
    const shift = ((rotationOffset % n) + n) % n;
    result = [...result.slice(shift), ...result.slice(0, shift)];
    accentMap = [...accentMap.slice(shift), ...accentMap.slice(0, shift)];
  }

  const finalAccentIndices: number[] = [];
  accentMap.forEach((isAcc, idx) => {
    if (isAcc) finalAccentIndices.push(idx);
  });

  return { durations: result, accentIndices: finalAccentIndices };
}
