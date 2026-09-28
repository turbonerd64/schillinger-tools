import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  PARENT_SCALES,
  CYCLE_MOVES,
  CycleMove,
  ScaleDefinition,
  ChordStructureType,
  HarmonySystemType,
  VoiceLeadingMode,
  ChordItem,
  generateRailChords,
  applySchillingerVoiceLeading,
  rebuildChordWithStructure,
} from '../../core/harmony/engine';
import {
  getHarmonyPresetById,
  getCycleMovesForPreset,
} from '../../core/harmony/presets';
import {
  GrooveStyle,
  HarmonyGroovePattern,
  HARMONY_GROOVE_PRESETS,
  ALL_HARMONY_GROOVE_PRESETS,
  createLiveRhythmGroove,
  createGrooveFromRhythmState,
  generateProgressionArrangement,
} from '../../core/harmony/groove';
import { FormulaBar } from './FormulaBar';
import { GrooveControlStrip } from './GrooveControlStrip';
import { MasterProgressionLane } from './MasterProgressionLane';
import { ParallelModeRails } from './ParallelModeRails';
import { InteractivePiano } from './InteractivePiano';
import { InteractiveFretboard } from './InteractiveFretboard';
import { HarmonyExportPanel } from './HarmonyExportPanel';
import { audioService } from '../../core/audio/synth';
import { SyncMode, MetricGrouping } from '../../core/rhythm/types';

export interface LiveRhythmData {
  a: number;
  b: number;
  c?: number;
  mode: SyncMode;
  metricGrouping: MetricGrouping;
  durations: number[];
  accentIndices: number[];
  totalLength: number;
  name: string;
  description: string;
  isReversed?: boolean;
  rotationOffset?: number;
}

interface HarmonyStudioViewProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  selectedChordIndex: number;
  setSelectedChordIndex: React.Dispatch<React.SetStateAction<number>>;
  onChordCountUpdate?: (count: number) => void;
  liveRhythm?: LiveRhythmData;
  rhythmParams?: {
    a: number;
    b: number;
    c?: number;
    mode: SyncMode;
    metricGrouping: MetricGrouping;
    isReversed?: boolean;
    rotationOffset?: number;
  };
  bpm: number;
}

export const HarmonyStudioView: React.FC<HarmonyStudioViewProps> = ({
  isPlaying,
  setIsPlaying,
  selectedChordIndex,
  setSelectedChordIndex,
  onChordCountUpdate,
  liveRhythm,
  rhythmParams,
  bpm,
}) => {
  const [tonicRoot, setTonicRoot] = useState<number>(0); // C
  const [structure, setStructure] = useState<ChordStructureType>('S7');
  const [totalChordsCount, setTotalChordsCount] = useState<number>(8);
  const [harmonySystem, setHarmonySystem] = useState<HarmonySystemType>('diatonic');

  const [invariantQuality, setInvariantQuality] = useState<string>('maj7');
  const [voiceLeadingMode, setVoiceLeadingMode] = useState<VoiceLeadingMode>('greedy');

  // Active cyclic formula moves (Initial: Kozlov's 28-Chord Cyclic Matrix)
  const [selectedPresetId, setSelectedPresetId] = useState<string>('kozlov_28');
  const [formula, setFormula] = useState<CycleMove[]>([
    CYCLE_MOVES.find((m) => m.id === 'c3_down')!,
    CYCLE_MOVES.find((m) => m.id === 'c3_down')!,
    CYCLE_MOVES.find((m) => m.id === 'c5_up')!,
    CYCLE_MOVES.find((m) => m.id === 'c3_down')!,
  ]);

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = getHarmonyPresetById(presetId);
    if (preset) {
      const moves = getCycleMovesForPreset(preset);
      setFormula(moves);
      setStructure(preset.chordStructure);
      if (preset.harmonySystem) {
        setHarmonySystem(preset.harmonySystem);
      } else {
        setHarmonySystem('diatonic');
      }
      if (preset.invariantStructureQuality) {
        setInvariantQuality(preset.invariantStructureQuality);
      }
      if (preset.totalChords) {
        setTotalChordsCount(preset.totalChords);
        if (onChordCountUpdate) onChordCountUpdate(preset.totalChords);
      }
      if (preset.defaultScaleId) {
        const targetScale = PARENT_SCALES.find((s) => s.id === preset.defaultScaleId);
        if (targetScale) {
          setActiveRails((prev) => {
            if (prev.some((s) => s.id === targetScale.id)) return prev;
            return [targetScale, ...prev];
          });
        }
      }
    }
  };

  // Active parallel rails (display rails for comparative view)
  const [activeRails, setActiveRails] = useState<ScaleDefinition[]>([
    PARENT_SCALES.find((s) => s.id === 'ionian')!,
    PARENT_SCALES.find((s) => s.id === 'phrygian')!,
  ]);

  // Generate rail chords map
  const railChordsMap = useMemo(() => {
    const map: Record<string, ChordItem[]> = {};
    for (const scale of PARENT_SCALES) {
      const chords = generateRailChords(
        tonicRoot,
        scale,
        formula,
        structure,
        totalChordsCount,
        harmonySystem,
        invariantQuality,
        voiceLeadingMode
      );
      map[scale.id] = chords;
    }
    return map;
  }, [tonicRoot, formula, structure, totalChordsCount, harmonySystem, invariantQuality, voiceLeadingMode]);

  // Master progression
  const [masterChords, setMasterChords] = useState<ChordItem[]>([]);
  const [selectedChordId, setSelectedChordId] = useState<string | null>(null);

  // Update master chords when core formula or length changes (WITHOUT resetting on activeRails change!)
  useEffect(() => {
    const baseChords = railChordsMap['ionian'] || Object.values(railChordsMap)[0] || [];

    setMasterChords((prev) => {
      // If empty or length changed, initialize from base chords
      if (prev.length === 0 || prev.length !== baseChords.length) {
        return baseChords;
      }

      // Preserve modal interchange and custom density assignments across each step!
      const updated = prev.map((oldChord, idx) => {
        const sourceScaleId = oldChord.sourceScaleId || 'ionian';
        const sourceRail = railChordsMap[sourceScaleId] || baseChords;
        const freshChord = sourceRail[idx] || baseChords[idx];
        if (oldChord.isCustomDensity && oldChord.structure) {
          const rebuilt = rebuildChordWithStructure(
            freshChord,
            oldChord.structure,
            tonicRoot,
            harmonySystem,
            invariantQuality
          );
          return {
            ...rebuilt,
            stepIndex: idx,
            isCustomBorrowed: oldChord.isCustomBorrowed,
            isCustomDensity: true,
          };
        }
        return {
          ...freshChord,
          stepIndex: idx,
          isCustomBorrowed: oldChord.isCustomBorrowed,
        };
      });

      return applySchillingerVoiceLeading(updated, voiceLeadingMode);
    });

    if (onChordCountUpdate) {
      onChordCountUpdate(baseChords.length);
    }
  }, [railChordsMap, voiceLeadingMode, tonicRoot, harmonySystem, invariantQuality]);

  const playTimerRef = useRef<number | null>(null);
  const currentChord = masterChords[selectedChordIndex] || masterChords[0];

  const handleSelectChord = (chord: ChordItem, stepIdx: number) => {
    setSelectedChordIndex(stepIdx);
    setSelectedChordId(chord.id);
    if (chord.voicedMidiNotes && chord.voicedMidiNotes.length > 0) {
      audioService.playVoicedChord(chord.voicedMidiNotes, 0.8, 'piano');
    }
  };

  const handleSwapChord = (stepIdx: number, newChord: ChordItem) => {
    const currentChordAtStep = masterChords[stepIdx];
    let chordToInsert = newChord;
    if (currentChordAtStep?.isCustomDensity && currentChordAtStep.structure) {
      chordToInsert = rebuildChordWithStructure(
        chordToInsert,
        currentChordAtStep.structure,
        tonicRoot,
        harmonySystem,
        invariantQuality
      );
    }
    const updated = [...masterChords];
    updated[stepIdx] = {
      ...chordToInsert,
      stepIndex: stepIdx,
      isCustomBorrowed: true,
    };
    const reVoiced = applySchillingerVoiceLeading(updated, voiceLeadingMode);
    setMasterChords(reVoiced);
    setSelectedChordIndex(stepIdx);
    setSelectedChordId(chordToInsert.id);
    audioService.playVoicedChord(reVoiced[stepIdx].voicedMidiNotes, 0.8, 'piano');
  };

  const handleApplyDensity = (newStructure: ChordStructureType, startIndex: number, endIndex: number) => {
    const updated = [...masterChords];
    for (let i = startIndex; i <= endIndex && i < updated.length; i++) {
      if (updated[i]) {
        updated[i] = rebuildChordWithStructure(
          updated[i],
          newStructure,
          tonicRoot,
          harmonySystem,
          invariantQuality
        );
      }
    }
    const reVoiced = applySchillingerVoiceLeading(updated, voiceLeadingMode);
    setMasterChords(reVoiced);
    if (reVoiced[startIndex]?.voicedMidiNotes) {
      audioService.playVoicedChord(reVoiced[startIndex].voicedMidiNotes, 0.8, 'piano');
    }
  };

  const handleApplyChunkMode = (scale: ScaleDefinition, startIndex: number, endIndex: number) => {
    const sourceRail = railChordsMap[scale.id];
    if (!sourceRail) return;

    const updated = [...masterChords];
    for (let i = startIndex; i <= endIndex && i < updated.length; i++) {
      if (sourceRail[i]) {
        updated[i] = {
          ...sourceRail[i],
          stepIndex: i,
          isCustomBorrowed: scale.id !== 'ionian',
        };
      }
    }
    const reVoiced = applySchillingerVoiceLeading(updated, voiceLeadingMode);
    setMasterChords(reVoiced);
    if (reVoiced[startIndex]?.voicedMidiNotes) {
      audioService.playVoicedChord(reVoiced[startIndex].voicedMidiNotes, 0.8, 'piano');
    }
  };

  // Groove Realization State - Defaults to inheriting from the live Rhythm Studio
  const [selectedGrooveId, setSelectedGrooveId] = useState<string>('live_rhythm');
  const [grooveStyle, setGrooveStyle] = useState<GrooveStyle>('comping');
  const [includePercussion, setIncludePercussion] = useState<boolean>(true);

  // Dynamic live groove preset from active Rhythm Studio parameters
  const liveGroovePreset = useMemo<HarmonyGroovePattern | null>(() => {
    if (liveRhythm) {
      return createLiveRhythmGroove(
        liveRhythm.durations,
        liveRhythm.accentIndices,
        liveRhythm.totalLength,
        liveRhythm.name,
        liveRhythm.description
      );
    }
    if (rhythmParams) {
      return createGrooveFromRhythmState(
        rhythmParams.a,
        rhythmParams.b,
        rhythmParams.mode,
        rhythmParams.metricGrouping,
        rhythmParams.c,
        rhythmParams.isReversed,
        rhythmParams.rotationOffset
      );
    }
    return null;
  }, [liveRhythm, rhythmParams]);

  // Combined groove presets: Live Rhythm + Curated Grooves + All Rhythm Presets
  const groovePresets = useMemo(() => {
    const list: HarmonyGroovePattern[] = [];
    if (liveGroovePreset) {
      list.push(liveGroovePreset);
    }
    for (const p of ALL_HARMONY_GROOVE_PRESETS) {
      if (p.id !== 'sustained' && !list.some((existing) => existing.id === p.id || existing.name === p.name)) {
        list.push(p);
      }
    }
    return list;
  }, [liveGroovePreset]);

  const activeGroove = useMemo(() => {
    return groovePresets.find((g) => g.id === selectedGrooveId) || groovePresets[0] || HARMONY_GROOVE_PRESETS[1];
  }, [groovePresets, selectedGrooveId]);

  // Synchronize dynamic arrangement into Web Audio lookahead scheduler
  useEffect(() => {
    if (!masterChords || masterChords.length === 0) return;

    // Straight mode mutes rhythmic subdivision and percussion
    const effectivePercussion = grooveStyle === 'sustained' ? false : includePercussion;

    const arrangement = generateProgressionArrangement(
      masterChords,
      activeGroove,
      grooveStyle,
      effectivePercussion
    );

    const stepMap = new Map<number, {
      chordIndex: number;
      notes: Array<{
        pitches: number[];
        durationSec: number;
        velocity: number;
        instrument?: 'epiano' | 'piano' | 'guitar';
      }>;
      percussion?: {
        channel: 'a' | 'b' | 'c' | 'resultant' | 'accent';
        isAccented: boolean;
      };
    }>();

    const secondsPerUnit = 60 / bpm / 4;

    for (let u = 0; u < arrangement.totalTimelineUnits; u++) {
      const stepInfo = arrangement.chordSteps.find((s) => u >= s.startUnit && u < s.endUnit);
      const chordIndex = stepInfo ? stepInfo.stepIndex : 0;

      const notesAtU: Array<{
        pitches: number[];
        durationSec: number;
        velocity: number;
        instrument?: 'epiano' | 'piano' | 'guitar';
      }> = [];

      // Add chord notes (Track 0) and bass notes (Track 1)
      for (let t = 0; t <= 1 && t < arrangement.tracks.length; t++) {
        const trackNotes = arrangement.tracks[t].notes.filter((n) => n.tick === u);
        for (const n of trackNotes) {
          notesAtU.push({
            pitches: n.pitches,
            durationSec: Math.max(0.05, n.durationUnits * secondsPerUnit * (n.gateRatio ?? 0.85)),
            velocity: n.velocity ?? 85,
            instrument: 'piano',
          });
        }
      }

      let percInfo: { channel: 'a' | 'b' | 'c' | 'resultant' | 'accent'; isAccented: boolean } | undefined;
      if (effectivePercussion && arrangement.tracks[2]) {
        const percNote = arrangement.tracks[2].notes.find((n) => n.tick === u);
        if (percNote) {
          const isAcc = percNote.pitches.includes(37) || percNote.pitches.includes(76);
          percInfo = {
            channel: percNote.pitches.includes(37) ? 'accent' : isAcc ? 'a' : 'b',
            isAccented: isAcc,
          };
        }
      }

      if (notesAtU.length > 0 || percInfo) {
        stepMap.set(u, {
          chordIndex,
          notes: notesAtU,
          percussion: percInfo,
        });
      }
    }

    audioService.loadHarmonySequence(arrangement.totalTimelineUnits, stepMap);
  }, [masterChords, activeGroove, grooveStyle, includePercussion, bpm]);

  // Tempo sync
  useEffect(() => {
    audioService.setBpm(bpm);
  }, [bpm]);

  // Playhead step callback
  useEffect(() => {
    audioService.setHarmonyPlayheadCallback((chordIdx) => {
      setSelectedChordIndex(chordIdx);
    });

    return () => {
      audioService.setHarmonyPlayheadCallback(null);
    };
  }, [setSelectedChordIndex]);

  // Master play / pause handling
  useEffect(() => {
    if (isPlaying) {
      audioService.setBpm(bpm);
      audioService.playHarmony();
    } else {
      audioService.pauseHarmony();
    }
  }, [isPlaying, bpm]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Top Setup: Formula & Key */}
      <FormulaBar
        tonicRoot={tonicRoot}
        setTonicRoot={setTonicRoot}
        formula={formula}
        setFormula={setFormula}
        structure={structure}
        setStructure={setStructure}
        totalChordsCount={totalChordsCount}
        setTotalChordsCount={(count) => {
          setTotalChordsCount(count);
          if (onChordCountUpdate) onChordCountUpdate(count);
        }}
        selectedPresetId={selectedPresetId}
        onSelectPreset={handleSelectPreset}
        harmonySystem={harmonySystem}
        setHarmonySystem={setHarmonySystem}
        invariantQuality={invariantQuality}
        setInvariantQuality={setInvariantQuality}
        voiceLeadingMode={voiceLeadingMode}
        setVoiceLeadingMode={setVoiceLeadingMode}
      />

      {/* 2. Rhythmic Harmony & Groove Coupling Control Strip */}
      <GrooveControlStrip
        groovePresets={groovePresets}
        selectedGrooveId={selectedGrooveId}
        onSelectGroove={setSelectedGrooveId}
        grooveStyle={grooveStyle}
        setGrooveStyle={setGrooveStyle}
        includePercussion={includePercussion}
        setIncludePercussion={setIncludePercussion}
        activeGroove={activeGroove}
        liveRhythmName={liveRhythm?.name || 'Live Rhythm Studio'}
      />

      {/* 3. MASTER PROGRESSION LANE */}
      <MasterProgressionLane
        masterChords={masterChords}
        activeChordIndex={selectedChordIndex}
        onSelectChord={handleSelectChord}
        availableScales={activeRails}
        onApplyChunkMode={handleApplyChunkMode}
        railChordsMap={railChordsMap}
        onSwapChord={handleSwapChord}
        onApplyDensity={handleApplyDensity}
      />

      {/* 4. PARALLEL MODE RAILS */}
      <ParallelModeRails
        activeRails={activeRails}
        setActiveRails={setActiveRails}
        railChordsMap={railChordsMap}
        masterChords={masterChords}
        activeChordIndex={selectedChordIndex}
        isPlaying={isPlaying}
        selectedChordId={selectedChordId}
        onSelectChord={handleSelectChord}
        onSwapIntoMaster={(chord, stepIdx) => handleSwapChord(stepIdx, chord)}
      />

      {/* 5. Visualizers: Piano & Guitar Fretboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InteractivePiano
          activeMidiNotes={currentChord?.voicedMidiNotes || []}
          onPlayNote={(midi) => audioService.playVoicedChord([midi], 0.6, 'piano')}
        />

        <InteractiveFretboard
          activePitchClasses={currentChord?.pitchClasses || []}
          rootPitchClass={currentChord?.rootPitchClass ?? tonicRoot}
        />
      </div>

      {/* 6. Export Panel with Multi-format & Multi-track SMF 1 support */}
      <HarmonyExportPanel
        chords={masterChords}
        bpm={bpm}
        tonicRoot={tonicRoot}
        activeGroove={activeGroove}
        grooveStyle={grooveStyle}
        includePercussion={grooveStyle === 'sustained' ? false : includePercussion}
      />
    </div>
  );
};


