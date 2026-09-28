import React from 'react';
import {
  NOTE_NAMES,
  CYCLE_MOVES,
  CycleMove,
  ChordStructureType,
  HarmonySystemType,
  VoiceLeadingMode,
} from '../../core/harmony/engine';
import {
  Plus,
  Sparkles,
  Sliders,
  Layers,
  RotateCw,
} from 'lucide-react';
import {
  SCHILLINGER_HARMONY_PRESETS,
  getHarmonyPresetById,
} from '../../core/harmony/presets';

interface FormulaBarProps {
  tonicRoot: number;
  setTonicRoot: (root: number) => void;
  formula: CycleMove[];
  setFormula: React.Dispatch<React.SetStateAction<CycleMove[]>>;
  structure: ChordStructureType;
  setStructure: (s: ChordStructureType) => void;
  totalChordsCount: number;
  setTotalChordsCount: (count: number) => void;
  selectedPresetId: string;
  onSelectPreset: (presetId: string) => void;
  harmonySystem: HarmonySystemType;
  setHarmonySystem: (sys: HarmonySystemType) => void;
  invariantQuality: string;
  setInvariantQuality: (q: string) => void;
  voiceLeadingMode: VoiceLeadingMode;
  setVoiceLeadingMode: (mode: VoiceLeadingMode) => void;
}

export const FormulaBar: React.FC<FormulaBarProps> = ({
  tonicRoot,
  setTonicRoot,
  formula,
  setFormula,
  structure,
  setStructure,
  totalChordsCount,
  setTotalChordsCount,
  selectedPresetId,
  onSelectPreset,
  harmonySystem,
  setHarmonySystem,
  invariantQuality,
  setInvariantQuality,
  voiceLeadingMode,
  setVoiceLeadingMode,
}) => {

  const activePreset = getHarmonyPresetById(selectedPresetId);

  const diatonicPresets = SCHILLINGER_HARMONY_PRESETS.filter((p) => p.category === 'Diatonic Cycle');
  const compoundPresets = SCHILLINGER_HARMONY_PRESETS.filter((p) => p.category === 'Compound / Cadential');
  const symmetricPresets = SCHILLINGER_HARMONY_PRESETS.filter((p) => p.category === 'Symmetric Root System');

  const diatonicMoves = CYCLE_MOVES.filter((m) => m.system === 'diatonic');
  const symmetricMoves = CYCLE_MOVES.filter((m) => m.system === 'symmetric');

  const addMove = (move: CycleMove) => {
    onSelectPreset('custom');
    if (formula.length < 8) {
      setFormula([...formula, move]);
    }
  };

  const removeMove = (index: number) => {
    onSelectPreset('custom');
    const updated = [...formula];
    updated.splice(index, 1);
    setFormula(updated);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-900 p-5 sm:p-6 shadow-sm space-y-5">
      {/* Top Header Bar: Title and Categorized Presets Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[#c84b31]" />
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 uppercase tracking-wider font-mono">
            Harmonic Setup &amp; Formulas
          </h2>
        </div>

        {/* Categorized Harmony Preset Dropdown */}
        <div className="flex items-center gap-2 flex-wrap">
          <label htmlFor="harmony-preset-select" className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 font-mono">
            <Sparkles className="w-4 h-4 text-[#c84b31]" />
            Preset:
          </label>
          <div className="relative">
            <select
              id="harmony-preset-select"
              value={selectedPresetId}
              onChange={(e) => onSelectPreset(e.target.value)}
              className="bg-white border-2 border-slate-900 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-mono font-bold text-slate-900 shadow-2xs hover:border-[#c84b31] focus:outline-none focus:ring-2 focus:ring-[#c84b31] cursor-pointer max-w-[280px] sm:max-w-xs truncate"
            >
              <option value="custom">-- Custom Formula --</option>
              <optgroup label="Diatonic Cycles">
                {diatonicPresets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Compound / Cadential">
                {compoundPresets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Symmetric Root Systems">
                {symmetricPresets.map((p) => (
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
              {activePreset.category}
            </span>
            <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-300 shadow-2xs">
              Scale: {activePreset.defaultScale} &bull; {activePreset.chordStructure === 'S5' ? 'Triads (S5)' : '7ths (S7)'}
            </span>
            <span className="text-slate-700 font-sans sm:ml-1 font-medium">
              {activePreset.description}
            </span>
          </div>
          <div className="text-xs font-mono font-bold text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-300 shadow-2xs flex-shrink-0">
            Formula: <strong className="text-slate-900">[{activePreset.cycleFormula.map((f) => f.label).join(' → ')}]</strong>
          </div>
        </div>
      )}

      {/* Main Parameters Grid with larger text */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
        {/* Tonic Key */}
        <div className="md:col-span-4 p-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 space-y-2">
          <label className="text-xs sm:text-sm font-extrabold text-slate-800 uppercase tracking-wider block font-mono">
            Tonic Root Key
          </label>
          <div className="flex flex-wrap gap-1">
            {NOTE_NAMES.map((name, idx) => (
              <button
                key={name}
                onClick={() => setTonicRoot(idx)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs sm:text-sm font-mono font-extrabold transition-all border-2 ${
                  tonicRoot === idx
                    ? 'bg-[#c84b31] border-[#c84b31] text-white shadow-sm scale-105'
                    : 'bg-white border-slate-300 text-slate-800 hover:border-slate-900'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Chord Structure */}
        <div className="md:col-span-4 p-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 space-y-2">
          <label className="text-xs sm:text-sm font-extrabold text-slate-800 uppercase tracking-wider block font-mono">
            Chord Density
          </label>
          <div className="flex gap-1.5">
            {[
              { id: 'S5', label: 'Triad' },
              { id: 'S7', label: '7th' },
              { id: 'S9', label: '9th' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setStructure(item.id as ChordStructureType);
                  onSelectPreset('custom');
                }}
                className={`flex-1 py-2 px-1 rounded-xl text-xs sm:text-sm font-extrabold font-mono border-2 transition-all ${
                  structure === item.id
                    ? 'bg-slate-900 border-slate-900 text-white shadow-2xs'
                    : 'bg-white border-slate-300 text-slate-700 hover:border-slate-800'
                }`}
                title={item.label}
              >
                {item.id}
              </button>
            ))}
          </div>
        </div>

        {/* Progression Length */}
        <div className="md:col-span-4 p-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs sm:text-sm font-extrabold text-slate-800 uppercase tracking-wider font-mono">
              Progression Length
            </label>
            <span className="text-xs sm:text-sm font-mono font-extrabold text-[#c84b31] bg-white px-2 py-0.5 rounded border border-slate-300">
              {totalChordsCount} chords
            </span>
          </div>
          <input
            type="range"
            min={4}
            max={32}
            value={totalChordsCount}
            onChange={(e) => {
              setTotalChordsCount(parseInt(e.target.value));
              onSelectPreset('custom');
            }}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#c84b31]"
          />
        </div>
      </div>


      {/* Schillinger System & Voice-Leading Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 p-4 rounded-xl bg-slate-50 border-2 border-slate-200">
        {/* Harmonic System Selection */}
        <div className="lg:col-span-6 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs sm:text-sm font-extrabold text-slate-800 uppercase tracking-wider block font-mono flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#c84b31]" />
              Harmonic System
            </label>
            <span className="text-xs font-mono font-bold text-slate-500">
              Book V
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'diatonic', label: 'Type I: Diatonic', desc: 'Scale tertian' },
              { id: 'diatonic_symmetric', label: 'Type II: Invariant', desc: 'Fixed quality' },
              { id: 'symmetric', label: 'Type III: Symmetric', desc: 'Roots of 2' },
            ].map((sys) => (
              <button
                key={sys.id}
                onClick={() => {
                  setHarmonySystem(sys.id as HarmonySystemType);
                  onSelectPreset('custom');
                }}
                className={`py-2 px-1.5 rounded-xl text-xs font-extrabold font-mono border-2 transition-all text-center flex flex-col items-center justify-center ${
                  harmonySystem === sys.id
                    ? 'bg-[#c84b31] border-[#c84b31] text-white shadow-2xs'
                    : 'bg-white border-slate-300 text-slate-700 hover:border-slate-800'
                }`}
              >
                <span>{sys.label}</span>
                <span className={`text-[10px] font-sans font-medium mt-0.5 ${harmonySystem === sys.id ? 'text-white/80' : 'text-slate-400'}`}>
                  {sys.desc}
                </span>
              </button>
            ))}
          </div>

          {/* Invariant Quality Selector (Visible in Type II or Type III) */}
          {(harmonySystem === 'diatonic_symmetric' || harmonySystem === 'symmetric') && (
            <div className="pt-2 flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-mono font-bold text-slate-700">Invariant Quality:</span>
              {(structure === 'S5'
                ? [
                    { id: '', label: 'Maj' },
                    { id: 'm', label: 'Min' },
                    { id: 'dim', label: 'Dim' },
                    { id: 'aug', label: 'Aug' },
                  ]
                : [
                    { id: 'maj7', label: 'Maj7' },
                    { id: 'm7', label: 'Min7' },
                    { id: '7', label: 'Dom7' },
                    { id: 'm7b5', label: 'm7b5' },
                    { id: 'dim7', label: 'Dim7' },
                  ]
              ).map((q) => (
                <button
                  key={q.id}
                  onClick={() => setInvariantQuality(q.id)}
                  className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold border-2 transition-all ${
                    invariantQuality === q.id
                      ? 'bg-slate-900 border-slate-900 text-white shadow-2xs'
                      : 'bg-white border-slate-300 text-slate-700 hover:border-slate-900'
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Voice-Leading Transformation Groups */}
        <div className="lg:col-span-6 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs sm:text-sm font-extrabold text-slate-800 uppercase tracking-wider block font-mono flex items-center gap-1.5">
              <RotateCw className="w-4 h-4 text-[#c84b31]" />
              Voice-Leading Mode
            </label>
            <span className="text-xs font-mono font-bold text-slate-500">
              Book V, Ch. 2
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {[
              { id: 'greedy', label: 'Minimal Motion', desc: 'Nearest path' },
              { id: 'schillinger_cw', label: 'Clockwise', desc: 'Voice cycle 1→3→5→7' },
              { id: 'schillinger_ccw', label: 'Counter-CW', desc: 'Voice cycle 1→7→5→3' },
              { id: 'schillinger_const', label: 'Common Tone', desc: 'Hold shared notes' },
            ].map((vl) => (
              <button
                key={vl.id}
                onClick={() => setVoiceLeadingMode(vl.id as VoiceLeadingMode)}
                className={`py-2 px-1.5 rounded-xl text-xs font-extrabold font-mono border-2 transition-all text-center flex flex-col items-center justify-center ${
                  voiceLeadingMode === vl.id
                    ? 'bg-slate-900 border-slate-900 text-white shadow-2xs'
                    : 'bg-white border-slate-300 text-slate-700 hover:border-slate-800'
                }`}
              >
                <span>{vl.label}</span>
                <span className={`text-[10px] font-sans font-medium mt-0.5 ${voiceLeadingMode === vl.id ? 'text-slate-300' : 'text-slate-400'}`}>
                  {vl.desc}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cyclic Formula Chain */}
      <div className="bg-slate-50 rounded-xl border-2 border-slate-200 p-4 space-y-3">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold uppercase tracking-wider text-slate-900 font-mono">
                Harmonic Cycle Formula:
              </span>
              <span className="text-xs text-slate-500 font-bold font-mono">
                ({formula.length} moves &bull; loops across progression)
              </span>
            </div>
          </div>

          {/* Quick Add Move Buttons: Categorized Diatonic vs Symmetric */}
          <div className="flex flex-col gap-2 pt-1 border-t border-slate-200">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 mr-1">
                Diatonic Cycles (Scale Steps):
              </span>
              {diatonicMoves.map((move) => (
                <button
                  key={move.id}
                  onClick={() => addMove(move)}
                  className="px-2.5 py-1 rounded-lg text-xs font-extrabold font-mono bg-white border-2 border-slate-300 text-slate-900 hover:border-slate-900 active:scale-95 transition-all shadow-2xs flex items-center gap-1"
                  title={move.alias}
                >
                  <Plus className="w-3 h-3 text-[#c84b31]" />
                  <span>{move.name}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#c84b31] mr-1">
                Symmetric Octave Divisions (Roots of 2):
              </span>
              {symmetricMoves.map((move) => (
                <button
                  key={move.id}
                  onClick={() => addMove(move)}
                  className="px-2.5 py-1 rounded-lg text-xs font-extrabold font-mono bg-white border-2 border-[#c84b31]/40 text-slate-900 hover:border-[#c84b31] active:scale-95 transition-all shadow-2xs flex items-center gap-1"
                  title={move.alias}
                >
                  <Plus className="w-3 h-3 text-[#c84b31]" />
                  <span>{move.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Formula Pills Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200">
          <div className="px-3.5 py-1.5 rounded-full bg-[#c84b31] text-white font-mono text-xs sm:text-sm font-bold shadow-sm">
            Degree I (Tonic)
          </div>

          {formula.length === 0 ? (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border-2 border-dashed border-amber-300 text-amber-900 font-mono text-xs sm:text-sm font-bold">
              <span>Formula empty &bull; Click + buttons above to add cycle movements</span>
            </div>
          ) : (
            formula.map((move, idx) => (
              <div
                key={`${move.id}-${idx}`}
                className="flex items-center gap-1 pl-3.5 pr-2 py-1.5 rounded-full bg-slate-900 text-white font-mono text-xs sm:text-sm font-bold shadow-sm"
              >
                <span>{move.name}</span>
                <span className="text-xs text-slate-400 font-sans ml-1 mr-1">
                  {move.semitoneOffset !== undefined
                    ? `${move.semitoneOffset} st`
                    : move.id.includes('c3')
                    ? '3rd'
                    : move.id.includes('c5')
                    ? '5th'
                    : 'step'}
                </span>
                <button
                  onClick={() => removeMove(idx)}
                  className="w-5 h-5 rounded-full hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white"
                  title="Remove step"
                >
                  &times;
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
