import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  PARENT_SCALES,
  CYCLE_MOVES,
  CycleMove,
  ScaleDefinition,
  ChordStructureType,
  ChordItem,
  generateRailChords,
  applyGreedyVoiceLeading,
} from '../../core/harmony/engine';
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
  const [bpm, setBpm] = useState<number>(90);

  // Active cyclic formula moves
  const [formula, setFormula] = useState<CycleMove[]>([
    CYCLE_MOVES.find((m) => m.id === 'c3_down')!,
    CYCLE_MOVES.find((m) => m.id === 'c3_down')!,
    CYCLE_MOVES.find((m) => m.id === 'c5_up')!,
    CYCLE_MOVES.find((m) => m.id === 'c3_down')!,
  ]);

  // Active parallel rails
  const [activeRails, setActiveRails] = useState<ScaleDefinition[]>([
    PARENT_SCALES.find((s) => s.id === 'ionian')!,
    PARENT_SCALES.find((s) => s.id === 'phrygian')!,
  ]);

  // Generate rail chords map
  const railChordsMap = useMemo(() => {
    const map: Record<string, ChordItem[]> = {};
    for (const scale of PARENT_SCALES) {
      const raw = generateRailChords(tonicRoot, scale, formula, structure, totalChordsCount);
      map[scale.id] = applyGreedyVoiceLeading(raw);
    }
    return map;
  }, [tonicRoot, formula, structure, totalChordsCount]);

  // Master progression
  const [masterChords, setMasterChords] = useState<ChordItem[]>([]);

  // Update master chords when parameters change
  useEffect(() => {
    const baseRailId = activeRails[0]?.id || 'ionian';
    const baseChords = railChordsMap[baseRailId] || [];
    setMasterChords(baseChords);
    if (onChordCountUpdate) {
      onChordCountUpdate(baseChords.length);
    }
  }, [railChordsMap, activeRails]);

  const playTimerRef = useRef<number | null>(null);
  const currentChord = masterChords[selectedChordIndex] || masterChords[0];

  const handleSelectChord = (chord: ChordItem, stepIdx: number) => {
    setSelectedChordIndex(stepIdx);
    if (chord.voicedMidiNotes && chord.voicedMidiNotes.length > 0) {
      audioService.playVoicedChord(chord.voicedMidiNotes, 0.8);
    }
  };

  const handleSwapChord = (stepIdx: number, newChord: ChordItem) => {
    const updated = [...masterChords];
    updated[stepIdx] = {
      ...newChord,
      stepIndex: stepIdx,
      isCustomBorrowed: true,
    };
    const reVoiced = applyGreedyVoiceLeading(updated);
    setMasterChords(reVoiced);
    setSelectedChordIndex(stepIdx);
    audioService.playVoicedChord(reVoiced[stepIdx].voicedMidiNotes, 0.8);
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
          isCustomBorrowed: scale.id !== activeRails[0]?.id,
        };
      }
    }
    const reVoiced = applyGreedyVoiceLeading(updated);
    setMasterChords(reVoiced);
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
            audioService.playVoicedChord(nextChord.voicedMidiNotes, (intervalMs / 1000) * 0.9);
          }
          return next;
        });
      }, intervalMs);

      if (currentChord && currentChord.voicedMidiNotes) {
        audioService.playVoicedChord(currentChord.voicedMidiNotes, (intervalMs / 1000) * 0.9);
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
      />

      {/* 3. PARALLEL MODE RAILS (For comparative reference & chord borrowing) */}
      <ParallelModeRails
        activeRails={activeRails}
        setActiveRails={setActiveRails}
        railChordsMap={railChordsMap}
        activeChordIndex={selectedChordIndex}
        onSelectChord={handleSelectChord}
        onSwapIntoMaster={(chord, stepIdx) => handleSwapChord(stepIdx, chord)}
      />

      {/* 4. Visualizers: Piano & Guitar Fretboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InteractivePiano
          activeMidiNotes={currentChord?.voicedMidiNotes || []}
          onPlayNote={(midi) => audioService.playVoicedChord([midi], 0.6)}
        />

        <InteractiveFretboard
          activePitchClasses={currentChord?.pitchClasses || []}
          rootPitchClass={currentChord?.rootPitchClass ?? tonicRoot}
        />
      </div>

      {/* 5. Export Panel */}
      <HarmonyExportPanel chords={masterChords} bpm={bpm} />
    </div>
  );
};
