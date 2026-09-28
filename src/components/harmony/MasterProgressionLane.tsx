import React, { useState, useRef, useEffect } from 'react';
import { ChordItem, ScaleDefinition } from '../../core/harmony/engine';
import { ArrowLeftRight, Check, X, MousePointerClick } from 'lucide-react';

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
  // Range selection [startIndex, endIndex]
  const [selectedRange, setSelectedRange] = useState<[number, number] | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragAnchor, setDragAnchor] = useState<number | null>(null);

  // Popover position & visibility
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number } | null>(null);
  const chordCardRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  // Global mouseup to finalize dragging
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        if (selectedRange !== null) {
          // Position popover relative to the last chord in selected range
          const targetIdx = selectedRange[1];
          const el = chordCardRefs.current[targetIdx];
          if (el) {
            const rect = el.getBoundingClientRect();
            const popoverWidth = 320;
            const left = Math.max(16, Math.min(window.innerWidth - popoverWidth - 16, rect.left + rect.width / 2 - popoverWidth / 2));
            const top = rect.bottom + 8 + 260 < window.innerHeight
              ? rect.bottom + 8
              : Math.max(16, rect.top - 270);

            setPopoverPos({ top, left });
          }
        }
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging, selectedRange]);

  const handleMouseDown = (idx: number, chord: ChordItem) => {
    onSelectChord(chord, idx);
    setDragAnchor(idx);
    setSelectedRange([idx, idx]);
    setIsDragging(true);
    setPopoverPos(null); // Hide menu while dragging
  };

  const handleMouseEnter = (idx: number) => {
    if (isDragging && dragAnchor !== null) {
      const start = Math.min(dragAnchor, idx);
      const end = Math.max(dragAnchor, idx);
      setSelectedRange([start, end]);
    }
  };

  const handleChordClick = (idx: number, chord: ChordItem) => {
    if (isDragging) return;
    onSelectChord(chord, idx);
    setSelectedRange([idx, idx]);

    // Position popover
    const el = chordCardRefs.current[idx];
    if (el) {
      const rect = el.getBoundingClientRect();
      const popoverWidth = 320;
      const left = Math.max(16, Math.min(window.innerWidth - popoverWidth - 16, rect.left + rect.width / 2 - popoverWidth / 2));
      const top = rect.bottom + 8 + 260 < window.innerHeight
        ? rect.bottom + 8
        : Math.max(16, rect.top - 270);

      setPopoverPos({ top, left });
    }
  };

  const closePopover = () => {
    setPopoverPos(null);
    setSelectedRange(null);
  };

  const isRange = selectedRange !== null && selectedRange[0] !== selectedRange[1];
  const activeSingleChord = selectedRange !== null ? masterChords[selectedRange[0]] : null;

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-900 p-5 sm:p-6 shadow-sm space-y-4 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-100 pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2 font-mono uppercase tracking-tight">
            <ArrowLeftRight className="w-5 h-5 text-[#c84b31]" />
            Master Progression Lane &bull; Modal Interchange
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 flex items-center gap-1.5">
            <MousePointerClick className="w-3.5 h-3.5 text-[#c84b31]" />
            <span>Click or drag across a chunk of chords to batch-swap them into any parallel mode.</span>
          </p>
        </div>

        {/* Quick Batch Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider">
            Quick Batch:
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
              50/50 Split
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Master Sequence with Full Color Matching and Drag Selection */}
      <div
        className="overflow-x-auto w-full py-3 flex items-center gap-3 select-none"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {masterChords.map((chord, idx) => {
          const isCurrent = activeChordIndex === idx;
          const isSelected = selectedRange !== null && idx >= selectedRange[0] && idx <= selectedRange[1];

          return (
            <div key={`master-${chord.id}-${idx}`} className="flex-shrink-0 flex flex-col items-center">
              <button
                ref={(el) => {
                  chordCardRefs.current[idx] = el;
                }}
                onMouseDown={() => handleMouseDown(idx, chord)}
                onMouseEnter={() => handleMouseEnter(idx)}
                onClick={() => handleChordClick(idx, chord)}
                style={{
                  backgroundColor: chord.sourceColor,
                }}
                className={`w-24 sm:w-28 py-4 px-2.5 rounded-2xl font-bold font-mono transition-all text-center border-2 text-white relative shadow-sm cursor-pointer select-none ${
                  isSelected
                    ? 'ring-4 ring-[#c84b31] border-white scale-105 z-10 shadow-lg'
                    : isCurrent
                    ? 'ring-4 ring-slate-900 border-white scale-105 shadow-md'
                    : 'border-slate-900/40 hover:brightness-110'
                }`}
                title={`Click or drag to select • Source: ${chord.sourceScaleName}`}
              >
                {/* Chord Symbol */}
                <div className="text-base sm:text-lg font-extrabold tracking-tight drop-shadow-xs">
                  {chord.chordName}
                </div>
                {/* Roman Numeral */}
                <div className="text-xs sm:text-sm opacity-90 font-mono mt-1 font-bold">
                  {chord.romanNumeral}
                </div>

                {isSelected && (
                  <span className="absolute -top-2.5 -right-1 bg-[#c84b31] text-white text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-white shadow-xs">
                    Sel
                  </span>
                )}
              </button>

              {/* Source Scale Name Tag */}
              <span
                className={`text-xs font-mono font-bold mt-1.5 px-2 py-0.5 rounded-full border transition-all ${
                  isSelected
                    ? 'bg-[#c84b31] text-white border-[#c84b31]'
                    : 'bg-slate-50 border-slate-300 text-slate-700'
                }`}
              >
                {chord.sourceScaleName.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Floating Context-Menu Popover (Fixed, never pushes down the lane or gets clipped!) */}
      {popoverPos && selectedRange !== null && (
        <>
          {/* Backdrop Scrim */}
          <div
            className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-[1px]"
            onClick={closePopover}
          />

          {/* Context Menu Card */}
          <div
            style={{
              top: `${popoverPos.top}px`,
              left: `${popoverPos.left}px`,
            }}
            className="fixed z-50 w-80 bg-white border-2 border-slate-900 rounded-2xl shadow-2xl p-4 space-y-3 animate-in fade-in zoom-in-95 duration-100"
          >
            {/* Popover Header */}
            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-2.5">
              <div>
                <span className="text-xs font-extrabold font-mono uppercase tracking-wider text-[#c84b31] block">
                  {isRange
                    ? `Batch Swap: Chords #${selectedRange[0] + 1} – #${selectedRange[1] + 1}`
                    : `Modal Interchange • Chord #${selectedRange[0] + 1}`}
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {isRange
                    ? `Swapping ${selectedRange[1] - selectedRange[0] + 1} chords simultaneously`
                    : activeSingleChord
                    ? `Current: ${activeSingleChord.chordName} (${activeSingleChord.sourceScaleName})`
                    : ''}
                </span>
              </div>
              <button
                onClick={closePopover}
                className="w-6 h-6 rounded-full hover:bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-500 hover:text-slate-900 font-bold text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Scale Options Grid */}
            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {availableScales.map((scale) => {
                const singleAltChord = !isRange && selectedRange !== null
                  ? railChordsMap[scale.id]?.[selectedRange[0]]
                  : null;

                const isCurrentMode = !isRange && activeSingleChord?.sourceScaleId === scale.id;

                return (
                  <button
                    key={scale.id}
                    onClick={() => {
                      if (selectedRange !== null) {
                        if (isRange) {
                          onApplyChunkMode(scale, selectedRange[0], selectedRange[1]);
                        } else if (singleAltChord) {
                          onSwapChord(selectedRange[0], singleAltChord);
                        }
                      }
                      closePopover();
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border-2 transition-all text-left font-mono ${
                      isCurrentMode
                        ? 'bg-slate-900 border-slate-900 text-white font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-white hover:border-slate-900 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full inline-block border border-slate-900"
                        style={{ backgroundColor: scale.color }}
                      />
                      <span className="text-xs sm:text-sm font-extrabold">
                        {scale.name}
                      </span>
                    </div>

                    {!isRange && singleAltChord && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#c84b31]">
                          {singleAltChord.chordName}
                        </span>
                        <span className="text-[11px] opacity-75">
                          ({singleAltChord.romanNumeral})
                        </span>
                        {isCurrentMode && <Check className="w-3.5 h-3.5 text-white ml-1" />}
                      </div>
                    )}

                    {isRange && (
                      <span className="text-[11px] font-bold text-slate-500 uppercase">
                        Apply to {selectedRange[1] - selectedRange[0] + 1} chords
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
