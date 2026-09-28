import React from 'react';
import {
  Music,
  Layers,
  BookOpen,
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume2,
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'rhythm' | 'harmony' | 'theory';
  setActiveTab: (tab: 'rhythm' | 'harmony' | 'theory') => void;

  // Master Volume shared across all tools
  masterVolume: number;
  setMasterVolume: (vol: number) => void;

  // Rhythm Transport
  isPlayingRhythm: boolean;
  onPlayRhythm: () => void;
  onPauseRhythm: () => void;
  onStopRhythm: () => void;
  rhythmActiveTick: number;
  rhythmTotalLength: number;

  // Harmony Transport
  isPlayingHarmony: boolean;
  onPlayHarmony: () => void;
  onPauseHarmony: () => void;
  onResetHarmony: () => void;
  onStepBackHarmony: () => void;
  onStepForwardHarmony: () => void;
  harmonyCurrentIndex: number;
  harmonyTotalChords: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  masterVolume,
  setMasterVolume,
  isPlayingRhythm,
  onPlayRhythm,
  onPauseRhythm,
  onStopRhythm,
  rhythmActiveTick,
  rhythmTotalLength,
  isPlayingHarmony,
  onPlayHarmony,
  onPauseHarmony,
  onResetHarmony,
  onStepBackHarmony,
  onStepForwardHarmony,
  harmonyCurrentIndex,
  harmonyTotalChords,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-slate-900 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-xl shadow-sm border-2 border-slate-900">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-slate-900 tracking-tight font-mono">
                SCHILLINGER TOOLS
              </span>
              <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-[#fdf0ec] text-[#c84b31] border border-[#c84b31]/40">
                STUDIO
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans hidden sm:block">
              Interactive Mathematical Music Composition
            </p>
          </div>
        </div>

        {/* Global Taskbar Transport & Master Volume Control */}
        <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-1.5 rounded-2xl border-2 border-slate-900 shadow-2xs">
          {/* Rhythm Studio Transport Controls */}
          {activeTab === 'rhythm' && (
            <div className="flex items-center gap-2">
              <button
                onClick={isPlayingRhythm ? onPauseRhythm : onPlayRhythm}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 text-white transition-all active:scale-95 shadow-2xs ${
                  isPlayingRhythm ? 'bg-[#c84b31] hover:bg-[#b03e26]' : 'bg-slate-900 hover:bg-slate-800'
                }`}
                title={isPlayingRhythm ? 'Pause' : 'Play'}
              >
                {isPlayingRhythm ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPlayingRhythm ? 'Pause' : 'Play'}</span>
              </button>

              <button
                onClick={onStopRhythm}
                className="w-8 h-8 rounded-xl bg-white border-2 border-slate-300 hover:border-slate-800 flex items-center justify-center text-slate-700 active:scale-95 transition-all shadow-2xs"
                title="Reset to Tick 0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <span className="text-xs sm:text-sm font-mono font-bold text-slate-900 px-1.5">
                {rhythmActiveTick}/{rhythmTotalLength}t
              </span>
            </div>
          )}

          {/* Harmony & Scales Transport Controls */}
          {activeTab === 'harmony' && (
            <div className="flex items-center gap-2">
              <button
                onClick={onStepBackHarmony}
                className="w-8 h-8 rounded-xl bg-white border-2 border-slate-300 hover:border-slate-800 flex items-center justify-center text-slate-700 active:scale-95 transition-all shadow-2xs"
                title="Previous Chord"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={isPlayingHarmony ? onPauseHarmony : onPlayHarmony}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 text-white transition-all active:scale-95 shadow-2xs ${
                  isPlayingHarmony ? 'bg-[#c84b31] hover:bg-[#b03e26]' : 'bg-slate-900 hover:bg-slate-800'
                }`}
                title={isPlayingHarmony ? 'Pause Progression' : 'Play Progression'}
              >
                {isPlayingHarmony ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPlayingHarmony ? 'Pause' : 'Play'}</span>
              </button>

              <button
                onClick={onStepForwardHarmony}
                className="w-8 h-8 rounded-xl bg-white border-2 border-slate-300 hover:border-slate-800 flex items-center justify-center text-slate-700 active:scale-95 transition-all shadow-2xs"
                title="Next Chord"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onResetHarmony}
                className="w-8 h-8 rounded-xl bg-white border-2 border-slate-300 hover:border-slate-800 flex items-center justify-center text-slate-700 active:scale-95 transition-all shadow-2xs"
                title="Reset to Chord 1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <span className="text-xs sm:text-sm font-mono font-bold text-slate-900 px-1.5">
                Chord {harmonyCurrentIndex + 1}/{harmonyTotalChords}
              </span>
            </div>
          )}

          {/* Master Volume Slider (Shared on both studios) */}
          <div className="flex items-center gap-2 border-l-2 border-slate-200 pl-3">
            <Volume2 className="w-4 h-4 text-[#c84b31]" />
            <span className="text-xs font-mono font-bold text-slate-600 hidden sm:inline">Vol</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={masterVolume}
              onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
              className="w-20 sm:w-24 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#c84b31]"
              title="Master Volume"
            />
            <span className="text-xs font-mono font-bold text-slate-700 w-8">
              {Math.round(masterVolume * 100)}%
            </span>
          </div>
        </div>

        {/* Studio Module Tabs */}
        <nav className="flex items-center bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-900 w-full md:w-auto justify-center">
          <button
            onClick={() => setActiveTab('rhythm')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'rhythm'
                ? 'bg-white text-slate-950 shadow-sm border-2 border-slate-300'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Music className="w-4 h-4 text-[#c84b31]" />
            <span>Rhythm Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('harmony')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'harmony'
                ? 'bg-white text-slate-950 shadow-sm border-2 border-slate-300'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Layers className="w-4 h-4 text-sky-600" />
            <span>Harmony &amp; Scales</span>
          </button>

          <button
            onClick={() => setActiveTab('theory')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'theory'
                ? 'bg-white text-slate-950 shadow-sm border-2 border-slate-300'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>Theory Primer</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
