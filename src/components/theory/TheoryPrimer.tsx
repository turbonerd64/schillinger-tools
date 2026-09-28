import React from 'react';
import {
  BookOpen,
  Music,
  Layers,
  Cpu,
  Sparkles,
  ArrowRight,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';

export const TheoryPrimer: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Top Hero / Header */}
      <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#c84b31] bg-[#fdf0ec] px-3 py-1 rounded-full w-fit border border-[#c84b31]/30">
          <BookOpen className="w-4 h-4" />
          The Schillinger System Educational Guide
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          A Universal Mathematical Language for Rhythm, Scale, and Harmony
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-sans">
          In <em>The Schillinger System of Musical Composition</em> (1941), Russian mathematician, theorist, and composer Joseph Schillinger showed that musical composition does not rely on arbitrary trial-and-error rules. By translating rhythm, melody, and chord motion into periodic interferences, cyclic modular arithmetic, and geometric projections, any musical style can be generated with mathematical precision.
        </p>

        {/* Quick Navigation Anchor Bar */}
        <div className="pt-3 border-t-2 border-slate-100 flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-mono mr-1">
            Jump To:
          </span>
          <button
            onClick={() => scrollTo('rhythm-foundations')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold font-mono border-2 border-slate-900 bg-slate-50 hover:bg-slate-900 hover:text-white transition-all shadow-2xs"
          >
            <Music className="w-4 h-4 text-[#c84b31]" />
            <span>1. Rhythm Foundations</span>
          </button>
          <button
            onClick={() => scrollTo('harmony-scales')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold font-mono border-2 border-slate-900 bg-slate-50 hover:bg-slate-900 hover:text-white transition-all shadow-2xs"
          >
            <Layers className="w-4 h-4 text-sky-600" />
            <span>2. Harmony &amp; Scales</span>
          </button>
          <button
            onClick={() => scrollTo('technical-reference')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold font-mono border-2 border-slate-900 bg-slate-50 hover:bg-slate-900 hover:text-white transition-all shadow-2xs"
          >
            <Cpu className="w-4 h-4 text-amber-600" />
            <span>3. Technical Reference &amp; Formulas</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: RHYTHM FOUNDATIONS */}
      <section id="rhythm-foundations" className="space-y-4">
        <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-2">
          <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-mono font-bold flex items-center justify-center text-sm">
            1
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Rhythm Foundations: Periodic Interference
          </h2>
        </div>

        <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
          <p>
            Traditional musical notation represents time using symbols (quarters, eighths, sixteenths) based on arbitrary division by two. Schillinger demonstrated that this notation limits creative exploration and proposed analyzing rhythm through three synchronized coordinates: <strong>Numbers</strong>, <strong>Graphs</strong>, and <strong>Sound</strong>.
          </p>

          <div className="p-4 rounded-2xl bg-[#fdf0ec] border-2 border-[#c84b31]/30 space-y-2">
            <h4 className="text-base font-bold text-[#c84b31] font-mono uppercase">
              How a Resultant Works
            </h4>
            <p className="text-sm sm:text-base text-slate-800">
              When two musicians or instruments play pulses of different lengths at the same time—such as one beating every <strong>4 units</strong> (Major Generator <em>a</em>) and the other beating every <strong>3 units</strong> (Minor Generator <em>b</em>)—their attacks intertwine. The resulting combined rhythm heard by the listener is the <strong>Resultant</strong> (<code className="font-bold text-[#c84b31]">r = 3 + 1 + 2 + 2 + 1 + 3</code>).
            </p>
          </div>

          <p>
            Because both generators start together at tick 0, they eventually meet again at their <strong>Common Product</strong> (<code className="font-bold">4 × 3 = 12</code>). Natural accents occur wherever attacks coincide in phase, creating organic syncopation without forced bar lines.
          </p>
        </div>
      </section>

      {/* SECTION 2: HARMONY & SCALES */}
      <section id="harmony-scales" className="space-y-4">
        <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-2">
          <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-mono font-bold flex items-center justify-center text-sm">
            2
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Harmony &amp; Scales: Symmetrical Root Cycles
          </h2>
        </div>

        <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
          <p>
            Standard classical harmony classifies chord progressions through functional roles: Tonic (I), Subdominant (IV), and Dominant (V). Schillinger showed that functional harmony is only one narrow sub-system.
          </p>

          <p>
            In his broader theory, chords move according to <strong>Harmonic Root Cycles</strong> (C) through any chosen <strong>Parent Scale</strong>:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-4 space-y-1.5">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#c84b31] text-white">
                Cycle of 3rds (C3)
              </span>
              <p className="text-xs sm:text-sm text-slate-700 pt-1">
                Moves by two scale degrees. Moving down a third (C₃ ↓) is equivalent to moving up a sixth, creating lush tertian shifts.
              </p>
            </div>

            <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-4 space-y-1.5">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white">
                Cycle of 5ths (C5)
              </span>
              <p className="text-xs sm:text-sm text-slate-700 pt-1">
                Moves by four scale degrees. Descending (C₅ ↓) produces the familiar circle-of-fifths root progression.
              </p>
            </div>

            <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-4 space-y-1.5">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white">
                Cycle of 7ths (C7)
              </span>
              <p className="text-xs sm:text-sm text-slate-700 pt-1">
                Moves by six scale degrees (or step-wise). Descending (C₇ ↓) steps upward into the adjacent degree.
              </p>
            </div>
          </div>

          <p className="pt-2">
            <strong>Modal Interchange in Parallel Rails:</strong> When a cyclic formula (e.g., <code>[C3↓, C3↓, C5↑, C3↓]</code>) is projected across multiple scales simultaneously (such as C Ionian and C Phrygian), chords line up beat-for-beat. Composers can borrow individual chords or entire slices across modes while preserving continuous cyclic coherence.
          </p>
        </div>
      </section>

      {/* SECTION 3: TECHNICAL REFERENCE & QUICK FORMULAS */}
      <section id="technical-reference" className="space-y-4">
        <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-2">
          <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-mono font-bold flex items-center justify-center text-sm">
            3
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Technical Reference &amp; Quick Formulas
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Binary Synchronization */}
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 space-y-2">
            <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-300">
              Binary Synchronization (a ÷ b)
            </span>
            <div className="text-sm font-mono font-extrabold text-slate-900">
              Length: L = a × b
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Attacks occur at multiples of <em>a</em> and <em>b</em> up to <em>L</em>.
              Durations are calculated between consecutive unique sorted attacks: <code className="font-bold">d_i = U[i+1] - U[i]</code>.
            </p>
          </div>

          {/* Fractioning */}
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 space-y-2">
            <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-300">
              Fractioning (a ÷ b̲)
            </span>
            <div className="text-sm font-mono font-extrabold text-slate-900">
              Length: L = a² &bull; Batches: N_b = a - b + 1
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Major generator <em>a</em> runs <em>a</em> times. Minor generator <em>b</em> runs in <em>N_b</em> groups, each starting at <code className="font-bold">k × a</code> for <em>a</em> iterations.
            </p>
          </div>

          {/* Coincidence of Phase */}
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 space-y-2">
            <span className="text-xs font-mono font-bold text-[#c84b31] bg-[#fdf0ec] px-2.5 py-0.5 rounded-full border border-[#c84b31]/40">
              Phase Coincidence (Accents)
            </span>
            <div className="text-sm font-mono font-extrabold text-slate-900">
              U[i] ∈ Attacks(a) ∩ Attacks(b)
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              When attacks of both periodicities strike at the exact same moment, the sound receives a natural physical accent (&gt;).
            </p>
          </div>

          {/* Distributive Powers */}
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 space-y-2">
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300">
              Distributive Powers (Binomial Square)
            </span>
            <div className="text-sm font-mono font-extrabold text-slate-900">
              (a + b)² = a² + ab + ab + b²
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Powers govern the evolution of rhythmic phrases across entire measures, creating structured counterthemes that contrast with the initial rhythm.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
