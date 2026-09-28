import React from 'react';
import { Music, Layers, BookOpen, Play, Pause, RotateCcw } from 'lucide-react';

interface HeaderProps {
  activeTab: 'rhythm' | 'harmony' | 'theory';
  setActiveTab: (tab: 'rhythm' | 'harmony' | 'theory') => void;
  // Global Rhythm Transport for sticky access
  isPlayingRhythm: boolean;
  onPlayRhythm: () => void;
  onPauseRhythm: () => void;
  onStopRhythm: () => void;
  rhythmActiveTick: number;
  rhythmTotalLength: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isPlayingRhythm,
  onPlayRhythm,
  onPauseRhythm,
  onStopRhythm,
  rhythmActiveTick,
  rhythmTotalLength,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-slate-900 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm border border-slate-900">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-slate-900 tracking-tight">
                  SCHILLINGER TOOLS
                </span>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-[#fdf0ec] text-[#c84b31] border border-[#c84b31]/40">
                  STUDIO
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-sans hidden sm:block">
                The Schillinger System of Musical Composition
              </p>
            </div>
          </div>

          {/* Sticky Transport Pill for Rhythm Tab */}
          {activeTab === 'rhythm' && (
            <div className="flex items-center gap-2 bg-slate-100 px-2.5 py-1.5 rounded-full border-2 border-slate-900 shadow-2xs">
              <button
                onClick={isPlayingRhythm ? onPauseRhythm : onPlayRhythm}
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-white transition-all active:scale-95 ${
                  isPlayingRhythm ? 'bg-[#c84b31]' : 'bg-slate-900'
                }`}
                title={isPlayingRhythm ? 'Pause' : 'Play'}
              >
                {isPlayingRhythm ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />}
              </button>
              <button
                onClick={onStopRhythm}
                className="w-7 h-7 rounded-full bg-white border border-slate-300 hover:border-slate-800 flex items-center justify-center text-slate-700 active:scale-95 transition-all"
                title="Reset"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
              <span className="text-[11px] font-mono font-bold text-slate-900 px-1">
                {rhythmActiveTick}/{rhythmTotalLength}t
              </span>
            </div>
          )}
        </div>

        {/* Tab Selector */}
        <nav className="flex items-center bg-slate-100 p-1 rounded-2xl border-2 border-slate-900 w-full sm:w-auto justify-center">
          <button
            onClick={() => setActiveTab('rhythm')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'rhythm'
                ? 'bg-white text-slate-950 shadow-sm border border-slate-300'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Music className="w-3.5 h-3.5 text-[#c84b31]" />
            <span>Rhythm Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('harmony')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'harmony'
                ? 'bg-white text-slate-950 shadow-sm border border-slate-300'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-sky-600" />
            <span>Harmony & Scales</span>
          </button>

          <button
            onClick={() => setActiveTab('theory')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'theory'
                ? 'bg-white text-slate-950 shadow-sm border border-slate-300'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>Theory Primer</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
