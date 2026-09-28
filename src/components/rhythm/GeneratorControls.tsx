import React, { useState } from 'react';
import { SyncMode, MetricGrouping } from '../../core/rhythm/types';
import { Sliders, Sparkles, Split, Compass, Gauge } from 'lucide-react';
import { audioService } from '../../core/audio/synth';

interface GeneratorControlsProps {
  a: number;
  b: number;
  c: number;
  setA: (val: number) => void;
  setB: (val: number) => void;
  setC: (val: number) => void;
  mode: SyncMode;
  setMode: (mode: SyncMode) => void;
  metricGrouping: MetricGrouping;
  setMetricGrouping: (grouping: MetricGrouping) => void;
  totalLength: number;
  bpm: number;
  setBpm: (bpm: number) => void;
}

const PRESETS = [
  { label: '3 ÷ 2', a: 3, b: 2, desc: 'Classic Hemiola' },
  { label: '4 ÷ 3', a: 4, b: 3, desc: 'Polyrhythmic standard' },
  { label: '5 ÷ 2', a: 5, b: 2, desc: 'Balkan / Quintuple' },
  { label: '5 ÷ 3', a: 5, b: 3, desc: 'Harmonic contrast' },
  { label: '5 ÷ 4', a: 5, b: 4, desc: 'Metric tension' },
  { label: '7 ÷ 4', a: 7, b: 4, desc: 'Asymmetric 28-pulse' },
  { label: '8 ÷ 5', a: 8, b: 5, desc: 'Fibonacci ratio' },
];

export const GeneratorControls: React.FC<GeneratorControlsProps> = ({
  a,
  b,
  c,
  setA,
  setB,
  setC,
  mode,
  setMode,
  metricGrouping,
  setMetricGrouping,
  totalLength,
  bpm,
  setBpm,
}) => {
  const [tapTimes, setTapTimes] = useState<number[]>([]);

  const handleTapTempo = () => {
    const now = Date.now();
    const recentTaps = [...tapTimes.filter((t) => now - t < 3000), now];
    setTapTimes(recentTaps);

    if (recentTaps.length >= 2) {
      const intervals = [];
      for (let i = 1; i < recentTaps.length; i++) {
        intervals.push(recentTaps[i] - recentTaps[i - 1]);
      }
      const avgInterval = intervals.reduce((x, y) => x + y, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      if (calculatedBpm >= 40 && calculatedBpm <= 260) {
        setBpm(calculatedBpm);
        audioService.setBpm(calculatedBpm);
      }
    }
  };

  const handleAChange = (newA: number) => {
    const validA = Math.max(2, Math.min(16, newA));
    setA(validA);
    if (validA <= b && mode !== 'trinomial') {
      setB(validA - 1);
    }
  };

  const handleBChange = (newB: number) => {
    const validB = Math.max(1, Math.min(a - 1, newB));
    setB(validB);
  };

  const handleCChange = (newC: number) => {
    setC(Math.max(1, Math.min(16, newC)));
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-900 p-5 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#c84b31]" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Generator Parameters
          </h2>
        </div>
        <div className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-300">
          Cycle: <span className="text-[#c84b31]">{totalLength}</span> units
        </div>
      </div>

      {/* Preset Pills */}
      <div>
        <label className="text-xs font-bold text-slate-600 mb-2 block flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#c84b31]" />
          <span>Quick Rhythmic Presets</span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((preset) => {
            const isSelected = a === preset.a && b === preset.b && mode === 'binary';
            return (
              <button
                key={preset.label}
                onClick={() => {
                  setA(preset.a);
                  setB(preset.b);
                  if (mode === 'trinomial') setMode('binary');
                }}
                title={preset.desc}
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all border-2 ${
                  isSelected
                    ? 'bg-[#c84b31] border-[#c84b31] text-white shadow-sm'
                    : 'bg-slate-50 border-slate-300 text-slate-700 hover:border-slate-900 hover:text-slate-950'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interference Model Toggle */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-600 block flex items-center gap-1.5">
          <Split className="w-3.5 h-3.5 text-slate-700" />
          <span>Interference Model</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setMode('binary')}
            className={`p-2.5 rounded-xl border-2 text-left transition-all ${
              mode === 'binary'
                ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-400'
            }`}
          >
            <div className="text-xs font-bold font-mono">a ÷ b</div>
            <div className="text-[10px] opacity-80 mt-0.5">Binary Sync (ab)</div>
          </button>

          <button
            onClick={() => setMode('fractioned')}
            className={`p-2.5 rounded-xl border-2 text-left transition-all ${
              mode === 'fractioned'
                ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-400'
            }`}
          >
            <div className="text-xs font-bold font-mono">a ÷ b̲</div>
            <div className="text-[10px] opacity-80 mt-0.5">Fractioning (a²)</div>
          </button>

          <button
            onClick={() => setMode('trinomial')}
            className={`p-2.5 rounded-xl border-2 text-left transition-all ${
              mode === 'trinomial'
                ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-400'
            }`}
          >
            <div className="text-xs font-bold font-mono">a ÷ b ÷ c</div>
            <div className="text-[10px] opacity-80 mt-0.5">3 Generators</div>
          </button>
        </div>
      </div>

      {/* Generator Sliders + Tempo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Major Generator (a) */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-sky-700 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600 inline-block"></span>
              Major (a)
            </span>
            <span className="text-sm font-bold font-mono text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">
              {a}
            </span>
          </div>
          <input
            type="range"
            min={2}
            max={12}
            value={a}
            onChange={(e) => handleAChange(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
          />
          <div className="text-[10px] font-mono text-slate-500">Period: {a} units</div>
        </div>

        {/* Minor Generator (b) */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-rose-700 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block"></span>
              Minor (b)
            </span>
            <span className="text-sm font-bold font-mono text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">
              {b}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={Math.max(1, a - 1)}
            value={b}
            onChange={(e) => handleBChange(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
          />
          <div className="text-[10px] font-mono text-slate-500">Period: {b} units</div>
        </div>

        {/* Tempo in Generator Parameters */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-slate-800 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-[#c84b31]" />
              Tempo
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold font-mono text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">
                {bpm}
              </span>
              <button
                onClick={handleTapTempo}
                className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-white border border-slate-300 rounded hover:border-slate-800 active:scale-95 transition-all"
              >
                TAP
              </button>
            </div>
          </div>
          <input
            type="range"
            min={40}
            max={240}
            value={bpm}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setBpm(val);
              audioService.setBpm(val);
            }}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#c84b31]"
          />
          <div className="text-[10px] font-mono text-slate-500">BPM (Beats per Minute)</div>
        </div>

        {/* Third Generator (c) if 3-generator mode */}
        {mode === 'trinomial' && (
          <div className="sm:col-span-2 lg:col-span-3 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-purple-700 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block"></span>
                Tertium Generator (c)
              </span>
              <span className="text-sm font-bold font-mono text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">
                {c}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={12}
              value={c}
              onChange={(e) => handleCChange(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>
        )}
      </div>

      {/* Metric Grouping */}
      <div className="space-y-1.5 pt-2 border-t border-slate-200">
        <label className="text-xs font-bold text-slate-600 block flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-slate-700" />
          <span>Metric Measure Grouping</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setMetricGrouping('ab')}
            className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all border-2 ${
              metricGrouping === 'ab'
                ? 'bg-slate-900 border-slate-900 text-white shadow-2xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-400'
            }`}
          >
            Group by ab
            <div className="text-[10px] opacity-75 font-sans font-normal">1 bar ({totalLength}t)</div>
          </button>

          <button
            onClick={() => setMetricGrouping('a')}
            className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all border-2 ${
              metricGrouping === 'a'
                ? 'bg-slate-900 border-slate-900 text-white shadow-2xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-400'
            }`}
          >
            Group by a
            <div className="text-[10px] opacity-75 font-sans font-normal">{b} bars ({a}t each)</div>
          </button>

          <button
            onClick={() => setMetricGrouping('b')}
            className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all border-2 ${
              metricGrouping === 'b'
                ? 'bg-slate-900 border-slate-900 text-white shadow-2xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-400'
            }`}
          >
            Group by b
            <div className="text-[10px] opacity-75 font-sans font-normal">{a} bars ({b}t each)</div>
          </button>
        </div>
      </div>
    </div>
  );
};
