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
  Link2,
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
  liveRhythmName?: string;
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
  liveRhythmName,
}) => {
  const isStraightMode = grooveStyle === 'sustained';
  const isInheritedActive = selectedGrooveId === 'live_rhythm';

  // Group presets for dropdown
  const livePreset = groovePresets.find((p) => p.id === 'live_rhythm');
  const syncopatedPresets = groovePresets.filter((p) => p.id !== 'live_rhythm' && p.category === 'Syncopated');
  const standardPresets = groovePresets.filter((p) => p.id !== 'live_rhythm' && p.category === 'Standard');
  const symmetricPresets = groovePresets.filter((p) => p.id !== 'live_rhythm' && p.category === 'Symmetric');
  const complexPresets = groovePresets.filter((p) => p.id !== 'live_rhythm' && p.category === 'Complex');

  // Texture styles available during groove playback
  const grooveStylesList: Array<{ id: GrooveStyle; label: string; desc: string }> = [
    {
      id: 'comping',
      label: 'Rhythmic Comping',
      desc: 'Full voicings strike to resultant pulse',
    },
    {
      id: 'bass_chords',
      label: 'Bass & Chords Split',
      desc: 'Downbeat root anchor + upper syncopation',
    },
    {
      id: 'arpeggio',
      label: 'Linear Arpeggio',
      desc: 'Voices cycle sequentially through groove grid',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-900 p-5 shadow-sm space-y-4">
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
            onChange={(e) => {
              onSelectGroove(e.target.value);
              if (isStraightMode) {
                setGrooveStyle('comping');
              }
            }}
            className="text-xs sm:text-sm font-mono font-bold bg-slate-50 border-2 border-slate-900 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#c84b31] shadow-2xs cursor-pointer text-slate-900 max-w-[220px] sm:max-w-xs truncate"
          >
            {livePreset && (
              <optgroup label="Coupled to Rhythm Tab">
                <option value={livePreset.id}>✨ {livePreset.name}</option>
              </optgroup>
            )}
            {syncopatedPresets.length > 0 && (
              <optgroup label="Syncopated &amp; Latin (Claves, Swing, Dance)">
                {syncopatedPresets.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </optgroup>
            )}
            {standardPresets.length > 0 && (
              <optgroup label="Standard Polyrhythms (Hemiolas &amp; Fundamentals)">
                {standardPresets.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </optgroup>
            )}
            {symmetricPresets.length > 0 && (
              <optgroup label="Symmetric &amp; Fractional Axis">
                {symmetricPresets.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </optgroup>
            )}
            {complexPresets.length > 0 && (
              <optgroup label="Complex &amp; Asymmetric Pulses">
                {complexPresets.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </div>
      </div>

      {/* Top 2-Button Mode Toggle: Groove vs Straight */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Groove Button */}
        <button
          onClick={() => {
            if (isStraightMode) {
              setGrooveStyle('comping');
            }
          }}
          className={`p-3.5 rounded-xl border-2 transition-all text-left flex items-center justify-between gap-3 shadow-2xs active:scale-98 ${
            !isStraightMode
              ? 'bg-[#fdf0ec] border-[#c84b31] ring-2 ring-[#c84b31]/30 text-slate-900'
              : 'bg-slate-50 border-slate-300 hover:border-slate-800 text-slate-700 hover:bg-white'
          }`}
          title="Play chord progression with rhythmic groove and pulse articulation"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className={`p-2 rounded-lg shrink-0 ${!isStraightMode ? 'bg-[#c84b31] text-white' : 'bg-slate-200 text-slate-700'}`}>
              <Activity className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-extrabold font-mono flex items-center gap-1.5 truncate">
                <span>Groove</span>
              </div>
              <div className="text-[11px] text-slate-500 font-sans truncate">
                Pattern: <strong className="text-slate-800">{activeGroove.name}</strong>
              </div>
            </div>
          </div>
          {!isStraightMode && (
            <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-[#c84b31] text-white shrink-0">
              ACTIVE
            </span>
          )}
        </button>

        {/* Straight Button */}
        <button
          onClick={() => setGrooveStyle('sustained')}
          className={`p-3.5 rounded-xl border-2 transition-all text-left flex items-center justify-between gap-3 shadow-2xs active:scale-98 ${
            isStraightMode
              ? 'bg-slate-900 border-slate-900 ring-2 ring-slate-900/30 text-white'
              : 'bg-slate-50 border-slate-300 hover:border-slate-800 text-slate-700 hover:bg-white'
          }`}
          title="Play whole-measure sustained chord pads with rhythm muted"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className={`p-2 rounded-lg shrink-0 ${isStraightMode ? 'bg-amber-400 text-slate-900' : 'bg-slate-200 text-slate-700'}`}>
              <VolumeX className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-extrabold font-mono truncate">
                <span>Straight</span>
              </div>
              <div className={`text-[11px] truncate ${isStraightMode ? 'text-slate-300' : 'text-slate-500'}`}>
                Whole-measure chord pads &bull; Rhythm muted
              </div>
            </div>
          </div>
          {isStraightMode && (
            <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 shrink-0">
              ACTIVE
            </span>
          )}
        </button>
      </div>

      {/* Dynamic Status Readout Banner */}
      {isStraightMode ? (
        <div className="bg-slate-100 border-2 border-slate-300 rounded-xl p-3 flex items-center gap-2.5 text-xs font-mono text-slate-700">
          <VolumeX className="w-4 h-4 text-slate-600 shrink-0" />
          <span>
            <strong>Straight Mode Active:</strong> Chords sustain as ambient whole-measure voicings without rhythmic pulses or percussion.
          </span>
        </div>
      ) : isInheritedActive ? (
        <div className="bg-[#fdf0ec] border-2 border-[#c84b31]/40 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-slate-900">
          <div className="flex items-center gap-2 truncate">
            <Link2 className="w-4 h-4 text-[#c84b31] shrink-0" />
            <span className="truncate">
              <strong>Coupled with Rhythm Tab:</strong> Articulating progression with <strong>{liveRhythmName || 'Live Rhythm'}</strong> ({activeGroove.totalLength} ticks cycle).
            </span>
          </div>
          <span className="text-[11px] text-[#c84b31] font-bold shrink-0">
            Real-time synchronization
          </span>
        </div>
      ) : (
        <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-slate-700">
          <div className="flex items-center gap-2 truncate">
            <Sparkles className="w-4 h-4 text-[#c84b31] shrink-0" />
            <span className="truncate">
              <strong>Active Groove Preset:</strong> {activeGroove.name} ({activeGroove.totalLength} ticks) &bull; {activeGroove.description}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-bold shrink-0">
            {activeGroove.category}
          </span>
        </div>
      )}

      {/* Main Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Left: Texture Realization Modes */}
        <div className="lg:col-span-8 space-y-2">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            Realization Texture (Groove Style):
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {grooveStylesList.map((st) => {
              const isSelected = !isStraightMode && grooveStyle === st.id;
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
          <label className={`flex items-center justify-between select-none ${isStraightMode ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
            <span className="text-xs font-mono font-bold text-slate-800 flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-[#c84b31]" />
              Percussion Bed
            </span>
            <input
              type="checkbox"
              disabled={isStraightMode}
              checked={isStraightMode ? false : includePercussion}
              onChange={(e) => setIncludePercussion(e.target.checked)}
              className="w-4 h-4 text-[#c84b31] rounded border-slate-300 focus:ring-[#c84b31] cursor-pointer"
            />
          </label>

          {/* Active Groove Duration Series Badges */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between">
              <span>{isStraightMode ? 'Measure Length:' : 'Resultant Durations:'}</span>
              <span className="font-bold text-slate-700">
                {activeGroove.totalLength} ticks
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {isStraightMode ? (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border bg-white text-slate-600 border-slate-300">
                  1 &times; {activeGroove.totalLength}t (Sustained whole chord)
                </span>
              ) : (
                activeGroove.durations.map((dur, idx) => {
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
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
