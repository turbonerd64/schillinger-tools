import React, { useState } from 'react';
import { audioService } from '../../core/audio/synth';
import { Volume2, VolumeX, Sliders } from 'lucide-react';

interface VolumeMixerProps {
  is3Part: boolean;
}

export const VolumeMixer: React.FC<VolumeMixerProps> = ({ is3Part }) => {
  const [masterVol, setMasterVol] = useState<number>(0.85);
  const [mixerState, setMixerState] = useState({
    a: { muted: false, solo: false, volume: 0.8 },
    b: { muted: false, solo: false, volume: 0.8 },
    c: { muted: false, solo: false, volume: 0.8 },
    resultant: { muted: false, solo: false, volume: 0.95 },
  });

  const handleMasterVolume = (vol: number) => {
    setMasterVol(vol);
    audioService.setMasterVolume(vol);
  };

  const toggleMute = (channel: 'a' | 'b' | 'c' | 'resultant') => {
    const nextMuted = !mixerState[channel].muted;
    setMixerState((prev) => ({
      ...prev,
      [channel]: { ...prev[channel], muted: nextMuted },
    }));
    audioService.channels[channel].muted = nextMuted;
  };

  const handleVolume = (channel: 'a' | 'b' | 'c' | 'resultant', vol: number) => {
    setMixerState((prev) => ({
      ...prev,
      [channel]: { ...prev[channel], volume: vol },
    }));
    audioService.channels[channel].volume = vol;
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-900 p-4 shadow-sm space-y-3">
      {/* Header with Master Volume */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-[#c84b31]" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Track Volumes & Output
          </h3>
        </div>

        {/* Master Volume */}
        <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <span className="text-xs font-mono font-bold text-slate-900">Master Vol</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={masterVol}
            onChange={(e) => handleMasterVolume(parseFloat(e.target.value))}
            className="w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#c84b31]"
          />
          <span className="text-[11px] font-mono font-bold text-slate-500 w-8">
            {Math.round(masterVol * 100)}%
          </span>
        </div>
      </div>

      {/* Compact Channel Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {/* Gen a */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold font-mono">
            <span className="text-sky-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-600"></span>
              Gen a
            </span>
            <button
              onClick={() => toggleMute('a')}
              className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                mixerState.a.muted ? 'bg-red-500 text-white' : 'bg-white border border-slate-300 text-slate-600'
              }`}
            >
              MUTE
            </button>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={mixerState.a.volume}
            onChange={(e) => handleVolume('a', parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-200 rounded appearance-none accent-sky-600 cursor-pointer"
          />
        </div>

        {/* Gen b */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold font-mono">
            <span className="text-rose-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              Gen b
            </span>
            <button
              onClick={() => toggleMute('b')}
              className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                mixerState.b.muted ? 'bg-red-500 text-white' : 'bg-white border border-slate-300 text-slate-600'
              }`}
            >
              MUTE
            </button>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={mixerState.b.volume}
            onChange={(e) => handleVolume('b', parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-200 rounded appearance-none accent-rose-600 cursor-pointer"
          />
        </div>

        {/* Resultant r */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold font-mono">
            <span className="text-[#c84b31] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#c84b31]"></span>
              Resultant r
            </span>
            <button
              onClick={() => toggleMute('resultant')}
              className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                mixerState.resultant.muted ? 'bg-red-500 text-white' : 'bg-white border border-slate-300 text-slate-600'
              }`}
            >
              MUTE
            </button>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={mixerState.resultant.volume}
            onChange={(e) => handleVolume('resultant', parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-200 rounded appearance-none accent-[#c84b31] cursor-pointer"
          />
        </div>

        {/* Gen c (if 3-part) */}
        {is3Part && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold font-mono">
              <span className="text-purple-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                Gen c
              </span>
              <button
                onClick={() => toggleMute('c')}
                className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                  mixerState.c.muted ? 'bg-red-500 text-white' : 'bg-white border border-slate-300 text-slate-600'
                }`}
              >
                MUTE
              </button>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={mixerState.c.volume}
              onChange={(e) => handleVolume('c', parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded appearance-none accent-purple-600 cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
};
