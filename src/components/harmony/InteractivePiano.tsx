import React from 'react';
import { NOTE_NAMES } from '../../core/harmony/engine';

interface InteractivePianoProps {
  activeMidiNotes: number[]; // Voiced notes e.g. [48, 60, 64, 67, 71]
  onPlayNote?: (midi: number) => void;
}

export const InteractivePiano: React.FC<InteractivePianoProps> = ({
  activeMidiNotes,
  onPlayNote,
}) => {
  // 2 Octaves: C3 (48) to B4 (71), or C3 (48) to C5 (72)
  const startMidi = 48; // C3
  const endMidi = 72;   // C5

  const whiteKeys: number[] = [];
  const blackKeys: { midi: number; leftPercent: number }[] = [];

  const isBlackKey = (midi: number) => {
    const pc = midi % 12;
    return pc === 1 || pc === 3 || pc === 6 || pc === 8 || pc === 10;
  };

  for (let m = startMidi; m <= endMidi; m++) {
    if (!isBlackKey(m)) {
      whiteKeys.push(m);
    }
  }

  // Calculate black key horizontal placement relative to white keys
  let whiteIndex = 0;
  for (let m = startMidi; m < endMidi; m++) {
    if (isBlackKey(m)) {
      // It sits between previous white key and next white key
      const leftPercent = ((whiteIndex - 0.35) / whiteKeys.length) * 100;
      blackKeys.push({ midi: m, leftPercent });
    } else {
      whiteIndex++;
    }
  }

  const activeSet = new Set(activeMidiNotes);

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-900 p-4 shadow-sm space-y-2">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
          Piano Keyboard Voicing (C3 – C5)
        </span>
        <span className="text-xs font-mono text-slate-500">
          {activeMidiNotes.length > 0
            ? activeMidiNotes.map((m) => `${NOTE_NAMES[m % 12]}${Math.floor(m / 12) - 1}`).join(' • ')
            : 'Select or play a chord'}
        </span>
      </div>

      {/* Keyboard SVG / Canvas Container */}
      <div className="relative w-full h-24 select-none pt-1">
        {/* White Keys */}
        <div className="flex w-full h-full">
          {whiteKeys.map((midi) => {
            const isActive = activeSet.has(midi);
            const isBass = activeMidiNotes[0] === midi;
            const noteName = NOTE_NAMES[midi % 12];

            return (
              <button
                key={`white-${midi}`}
                onClick={() => onPlayNote?.(midi)}
                className={`flex-1 h-full border-r border-b border-slate-300 rounded-b-md flex flex-col justify-end items-center pb-1.5 transition-all text-[11px] font-mono font-extrabold ${
                  isActive
                    ? isBass
                      ? 'bg-[#c84b31] text-white border-2 border-[#c84b31] shadow-md z-1 scale-y-105'
                      : 'bg-sky-500 text-white border-2 border-sky-600 shadow-md z-1 scale-y-105'
                    : 'bg-white hover:bg-slate-50 text-slate-400'
                }`}
                title={`${noteName}${Math.floor(midi / 12) - 1} (${midi})`}
              >
                {isActive ? noteName : ''}
              </button>
            );
          })}
        </div>

        {/* Black Keys */}
        {blackKeys.map(({ midi, leftPercent }) => {
          const isActive = activeSet.has(midi);
          const isBass = activeMidiNotes[0] === midi;
          const noteName = NOTE_NAMES[midi % 12];

          return (
            <button
              key={`black-${midi}`}
              onClick={() => onPlayNote?.(midi)}
              style={{ left: `${leftPercent}%`, width: `${(1 / whiteKeys.length) * 70}%` }}
              className={`absolute top-1 h-[60%] rounded-b-sm z-10 flex flex-col justify-end items-center pb-1 transition-all text-[10px] font-mono font-extrabold shadow-md ${
                isActive
                  ? isBass
                    ? 'bg-[#c84b31] text-white border-2 border-white ring-2 ring-[#c84b31]'
                    : 'bg-amber-400 text-slate-950 border-2 border-white ring-2 ring-amber-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title={`${noteName}${Math.floor(midi / 12) - 1} (${midi})`}
            >
              {isActive ? noteName : ''}
            </button>
          );
        })}
      </div>
    </div>
  );
};
