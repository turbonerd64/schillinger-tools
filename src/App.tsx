import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/common/Header';
import { GeneratorControls } from './components/rhythm/GeneratorControls';
import { MultiLaneVisualizer } from './components/rhythm/MultiLaneVisualizer';
import { TransportMixer } from './components/rhythm/TransportMixer';
import { VariationsPanel } from './components/rhythm/VariationsPanel';
import { DataExportPanel } from './components/rhythm/DataExportPanel';
import { HarmonyCyclesPreview } from './components/future/HarmonyCyclesPreview';
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
import { audioService } from './core/audio/synth';

export function App() {
  const [activeTab, setActiveTab] = useState<'rhythm' | 'harmony' | 'theory'>('rhythm');

  // Generator parameters
  const [a, setA] = useState<number>(4);
  const [b, setB] = useState<number>(3);
  const [c, setC] = useState<number>(2);
  const [mode, setMode] = useState<SyncMode>('binary');
  const [metricGrouping, setMetricGrouping] = useState<MetricGrouping>('ab');

  // Variations
  const [variations, setVariations] = useState<RhythmVariationState>({
    isReversed: false,
    rotationOffset: 0,
  });

  // Transport & Audio State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [bpm, setBpm] = useState<number>(120);
  const [activeTick, setActiveTick] = useState<number>(0);
  const [playheadProgress, setPlayheadProgress] = useState<number>(0);

  // Compute master Schillinger resultant
  const resultant = useMemo(() => {
    return calculateSchillingerRhythm(a, b, mode, metricGrouping, c);
  }, [a, b, mode, metricGrouping, c]);

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

    // Lane B attacks
    resultant.lanes.find((l) => l.id === 'b')?.attackTicks.forEach((tick) => {
      events.push({ tick, channel: 'b', isAccented: tick === 0 });
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

  // Update audio engine on changes
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

  const handlePlay = () => {
    audioService.play();
    setIsPlaying(true);
  };

  const handlePause = () => {
    audioService.pause();
    setIsPlaying(false);
  };

  const handleStop = () => {
    audioService.stop();
    setIsPlaying(false);
    setActiveTick(0);
    setPlayheadProgress(0);
  };

  return (
    <div className="min-h-screen bg-schillinger-bg text-slate-100 flex flex-col font-sans selection:bg-schillinger-accentA/20 selection:text-schillinger-accentA">
      {/* Universal Suite Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'rhythm' && (
          <div className="space-y-6">
            {/* Top Row: Visualizer & Transport */}
            <MultiLaneVisualizer
              resultant={resultant}
              playheadProgress={playheadProgress}
              activeTick={activeTick}
            />

            <TransportMixer
              isPlaying={isPlaying}
              onPlay={handlePlay}
              onPause={handlePause}
              onStop={handleStop}
              bpm={bpm}
              setBpm={setBpm}
              is3Part={mode === 'trinomial'}
            />

            {/* Bottom Grid: Controls, Variations, Export */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 space-y-6">
                <GeneratorControls
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
                />
              </div>

              <div className="lg:col-span-7 space-y-6">
                <VariationsPanel
                  resultant={resultant}
                  variations={variations}
                  setVariations={setVariations}
                  displayedDurations={displayedDurations}
                />

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

        {activeTab === 'harmony' && <HarmonyCyclesPreview />}

        {activeTab === 'theory' && <TheoryPrimer />}
      </main>

      {/* Footer */}
      <footer className="border-t border-schillinger-border/60 py-4 mt-8 bg-schillinger-panel/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-schillinger-textMuted font-mono gap-2">
          <div>
            Schillinger Rhythm Engine &bull; Based on <em>Book I: Theory of Rhythm</em>
          </div>
          <div>
            Modular Agential Suite &bull; Ready for Book II & Book V Integration
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
