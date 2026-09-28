import React from 'react';
import {
  ChordItem,
  ScaleDefinition,
  PARENT_SCALES,
} from '../../core/harmony/engine';
import { Layers, ArrowRight, Volume2 } from 'lucide-react';

interface ParallelModeRailsProps {
  activeRails: ScaleDefinition[];
  setActiveRails: React.Dispatch<React.SetStateAction<ScaleDefinition[]>>;
  railChordsMap: Record<string, ChordItem[]>;
  activeChordIndex: number;
  onSelectChord: (chord: ChordItem, stepIdx: number) => void;
  onSwapIntoMaster: (chord: ChordItem, stepIdx: number) => void;
}

export const ParallelModeRails: React.FC<ParallelModeRailsProps> = ({
  activeRails,
  setActiveRails,
  railChordsMap,
  activeChordIndex,
  onSelectChord,
  onSwapIntoMaster,
}) => {
  const toggleScaleInRail = (scale: ScaleDefinition) => {
    if (activeRails.some((s) => s.id === scale.id)) {
      if (activeRails.length > 1) {
        setActiveRails(activeRails.filter((s) => s.id !== scale.id));
      }
    } else {
      if (activeRails.length < 4) {
        setActiveRails([...activeRails, scale]);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-900 p-5 shadow-sm space-y-5">
      {/* Header & Scale Pickers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#c84b31]" />
            Parallel Mode Rails
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare how the exact same cyclic root moves project across different parent scales. Click any chord to audition or swap into Master.
          </p>
        </div>

        {/* Rail Toggle Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {PARENT_SCALES.slice(0, 7).map((scale) => {
            const isLoaded = activeRails.some((s) => s.id === scale.id);
            return (
              <button
                key={scale.id}
                onClick={() => toggleScaleInRail(scale)}
                className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono transition-all border ${
                  isLoaded
                    ? 'bg-slate-900 border-slate-900 text-white shadow-2xs'
                    : 'bg-slate-50 border-slate-300 text-slate-600 hover:border-slate-800'
                }`}
              >
                {scale.name.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stacked Rails */}
      <div className="space-y-4">
        {activeRails.map((scale) => {
          const chords = railChordsMap[scale.id] || [];

          return (
            <div
              key={scale.id}
              className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: scale.color }}
                  ></span>
                  {scale.name} Version
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {scale.intervals.length} tones
                </span>
              </div>

              {/* Horizontal Scrollable Chords Sequence */}
              <div
                className="overflow-x-auto w-full py-1.5 flex items-center gap-2 select-none"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {chords.map((chord, stepIdx) => {
                  const isCurrent = activeChordIndex === stepIdx;
                  const isFirstInCycle = stepIdx % 4 === 0;

                  return (
                    <div
                      key={chord.id}
                      className="flex-shrink-0 flex flex-col items-center group"
                    >
                      <button
                        onClick={() => {
                          onSelectChord(chord, stepIdx);
                        }}
                        onDoubleClick={() => {
                          onSwapIntoMaster(chord, stepIdx);
                        }}
                        className={`w-20 sm:w-24 py-2.5 px-2 rounded-xl text-xs font-bold font-mono transition-all text-center border-2 relative shadow-2xs active:scale-95 ${
                          isCurrent
                            ? 'bg-[#c84b31] border-[#c84b31] text-white shadow-md scale-105'
                            : isFirstInCycle
                            ? 'bg-[#fdf0ec] border-[#c84b31] text-[#c84b31] hover:bg-[#c84b31] hover:text-white'
                            : 'bg-white border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white'
                        }`}
                        title="Click to preview • Double-click to swap into Master"
                      >
                        <div className="text-xs sm:text-sm font-bold tracking-tight">
                          {chord.chordName}
                        </div>
                        <div className="text-[10px] opacity-75 font-sans mt-0.5">
                          {chord.romanNumeral}
                        </div>

                        {/* Quick Swap Badge on hover */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            onSwapIntoMaster(chord, stepIdx);
                          }}
                          className="hidden group-hover:flex absolute -top-2 -right-1 bg-slate-900 text-white rounded-full w-4 h-4 items-center justify-center text-[9px] font-bold shadow hover:bg-[#c84b31]"
                          title="Apply to Master Lane"
                        >
                          ↓
                        </div>
                      </button>

                      <span className="text-[10px] font-mono text-slate-400 mt-1">
                        #{stepIdx + 1}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
