import React from 'react';
import {
  BookOpen,
  Music,
  Layers,
  Cpu,
  Sparkles,
  ArrowRight,
  Compass,
  Waves,
  Lightbulb,
  ArrowLeftRight,
  RotateCw,
  Sliders,
} from 'lucide-react';

export const TheoryPrimer: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Top Hero / Header */}
      <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#c84b31] bg-[#fdf0ec] px-3 py-1 rounded-full w-fit border border-[#c84b31]/30">
          <BookOpen className="w-4 h-4" />
          Theory Overview &amp; Reference Guide
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          An Alternative Mathematical Model for Rhythm, Scale, and Harmony
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-sans">
          The framework developed by Joseph Schillinger offers an intuitive mathematical model for conceptualizing musical materials. By looking at rhythm, scale structures, and harmonic movement through periodic wave interference, modular cyclic math, and geometric symmetry, it provides composers and producers with an open generative toolkit. This perspective reveals fresh structural possibilities, unexpected cadential turns, and rich polyrhythmic relationships that traditional theory books rarely explore.
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
      <section id="rhythm-foundations" className="space-y-6">
        <div className="flex items-center gap-3 border-b-2 border-slate-900 pb-3">
          <span className="w-9 h-9 rounded-xl bg-slate-900 text-white font-mono font-bold flex items-center justify-center text-base">
            1
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Rhythm Foundations: Periodic Interference
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-sans">
              How independent pulses weave together to generate organic musical grooves
            </p>
          </div>
        </div>

        {/* Card 1: Core Philosophy */}
        <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 text-slate-700 text-base sm:text-lg leading-relaxed">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-sky-700 font-extrabold">
            <Waves className="w-4 h-4" />
            <span>The Core Concept</span>
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
            Thinking in Waves Rather than Rigid Fractions
          </h3>

          <p>
            Traditional musical notation usually represents rhythm through static note shapes: whole notes, quarter notes, eighths, and sixteenths. While this system works well for reading standard sheet music, it can sometimes make rhythm feel like arbitrary arithmetic.
          </p>

          <p>
            In the Schillinger model, rhythm is viewed dynamically, much like ripples interfering on the surface of water. Instead of slicing up a single bar into fractions, you set two or more independent periodic clocks running simultaneously. Whenever either clock strikes, a note is played. The interlocking pattern that emerges is called the <strong>Resultant</strong>.
          </p>

          {/* Three Building Blocks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-sky-50 border-2 border-sky-200 space-y-2">
              <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-sky-600 text-white">
                Major Generator (a)
              </span>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                The wider, slower periodic anchor. For instance, a pulse that strikes every 4 beats. It acts as the steady foundation of the rhythmic space.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 space-y-2">
              <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-rose-600 text-white">
                Minor Generator (b)
              </span>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                The faster counter-pulse. For instance, a pulse that strikes every 3 beats. It weaves across the major generator to create syncopation.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#fdf0ec] border-2 border-[#c84b31]/40 space-y-2">
              <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-[#c84b31] text-white">
                Resultant Wave (r)
              </span>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                The combined sequence of durations heard by the listener. It captures the natural interaction of both periodicities in real time.
              </p>
            </div>
          </div>

          {/* Walkthrough Box */}
          <div className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-300 space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h4 className="text-base font-bold text-slate-900 font-mono uppercase tracking-wide">
                A Concrete Example: 4 against 3 (4 ÷ 3)
              </h4>
            </div>

            <p className="text-sm sm:text-base text-slate-700">
              Imagine two musicians tapping together starting at tick 0. Drummer A taps every 4 pulses (at ticks 0, 4, 8, 12). Drummer B taps every 3 pulses (at ticks 0, 3, 6, 9, 12).
            </p>

            <div className="p-3 bg-white rounded-xl border border-slate-300 font-mono text-xs sm:text-sm space-y-1.5 text-slate-800">
              <div><strong>Combined Attack Points:</strong> 0, 3, 4, 6, 8, 9, 12</div>
              <div><strong>Resulting Durations:</strong> (3 - 0) = 3, (4 - 3) = 1, (6 - 4) = 2, (8 - 6) = 2, (9 - 8) = 1, (12 - 9) = 3</div>
              <div className="text-[#c84b31] font-extrabold pt-1">
                Final Resultant: [ 3 + 1 + 2 + 2 + 1 + 3 ] = 12 total units
              </div>
            </div>

            <p className="text-sm text-slate-600">
              Notice the beautiful natural symmetry. The durations <code className="font-bold">3, 1, 2</code> are directly mirrored on the second half by <code className="font-bold">2, 1, 3</code>. At tick 0 and tick 12, both drummers strike simultaneously, creating a physical <strong>coincidence of phase</strong>, which produces a natural musical accent without needing an artificial accent mark.
            </p>
          </div>

          {/* Variations Explanation */}
          <div className="pt-2 space-y-3">
            <h4 className="text-base font-bold text-slate-900 font-mono uppercase tracking-wide flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#c84b31]" />
              Expanding Patterns Through Variations
            </h4>
            <p className="text-sm sm:text-base text-slate-700">
              Once you have a resultant, you can transform it into an entire musical family using two fundamental operations:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
              <li className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <strong className="text-slate-900 font-mono flex items-center gap-1.5">
                  <ArrowLeftRight className="w-4 h-4 text-[#c84b31]" />
                  Retrograde (Reversal)
                </strong>
                <span>Playing the duration sequence in reverse order. In symmetrical patterns like 4 ÷ 3, this reveals elegant palindromic properties.</span>
              </li>
              <li className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <strong className="text-slate-900 font-mono flex items-center gap-1.5">
                  <RotateCw className="w-4 h-4 text-[#c84b31]" />
                  Circular Permutation (Rotation)
                </strong>
                <span>Shifting the starting beat forward or backward. This preserves the internal rhythmic groove while giving it completely different points of syncopation.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 2: HARMONY & SCALES */}
      <section id="harmony-scales" className="space-y-6">
        <div className="flex items-center gap-3 border-b-2 border-slate-900 pb-3">
          <span className="w-9 h-9 rounded-xl bg-slate-900 text-white font-mono font-bold flex items-center justify-center text-base">
            2
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Harmony &amp; Scales: Symmetrical Root Cycles
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-sans">
              Navigating chord progressions as geometric pathways through scale space
            </p>
          </div>
        </div>

        {/* Card 2: Core Harmonic Concept */}
        <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 text-slate-700 text-base sm:text-lg leading-relaxed">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-purple-700 font-extrabold">
            <Compass className="w-4 h-4" />
            <span>Harmonic Perspective</span>
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
            Moving Beyond Functional Labels to Root Cycles
          </h3>

          <p>
            Standard classical harmony typically teaches that chords must follow specific functional roles: Tonic (home), Subdominant (moving away), and Dominant (building tension to return home). While this explains classical music well, it can feel restrictive when composing modern modal jazz, film scores, ambient music, or progressive song structures.
          </p>

          <p>
            The Schillinger model approaches harmony through a simple, elegant mechanism: <strong>Harmonic Root Cycles</strong>. Instead of memorizing dozens of rigid chord progression rules, you choose a <strong>Parent Scale</strong> (like Major, Dorian, or Hungarian Minor) and let chords move by uniform step-intervals along the scale degrees.
          </p>

          {/* Three Root Cycles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-4 space-y-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#c84b31] text-white">
                Cycle of 3rds (C3)
              </span>
              <div className="text-sm font-bold font-mono text-slate-900">Step Offset: ±2 degrees</div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                Chords move by two scale steps (such as I to vi, or vi to IV). Because adjacent chords share two common notes, this cycle produces lush, smooth, velvety harmonic transitions.
              </p>
            </div>

            <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-4 space-y-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
                Cycle of 5ths (C5)
              </span>
              <div className="text-sm font-bold font-mono text-slate-900">Step Offset: ±4 degrees</div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                Chords jump by four scale steps. Moving downward produces the familiar circle-of-fifths progression (such as ii to V to I), delivering powerful forward drive and resolution.
              </p>
            </div>

            <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-4 space-y-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
                Cycle of 7ths (C7)
              </span>
              <div className="text-sm font-bold font-mono text-slate-900">Step Offset: ±6 (or ±1 step)</div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                Chords step directly to adjacent scale degrees (such as IV to V). Because neighboring chords share zero common tones, this cycle creates crisp, vibrant, contrasting shifts.
              </p>
            </div>
          </div>

          {/* Parallel Rails & Modal Interchange Box */}
          <div className="p-5 rounded-2xl bg-[#fdf0ec]/60 border-2 border-[#c84b31]/30 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#c84b31]" />
              <h4 className="text-base font-bold text-slate-900 font-mono uppercase tracking-wide">
                Parallel Rails &amp; Modal Interchange
              </h4>
            </div>

            <p className="text-sm sm:text-base text-slate-800">
              One of the most inspiring techniques in this studio is <strong>Parallel Mode Rails</strong>. Here is how it works:
            </p>

            <ol className="list-decimal list-inside space-y-2 text-sm sm:text-base text-slate-800 pl-1">
              <li>
                <strong>Define a Cyclic Formula:</strong> For example, a 4-chord sequence like <code>[ C3 ↓, C3 ↓, C5 ↑, C3 ↓ ]</code>.
              </li>
              <li>
                <strong>Project Across Multiple Modes:</strong> Run that exact formula simultaneously through C Ionian (bright major) and C Phrygian (dark modal spanish).
              </li>
              <li>
                <strong>Borrow Chords Effortlessly:</strong> Because both tracks share the exact same cyclic root logic, chords align beat-for-beat. You can swap out a single chord from the dark rail and drop it into your master progression, creating sophisticated modal interchange with total structural coherence.
              </li>
            </ol>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-700 space-y-1">
            <strong className="text-slate-900 font-mono">Voice Leading Note:</strong>
            <p>
              The application automatically applies greedy nearest-neighbor voice leading. Notes move by the smallest possible melodic distances on keyboard and guitar, ensuring that even unusual synthetic scales (like Hungarian Minor) sound musical and cohesive.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: TECHNICAL REFERENCE & QUICK FORMULAS */}
      <section id="technical-reference" className="space-y-6">
        <div className="flex items-center gap-3 border-b-2 border-slate-900 pb-3">
          <span className="w-9 h-9 rounded-xl bg-slate-900 text-white font-mono font-bold flex items-center justify-center text-base">
            3
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Technical Reference &amp; Formulas
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-sans">
              Mathematical summaries of the core algorithms powering the studio
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Binary Synchronization */}
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 space-y-2 shadow-2xs">
            <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-300">
              Binary Synchronization (a ÷ b)
            </span>
            <div className="text-sm font-mono font-extrabold text-slate-900">
              Cycle Length: L = a × b
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
              Attacks occur at integer multiples of <em>a</em> and <em>b</em> up to <em>L</em>.
              Durations are calculated between consecutive unique sorted attacks: <code className="font-bold">d_i = U[i+1] - U[i]</code>.
            </p>
          </div>

          {/* Fractioning */}
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 space-y-2 shadow-2xs">
            <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-300">
              Fractioning (a ÷ b̲)
            </span>
            <div className="text-sm font-mono font-extrabold text-slate-900">
              Cycle Length: L = a² &bull; Batches: N_b = a - b + 1
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
              Major generator <em>a</em> runs <em>a</em> times. Minor generator <em>b</em> runs in <em>N_b</em> sub-groups, each starting at <code className="font-bold">k × a</code> for <em>a</em> steps, creating internal symmetry.
            </p>
          </div>

          {/* Coincidence of Phase */}
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 space-y-2 shadow-2xs">
            <span className="text-xs font-mono font-bold text-[#c84b31] bg-[#fdf0ec] px-2.5 py-0.5 rounded-full border border-[#c84b31]/40">
              Phase Coincidence (Accents)
            </span>
            <div className="text-sm font-mono font-extrabold text-slate-900">
              Coincident Attacks: U[i] ∈ Attacks(a) ∩ Attacks(b)
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
              When attack points of both periodicities strike at the exact same instant, the sound receives a natural physical accent (&gt;) from acoustic reinforcement.
            </p>
          </div>

          {/* Distributive Powers */}
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 space-y-2 shadow-2xs">
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300">
              Distributive Powers (Binomial Square)
            </span>
            <div className="text-sm font-mono font-extrabold text-slate-900">
              (a + b)² = a² + ab + ab + b²
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
              Binomial powers govern the development of rhythmic phrases across bars, yielding balanced counterthemes that contrast naturally with the primary rhythm.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
