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
import { ParallelModeRails } from './ParallelModeRails';
import { MasterProgressionLane } from './MasterProgressionLane';
import { InteractivePiano } from './InteractivePiano';
import { InteractiveFretboard } from './InteractiveFretboard';
import { HarmonyExportPanel } from './HarmonyExportPanel';
import { audioService } from '../../core/audio/synth';

export const HarmonyStudioView: React.FC = () => {
  const [tonicRoot, setTonicRoot] = useState<number>(0); // C
  const [structure, setStructure] = useState<ChordStructureType>('S7');
  const [totalChordsCount, setTotalChordsCount] = useState<number>(8);
  const [bpm, setBpm] = useState<number>(90);
  const [masterVolume, setMasterVolume] = useState<number>(0.85);

  // Active cyclic formula moves
  const [formula, setFormula] = useState<CycleMove[]>([
    CYCLE_MOVES.find((m) => m.id === 'c3_down')!,
    CYCLE_MOVES.find((m) => m.id === 'c3_down')!,
    CYCLE_MOVES.find((m) => m.id === 'c5_up')!,
    CYCLE_MOVES.find((m) => m.id === 'c3_down')!,
  ]);

  // Active parallel rails (Ionian + Phrygian by default, matching screenshot 1!)
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

  // Master progression (starts as clone of first active rail)
  const [masterChords, setMasterChords] = useState<ChordItem[]>([]);

  // Update master chords when parameters change
  useEffect(() => {
    const baseRailId = activeRails[0]?.id || 'ionian';
    const baseChords = railChordsMap[baseRailId] || [];
    setMasterChords(baseChords);
  }, [railChordsMap, activeRails]);

  // Selected chord for visualizers & playback
  const [selectedChordIndex, setSelectedChordIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
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
    // Re-apply voice leading so the swap connects smoothly
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
      const intervalMs = (60 / bpm) * 1000 * 2; // 2 beats per chord
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

      // Play current immediately on start
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

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleReset = () => {
    setIsPlaying(false);
    setSelectedChordIndex(0);
    if (masterChords[0]?.voicedMidiNotes) {
      audioService.playVoicedChord(masterChords[0].voicedMidiNotes, 0.8);
    }
  };

  const handleStepForward = () => {
    const next = (selectedChordIndex + 1) % masterChords.length;
    setSelectedChordIndex(next);
    if (masterChords[next]?.voicedMidiNotes) {
      audioService.playVoicedChord(masterChords[next].voicedMidiNotes, 0.8);
    }
  };

  const handleStepBack = () => {
    const prev = (selectedChordIndex - 1 + masterChords.length) % masterChords.length;
    setSelectedChordIndex(prev);
    if (masterChords[prev]?.voicedMidiNotes) {
      audioService.playVoicedChord(masterChords[prev].voicedMidiNotes, 0.8);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Configuration & Formula Bar */}
      <FormulaBar
        tonicRoot={tonicRoot}
        setTonicRoot={setTonicRoot}
        formula={formula}
        setFormula={setFormula}
        structure={structure}
        setStructure={setStructure}
        totalChordsCount={totalChordsCount}
        setTotalChordsCount={setTotalChordsCount}
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onReset={handleReset}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        bpm={bpm}
        setBpm={setBpm}
        masterVolume={masterVolume}
        setMasterVolume={(vol) => {
          setMasterVolume(vol);
          audioService.setMasterVolume(vol);
        }}
      />

      {/* Parallel Mode Rails */}
      <ParallelModeRails
        activeRails={activeRails}
        setActiveRails={setActiveRails}
        railChordsMap={railChordsMap}
        activeChordIndex={selectedChordIndex}
        onSelectChord={handleSelectChord}
        onSwapIntoMaster={(chord, stepIdx) => handleSwapChord(stepIdx, chord)}
      />

      {/* Master Progression Lane */}
      <MasterProgressionLane
        masterChords={masterChords}
        activeChordIndex={selectedChordIndex}
        onSelectChord={handleSelectChord}
        availableScales={activeRails}
        onApplyChunkMode={handleApplyChunkMode}
        railChordsMap={railChordsMap}
        onSwapChord={handleSwapChord}
      />

      {/* Visualizers: Piano & Guitar Fretboard */}
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

      {/* Export Panel */}
      <HarmonyExportPanel chords={masterChords} bpm={bpm} />
    </div>
  );
};
