import React, { useState, useEffect } from 'react';
import { audioService } from '../../core/audio/synth';
import { Play, Pause, RotateCcw, Repeat, Volume2, VolumeX, Radio } from 'lucide-react';

interface TransportMixerProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  bpm: number;
  setBpm: (val: number) => void;
  is3Part: boolean;
}

export const TransportMixer: React.FC<TransportMixerProps> = ({
  isPlaying,
  onPlay,
  onPause,
  onStop,
  bpm,
  setBpm,
  is3Part,
}) => {
  const [tapTimes, setTapTimes] = useState<number[]>([]);
  const [mixerState, setMixerState] = useState({
    a: { muted: false, solo: false, volume: 0.8 },
    b: { muted: false, solo: false, volume: 0.8 },
    c: { muted: false, solo: false, volume: 0.8 },
    resultant: { muted: false, solo: false, volume: 0.95 },
  });

  const handleTapTempo = () => {
    const now = Date.now();
    const recentTaps = [...tapTimes.filter((t) => now - t < 3000), now];
    setTapTimes(recentTaps);

    if (recentTaps.length >= 2) {
      const intervals = [];
      for (let i = 1; i < recentTaps.length; i++) {
        intervals.push(recentTaps[i] - recentTaps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      if (calculatedBpm >= 40 && calculatedBpm <= 260) {
        setBpm(calculatedBpm);
        audioService.setBpm(calculatedBpm);
      }
    }
  };

  const toggleMute = (channel: 'a' | 'b' | 'c' | 'resultant') => {
    const nextMuted = !mixerState[channel].muted;
    setMixerState((prev) => ({
      ...prev,
      [channel]: { ...prev[channel], muted: nextMuted },
    }));
    audioService.channels[channel].muted = nextMuted;
  };

  const toggleSolo = (channel: 'a' | 'b' | 'c' | 'resultant') => {
    const nextSolo = !mixerState[channel].solo;
    setMixerState((prev) => ({
      ...prev,
      [channel]: { ...prev[channel], solo: nextSolo },
    }));
    audioService.channels[channel].solo = nextSolo;
  };

  const handleVolume = (channel: 'a' | 'b' | 'c' | 'resultant', vol: number) => {
    setMixerState((prev) => ({
      ...prev,
      [channel]: { ...prev[channel], volume: vol },
    }));
    audioService.channels[channel].volume = vol;
  };

  return (
    <div className="bg-schillinger-card rounded-2xl border border-schillinger-border p-5 shadow-xl space-y-6">
      {/* Transport Controls Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-schillinger-border/60 pb-4">
        {/* Main Playback Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={isPlaying ? onPause : onPlay}
            className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all shadow-lg active:scale-95 ${
              isPlaying
                ? 'bg-schillinger-accentB text-white shadow-schillinger-accentB/20'
                : 'bg-schillinger-accentA text-black font-bold shadow-schillinger-accentA/20 hover:brightness-110'
            }`}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
          </button>

          <button
            onClick={onStop}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-schillinger-panel border border-schillinger-border text-schillinger-textMuted hover:text-white transition-all active:scale-95"
            title="Reset to phase zero"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Tempo / BPM Controls */}
        <div className="flex items-center gap-4 bg-schillinger-panel/80 px-4 py-2 rounded-xl border border-schillinger-border w-full sm:w-auto">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-mono text-schillinger-textMuted">Tempo</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono text-white">{bpm}</span>
              <span className="text-[10px] font-mono text-schillinger-textMuted">BPM</span>
            </div>
          </div>

          <input
            type="range"
            min={40}
            max={240}
            value={bpm}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setBpm(val);
              audioService.setBpm(val);
            }}
            className="w-24 sm:w-32 h-1.5 bg-schillinger-grid rounded-lg appearance-none cursor-pointer accent-schillinger-accentA"
          />

          <button
            onClick={handleTapTempo}
            className="px-2.5 py-1 text-xs font-mono bg-schillinger-bg hover:bg-schillinger-border border border-schillinger-border rounded-lg text-gray-300 active:scale-95 transition-all"
          >
            TAP
          </button>
        </div>
      </div>

      {/* Track Mixer Rows */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-schillinger-textMuted uppercase tracking-wider">
          <span>Acoustic Track Mixer</span>
          <span className="text-[11px] text-gray-500 font-sans">Physical Resonant Models</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Channel A */}
          <div className="bg-schillinger-panel/90 border border-schillinger-border rounded-xl p-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-schillinger-accentA flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-schillinger-accentA"></span>
                Gen a (Low Block)
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleMute('a')}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                    mixerState.a.muted ? 'bg-red-500/30 text-red-400 border border-red-500/50' : 'bg-schillinger-bg text-gray-400 border border-schillinger-border'
                  }`}
                >
                  M
                </button>
                <button
                  onClick={() => toggleSolo('a')}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                    mixerState.a.solo ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50' : 'bg-schillinger-bg text-gray-400 border border-schillinger-border'
                  }`}
                >
                  S
                </button>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={mixerState.a.volume}
              onChange={(e) => handleVolume('a', parseFloat(e.target.value))}
              className="w-full h-1 bg-schillinger-grid rounded appearance-none accent-schillinger-accentA cursor-pointer"
            />
          </div>

          {/* Channel B */}
          <div className="bg-schillinger-panel/90 border border-schillinger-border rounded-xl p-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-schillinger-accentB flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-schillinger-accentB"></span>
                Gen b (High Rim)
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleMute('b')}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                    mixerState.b.muted ? 'bg-red-500/30 text-red-400 border border-red-500/50' : 'bg-schillinger-bg text-gray-400 border border-schillinger-border'
                  }`}
                >
                  M
                </button>
                <button
                  onClick={() => toggleSolo('b')}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                    mixerState.b.solo ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50' : 'bg-schillinger-bg text-gray-400 border border-schillinger-border'
                  }`}
                >
                  S
                </button>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={mixerState.b.volume}
              onChange={(e) => handleVolume('b', parseFloat(e.target.value))}
              className="w-full h-1 bg-schillinger-grid rounded appearance-none accent-schillinger-accentB cursor-pointer"
            />
          </div>

          {/* Channel Resultant */}
          <div className="bg-schillinger-panel/90 border border-schillinger-border rounded-xl p-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-schillinger-resultant flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-schillinger-resultant"></span>
                Resultant r (Clave)
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleMute('resultant')}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                    mixerState.resultant.muted ? 'bg-red-500/30 text-red-400 border border-red-500/50' : 'bg-schillinger-bg text-gray-400 border border-schillinger-border'
                  }`}
                >
                  M
                </button>
                <button
                  onClick={() => toggleSolo('resultant')}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                    mixerState.resultant.solo ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50' : 'bg-schillinger-bg text-gray-400 border border-schillinger-border'
                  }`}
                >
                  S
                </button>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={mixerState.resultant.volume}
              onChange={(e) => handleVolume('resultant', parseFloat(e.target.value))}
              className="w-full h-1 bg-schillinger-grid rounded appearance-none accent-schillinger-resultant cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
