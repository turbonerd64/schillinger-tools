import React from 'react';
import { NOTE_NAMES } from '../../core/harmony/engine';

interface InteractiveFretboardProps {
  activePitchClasses: number[];
  rootPitchClass: number;
}

// Standard Guitar Tuning: E2 (4), A2 (9), D3 (2), G3 (7), B3 (11), E4 (4)
const STRING_TUNINGS = [4, 11, 7, 2, 9, 4]; // High E down to Low E
const STRING_NAMES = ['e', 'B', 'G', 'D', 'A', 'E'];
const FRETS = 12;

export const InteractiveFretboard: React.FC<InteractiveFretboardProps> = ({
  activePitchClasses,
  rootPitchClass,
}) => {
  const activeSet = new Set(activePitchClasses);

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-900 p-4 shadow-sm space-y-2">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
          Guitar Fretboard (12 Frets)
        </span>
        <span className="text-xs font-mono text-slate-500">
          Root: <strong className="text-[#c84b31]">{NOTE_NAMES[rootPitchClass]}</strong>
        </span>
      </div>

      <div className="overflow-x-auto w-full py-1">
        <div className="min-w-[620px] bg-slate-50 border border-slate-200 rounded-xl p-3 relative">
          {/* Strings */}
          <div className="space-y-3 relative">
            {STRING_TUNINGS.map((openPc, stringIdx) => (
              <div key={`string-${stringIdx}`} className="flex items-center relative h-6">
                {/* String name indicator */}
                <span className="w-5 text-xs font-bold font-mono text-slate-500 select-none">
                  {STRING_NAMES[stringIdx]}
                </span>

                {/* Horizontal String Line */}
                <div
                  className="flex-1 flex items-center relative"
                  style={{
                    borderBottom: `${1 + stringIdx * 0.4}px solid #94a3b8`,
                  }}
                >
                  {/* Frets along string */}
                  {Array.from({ length: FRETS + 1 }).map((_, fret) => {
                    const pc = (openPc + fret) % 12;
                    const isActive = activeSet.has(pc);
                    const isRoot = pc === rootPitchClass;
                    const noteName = NOTE_NAMES[pc];

                    return (
                      <div
                        key={`fret-${fret}`}
                        className="flex-1 flex justify-center items-center relative border-r border-slate-300 h-6"
                      >
                        {isActive && (
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold font-mono text-white shadow-sm z-10 transition-transform ${
                              isRoot ? 'bg-[#c84b31]' : 'bg-slate-900'
                            }`}
                          >
                            {noteName}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Fret Number Markers */}
          <div className="flex items-center mt-2 pl-5 text-[10px] font-mono text-slate-400">
            {Array.from({ length: FRETS + 1 }).map((_, fret) => (
              <div key={`fret-num-${fret}`} className="flex-1 text-center">
                {fret === 0 ? 'Open' : fret === 3 || fret === 5 || fret === 7 || fret === 9 || fret === 12 ? fret : ''}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
