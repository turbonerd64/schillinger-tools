import React from 'react';
import {
  NOTE_NAMES,
  CYCLE_MOVES,
  CycleMove,
  ChordStructureType,
} from '../../core/harmony/engine';
import {
  Plus,
  Sparkles,
  Sliders,
  Gauge,
} from 'lucide-react';

interface FormulaBarProps {
  tonicRoot: number;
  setTonicRoot: (root: number) => void;
  formula: CycleMove[];
  setFormula: React.Dispatch<React.SetStateAction<CycleMove[]>>;
  structure: ChordStructureType;
  setStructure: (s: ChordStructureType) => void;
  totalChordsCount: number;
  setTotalChordsCount: (count: number) => void;
  bpm: number;
  setBpm: (bpm: number) => void;
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
  bpm,
  setBpm,
}) => {
  const addMove = (move: CycleMove) => {
    if (formula.length < 8) {
      setFormula([...formula, move]);
    }
  };

  const removeMove = (index: number) => {
    if (formula.length > 1) {
      const updated = [...formula];
      updated.splice(index, 1);
      setFormula(updated);
    }
  };

  const applyPreset1 = () => {
    const c3Down = CYCLE_MOVES.find((m) => m.id === 'c3_down')!;
    const c5Up = CYCLE_MOVES.find((m) => m.id === 'c5_up')!;
    setFormula([c3Down, c3Down, c5Up, c3Down]);
    setStructure('S7');
    setTotalChordsCount(8);
  };

  const applyPresetCycle5 = () => {
    const c5Down = CYCLE_MOVES.find((m) => m.id === 'c5_down')!;
    setFormula([c5Down]);
    setStructure('S7');
    setTotalChordsCount(8);
  };

  const applyPresetCycle7 = () => {
    const c7Down = CYCLE_MOVES.find((m) => m.id === 'c7_down')!;
    setFormula([c7Down]);
    setStructure('S7');
    setTotalChordsCount(8);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-900 p-5 sm:p-6 shadow-sm space-y-5">
      {/* Top Presets Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[#c84b31]" />
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 uppercase tracking-wider font-mono">
            Harmonic Setup &amp; Formulas
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#c84b31]" />
            Presets:
          </span>
          <button
            onClick={applyPreset1}
            className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-[#fdf0ec] border-2 border-[#c84b31] text-[#c84b31] hover:bg-[#c84b31] hover:text-white transition-all shadow-sm"
          >
            Aleksei C3/C5 Formula
          </button>
          <button
            onClick={applyPresetCycle5}
            className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-slate-100 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
          >
            Cycle 5 Down
          </button>
          <button
            onClick={applyPresetCycle7}
            className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-slate-100 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
          >
            Cycle 7 Down (Step Up)
          </button>
        </div>
      </div>

      {/* Main Parameters Grid with larger text */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Tonic Key */}
        <div className="md:col-span-4 p-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 space-y-2">
          <label className="text-xs sm:text-sm font-extrabold text-slate-800 uppercase tracking-wider block font-mono">
            Tonic Root Key
          </label>
          <div className="flex flex-wrap gap-1.5">
            {NOTE_NAMES.map((name, idx) => (
              <button
                key={name}
                onClick={() => setTonicRoot(idx)}
                className={`w-8 h-8 rounded-lg text-xs sm:text-sm font-mono font-extrabold transition-all border-2 ${
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
        <div className="md:col-span-3 p-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 space-y-2">
          <label className="text-xs sm:text-sm font-extrabold text-slate-800 uppercase tracking-wider block font-mono">
            Chord Density
          </label>
          <div className="flex gap-2">
            {[
              { id: 'S5', label: 'Triad (S5)' },
              { id: 'S7', label: '7th (S7)' },
              { id: 'S9', label: '9th (S9)' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setStructure(item.id as ChordStructureType)}
                className={`flex-1 py-2 px-1 rounded-xl text-xs sm:text-sm font-extrabold font-mono border-2 transition-all ${
                  structure === item.id
                    ? 'bg-slate-900 border-slate-900 text-white shadow-2xs'
                    : 'bg-white border-slate-300 text-slate-700 hover:border-slate-800'
                }`}
              >
                {item.id}
              </button>
            ))}
          </div>
        </div>

        {/* Progression Length */}
        <div className="md:col-span-3 p-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs sm:text-sm font-extrabold text-slate-800 uppercase tracking-wider font-mono">
              Progression Length
            </label>
            <span className="text-sm sm:text-base font-mono font-extrabold text-[#c84b31] bg-white px-2 py-0.5 rounded border border-slate-300">
              {totalChordsCount} chords
            </span>
          </div>
          <input
            type="range"
            min={4}
            max={32}
            value={totalChordsCount}
            onChange={(e) => setTotalChordsCount(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#c84b31]"
          />
        </div>

        {/* Tempo */}
        <div className="md:col-span-2 p-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs sm:text-sm font-extrabold text-slate-800 uppercase tracking-wider font-mono">
              Tempo
            </label>
            <span className="text-sm sm:text-base font-mono font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">
              {bpm}
            </span>
          </div>
          <input
            type="range"
            min={40}
            max={200}
            value={bpm}
            onChange={(e) => setBpm(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#c84b31]"
          />
        </div>
      </div>

      {/* Cyclic Formula Chain */}
      <div className="bg-slate-50 rounded-xl border-2 border-slate-200 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold uppercase tracking-wider text-slate-900 font-mono">
              Harmonic Cycle Formula:
            </span>
            <span className="text-xs text-slate-500 font-bold font-mono">
              ({formula.length} moves • loops across progression)
            </span>
          </div>

          {/* Quick Add Move Buttons */}
          <div className="flex flex-wrap gap-1.5">
            {CYCLE_MOVES.map((move) => (
              <button
                key={move.id}
                onClick={() => addMove(move)}
                className="px-3 py-1 rounded-lg text-xs sm:text-sm font-extrabold font-mono bg-white border-2 border-slate-300 text-slate-900 hover:border-slate-900 active:scale-95 transition-all shadow-2xs flex items-center gap-1"
                title={move.alias}
              >
                <Plus className="w-3.5 h-3.5 text-[#c84b31]" />
                <span>{move.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Formula Pills Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <div className="px-3.5 py-1.5 rounded-full bg-[#c84b31] text-white font-mono text-xs sm:text-sm font-bold shadow-sm">
            Degree I (Tonic)
          </div>

          {formula.map((move, idx) => (
            <div
              key={`${move.id}-${idx}`}
              className="flex items-center gap-1 pl-3.5 pr-2 py-1.5 rounded-full bg-slate-900 text-white font-mono text-xs sm:text-sm font-bold shadow-sm"
            >
              <span>{move.name}</span>
              <span className="text-xs text-slate-400 font-sans ml-1 mr-1">
                {move.id.includes('c3') ? '3rd' : move.id.includes('c5') ? '5th' : 'step'}
              </span>
              <button
                onClick={() => removeMove(idx)}
                className="w-5 h-5 rounded-full hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white"
                title="Remove step"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
