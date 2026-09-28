import React from 'react';
import {
  NOTE_NAMES,
  CYCLE_MOVES,
  CycleMove,
  ChordStructureType,
  PARENT_SCALES,
  ScaleDefinition,
} from '../../core/harmony/engine';
import {
  Plus,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Layers,
  Activity,
  Sliders,
  SkipForward,
  SkipBack,
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
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  bpm: number;
  setBpm: (bpm: number) => void;
  masterVolume: number;
  setMasterVolume: (vol: number) => void;
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
  isPlaying,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBack,
  bpm,
  setBpm,
  masterVolume,
  setMasterVolume,
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

  // Presets from test cases and video
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
    <div className="bg-white rounded-2xl border-2 border-slate-900 p-5 shadow-sm space-y-5">
      {/* Top Row: Presets & Transport */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        {/* Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#c84b31]" />
            Presets:
          </span>
          <button
            onClick={applyPreset1}
            className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#fdf0ec] border-2 border-[#c84b31] text-[#c84b31] hover:bg-[#c84b31] hover:text-white transition-all shadow-sm"
          >
            Aleksei C3/C5 Formula
          </button>
          <button
            onClick={applyPresetCycle5}
            className="px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
          >
            Cycle 5 Down (Circle of 5ths)
          </button>
          <button
            onClick={applyPresetCycle7}
            className="px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
          >
            Cycle 7 Down (Step Up)
          </button>
        </div>

        {/* Transport & Master Volume */}
        <div className="flex items-center gap-3">
          <button
            onClick={onStepBack}
            className="w-9 h-9 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-100 text-slate-900 flex items-center justify-center active:scale-95 transition-all"
            title="Previous chord"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={isPlaying ? onPause : onPlay}
            className={`px-4 py-2 rounded-xl border-2 border-slate-900 font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 ${
              isPlaying
                ? 'bg-[#c84b31] text-white hover:bg-[#b03e26]'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Play Progression'}</span>
          </button>

          <button
            onClick={onStepForward}
            className="w-9 h-9 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-100 text-slate-900 flex items-center justify-center active:scale-95 transition-all"
            title="Next chord"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={onReset}
            className="w-9 h-9 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-100 text-slate-900 flex items-center justify-center active:scale-95 transition-all"
            title="Reset to Chord 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Master Volume */}
          <div className="flex items-center gap-2 border-l border-slate-300 pl-3">
            <span className="text-[10px] font-bold uppercase text-slate-500 font-mono">Vol</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={masterVolume}
              onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
              className="w-16 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#c84b31]"
            />
          </div>
        </div>
      </div>

      {/* Main Parameters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Tonic Key */}
        <div className="md:col-span-3 space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Tonic Key
          </label>
          <div className="flex flex-wrap gap-1">
            {NOTE_NAMES.map((name, idx) => (
              <button
                key={name}
                onClick={() => setTonicRoot(idx)}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all border ${
                  tonicRoot === idx
                    ? 'bg-[#c84b31] border-[#c84b31] text-white shadow-sm'
                    : 'bg-slate-50 border-slate-300 text-slate-700 hover:border-slate-900'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Chord Structure (S5, S7, S9) */}
        <div className="md:col-span-3 space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Chord Structure
          </label>
          <div className="flex gap-2">
            {[
              { id: 'S5', label: 'Triads (S5)', desc: '3 notes' },
              { id: 'S7', label: '7th Chords (S7)', desc: '4 notes' },
              { id: 'S9', label: '9th Chords (S9)', desc: '5 notes' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setStructure(item.id as ChordStructureType)}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold border-2 transition-all ${
                  structure === item.id
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-400'
                }`}
              >
                {item.id}
              </button>
            ))}
          </div>
        </div>

        {/* Progression Length */}
        <div className="md:col-span-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Progression Length
            </label>
            <span className="text-xs font-mono font-bold text-slate-900">
              {totalChordsCount} chords
            </span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="range"
              min={4}
              max={32}
              value={totalChordsCount}
              onChange={(e) => setTotalChordsCount(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#c84b31]"
            />
          </div>
        </div>

        {/* Tempo */}
        <div className="md:col-span-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Tempo
            </label>
            <span className="text-xs font-mono font-bold text-slate-900">{bpm} BPM</span>
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

      {/* Cycle Formula Chain */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">
              Cyclic Formula Chain:
            </span>
            <span className="text-[11px] text-slate-500">
              ({formula.length} moves • repeats continuously)
            </span>
          </div>

          {/* Quick Add Move Buttons */}
          <div className="flex flex-wrap gap-1.5">
            {CYCLE_MOVES.map((move) => (
              <button
                key={move.id}
                onClick={() => addMove(move)}
                className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-white border border-slate-300 text-slate-800 hover:border-slate-900 active:scale-95 transition-all shadow-2xs flex items-center gap-1"
                title={move.alias}
              >
                <Plus className="w-3 h-3 text-[#c84b31]" />
                <span>{move.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Formula Pills Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <div className="px-3 py-1.5 rounded-full bg-[#c84b31] text-white font-mono text-xs font-bold shadow-sm">
            Degree I (Start)
          </div>

          {formula.map((move, idx) => (
            <div
              key={`${move.id}-${idx}`}
              className="flex items-center gap-1 pl-3 pr-1.5 py-1 rounded-full bg-slate-900 text-white font-mono text-xs font-bold shadow-sm"
            >
              <span>{move.name}</span>
              <span className="text-[10px] text-slate-400 font-sans ml-1 mr-1">
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
