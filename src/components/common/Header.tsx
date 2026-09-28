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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 sm:py-2.5 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-3">
        {/* Brand & Title */}
        <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-base sm:text-xl shadow-sm border-2 border-slate-900">
              S
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-sm sm:text-lg font-black text-slate-900 tracking-tight font-mono">
                  SCHILLINGER TOOLS
                </span>
                <span className="text-[10px] sm:text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-[#fdf0ec] text-[#c84b31] border border-[#c84b31]/40">
                  STUDIO
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-sans hidden lg:block">
                Interactive Mathematical Music Composition
              </p>
            </div>
          </div>

          {/* Quick tab toggle for mobile right in top bar if needed, or tabs below */}
        </div>

        {/* Global Taskbar Transport & Master Volume Control (Standardized Fixed Width Pill) */}
        <div className="flex items-center gap-2 bg-slate-50 px-2.5 py-1 sm:py-1.5 rounded-2xl border-2 border-slate-900 shadow-2xs">
          {/* Standardized Transport Section with Fixed Width */}
          <div className="w-[185px] sm:w-[220px] flex items-center justify-between">
            {/* Rhythm Studio Transport Controls */}
            {activeTab === 'rhythm' && (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={isPlayingRhythm ? onPauseRhythm : onPlayRhythm}
                    className={`w-18 sm:w-20 py-1 sm:py-1.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1 text-white transition-all active:scale-95 shadow-2xs ${
                      isPlayingRhythm ? 'bg-[#c84b31] hover:bg-[#b03e26]' : 'bg-slate-900 hover:bg-slate-800'
                    }`}
                    title={isPlayingRhythm ? 'Pause' : 'Play'}
                  >
                    {isPlayingRhythm ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isPlayingRhythm ? 'Pause' : 'Play'}</span>
                  </button>

                  <button
                    onClick={onStopRhythm}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white border-2 border-slate-300 hover:border-slate-800 flex items-center justify-center text-slate-700 active:scale-95 transition-all shadow-2xs"
                    title="Reset to Tick 0"
                  >
                    <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>

                <span className="text-[11px] sm:text-xs font-mono font-extrabold text-slate-900 pl-1 text-right">
                  {rhythmActiveTick}/{rhythmTotalLength}t
                </span>
              </div>
            )}

            {/* Harmony & Scales Transport Controls */}
            {activeTab === 'harmony' && (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1">
                  <button
                    onClick={onStepBackHarmony}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white border-2 border-slate-300 hover:border-slate-800 flex items-center justify-center text-slate-700 active:scale-95 transition-all shadow-2xs"
                    title="Previous Chord"
                  >
                    <SkipBack className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>

                  <button
                    onClick={isPlayingHarmony ? onPauseHarmony : onPlayHarmony}
                    className={`w-18 sm:w-20 py-1 sm:py-1.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1 text-white transition-all active:scale-95 shadow-2xs ${
                      isPlayingHarmony ? 'bg-[#c84b31] hover:bg-[#b03e26]' : 'bg-slate-900 hover:bg-slate-800'
                    }`}
                    title={isPlayingHarmony ? 'Pause Progression' : 'Play Progression'}
                  >
                    {isPlayingHarmony ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isPlayingHarmony ? 'Pause' : 'Play'}</span>
                  </button>

                  <button
                    onClick={onStepForwardHarmony}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white border-2 border-slate-300 hover:border-slate-800 flex items-center justify-center text-slate-700 active:scale-95 transition-all shadow-2xs"
                    title="Next Chord"
                  >
                    <SkipForward className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>

                <span className="text-[11px] sm:text-xs font-mono font-extrabold text-slate-900 pl-1 text-right">
                  {harmonyCurrentIndex + 1}/{harmonyTotalChords}
                </span>
              </div>
            )}

            {/* Theory Primer Placeholder / Info */}
            {activeTab === 'theory' && (
              <div className="flex items-center justify-between w-full text-slate-500 text-xs font-mono font-bold px-1">
                <span>Theory Guide</span>
                <span>Reference</span>
              </div>
            )}
          </div>

          {/* Master Volume Slider (Consistent across tabs) */}
          <div className="flex items-center gap-1.5 sm:gap-2 border-l-2 border-slate-200 pl-2 sm:pl-3">
            <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c84b31]" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={masterVolume}
              onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
              className="w-16 sm:w-20 h-1.5 sm:h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#c84b31]"
              title="Master Volume"
            />
            <span className="text-[11px] sm:text-xs font-mono font-bold text-slate-700 w-7 sm:w-8 text-right">
              {Math.round(masterVolume * 100)}%
            </span>
          </div>
        </div>

        {/* Studio Module Navigation Tabs */}
        <nav className="flex items-center bg-slate-100 p-1 rounded-xl sm:rounded-2xl border-2 border-slate-900 w-full md:w-auto justify-center">
          <button
            onClick={() => setActiveTab('rhythm')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-extrabold font-mono transition-all ${
              activeTab === 'rhythm'
                ? 'bg-white text-slate-950 shadow-sm border-2 border-slate-300'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Music className="w-3.5 h-3.5 text-[#c84b31]" />
            <span>Rhythm</span>
          </button>

          <button
            onClick={() => setActiveTab('harmony')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-extrabold font-mono transition-all ${
              activeTab === 'harmony'
                ? 'bg-white text-slate-950 shadow-sm border-2 border-slate-300'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-sky-600" />
            <span>Harmony</span>
          </button>

          <button
            onClick={() => setActiveTab('theory')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-extrabold font-mono transition-all ${
              activeTab === 'theory'
                ? 'bg-white text-slate-950 shadow-sm border-2 border-slate-300'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>Theory</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
