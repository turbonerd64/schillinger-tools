import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/common/Header';
import { UnifiedRhythmControls } from './components/rhythm/UnifiedRhythmControls';
import { MultiLaneVisualizer } from './components/rhythm/MultiLaneVisualizer';
import { VolumeMixer } from './components/rhythm/VolumeMixer';
import { DataExportPanel } from './components/rhythm/DataExportPanel';
import { HarmonyStudioView } from './components/harmony/HarmonyStudioView';
import { TheoryPrimer } from './components/theory/TheoryPrimer';

import {
  calculateSchillingerRhythm,
  applyRhythmVariations,
} from './core/rhythm/engine';
import {
  SyncMode,
  MetricGrouping,
  RhythmVariationState,
} from './core/rhythm/types';
import { getPresetById, calculatePresetResultant } from './core/rhythm/presets';
import { audioService } from './core/audio/synth';

export function App() {
  const [activeTab, setActiveTab] = useState<'rhythm' | 'harmony' | 'theory'>('rhythm');

  // Shared Master Volume
  const [masterVolume, setMasterVolume] = useState<number>(0.85);

  // Generator parameters
  const [a, setA] = useState<number>(4);
  const [b, setB] = useState<number>(3);
  const [c, setC] = useState<number>(2);
  const [mode, setMode] = useState<SyncMode>('binary');
  const [metricGrouping, setMetricGrouping] = useState<MetricGrouping>('ab');

  // Preset Selection State (Default: Polyrhythmic Matrix 4 ÷ 3)
  const [selectedPresetId, setSelectedPresetId] = useState<string>('matrix_4_3');

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = getPresetById(presetId);
    if (preset && preset.generators) {
      setA(preset.generators.a);
      setB(preset.generators.b);
      setMode(preset.generators.mode);
      if (preset.generators.c) {
        setC(preset.generators.c);
      }
    }
  };

  // Variations
  const [variations, setVariations] = useState<RhythmVariationState>({
    isReversed: false,
    rotationOffset: 0,
  });

  // Rhythm Transport State
  const [isPlayingRhythm, setIsPlayingRhythm] = useState<boolean>(false);
  const [bpm, setBpm] = useState<number>(100);
  const [activeTick, setActiveTick] = useState<number>(0);
  const [playheadProgress, setPlayheadProgress] = useState<number>(0);

  // Stop / pause audio when changing tabs
  useEffect(() => {
    if (activeTab !== 'rhythm' && isPlayingRhythm) {
      audioService.pause();
      setIsPlayingRhythm(false);
    }
    if (activeTab !== 'harmony' && isPlayingHarmony) {
      setIsPlayingHarmony(false);
    }
  }, [activeTab]);

  // Harmony Transport State
  const [isPlayingHarmony, setIsPlayingHarmony] = useState<boolean>(false);
  const [harmonyIndex, setHarmonyIndex] = useState<number>(0);
  const [harmonyCount, setHarmonyCount] = useState<number>(8);

  // Compute master Schillinger resultant (standard or custom genre preset)
  const activePreset = useMemo(() => getPresetById(selectedPresetId), [selectedPresetId]);

  const resultant = useMemo(() => {
    if (activePreset && activePreset.isCustomDuration) {
      return calculatePresetResultant(activePreset);
    }
    return calculateSchillingerRhythm(a, b, mode, metricGrouping, c);
  }, [a, b, mode, metricGrouping, c, activePreset]);

  // Compute variations on resultant
  const { durations: displayedDurations, accentIndices: displayedAccents } = useMemo(() => {
    return applyRhythmVariations(
      resultant.durations,
      resultant.accentIndices,
      variations.isReversed,
      variations.rotationOffset
    );
  }, [resultant, variations]);

  // Load timeline events into Web Audio scheduler
  const syncAudioTimeline = useCallback(() => {
    const events: Array<{ tick: number; channel: 'a' | 'b' | 'c' | 'resultant'; isAccented: boolean }> = [];

    // Lane A attacks
    resultant.lanes.find((l) => l.id === 'a')?.attackTicks.forEach((tick) => {
      events.push({ tick, channel: 'a', isAccented: tick === 0 });
    });

    // Lane B attacks (including fractioned b_1, b_2, etc.)
    resultant.lanes.filter((l) => l.id.startsWith('b')).forEach((lane) => {
      lane.attackTicks.forEach((tick) => {
        events.push({ tick, channel: 'b', isAccented: tick === 0 });
      });
    });

    // Lane C attacks if trinomial
    if (mode === 'trinomial') {
      resultant.lanes.find((l) => l.id === 'c')?.attackTicks.forEach((tick) => {
        events.push({ tick, channel: 'c', isAccented: tick === 0 });
      });
    }

    // Resultant attacks
    let currentTick = 0;
    const accentSet = new Set(displayedAccents);
    displayedDurations.forEach((dur, idx) => {
      events.push({
        tick: currentTick,
        channel: 'resultant',
        isAccented: accentSet.has(idx),
      });
      currentTick += dur;
    });

    audioService.loadSequence(resultant.totalLength, events);
  }, [resultant, mode, displayedDurations, displayedAccents]);

  useEffect(() => {
    syncAudioTimeline();
  }, [syncAudioTimeline]);

  // Register playhead callbacks
  useEffect(() => {
    audioService.setPlayheadCallback((tick, progress) => {
      setActiveTick(tick);
      setPlayheadProgress(progress);
    });

    return () => {
      audioService.setPlayheadCallback(null);
    };
  }, []);

  const handlePlayRhythm = () => {
    audioService.play();
    setIsPlayingRhythm(true);
  };

  const handlePauseRhythm = () => {
    audioService.pause();
    setIsPlayingRhythm(false);
  };

  const handleStopRhythm = () => {
    audioService.stop();
    setIsPlayingRhythm(false);
    setActiveTick(0);
    setPlayheadProgress(0);
  };

  const handlePlayHarmony = () => setIsPlayingHarmony(true);
  const handlePauseHarmony = () => setIsPlayingHarmony(false);
  const handleResetHarmony = () => {
    setIsPlayingHarmony(false);
    setHarmonyIndex(0);
  };
  const handleStepBackHarmony = () => {
    setHarmonyIndex((prev) => (prev - 1 + harmonyCount) % harmonyCount);
  };
  const handleStepForwardHarmony = () => {
    setHarmonyIndex((prev) => (prev + 1) % harmonyCount);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 flex flex-col font-sans selection:bg-[#fdf0ec] selection:text-[#c84b31]">
      {/* Sticky Universal Taskbar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        masterVolume={masterVolume}
        setMasterVolume={(vol) => {
          setMasterVolume(vol);
          audioService.setMasterVolume(vol);
        }}
        isPlayingRhythm={isPlayingRhythm}
        onPlayRhythm={handlePlayRhythm}
        onPauseRhythm={handlePauseRhythm}
        onStopRhythm={handleStopRhythm}
        rhythmActiveTick={activeTick}
        rhythmTotalLength={resultant.totalLength}
        isPlayingHarmony={isPlayingHarmony}
        onPlayHarmony={handlePlayHarmony}
        onPauseHarmony={handlePauseHarmony}
        onResetHarmony={handleResetHarmony}
        onStepBackHarmony={handleStepBackHarmony}
        onStepForwardHarmony={handleStepForwardHarmony}
        harmonyCurrentIndex={harmonyIndex}
        harmonyTotalChords={harmonyCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'rhythm' && (
          <div className="space-y-6">
            {/* 1. Combined Wide Compact Control Strip (Parameters + Variations) */}
            <UnifiedRhythmControls
              a={a}
              b={b}
              c={c}
              setA={setA}
              setB={setB}
              setC={setC}
              mode={mode}
              setMode={setMode}
              metricGrouping={metricGrouping}
              setMetricGrouping={setMetricGrouping}
              totalLength={resultant.totalLength}
              bpm={bpm}
              setBpm={setBpm}
              variations={variations}
              setVariations={setVariations}
              selectedPresetId={selectedPresetId}
              onSelectPreset={handleSelectPreset}
            />

            {/* 2. Centered Rhythm Architecture & Resultant Wave Graph */}
            <MultiLaneVisualizer
              resultant={resultant}
              playheadProgress={playheadProgress}
              activeTick={activeTick}
            />

            {/* 3. Bottom Row: Compact Volumes & Data/MIDI Export */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5">
                <VolumeMixer is3Part={mode === 'trinomial'} />
              </div>

              <div className="lg:col-span-7">
                <DataExportPanel
                  resultant={resultant}
                  variations={variations}
                  displayedDurations={displayedDurations}
                  displayedAccents={displayedAccents}
                  bpm={bpm}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'harmony' && (
          <HarmonyStudioView
            isPlaying={isPlayingHarmony}
            setIsPlaying={setIsPlayingHarmony}
            selectedChordIndex={harmonyIndex}
            setSelectedChordIndex={setHarmonyIndex}
            onChordCountUpdate={(count) => setHarmonyCount(count)}
          />
        )}

        {activeTab === 'theory' && <TheoryPrimer />}
      </main>

      {/* Clean Footer */}
      <footer className="border-t-2 border-slate-200 py-5 mt-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-slate-500 font-mono gap-2">
          <div className="font-bold">
            Schillinger Tools Studio &bull; Rhythm Resultants &amp; Symmetrical Harmony Cycles
          </div>
          <div>
            Built with Pure Discrete Math &bull; Modulo 12 Integer Notation
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
