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
import { FormulaBar } from './FormulaBar';
import { MasterProgressionLane } from './MasterProgressionLane';
import { ParallelModeRails } from './ParallelModeRails';
import { InteractivePiano } from './InteractivePiano';
import { InteractiveFretboard } from './InteractiveFretboard';
import { HarmonyExportPanel } from './HarmonyExportPanel';
import { audioService } from '../../core/audio/synth';

interface HarmonyStudioViewProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  selectedChordIndex: number;
  setSelectedChordIndex: React.Dispatch<React.SetStateAction<number>>;
  onChordCountUpdate?: (count: number) => void;
}

export const HarmonyStudioView: React.FC<HarmonyStudioViewProps> = ({
  isPlaying,
  setIsPlaying,
  selectedChordIndex,
  setSelectedChordIndex,
  onChordCountUpdate,
}) => {
  const [tonicRoot, setTonicRoot] = useState<number>(0); // C
  const [structure, setStructure] = useState<ChordStructureType>('S7');
  const [totalChordsCount, setTotalChordsCount] = useState<number>(8);
  const [bpm, setBpm] = useState<number>(100);
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

  // Progression playback loop
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = (60 / bpm) * 1000 * 2;
      playTimerRef.current = window.setInterval(() => {
        setSelectedChordIndex((prev) => {
          const next = (prev + 1) % masterChords.length;
          const nextChord = masterChords[next];
          if (nextChord && nextChord.voicedMidiNotes) {
            audioService.playVoicedChord(nextChord.voicedMidiNotes, (intervalMs / 1000) * 0.9, 'piano');
          }
          return next;
        });
      }, intervalMs);

      if (currentChord && currentChord.voicedMidiNotes) {
        audioService.playVoicedChord(currentChord.voicedMidiNotes, (intervalMs / 1000) * 0.9, 'piano');
      }
    } else {
      if (playTimerRef.current !== null) {
        window.clearInterval(playTimerRef.current);
        playTimerRef.current = null;
      }
    }

    return () => {
      if (playTimerRef.current !== null) {
        window.clearInterval(playTimerRef.current);
      }
    };
  }, [isPlaying, bpm, masterChords]);

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
        bpm={bpm}
        setBpm={setBpm}
        selectedPresetId={selectedPresetId}
        onSelectPreset={handleSelectPreset}
        harmonySystem={harmonySystem}
        setHarmonySystem={setHarmonySystem}
        invariantQuality={invariantQuality}
        setInvariantQuality={setInvariantQuality}
        voiceLeadingMode={voiceLeadingMode}
        setVoiceLeadingMode={setVoiceLeadingMode}
      />

      {/* 2. MASTER PROGRESSION LANE FIRST (Above Parallel Rails) */}
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

      {/* 3. PARALLEL MODE RAILS (For comparative reference & chord borrowing) */}
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

      {/* 4. Visualizers: Piano & Guitar Fretboard */}
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

      {/* 5. Export Panel with Multi-format support */}
      <HarmonyExportPanel chords={masterChords} bpm={bpm} tonicRoot={tonicRoot} />
    </div>
  );
};
