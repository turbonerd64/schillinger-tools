import React from 'react';
import { BookOpen, Cpu, Sparkles, Binary, Sliders, CheckCircle } from 'lucide-react';

export const TheoryPrimer: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro */}
      <div className="bg-schillinger-card border border-schillinger-border rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-schillinger-resultant" />
          <h2 className="text-lg font-bold text-white tracking-tight">
            Book I: Theory of Rhythm — Core Principles
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-schillinger-textMuted leading-relaxed">
          In <em>The Schillinger System of Musical Composition</em> (1941), Russian theorist and mathematician Joseph Schillinger demonstrated that conventional musical notation is inadequate for rhythm because it lacks a unified mathematical coordinate system.
          Instead, all musical rhythm can be understood through three parallel representations: <strong>Numbers</strong>, <strong>Graphs</strong>, and <strong>Musical Notes</strong>.
        </p>
      </div>

      {/* Grid of 4 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Binary Synchronization */}
        <div className="bg-schillinger-panel/70 border border-schillinger-border rounded-xl p-5 space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-schillinger-accentA/20 text-schillinger-accentA font-mono text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h3 className="text-sm font-semibold text-white">
              Binary Synchronization (a ÷ b)
            </h3>
          </div>
          <p className="text-xs text-schillinger-textMuted leading-relaxed">
            Two periodicities (major generator <em>a</em> and minor generator <em>b</em>) interfere over a common product cycle of <code className="text-schillinger-accentA font-mono">L = a × b</code>.
            Dropping perpendicular lines from all attack points yields the <strong>resultant</strong> sequence of durations.
          </p>
        </div>

        {/* Fractioning */}
        <div className="bg-schillinger-panel/70 border border-schillinger-border rounded-xl p-5 space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-schillinger-accentB/20 text-schillinger-accentB font-mono text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h3 className="text-sm font-semibold text-white">
              Fractioning Around Symmetry (a ÷ b̲)
            </h3>
          </div>
          <p className="text-xs text-schillinger-textMuted leading-relaxed">
            When standard binary synchronization produces too much variety, fractioning provides higher internal uniformity.
            The total cycle length is <code className="text-schillinger-accentB font-mono">L = a²</code>.
            The minor generator runs in <code className="text-schillinger-accentB font-mono">N_b = a - b + 1</code> batches, each starting at consecutive phases of <em>a</em>.
          </p>
        </div>

        {/* Accents & Phase Coincidence */}
        <div className="bg-schillinger-panel/70 border border-schillinger-border rounded-xl p-5 space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-schillinger-resultant/20 text-schillinger-resultant font-mono text-xs font-bold flex items-center justify-center">
              3
            </span>
            <h3 className="text-sm font-semibold text-white">
              Coincidence of Phase & Natural Accents
            </h3>
          </div>
          <p className="text-xs text-schillinger-textMuted leading-relaxed">
            Accents are not arbitrary or forced; they occur naturally wherever an attack of generator <em>a</em> and an attack of generator <em>b</em> land on the exact same tick.
            This physical superposition is what creates organic musical meter.
          </p>
        </div>

        {/* Metric Grouping */}
        <div className="bg-schillinger-panel/70 border border-schillinger-border rounded-xl p-5 space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-schillinger-accentC/20 text-schillinger-accentC font-mono text-xs font-bold flex items-center justify-center">
              4
            </span>
            <h3 className="text-sm font-semibold text-white">
              Three Forms of Metric Grouping
            </h3>
          </div>
          <p className="text-xs text-schillinger-textMuted leading-relaxed">
            A single resultant can be framed into musical measures in three distinct ways:
            <br />
            • <strong>Grouping by ab:</strong> 1 overarching measure of length <em>ab</em>.
            <br />
            • <strong>Grouping by a:</strong> <em>b</em> measures of length <em>a</em> (syncopates <em>b</em>).
            <br />
            • <strong>Grouping by b:</strong> <em>a</em> measures of length <em>b</em> (syncopates <em>a</em>).
          </p>
        </div>
      </div>
    </div>
  );
};
