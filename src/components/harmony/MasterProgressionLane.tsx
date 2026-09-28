import React, { useState } from 'react';
import { ChordItem, ScaleDefinition } from '../../core/harmony/engine';
import { ArrowLeftRight, Check, Sparkles, X } from 'lucide-react';

interface MasterProgressionLaneProps {
  masterChords: ChordItem[];
  activeChordIndex: number;
  onSelectChord: (chord: ChordItem, stepIdx: number) => void;
  availableScales: ScaleDefinition[];
  onApplyChunkMode: (scale: ScaleDefinition, startIndex: number, endIndex: number) => void;
  railChordsMap: Record<string, ChordItem[]>;
  onSwapChord: (stepIdx: number, newChord: ChordItem) => void;
}

export const MasterProgressionLane: React.FC<MasterProgressionLaneProps> = ({
  masterChords,
  activeChordIndex,
  onSelectChord,
  availableScales,
  onApplyChunkMode,
  railChordsMap,
  onSwapChord,
}) => {
  const [selectedChordForSwap, setSelectedChordForSwap] = useState<number | null>(null);

  const handleChordClick = (chord: ChordItem, idx: number) => {
    onSelectChord(chord, idx);
    setSelectedChordForSwap(selectedChordForSwap === idx ? null : idx);
  };

  const activeChord = selectedChordForSwap !== null ? masterChords[selectedChordForSwap] : null;

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-900 p-5 sm:p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-100 pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2 font-mono uppercase tracking-tight">
            <ArrowLeftRight className="w-5 h-5 text-[#c84b31]" />
            Master Progression Lane &bull; Modal Interchange
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Your final composite progression. Click any chord pill to swap modes, or batch-borrow across slices.
          </p>
        </div>

        {/* Quick Batch Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider">
            Batch Borrow:
          </span>
          {availableScales.slice(0, 3).map((scale) => (
            <button
              key={scale.id}
              onClick={() => onApplyChunkMode(scale, 0, masterChords.length - 1)}
              className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold border-2 border-slate-300 bg-slate-50 hover:border-slate-900 transition-all font-mono shadow-2xs"
            >
              All {scale.name.split(' ')[0]}
            </button>
          ))}
          {availableScales.length >= 2 && (
            <button
              onClick={() => {
                const mid = Math.floor(masterChords.length / 2);
                onApplyChunkMode(availableScales[0], 0, mid - 1);
                onApplyChunkMode(availableScales[1], mid, masterChords.length - 1);
              }}
              className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold border-2 border-[#c84b31] bg-[#fdf0ec] text-[#c84b31] hover:bg-[#c84b31] hover:text-white transition-all font-mono shadow-2xs"
            >
              50/50 Hybrid
            </button>
          )}
        </div>
      </div>

      {/* Dedicated Interchange Selector Bar (Prevents any dropdown clipping!) */}
      {selectedChordForSwap !== null && activeChord && (
        <div className="bg-[#fdf0ec] border-2 border-[#c84b31] rounded-2xl p-4 space-y-3 shadow-md">
          <div className="flex items-center justify-between border-b border-[#c84b31]/30 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold font-mono text-[#c84b31] uppercase">
                Modal Interchange for Chord #{selectedChordForSwap + 1}
              </span>
              <span className="text-sm font-mono font-extrabold text-slate-900">
                (Current: {activeChord.chordName} from {activeChord.sourceScaleName})
              </span>
            </div>
            <button
              onClick={() => setSelectedChordForSwap(null)}
              className="w-7 h-7 rounded-full bg-white border border-[#c84b31] hover:bg-[#c84b31] hover:text-white flex items-center justify-center text-[#c84b31] font-bold text-xs"
            >
              &times;
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {availableScales.map((scale) => {
              const altChord = railChordsMap[scale.id]?.[selectedChordForSwap];
              if (!altChord) return null;
              const isSelected = activeChord.sourceScaleId === scale.id;

              return (
                <button
                  key={scale.id}
                  onClick={() => {
                    onSwapChord(selectedChordForSwap, altChord);
                    setSelectedChordForSwap(null);
                  }}
                  className={`p-2.5 rounded-xl border-2 text-center transition-all shadow-2xs ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white font-bold ring-2 ring-[#c84b31]'
                      : 'bg-white border-slate-300 text-slate-800 hover:border-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-sm sm:text-base font-extrabold font-mono">
                    {altChord.chordName}
                  </div>
                  <div className="text-[11px] font-mono mt-0.5 opacity-80" style={{ color: isSelected ? '#ffffff' : scale.color }}>
                    {scale.name.split(' ')[0]} ({altChord.romanNumeral})
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Horizontal Master Sequence with Full Color Matching */}
      <div
        className="overflow-x-auto w-full py-3 flex items-center gap-3 select-none"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {masterChords.map((chord, idx) => {
          const isCurrent = activeChordIndex === idx;
          const isSelected = selectedChordForSwap === idx;

          return (
            <div key={`master-${chord.id}-${idx}`} className="flex-shrink-0 flex flex-col items-center">
              <button
                onClick={() => handleChordClick(chord, idx)}
                style={{
                  backgroundColor: chord.sourceColor,
                }}
                className={`w-24 sm:w-28 py-4 px-2.5 rounded-2xl font-bold font-mono transition-all text-center border-2 text-white relative shadow-sm active:scale-95 ${
                  isCurrent
                    ? 'ring-4 ring-slate-900 border-white scale-105 shadow-lg'
                    : isSelected
                    ? 'ring-4 ring-[#c84b31] border-white'
                    : 'border-slate-900/40 hover:brightness-110'
                }`}
                title={`Click to preview or swap (Source: ${chord.sourceScaleName})`}
              >
                {/* Chord Symbol */}
                <div className="text-base sm:text-lg font-extrabold tracking-tight drop-shadow-xs">
                  {chord.chordName}
                </div>
                {/* Roman Numeral */}
                <div className="text-xs sm:text-sm opacity-90 font-mono mt-1 font-bold">
                  {chord.romanNumeral}
                </div>
              </button>

              {/* Source Scale Name Tag */}
              <span
                className="text-xs font-mono font-bold mt-1.5 px-2 py-0.5 rounded-full border border-slate-300 bg-slate-50 text-slate-700"
              >
                {chord.sourceScaleName.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
