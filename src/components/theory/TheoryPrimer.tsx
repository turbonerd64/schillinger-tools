import React from 'react';
import { BookOpen, Sparkles, Compass, Split, Layers, Music } from 'lucide-react';

export const TheoryPrimer: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro */}
      <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-[#c84b31]" />
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            The Schillinger System &bull; Theoretical Primer
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Developed by theorist and mathematician Joseph Schillinger, the system replaces trial-and-error composition with an objective, coordinate-based methodology. All musical elements—rhythm, scales, chord progressions, and voice leading—are derived through periodic interferences, cyclic modular arithmetic, and geometric projections.
        </p>
      </div>

      {/* Grid of Core Foundations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Binary Synchronization */}
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 font-mono text-xs font-bold flex items-center justify-center border border-sky-300">
              1
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              Binary Synchronization (a ÷ b)
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Two periodicities (major generator <em>a</em> and minor generator <em>b</em>) interfere over a common product cycle of <code className="text-sky-700 font-mono font-bold">L = a × b</code>.
            The union of attack points yields the <strong>resultant</strong> sequence of durations.
          </p>
        </div>

        {/* Fractioning */}
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 font-mono text-xs font-bold flex items-center justify-center border border-rose-300">
              2
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              Fractioning (a ÷ b̲)
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            When standard binary synchronization produces too much variety, fractioning provides higher internal uniformity.
            The total cycle length is <code className="text-rose-700 font-mono font-bold">L = a²</code>.
            The minor generator runs in <code className="text-rose-700 font-mono font-bold">N_b = a - b + 1</code> batches, each starting at consecutive phases of <em>a</em>.
          </p>
        </div>

        {/* Coincidence of Phase */}
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#fdf0ec] text-[#c84b31] font-mono text-xs font-bold flex items-center justify-center border border-[#c84b31]/40">
              3
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              Coincidence of Phase & Accents
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Accents are not arbitrary or forced; they occur naturally wherever an attack of generator <em>a</em> and an attack of generator <em>b</em> land on the exact same tick.
            This physical superposition creates organic musical meter and drive.
          </p>
        </div>

        {/* Harmonic Root Cycles */}
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 font-mono text-xs font-bold flex items-center justify-center border border-amber-300">
              4
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              Harmonic Root Cycles (C3, C5, C7)
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Rather than confining progressions to traditional functional tonic-subdominant-dominant rules, root movement is governed by cyclic steps through arbitrary parent scales (Church modes, synthetic scales, and symmetric divisions).
          </p>
        </div>
      </div>
    </div>
  );
};
