import React from 'react';
import { Sparkles, Music, Sliders, Layers, Info } from 'lucide-react';

interface HeaderProps {
  activeTab: 'rhythm' | 'harmony' | 'theory';
  setActiveTab: (tab: 'rhythm' | 'harmony' | 'theory') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="border-b border-schillinger-border bg-schillinger-panel/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-schillinger-accentA via-schillinger-resultant to-schillinger-accentB p-0.5 shadow-lg shadow-schillinger-accentA/10 flex items-center justify-center">
            <div className="w-full h-full bg-schillinger-bg rounded-[10px] flex items-center justify-center">
              <span className="text-xl font-bold bg-gradient-to-r from-schillinger-accentA to-schillinger-resultant bg-clip-text text-transparent">
                S
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                SCHILLINGER TOOLS
                <span className="text-[10px] uppercase tracking-widest font-mono bg-schillinger-resultant/15 text-schillinger-resultant px-2 py-0.5 rounded-full border border-schillinger-resultant/30">
                  Studio v1.0
                </span>
              </h1>
            </div>
            <p className="text-xs text-schillinger-textMuted font-mono">
              The Schillinger System of Musical Composition
            </p>
          </div>
        </div>

        {/* Modular Suite Navigation */}
        <nav className="flex items-center bg-schillinger-card/90 p-1 rounded-xl border border-schillinger-border">
          <button
            onClick={() => setActiveTab('rhythm')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'rhythm'
                ? 'bg-schillinger-border text-white shadow-sm'
                : 'text-schillinger-textMuted hover:text-white'
            }`}
          >
            <Music className="w-3.5 h-3.5 text-schillinger-accentA" />
            <span>Book I: Rhythm Resultants</span>
          </button>

          <button
            onClick={() => setActiveTab('harmony')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all relative ${
              activeTab === 'harmony'
                ? 'bg-schillinger-border text-white shadow-sm'
                : 'text-schillinger-textMuted hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-schillinger-accentB" />
            <span>Harmony & Scales</span>
            <span className="bg-schillinger-accentB/20 text-schillinger-accentB text-[9px] px-1.5 py-0.2 rounded font-mono">
              Module 2
            </span>
          </button>

          <button
            onClick={() => setActiveTab('theory')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'theory'
                ? 'bg-schillinger-border text-white shadow-sm'
                : 'text-schillinger-textMuted hover:text-white'
            }`}
          >
            <Info className="w-3.5 h-3.5 text-schillinger-resultant" />
            <span>Book I Primer</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
