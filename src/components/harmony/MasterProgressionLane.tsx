import React, { useState } from 'react';
import { ChordItem, ScaleDefinition } from '../../core/harmony/engine';
import { ArrowLeftRight, Check, Sparkles, Volume2 } from 'lucide-react';

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
  const [selectedRange, setSelectedRange] = useState<[number, number] | null>(null);
  const [dropdownIndex, setDropdownIndex] = useState<number | null>(null);

  const handleChordClick = (chord: ChordItem, idx: number) => {
    onSelectChord(chord, idx);
    setDropdownIndex(dropdownIndex === idx ? null : idx);
  };

  const handleSelectChunk = (start: number, end: number) => {
    setSelectedRange([start, end]);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-900 p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-[#c84b31]" />
            Master Progression Lane & Modal Interchange
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Your customized hybrid progression. Click any chord pill to swap its source scale, or apply batch modal interchange across slices.
          </p>
        </div>

        {/* Quick Batch Interchange Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-600 font-mono">
            Batch Borrow:
          </span>
          {availableScales.slice(0, 3).map((scale) => (
            <button
              key={scale.id}
              onClick={() => onApplyChunkMode(scale, 0, masterChords.length - 1)}
              className="px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-300 bg-slate-50 hover:bg-slate-900 hover:text-white transition-all shadow-2xs font-mono"
            >
              All {scale.name.split(' ')[0]}
            </button>
          ))}
          {/* Half & Half preset */}
          {availableScales.length >= 2 && (
            <button
              onClick={() => {
                const mid = Math.floor(masterChords.length / 2);
                onApplyChunkMode(availableScales[0], 0, mid - 1);
                onApplyChunkMode(availableScales[1], mid, masterChords.length - 1);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-bold border-2 border-[#c84b31] bg-[#fdf0ec] text-[#c84b31] hover:bg-[#c84b31] hover:text-white transition-all shadow-2xs font-mono"
            >
              50/50 Hybrid
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Master Sequence */}
      <div
        className="overflow-x-auto w-full py-2 flex items-center gap-2.5 select-none"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {masterChords.map((chord, idx) => {
          const isCurrent = activeChordIndex === idx;

          return (
            <div key={`master-${chord.id}-${idx}`} className="flex-shrink-0 flex flex-col items-center relative">
              <button
                onClick={() => handleChordClick(chord, idx)}
                className={`w-20 sm:w-24 py-3 px-2 rounded-2xl text-xs font-bold font-mono transition-all text-center border-2 shadow-sm relative active:scale-95 ${
                  isCurrent
                    ? 'bg-[#c84b31] border-[#c84b31] text-white ring-4 ring-[#c84b31]/20 scale-105 z-10'
                    : 'bg-slate-900 border-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                <div className="text-xs sm:text-sm font-bold tracking-tight">
                  {chord.chordName}
                </div>
                <div className="text-[10px] opacity-75 font-sans mt-0.5">
                  {chord.romanNumeral}
                </div>

                {/* Source Scale Dot Badge */}
                <div
                  className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow"
                  style={{ backgroundColor: chord.sourceColor }}
                  title={`Source: ${chord.sourceScaleName}`}
                ></div>
              </button>

              <span className="text-[10px] font-mono text-slate-500 mt-1 font-bold">
                {chord.sourceScaleName.split(' ')[0]}
              </span>

              {/* Modal Interchange Popover Menu */}
              {dropdownIndex === idx && (
                <div className="absolute top-16 z-30 bg-white border-2 border-slate-900 rounded-xl shadow-xl p-2 w-44 space-y-1 text-left">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 pb-1 border-b border-slate-100 font-mono">
                    Swap Chord #{idx + 1}
                  </div>
                  {availableScales.map((scale) => {
                    const altChord = railChordsMap[scale.id]?.[idx];
                    if (!altChord) return null;
                    const isSelected = chord.sourceScaleId === scale.id;

                    return (
                      <button
                        key={scale.id}
                        onClick={() => {
                          onSwapChord(idx, altChord);
                          setDropdownIndex(null);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-[#fdf0ec] text-[#c84b31] font-bold'
                            : 'hover:bg-slate-100 text-slate-800'
                        }`}
                      >
                        <span>{altChord.chordName}</span>
                        <span className="text-[10px] opacity-60 font-sans">{scale.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
