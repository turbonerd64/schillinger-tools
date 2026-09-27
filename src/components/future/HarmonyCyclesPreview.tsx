import React, { useState } from 'react';
import { SCHILLINGER_HARMONY_CYCLES, HarmonyCycle } from '../../core/harmony/types';
import { Layers, Sparkles, Compass, CheckCircle2, ArrowRight } from 'lucide-react';

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const HarmonyCyclesPreview: React.FC = () => {
  const [selectedCycle, setSelectedCycle] = useState<HarmonyCycle>(SCHILLINGER_HARMONY_CYCLES[0]);
  const [rootNote, setRootNote] = useState<number>(0); // 0 = C

  // Generate sequence of roots for chosen cycle
  const generateCycleProgression = (cycle: HarmonyCycle, startRoot: number) => {
    const progression: string[] = [];
    let current = startRoot;
    const steps = cycle.intervalStep === 0 ? 4 : 12;
    for (let i = 0; i < steps; i++) {
      progression.push(NOTE_NAMES[current % 12]);
      if (cycle.intervalStep === 0) break;
      current = (current + cycle.intervalStep) % 12;
      if (current === startRoot && i > 0) break;
    }
    return progression;
  };

  const currentProgression = generateCycleProgression(selectedCycle, rootNote);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Banner Card */}
      <div className="bg-gradient-to-br from-schillinger-card via-schillinger-panel to-schillinger-card rounded-2xl border border-schillinger-border p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-schillinger-accentB/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-schillinger-border/60 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] uppercase font-mono tracking-widest bg-schillinger-accentB/15 text-schillinger-accentB border border-schillinger-accentB/30 px-2.5 py-0.5 rounded-full">
                Modular Architecture Roadmap
              </span>
              <span className="text-[10px] font-mono text-schillinger-textMuted">
                Book II & Book V
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Harmony Cycles & Parent Scales Engine
            </h2>
            <p className="text-xs text-schillinger-textMuted mt-1 max-w-2xl leading-relaxed">
              Joseph Schillinger recognized classical "functional" harmony as merely one elementary sub-system.
              His broader theory encompasses <strong>Symmetrical Systems</strong>, <strong>Zero Cycles (C₀)</strong>, and <strong>Multi-Tonic Polarities</strong> across expanded parent pitch-scales.
            </p>
          </div>

          <div className="bg-schillinger-bg/90 border border-schillinger-border px-4 py-3 rounded-xl flex items-center gap-3">
            <Layers className="w-6 h-6 text-schillinger-accentB" />
            <div>
              <div className="text-xs font-bold text-white font-mono">Module Foundation</div>
              <div className="text-[11px] text-emerald-400 font-mono">Types & Core Schema Active</div>
            </div>
          </div>
        </div>

        {/* Interactive Cycle Explorer */}
        <div className="mt-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-schillinger-accentA" />
              Interactive Symmetrical Cycle Explorer
            </h3>
            {/* Root note picker */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-schillinger-textMuted">Tonic Root:</span>
              <select
                value={rootNote}
                onChange={(e) => setRootNote(parseInt(e.target.value))}
                className="bg-schillinger-bg border border-schillinger-border text-white px-2 py-1 rounded-lg font-mono focus:outline-none focus:border-schillinger-accentA"
              >
                {NOTE_NAMES.map((name, idx) => (
                  <option key={name} value={idx}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cycle Selection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SCHILLINGER_HARMONY_CYCLES.map((cycle) => {
              const isSelected = selectedCycle.id === cycle.id;
              return (
                <div
                  key={cycle.id}
                  onClick={() => setSelectedCycle(cycle)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-schillinger-accentB/15 border-schillinger-accentB shadow-lg shadow-schillinger-accentB/5'
                      : 'bg-schillinger-panel/60 border-schillinger-border hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold font-mono text-white flex items-center gap-1.5">
                      {cycle.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-schillinger-bg border border-schillinger-border text-schillinger-accentB font-bold">
                      {cycle.code}
                    </span>
                  </div>
                  <p className="text-[11px] text-schillinger-textMuted leading-relaxed">
                    {cycle.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Root Progression Output */}
          <div className="bg-schillinger-panel/90 border border-schillinger-border rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-schillinger-textMuted">
              <span>Symmetric Root Movement ({selectedCycle.code} from {NOTE_NAMES[rootNote]})</span>
              <span>Tonics: {selectedCycle.tonicsCount}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {currentProgression.map((note, idx) => (
                <React.Fragment key={`${note}-${idx}`}>
                  <span className="w-9 h-9 rounded-lg bg-schillinger-card border border-schillinger-accentB/40 text-schillinger-accentB font-mono font-bold flex items-center justify-center text-sm shadow-sm">
                    {note}
                  </span>
                  {idx < currentProgression.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-schillinger-textMuted" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Architecture Note */}
        <div className="mt-6 pt-4 border-t border-schillinger-border/60 flex items-start gap-3 text-xs text-schillinger-textMuted">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
          <p>
            The underlying data model (<code className="text-schillinger-accentA font-mono">src/core/harmony/types.ts</code>) is already designed and integrated. As we finish Book I Rhythm, this modular architecture allows us to build out the full polyphonic voice-leading and scale permutation synthesizer seamlessly.
          </p>
        </div>
      </div>
    </div>
  );
};
