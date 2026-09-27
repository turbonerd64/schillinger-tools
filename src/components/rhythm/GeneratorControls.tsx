import React from 'react';
import { SyncMode, MetricGrouping } from '../../core/rhythm/types';
import { Sliders, Sparkles, Split, Hash, Compass } from 'lucide-react';

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
}

const PRESETS = [
  { label: '3 ÷ 2', a: 3, b: 2, desc: 'Classic Hemiola' },
  { label: '4 ÷ 3', a: 4, b: 3, desc: 'Polyrhythmic standard' },
  { label: '5 ÷ 2', a: 5, b: 2, desc: 'Balkan / Quintuple' },
  { label: '5 ÷ 3', a: 5, b: 3, desc: 'Harmonic contrast' },
  { label: '5 ÷ 4', a: 5, b: 4, desc: 'Modern metric tension' },
  { label: '7 ÷ 4', a: 7, b: 4, desc: 'Asymmetric 28-pulse' },
  { label: '8 ÷ 5', a: 8, b: 5, desc: 'Golden / Fibonacci' },
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
}) => {
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
    <div className="bg-schillinger-card rounded-2xl border border-schillinger-border p-5 space-y-6 shadow-xl">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-schillinger-border/60 pb-3">
        <div className="flex items-center gap-2.5">
          <Sliders className="w-4 h-4 text-schillinger-accentA" />
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            Generator Parameters
          </h2>
        </div>
        <div className="text-xs font-mono text-schillinger-textMuted bg-schillinger-bg px-2.5 py-1 rounded-md border border-schillinger-border">
          Cycle: <span className="text-schillinger-resultant font-bold">{totalLength}</span> units
        </div>
      </div>

      {/* Preset Pills */}
      <div>
        <label className="text-xs font-medium text-schillinger-textMuted mb-2 block flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-schillinger-resultant" />
          <span>Schillinger Classic Presets</span>
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
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                  isSelected
                    ? 'bg-schillinger-resultant/20 border-schillinger-resultant text-schillinger-resultant font-bold shadow-md shadow-schillinger-resultant/10'
                    : 'bg-schillinger-panel/60 border-schillinger-border/80 text-gray-300 hover:border-gray-500 hover:text-white'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode Selector */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-schillinger-textMuted block flex items-center gap-1.5">
          <Split className="w-3.5 h-3.5 text-schillinger-accentB" />
          <span>Interference Mode (Book I Chapter 2 & 4)</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setMode('binary')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              mode === 'binary'
                ? 'bg-schillinger-accentA/15 border-schillinger-accentA text-white shadow-md shadow-schillinger-accentA/5'
                : 'bg-schillinger-panel/50 border-schillinger-border/70 text-schillinger-textMuted hover:text-gray-200'
            }`}
          >
            <div className="text-xs font-bold font-mono text-schillinger-accentA">a ÷ b</div>
            <div className="text-[11px] text-gray-400 mt-0.5 leading-snug">Binary Sync (ab)</div>
          </button>

          <button
            onClick={() => setMode('fractioned')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              mode === 'fractioned'
                ? 'bg-schillinger-accentB/15 border-schillinger-accentB text-white shadow-md shadow-schillinger-accentB/5'
                : 'bg-schillinger-panel/50 border-schillinger-border/70 text-schillinger-textMuted hover:text-gray-200'
            }`}
          >
            <div className="text-xs font-bold font-mono text-schillinger-accentB">a ÷ b̲</div>
            <div className="text-[11px] text-gray-400 mt-0.5 leading-snug">Fractioning (a²)</div>
          </button>

          <button
            onClick={() => setMode('trinomial')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              mode === 'trinomial'
                ? 'bg-schillinger-accentC/15 border-schillinger-accentC text-white shadow-md shadow-schillinger-accentC/5'
                : 'bg-schillinger-panel/50 border-schillinger-border/70 text-schillinger-textMuted hover:text-gray-200'
            }`}
          >
            <div className="text-xs font-bold font-mono text-schillinger-accentC">a ÷ b ÷ c</div>
            <div className="text-[11px] text-gray-400 mt-0.5 leading-snug">3 Generators (abc)</div>
          </button>
        </div>
      </div>

      {/* Generator Steppers / Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Major Generator (a) */}
        <div className="p-3.5 rounded-xl bg-schillinger-panel/80 border border-schillinger-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-schillinger-accentA font-mono flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-schillinger-accentA inline-block"></span>
              Major Generator (a)
            </span>
            <span className="text-base font-bold font-mono text-white bg-schillinger-bg px-2.5 py-0.5 rounded border border-schillinger-border">
              {a}
            </span>
          </div>
          <input
            type="range"
            min={2}
            max={12}
            value={a}
            onChange={(e) => handleAChange(parseInt(e.target.value))}
            className="w-full h-1.5 bg-schillinger-grid rounded-lg appearance-none cursor-pointer accent-schillinger-accentA"
          />
          <div className="flex justify-between items-center text-[10px] font-mono text-schillinger-textMuted">
            <span>Period: {a} units</span>
            <span>Attacks: {mode === 'fractioned' ? a + 1 : (totalLength / a) + 1}</span>
          </div>
        </div>

        {/* Minor Generator (b) */}
        <div className="p-3.5 rounded-xl bg-schillinger-panel/80 border border-schillinger-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-schillinger-accentB font-mono flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-schillinger-accentB inline-block"></span>
              Minor Generator (b)
            </span>
            <span className="text-base font-bold font-mono text-white bg-schillinger-bg px-2.5 py-0.5 rounded border border-schillinger-border">
              {b}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={Math.max(1, a - 1)}
            value={b}
            onChange={(e) => handleBChange(parseInt(e.target.value))}
            className="w-full h-1.5 bg-schillinger-grid rounded-lg appearance-none cursor-pointer accent-schillinger-accentB"
          />
          <div className="flex justify-between items-center text-[10px] font-mono text-schillinger-textMuted">
            <span>Period: {b} units</span>
            <span>
              {mode === 'fractioned'
                ? `${a - b + 1} groups of ${a} attacks`
                : `Attacks: ${(totalLength / b) + 1}`}
            </span>
          </div>
        </div>

        {/* Third Generator (c) if Trinomial mode */}
        {mode === 'trinomial' && (
          <div className="sm:col-span-2 p-3.5 rounded-xl bg-schillinger-panel/80 border border-schillinger-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-schillinger-accentC font-mono flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-schillinger-accentC inline-block"></span>
                Tertium Generator (c)
              </span>
              <span className="text-base font-bold font-mono text-white bg-schillinger-bg px-2.5 py-0.5 rounded border border-schillinger-border">
                {c}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={12}
              value={c}
              onChange={(e) => handleCChange(parseInt(e.target.value))}
              className="w-full h-1.5 bg-schillinger-grid rounded-lg appearance-none cursor-pointer accent-schillinger-accentC"
            />
            <div className="flex justify-between items-center text-[10px] font-mono text-schillinger-textMuted">
              <span>Period: {c} units</span>
              <span>Common Product: {a * b * c}</span>
            </div>
          </div>
        )}
      </div>

      {/* Metric Grouping (Book I Chapter 3) */}
      <div className="space-y-2 pt-2 border-t border-schillinger-border/60">
        <label className="text-xs font-medium text-schillinger-textMuted block flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-schillinger-resultant" />
          <span>Metric Measure Grouping (Chapter 3)</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setMetricGrouping('ab')}
            className={`py-2 px-3 rounded-lg text-xs font-mono transition-all border ${
              metricGrouping === 'ab'
                ? 'bg-schillinger-resultant/20 border-schillinger-resultant text-schillinger-resultant font-bold'
                : 'bg-schillinger-panel/50 border-schillinger-border text-gray-400 hover:text-white'
            }`}
          >
            Group by ab
            <div className="text-[10px] text-gray-500 font-sans">1 bar ({totalLength}t)</div>
          </button>

          <button
            onClick={() => setMetricGrouping('a')}
            className={`py-2 px-3 rounded-lg text-xs font-mono transition-all border ${
              metricGrouping === 'a'
                ? 'bg-schillinger-accentA/20 border-schillinger-accentA text-schillinger-accentA font-bold'
                : 'bg-schillinger-panel/50 border-schillinger-border text-gray-400 hover:text-white'
            }`}
          >
            Group by a
            <div className="text-[10px] text-gray-500 font-sans">{b} bars ({a}t each)</div>
          </button>

          <button
            onClick={() => setMetricGrouping('b')}
            className={`py-2 px-3 rounded-lg text-xs font-mono transition-all border ${
              metricGrouping === 'b'
                ? 'bg-schillinger-accentB/20 border-schillinger-accentB text-schillinger-accentB font-bold'
                : 'bg-schillinger-panel/50 border-schillinger-border text-gray-400 hover:text-white'
            }`}
          >
            Group by b
            <div className="text-[10px] text-gray-500 font-sans">{a} bars ({b}t each)</div>
          </button>
        </div>
      </div>
    </div>
  );
};
