import { ChordItem } from './engine';
import { MultiTrackDefinition, MultiTrackNote } from '../export/midi';
import {
  calculateSchillingerRhythm,
  applyRhythmVariations,
} from '../rhythm/engine';
import { SyncMode, MetricGrouping } from '../rhythm/types';
import { RHYTHM_PRESETS, GenrePreset } from '../rhythm/presets';

export type GrooveStyle =
  | 'sustained'   // Classical sustained chord blocks (no rhythmic subdivision)
  | 'comping'     // Full voice-led chord strikes on each resultant attack
  | 'bass_chords' // Bass anchored to Generator a metric downbeats; upper voices comp on resultant
  | 'arpeggio';   // Upper voices cycle across resultant attacks

export interface HarmonyGroovePattern {
  id: string;
  name: string;
  category: 'Standard' | 'Syncopated' | 'Symmetric' | 'Complex';
  description: string;
  a: number;
  b: number;
  c?: number;
  mode: SyncMode;
  metricGrouping: MetricGrouping;
  durations: number[];      // Atomic tick durations (sum = totalLength)
  accentIndices: number[];  // Ticks/indices with downbeat/coincidence accents
  totalLength: number;      // Length of one rhythmic measure/cycle
}

function buildPreset(
  id: string,
  name: string,
  category: 'Standard' | 'Syncopated' | 'Symmetric' | 'Complex',
  description: string,
  a: number,
  b: number,
  mode: SyncMode,
  metricGrouping: MetricGrouping,
  c?: number
): HarmonyGroovePattern {
  const res = calculateSchillingerRhythm(a, b, mode, metricGrouping, c);
  return {
    id,
    name,
    category,
    description,
    a,
    b,
    c,
    mode,
    metricGrouping,
    durations: res.durations,
    accentIndices: res.accentIndices,
    totalLength: res.totalLength,
  };
}

export const HARMONY_GROOVE_PRESETS: HarmonyGroovePattern[] = [
  {
    id: 'sustained',
    name: 'Sustained Pad (Whole Note)',
    category: 'Standard',
    description: 'Sustains each chord as a whole-measure pad without rhythmic subdivision.',
    a: 4,
    b: 4,
    mode: 'binary',
    metricGrouping: 'ab',
    durations: [16],
    accentIndices: [0],
    totalLength: 16,
  },
  buildPreset(
    'gershwin_4_3',
    'Gershwin Broadway (4 ÷ 3)',
    'Syncopated',
    'Classic Broadway swing polyrhythmic resultant. Energetic syncopation with 4-tick metric anchors.',
    4,
    3,
    'binary',
    'a'
  ),
  buildPreset(
    'clave_3_2',
    'Son Clave Syncopation (3 ÷ 2)',
    'Syncopated',
    'Afro-Cuban and Bossa nova resultant foundation. Driving offbeat syncopation.',
    3,
    2,
    'binary',
    'a'
  ),
  buildPreset(
    'symmetric_4_3',
    'Symmetric Axis (4 ÷ 3̲)',
    'Symmetric',
    'Fractioned symmetrical resultant balanced around the temporal midpoint of the bar.',
    4,
    3,
    'fractioned',
    'ab'
  ),
  buildPreset(
    'balkan_5_4',
    'Balkan Dance (5 ÷ 4)',
    'Complex',
    'Asymmetric 5-against-4 compound resultant. Dynamic tension and release.',
    5,
    4,
    'binary',
    'a'
  ),
  buildPreset(
    'waltz_3_2',
    'Triple Syncopation (3 ÷ 2)',
    'Standard',
    'Brisk triplet cross-pulse ideal for jazz waltzes and rolling ostinatos.',
    3,
    2,
    'binary',
    'b'
  ),
];

/**
 * Converts a GenrePreset from Rhythm Studio into a HarmonyGroovePattern
 */
export function convertRhythmPresetToGroove(preset: GenrePreset): HarmonyGroovePattern {
  let durations = [...preset.durations];
  let accents = preset.accents ? [...preset.accents] : [0];
  let totalLength = durations.reduce((sum, d) => sum + d, 0);

  if (preset.generators && !preset.isCustomDuration) {
    const res = calculateSchillingerRhythm(
      preset.generators.a,
      preset.generators.b,
      preset.generators.mode,
      'ab',
      preset.generators.c
    );
    durations = res.durations;
    accents = res.accentIndices;
    totalLength = res.totalLength;
  }

  let category: 'Standard' | 'Syncopated' | 'Symmetric' | 'Complex' = 'Standard';
  if (
    preset.genre.includes('Latin') ||
    preset.genre.includes('Dance') ||
    preset.genre.includes('Swing')
  ) {
    category = 'Syncopated';
  } else if (preset.genre.includes('Classical') || preset.genre.includes('Pedagogical')) {
    category = 'Symmetric';
  } else if (
    preset.genre.includes('Complex') ||
    preset.name.includes('7') ||
    preset.name.includes('8') ||
    preset.name.includes('Fibonacci')
  ) {
    category = 'Complex';
  }

  return {
    id: `rhythm_${preset.id}`,
    name: `${preset.name}`,
    category,
    description: `${preset.genre}: ${preset.description}`,
    a: preset.generators?.a || 4,
    b: preset.generators?.b || 3,
    c: preset.generators?.c,
    mode: preset.generators?.mode || 'binary',
    metricGrouping: 'ab',
    durations,
    accentIndices: accents,
    totalLength,
  };
}

/**
 * All available groove presets combining curated harmony styles and rhythm presets
 */
export const ALL_HARMONY_GROOVE_PRESETS: HarmonyGroovePattern[] = [
  ...HARMONY_GROOVE_PRESETS,
  ...RHYTHM_PRESETS.map(convertRhythmPresetToGroove).filter(
    (rp) => !HARMONY_GROOVE_PRESETS.some((hp) => hp.id === rp.id)
  ),
];

/**
 * Creates a live coupled groove pattern directly from the Rhythm Tab's current resultant
 */
export function createLiveRhythmGroove(
  durations: number[],
  accentIndices: number[],
  totalLength: number,
  name: string = 'Live Rhythm Generator',
  description: string = 'Dynamic resultant inherited from active Rhythm Tab'
): HarmonyGroovePattern {
  return {
    id: 'live_rhythm',
    name: `Custom (Inherit from Rhythm Tab)`,
    category: 'Standard',
    description: `${description} (${durations.length} attacks, ${totalLength} units)`,
    a: 4,
    b: 3,
    mode: 'binary',
    metricGrouping: 'ab',
    durations: durations.length > 0 ? durations : [4, 4, 4, 4],
    accentIndices: accentIndices.length > 0 ? accentIndices : [0],
    totalLength: totalLength > 0 ? totalLength : 16,
  };
}

/**
 * Creates a custom groove pattern directly from Rhythm Studio generator parameters
 */
export function createGrooveFromRhythmState(
  a: number,
  b: number,
  mode: SyncMode,
  metricGrouping: MetricGrouping,
  c?: number,
  isReversed: boolean = false,
  rotationOffset: number = 0
): HarmonyGroovePattern {
  const baseResultant = calculateSchillingerRhythm(a, b, mode, metricGrouping, c);
  const { durations, accentIndices } = applyRhythmVariations(
    baseResultant.durations,
    baseResultant.accentIndices,
    isReversed,
    rotationOffset
  );

  return {
    id: 'live_rhythm',
    name: `Custom (Inherit from Rhythm Tab)`,
    category: 'Standard',
    description: `Real-time synchronization using active Rhythm Studio parameters (${a} ÷ ${b}).`,
    a,
    b,
    c,
    mode,
    metricGrouping,
    durations,
    accentIndices,
    totalLength: baseResultant.totalLength,
  };
}

export interface ProgressionArrangementTimeline {
  tracks: MultiTrackDefinition[];
  totalTimelineUnits: number;
  chordSteps: Array<{
    stepIndex: number;
    startUnit: number;
    endUnit: number;
    chord: ChordItem;
  }>;
}

/**
 * Realizes a full harmonic progression into multi-track musical arrangement notes
 */
export function generateProgressionArrangement(
  chords: ChordItem[],
  groove: HarmonyGroovePattern,
  style: GrooveStyle = 'comping',
  includePercussion: boolean = true
): ProgressionArrangementTimeline {
  const bassNotes: MultiTrackNote[] = [];
  const chordNotes: MultiTrackNote[] = [];
  const percussionNotes: MultiTrackNote[] = [];

  const chordSteps: Array<{
    stepIndex: number;
    startUnit: number;
    endUnit: number;
    chord: ChordItem;
  }> = [];

  let currentTimelineUnit = 0;
  const accentSet = new Set(groove.accentIndices);

  chords.forEach((chord, chordIdx) => {
    const chordStart = currentTimelineUnit;
    const chordEnd = chordStart + groove.totalLength;

    chordSteps.push({
      stepIndex: chordIdx,
      startUnit: chordStart,
      endUnit: chordEnd,
      chord,
    });

    const voiced = chord.voicedMidiNotes && chord.voicedMidiNotes.length > 0
      ? chord.voicedMidiNotes
      : [chord.rootPitchClass + 48, chord.rootPitchClass + 60, chord.rootPitchClass + 64, chord.rootPitchClass + 67];

    const bassPitch = voiced[0];
    const upperPitches = voiced.length > 1 ? voiced.slice(1) : voiced;

    if (style === 'sustained') {
      // 1. Sustained Pad: 1 long event spanning the entire cycle
      bassNotes.push({
        tick: chordStart,
        durationUnits: groove.totalLength,
        pitches: [bassPitch],
        velocity: 100,
        gateRatio: 0.95,
      });

      chordNotes.push({
        tick: chordStart,
        durationUnits: groove.totalLength,
        pitches: upperPitches,
        velocity: 88,
        gateRatio: 0.95,
      });

      if (includePercussion) {
        // Metronomic bar strike on downbeat
        percussionNotes.push({
          tick: chordStart,
          durationUnits: Math.min(4, groove.totalLength),
          pitches: [76], // GM Woodblock
          velocity: 100,
          gateRatio: 0.5,
        });
      }
    } else if (style === 'comping') {
      // 2. Comping: Full voicings pulsing to the resultant attacks
      let localTick = 0;
      groove.durations.forEach((dur, durIdx) => {
        const isAccented = accentSet.has(durIdx);
        const noteTick = chordStart + localTick;
        const vel = isAccented ? 115 : 82;
        const gate = isAccented ? 0.85 : 0.65;

        // Bass strikes with upper voicings
        bassNotes.push({
          tick: noteTick,
          durationUnits: dur,
          pitches: [bassPitch],
          velocity: isAccented ? 112 : 88,
          gateRatio: gate,
        });

        chordNotes.push({
          tick: noteTick,
          durationUnits: dur,
          pitches: upperPitches,
          velocity: vel,
          gateRatio: gate,
        });

        if (includePercussion) {
          percussionNotes.push({
            tick: noteTick,
            durationUnits: dur,
            pitches: [isAccented ? 37 : 75], // 37 = Rimshot, 75 = Claves
            velocity: isAccented ? 115 : 80,
            gateRatio: 0.5,
          });
        }

        localTick += dur;
      });
    } else if (style === 'bass_chords') {
      // 3. Bass & Chord Split: Bass anchored to downbeat; upper chords comp on resultant
      bassNotes.push({
        tick: chordStart,
        durationUnits: groove.totalLength,
        pitches: [bassPitch],
        velocity: 110,
        gateRatio: 0.92,
      });

      let localTick = 0;
      groove.durations.forEach((dur, durIdx) => {
        const isAccented = accentSet.has(durIdx);
        const noteTick = chordStart + localTick;
        const vel = isAccented ? 112 : 80;
        const gate = 0.62; // Crisper comping over sustained bass

        chordNotes.push({
          tick: noteTick,
          durationUnits: dur,
          pitches: upperPitches,
          velocity: vel,
          gateRatio: gate,
        });

        if (includePercussion) {
          percussionNotes.push({
            tick: noteTick,
            durationUnits: dur,
            pitches: [isAccented ? 76 : 75], // Woodblock on accent, Claves on offbeat
            velocity: isAccented ? 110 : 80,
            gateRatio: 0.5,
          });
        }

        localTick += dur;
      });
    } else if (style === 'arpeggio') {
      // 4. Linearized Arpeggio: Upper voices cycle sequentially across resultant attacks
      bassNotes.push({
        tick: chordStart,
        durationUnits: groove.totalLength,
        pitches: [bassPitch],
        velocity: 115,
        gateRatio: 0.95,
      });

      let localTick = 0;
      groove.durations.forEach((dur, durIdx) => {
        const isAccented = accentSet.has(durIdx);
        const noteTick = chordStart + localTick;

        // Pick one upper voice by rotating through the upper pitch classes
        const voiceIdx = durIdx % upperPitches.length;
        const targetPitch = upperPitches[voiceIdx];

        chordNotes.push({
          tick: noteTick,
          durationUnits: dur,
          pitches: [targetPitch],
          velocity: isAccented ? 108 : 82,
          gateRatio: 0.85,
        });

        if (includePercussion) {
          percussionNotes.push({
            tick: noteTick,
            durationUnits: dur,
            pitches: [isAccented ? 37 : 75],
            velocity: isAccented ? 100 : 75,
            gateRatio: 0.4,
          });
        }

        localTick += dur;
      });
    }

    currentTimelineUnit += groove.totalLength;
  });

  const tracks: MultiTrackDefinition[] = [
    {
      name: 'Rhythmic Harmony',
      channel: 0, // MIDI Channel 1
      notes: chordNotes,
    },
    {
      name: 'Bass Ground',
      channel: 1, // MIDI Channel 2
      notes: bassNotes,
    },
  ];

  if (includePercussion && percussionNotes.length > 0) {
    tracks.push({
      name: 'Schillinger Percussion',
      channel: 9, // General MIDI Channel 10 (0-indexed 9)
      notes: percussionNotes,
    });
  }

  return {
    tracks,
    totalTimelineUnits: currentTimelineUnit,
    chordSteps,
  };
}
