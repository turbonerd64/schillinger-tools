export type SyncMode = 'binary' | 'fractioned' | 'trinomial';
export type MetricGrouping = 'ab' | 'a' | 'b';

export interface AttackPoint {
  tick: number;
  sources: ('a' | 'b' | 'c')[];
  isCoincidence: boolean; // Coincidence of phase (accent >)
  isMeasureBoundary?: boolean;
}

export interface DurationBlock {
  index: number;
  startTick: number;
  duration: number;
  isAccented: boolean;
  generatorSource?: 'a' | 'b' | 'c' | 'resultant';
  measureIndex?: number;
}

export interface GeneratorLane {
  id: 'a' | 'b' | 'c' | 'resultant' | 'countertheme';
  name: string;
  symbol: string;
  period: number;
  totalLength: number;
  blocks: DurationBlock[];
  attackTicks: number[];
  color: string;
}

export interface ResultantOutput {
  generators: {
    a: number;
    b: number;
    c?: number;
  };
  mode: SyncMode;
  metricGrouping: MetricGrouping;
  totalLength: number;
  subdivisions: number;
  durations: number[];
  accentIndices: number[]; // indices in durations array that have accents
  formulaString: string;
  measureBars: number[];   // ticks where bar lines appear
  lanes: GeneratorLane[];
  counterthemeDurations?: number[]; // For trinomial synchronization (r')
}

export interface RhythmVariationState {
  isReversed: boolean;
  rotationOffset: number; // circular permutation shift
}
