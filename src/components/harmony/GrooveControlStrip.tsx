import React from 'react';
import {
  GrooveStyle,
  HarmonyGroovePattern,
} from '../../core/harmony/groove';
import {
  Activity,
  Layers,
  Music,
  Radio,
  Sparkles,
  Volume2,
  VolumeX,
  Check,
} from 'lucide-react';

interface GrooveControlStripProps {
  groovePresets: HarmonyGroovePattern[];
  selectedGrooveId: string;
  onSelectGroove: (grooveId: string) => void;
  grooveStyle: GrooveStyle;
  setGrooveStyle: (style: GrooveStyle) => void;
  includePercussion: boolean;
  setIncludePercussion: (include: boolean) => void;
  activeGroove: HarmonyGroovePattern;
  isStraightHarmony?: boolean;
  onToggleStraightHarmony?: () => void;
}

export const GrooveControlStrip: React.FC<GrooveControlStripProps> = ({
  groovePresets,
  selectedGrooveId,
  onSelectGroove,
  grooveStyle,
  setGrooveStyle,
  includePercussion,
  setIncludePercussion,
  activeGroove,
  isStraightHarmony = false,
  onToggleStraightHarmony,
}) => {
  const stylesList: Array<{ id: GrooveStyle; label: string; desc: string }> = [
    {
      id: 'sustained',
      label: 'Sustained Pad',
      desc: 'Ambient whole-measure sustain',
    },
    {
      id: 'comping',
      label: 'Rhythmic Comping',
      desc: 'Full voicings strike to resultant pulse',
    },
    {
      id: 'bass_chords',
      label: 'Bass & Chords Split',
      desc: 'Downbeat root anchor + syncopated upper comping',
    },
    {
      id: 'arpeggio',
      label: 'Linear Arpeggio',
      desc: 'Voices cycle sequentially through groove grid',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-900 p-5 shadow-sm space-y-4">
      {/* Straight Mode Banner if active */}
      {isStraightHarmony && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs sm:text-sm font-mono text-amber-950 shadow-2xs">
          <div className="flex items-center gap-2">
            <VolumeX className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Straight Mode (Rhythm Muted):</strong> Chords are playing as straight sustained pads without rhythmic groove pulses.
            </span>
          </div>
          {onToggleStraightHarmony && (
            <button
              onClick={onToggleStraightHarmony}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs shadow-2xs transition-all active:scale-95 shrink-0"
            >
              Re-enable Groove
            </button>
          )}
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#c84b31]" />
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wider font-mono">
              Rhythmic Harmony &amp; Groove Coupling (Book I &bull; Book V)
            </h3>
            <p className="text-xs text-slate-500 font-sans">
              Articulate cyclic chord voicings across periodic pulse resultants
            </p>
          </div>
        </div>

        {/* Preset Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="groove-pattern-select" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#c84b31]" />
            Groove Pattern:
          </label>
          <select
            id="groove-pattern-select"
            value={selectedGrooveId}
            onChange={(e) => onSelectGroove(e.target.value)}
            className="text-xs sm:text-sm font-mono font-bold bg-slate-50 border-2 border-slate-900 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#c84b31] shadow-2xs cursor-pointer text-slate-900"
          >
            {groovePresets.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Left: Texture Realization Modes */}
        <div className="lg:col-span-8 space-y-2">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            Realization Texture (Arrangement Style):
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {stylesList.map((st) => {
              const isSelected = grooveStyle === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => setGrooveStyle(st.id)}
                  className={`p-2.5 rounded-xl border-2 text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-mono font-extrabold flex items-center justify-between">
                    <span>{st.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <div className={`text-[10px] mt-1 line-clamp-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {st.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Percussion Backing Toggle & Pattern Metric Readout */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-3 bg-slate-50 p-3 rounded-xl border-2 border-slate-200">
          <label className="flex items-center justify-between cursor-pointer select-none">
            <span className="text-xs font-mono font-bold text-slate-800 flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-[#c84b31]" />
              Percussion Bed
            </span>
            <input
              type="checkbox"
              checked={includePercussion}
              onChange={(e) => setIncludePercussion(e.target.checked)}
              className="w-4 h-4 text-[#c84b31] rounded border-slate-300 focus:ring-[#c84b31] cursor-pointer"
            />
          </label>

          {/* Active Groove Duration Series Badges */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between">
              <span>Resultant Durations ({activeGroove.totalLength} ticks):</span>
              <span className="font-bold text-slate-700">
                {activeGroove.a} ÷ {activeGroove.b}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {activeGroove.durations.map((dur, idx) => {
                const isAccented = activeGroove.accentIndices.includes(idx);
                return (
                  <span
                    key={idx}
                    className={`text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded border ${
                      isAccented
                        ? 'bg-[#fdf0ec] text-[#c84b31] border-[#c84b31]/40'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    {dur}
                    {isAccented ? '>' : ''}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
