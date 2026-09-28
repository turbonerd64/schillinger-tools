import React from 'react';
import { SyncMode, MetricGrouping, RhythmVariationState } from '../../core/rhythm/types';
import { Sliders, Sparkles, Split, Compass, Gauge, ArrowLeftRight, RotateCw, RefreshCw, Cpu } from 'lucide-react';
import { RHYTHM_PRESETS, getPresetById } from '../../core/rhythm/presets';

interface UnifiedRhythmControlsProps {
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
  variations: RhythmVariationState;
  setVariations: React.Dispatch<React.SetStateAction<RhythmVariationState>>;
  selectedPresetId: string;
  onSelectPreset: (presetId: string) => void;
}

export const UnifiedRhythmControls: React.FC<UnifiedRhythmControlsProps> = ({
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
  variations,
  setVariations,
  selectedPresetId,
  onSelectPreset,
}) => {
  const activePreset = getPresetById(selectedPresetId);

  const fundamentalPresets = RHYTHM_PRESETS.filter((p) => p.genre === 'Polyrhythmic Fundamental');
  const afroCubanPresets = RHYTHM_PRESETS.filter((p) => p.genre === 'Afro-Cuban / Latin');
  const jazzDancePresets = RHYTHM_PRESETS.filter((p) => p.genre === 'Early Jazz / Dance' || p.genre === 'Swing / Big Band' || p.genre === 'Tango / Argentine');
  const fractionalPresets = RHYTHM_PRESETS.filter((p) => p.genre === 'Classical / Pedagogical');

  const handleAChange = (newA: number) => {
    onSelectPreset('custom');
    const validA = Math.max(2, Math.min(16, newA));
    setA(validA);
    if (validA <= b && mode !== 'trinomial') {
      setB(validA - 1);
    }
  };

  const handleBChange = (newB: number) => {
    onSelectPreset('custom');
    const validB = Math.max(1, Math.min(a - 1, newB));
    setB(validB);
  };

  const handleCChange = (newC: number) => {
    onSelectPreset('custom');
    setC(Math.max(1, Math.min(16, newC)));
  };

  const handleToggleReverse = () => {
    setVariations((prev) => ({ ...prev, isReversed: !prev.isReversed }));
  };

  const handleRotate = (delta: number) => {
    setVariations((prev) => ({
      ...prev,
      rotationOffset: prev.rotationOffset + delta,
    }));
  };

  const handleResetVariations = () => {
    setVariations({ isReversed: false, rotationOffset: 0 });
  };

  // Distributive Square
  const distSquareA2 = a * a;
  const distSquareAB = a * b;
  const distSquareB2 = b * b;
  const distSquareFormula = `${distSquareA2} + ${distSquareAB} + ${distSquareAB} + ${distSquareB2}`;
  const distSquareSum = distSquareA2 + 2 * distSquareAB + distSquareB2;

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-900 p-5 shadow-sm space-y-4">
      {/* Top Header Bar: Title, Presets Dropdown, and Cycle Badge */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 border-b-2 border-slate-100 pb-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#c84b31]" />
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 uppercase tracking-wider font-mono">
              Generator Setup &amp; Variations
            </h2>
          </div>

          <div className="text-sm font-mono font-extrabold text-slate-900 bg-[#fdf0ec] border-2 border-[#c84b31]/40 px-3.5 py-1 rounded-full">
            Cycle Length: <span className="text-[#c84b31]">{totalLength}</span> units
          </div>
        </div>

        {/* Categorized Preset Dropdown */}
        <div className="flex items-center gap-2 flex-wrap">
          <label htmlFor="rhythm-preset-select" className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 font-mono">
            <Sparkles className="w-4 h-4 text-[#c84b31]" />
            Preset:
          </label>
          <div className="relative">
            <select
              id="rhythm-preset-select"
              value={selectedPresetId}
              onChange={(e) => onSelectPreset(e.target.value)}
              className="bg-white border-2 border-slate-900 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-mono font-bold text-slate-900 shadow-2xs hover:border-[#c84b31] focus:outline-none focus:ring-2 focus:ring-[#c84b31] cursor-pointer max-w-[280px] sm:max-w-xs truncate"
            >
              <option value="custom">-- Custom Setup --</option>
              <optgroup label="Polyrhythmic Fundamentals">
                {fundamentalPresets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Afro-Cuban &amp; Latin">
                {afroCubanPresets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Jazz, Swing &amp; Dance">
                {jazzDancePresets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Fractional Continuity">
                {fractionalPresets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* Preset Context Banner (Shown when an authentic preset is selected) */}
      {activePreset && selectedPresetId !== 'custom' && (
        <div className="bg-[#fdf0ec]/70 border-2 border-[#c84b31]/30 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs sm:text-sm font-mono">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-extrabold text-[#c84b31] bg-white px-2.5 py-0.5 rounded-md border border-[#c84b31]/40 shadow-2xs">
              {activePreset.genre}
            </span>
            <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-300 shadow-2xs">
              {activePreset.timeSignature} &bull; {activePreset.baseUnit}
            </span>
            <span className="text-slate-700 font-sans sm:ml-1 font-medium">
              {activePreset.description}
            </span>
          </div>
          <div className="text-xs font-mono font-bold text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-300 shadow-2xs flex-shrink-0">
            Durations: <strong className="text-slate-900">[{activePreset.durations.join(', ')}]</strong>
          </div>
        </div>
      )}

      {/* Main Controls Row: Sliders, Model, Grouping & Variations in a clean unified grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-start">
        {/* Major Generator (a) */}
        <div className="lg:col-span-3 p-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold font-mono text-sky-700 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-600 inline-block"></span>
              Major (a)
            </span>
            <span className="text-lg font-extrabold font-mono text-slate-900 bg-white px-2.5 py-0.5 rounded-lg border-2 border-slate-300">
              {a}
            </span>
          </div>
          <input
            type="range"
            min={2}
            max={12}
            value={a}
            onChange={(e) => handleAChange(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
          />
          <div className="text-xs font-mono text-slate-500 font-medium">Period: {a} time units</div>
        </div>

        {/* Minor Generator (b) */}
        <div className="lg:col-span-3 p-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold font-mono text-rose-700 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-600 inline-block"></span>
              Minor (b)
            </span>
            <span className="text-lg font-extrabold font-mono text-slate-900 bg-white px-2.5 py-0.5 rounded-lg border-2 border-slate-300">
              {b}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={Math.max(1, a - 1)}
            value={b}
            onChange={(e) => handleBChange(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
          />
          <div className="text-xs font-mono text-slate-500 font-medium">Period: {b} time units</div>
        </div>

        {/* Interference Model Picker */}
        <div className="lg:col-span-3 p-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block font-mono flex items-center gap-1.5">
            <Split className="w-3.5 h-3.5 text-slate-800" />
            Interference Model
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => {
                setMode('binary');
                onSelectPreset('custom');
              }}
              className={`py-2 px-1 rounded-xl text-center border-2 transition-all ${
                mode === 'binary'
                  ? 'bg-slate-900 border-slate-900 text-white shadow-2xs font-bold'
                  : 'bg-white border-slate-300 text-slate-700 hover:border-slate-800'
              }`}
            >
              <div className="text-xs sm:text-sm font-bold font-mono">a ÷ b</div>
              <div className="text-[10px] opacity-75">Binary</div>
            </button>

            <button
              onClick={() => {
                setMode('fractioned');
                onSelectPreset('custom');
              }}
              className={`py-2 px-1 rounded-xl text-center border-2 transition-all ${
                mode === 'fractioned'
                  ? 'bg-slate-900 border-slate-900 text-white shadow-2xs font-bold'
                  : 'bg-white border-slate-300 text-slate-700 hover:border-slate-800'
              }`}
            >
              <div className="text-xs sm:text-sm font-bold font-mono">a ÷ b̲</div>
              <div className="text-[10px] opacity-75">Fractioned</div>
            </button>

            <button
              onClick={() => {
                setMode('trinomial');
                onSelectPreset('custom');
              }}
              className={`py-2 px-1 rounded-xl text-center border-2 transition-all ${
                mode === 'trinomial'
                  ? 'bg-slate-900 border-slate-900 text-white shadow-2xs font-bold'
                  : 'bg-white border-slate-300 text-slate-700 hover:border-slate-800'
              }`}
            >
              <div className="text-xs sm:text-sm font-bold font-mono">a÷b÷c</div>
              <div className="text-[10px] opacity-75">3-Part</div>
            </button>
          </div>
        </div>

        {/* Metric Grouping */}
        <div className="lg:col-span-3 p-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block font-mono flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-slate-800" />
            Metric Grouping
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => setMetricGrouping('ab')}
              className={`py-2 px-1 rounded-xl text-center border-2 transition-all ${
                metricGrouping === 'ab'
                  ? 'bg-[#c84b31] border-[#c84b31] text-white shadow-2xs font-bold'
                  : 'bg-white border-slate-300 text-slate-700 hover:border-slate-800'
              }`}
            >
              <div className="text-xs sm:text-sm font-bold font-mono">by ab</div>
              <div className="text-[10px] opacity-80">1 bar</div>
            </button>

            <button
              onClick={() => setMetricGrouping('a')}
              className={`py-2 px-1 rounded-xl text-center border-2 transition-all ${
                metricGrouping === 'a'
                  ? 'bg-[#c84b31] border-[#c84b31] text-white shadow-2xs font-bold'
                  : 'bg-white border-slate-300 text-slate-700 hover:border-slate-800'
              }`}
            >
              <div className="text-xs sm:text-sm font-bold font-mono">by a</div>
              <div className="text-[10px] opacity-80">{b} bars</div>
            </button>

            <button
              onClick={() => setMetricGrouping('b')}
              className={`py-2 px-1 rounded-xl text-center border-2 transition-all ${
                metricGrouping === 'b'
                  ? 'bg-[#c84b31] border-[#c84b31] text-white shadow-2xs font-bold'
                  : 'bg-white border-slate-300 text-slate-700 hover:border-slate-800'
              }`}
            >
              <div className="text-xs sm:text-sm font-bold font-mono">by b</div>
              <div className="text-[10px] opacity-80">{a} bars</div>
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Variations (Retrograde, Rotation) and Distributive Powers Strip */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2 border-t-2 border-slate-100">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Retrograde */}
          <button
            onClick={handleToggleReverse}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-xs sm:text-sm font-bold font-mono transition-all ${
              variations.isReversed
                ? 'bg-[#c84b31] border-[#c84b31] text-white shadow-sm'
                : 'bg-slate-50 border-slate-300 text-slate-800 hover:border-slate-900'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Retrograde (Reverse): {variations.isReversed ? 'ON' : 'OFF'}</span>
          </button>

          {/* Circular Permutation */}
          <div className="flex items-center gap-2 bg-slate-50 border-2 border-slate-300 px-3 py-1.5 rounded-xl">
            <span className="text-xs sm:text-sm font-bold font-mono text-slate-900">
              Shift: <span className="text-[#c84b31] font-bold">{variations.rotationOffset}</span>
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleRotate(-1)}
                className="w-7 h-7 rounded-lg bg-white border border-slate-300 text-xs font-bold hover:border-slate-900 active:scale-95 flex items-center justify-center shadow-2xs"
              >
                ◀
              </button>
              <button
                onClick={() => handleRotate(1)}
                className="w-7 h-7 rounded-lg bg-white border border-slate-300 text-xs font-bold hover:border-slate-900 active:scale-95 flex items-center justify-center shadow-2xs"
              >
                ▶
              </button>
            </div>
            {variations.rotationOffset !== 0 && (
              <button
                onClick={handleResetVariations}
                className="text-xs font-mono font-bold text-[#c84b31] ml-1 hover:underline flex items-center gap-0.5"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            )}
          </div>
          {/* Tempo Slider */}
          <div className="flex items-center gap-2 bg-slate-50 border-2 border-slate-300 px-3 py-1.5 rounded-xl">
            <Gauge className="w-4 h-4 text-[#c84b31]" />
            <span className="text-xs sm:text-sm font-bold font-mono text-slate-900">
              Tempo: <span className="text-[#c84b31] font-bold">{bpm}</span>
            </span>
            <input
              type="range"
              min={40}
              max={240}
              value={bpm}
              onChange={(e) => setBpm(parseInt(e.target.value, 10) || 100)}
              className="w-20 sm:w-28 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#c84b31]"
              title="Rhythm Tempo (BPM)"
            />
          </div>
        </div>

        {/* Distributive Square Compact Badge */}
        <div className="bg-[#fdf0ec] border-2 border-[#c84b31]/30 px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-xs sm:text-sm font-mono text-slate-900">
          <Cpu className="w-4 h-4 text-[#c84b31]" />
          <span>({a} + {b})² = <strong>{distSquareSum}</strong> → [{distSquareFormula}]</span>
        </div>
      </div>
    </div>
  );
};
