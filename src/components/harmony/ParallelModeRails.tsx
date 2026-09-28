import React from 'react';
import {
  ChordItem,
  ScaleDefinition,
  PARENT_SCALES,
} from '../../core/harmony/engine';
import { Layers } from 'lucide-react';

interface ParallelModeRailsProps {
  activeRails: ScaleDefinition[];
  setActiveRails: React.Dispatch<React.SetStateAction<ScaleDefinition[]>>;
  railChordsMap: Record<string, ChordItem[]>;
  masterChords: ChordItem[];
  activeChordIndex: number;
  onSelectChord: (chord: ChordItem, stepIdx: number) => void;
  onSwapIntoMaster: (chord: ChordItem, stepIdx: number) => void;
}

export const ParallelModeRails: React.FC<ParallelModeRailsProps> = ({
  activeRails,
  setActiveRails,
  railChordsMap,
  masterChords,
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
      if (activeRails.length < 5) {
        setActiveRails([...activeRails, scale]);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-900 p-5 sm:p-6 shadow-sm space-y-5">
      {/* Header & Rail Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-100 pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2 font-mono uppercase tracking-tight">
            <Layers className="w-5 h-5 text-[#c84b31]" />
            Parallel Mode Rails
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Same cyclic root movements projected through each parent scale. Click any chord to hear it or send to Master.
          </p>
        </div>

        {/* Scale Toggle Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {PARENT_SCALES.slice(0, 7).map((scale) => {
            const isLoaded = activeRails.some((s) => s.id === scale.id);
            return (
              <button
                key={scale.id}
                onClick={() => toggleScaleInRail(scale)}
                className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold font-mono transition-all border-2 ${
                  isLoaded
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                    : 'bg-slate-50 border-slate-300 text-slate-700 hover:border-slate-800'
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
              className="border-2 border-slate-900 rounded-2xl p-4 space-y-3 shadow-2xs"
              style={{
                backgroundColor:
                  scale.id === 'ionian'
                    ? '#fdf0ec' // Soft peach
                    : scale.id === 'phrygian'
                    ? '#fef3c7' // Soft amber
                    : scale.id === 'dorian'
                    ? '#e0f2fe' // Soft blue
                    : scale.id === 'lydian'
                    ? '#d1fae5' // Soft green
                    : scale.id === 'mixolydian'
                    ? '#ede9fe' // Soft violet
                    : scale.id === 'aeolian'
                    ? '#ffe4e6' // Soft rose
                    : '#f1f5f9', // Soft slate
              }}
            >
              <div className="flex items-center justify-between border-b border-slate-900/10 pb-2">
                <span className="text-sm sm:text-base font-extrabold font-mono uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full inline-block border border-slate-900"
                    style={{ backgroundColor: scale.color }}
                  ></span>
                  {scale.name} Version
                </span>
                <span className="text-xs font-mono font-bold text-slate-600 bg-white/70 px-2 py-0.5 rounded-md border border-slate-300">
                  {scale.intervals.length} Scale Degrees
                </span>
              </div>

              {/* Horizontal Scrollable Chords Sequence */}
              <div
                className="overflow-x-auto w-full py-2 flex items-center gap-1.5 sm:gap-3 select-none"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {chords.map((chord, stepIdx) => {
                  const isColumnActive = activeChordIndex === stepIdx;
                  const masterChordAtStep = masterChords[stepIdx];
                  const isSoundingInMaster = isColumnActive && masterChordAtStep?.sourceScaleId === scale.id;
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
                        style={isSoundingInMaster ? { backgroundColor: scale.color } : undefined}
                        className={`w-14 sm:w-28 py-2 sm:py-3.5 px-1 sm:px-2 rounded-xl sm:rounded-2xl font-bold font-mono transition-all text-center border-2 relative shadow-sm active:scale-95 ${
                          isSoundingInMaster
                            ? 'text-white border-white ring-3 sm:ring-4 ring-slate-900 scale-105 shadow-xl z-20'
                            : isColumnActive
                            ? 'bg-white/90 border-slate-400 text-slate-800 ring-2 ring-slate-300 opacity-80'
                            : isFirstInCycle
                            ? 'bg-white border-[#c84b31] text-[#c84b31] hover:bg-[#c84b31] hover:text-white'
                            : 'bg-white border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white'
                        }`}
                        title="Click to preview • Double-click to swap into Master"
                      >
                        <div className="text-xs sm:text-lg font-black tracking-tight">
                          {chord.chordName}
                        </div>
                        <div className="text-[9px] sm:text-sm opacity-85 font-mono mt-0.5 font-bold">
                          {chord.romanNumeral}
                        </div>

                        {/* Quick Swap Badge */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            onSwapIntoMaster(chord, stepIdx);
                          }}
                          className="hidden group-hover:flex absolute -top-2 -right-1 bg-slate-900 text-white rounded-full w-5 h-5 items-center justify-center text-[10px] font-bold shadow hover:bg-[#c84b31] border border-white"
                          title="Apply to Master Lane"
                        >
                          ↓
                        </div>
                      </button>

                      {isSoundingInMaster ? (
                        <span className="text-[8px] sm:text-[10px] font-mono font-extrabold text-white bg-slate-900 px-1 sm:px-2 py-0.5 rounded-full mt-1 shadow-sm">
                          ● Active
                        </span>
                      ) : (
                        <span className="text-[9px] sm:text-xs font-mono font-bold text-slate-500 mt-1">
                          #{stepIdx + 1}
                        </span>
                      )}
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
