# Schillinger Tools Studio User Guide & Compositional Cookbook

> A complete musician's manual, interface walkthrough, and compositional cookbook for **Schillinger Tools Studio**.

Live Application: **https://schillingertools.arman.love**

---

## 1. Welcome to the Studio

Schillinger Tools Studio brings the mathematical composition techniques of Joseph Schillinger into a fluid, visual environment. Whether you are composing polyrhythmic grooves, scoring cinematic chord progressions, exploring modal interchange, or generating multi-tonic jazz changes, this studio handles the mathematical calculations so you can focus on creative intuition.

### Navigation Overview
The top header provides quick switching between the three main environments:
- **Rhythm Studio:** Explore binary synchronization ($a \div b$), fractioning ($a \div \underline{b}$), 3-generator polyphony ($a \div b \div c$), metric grouping, and variations.
- **Harmony Studio:** Construct cyclic chord progressions across Diatonic, Invariant, and Symmetric root systems, with modal interchange, variable chord densities, and algebraic voice leading.
- **Theory Primer:** A digital handbook illustrating the fundamental concepts and mathematics from the 1941 treatise.

---

## 2. Rhythm Resultant Studio (Book I)

The Rhythm Studio derives rhythmic patterns from the interference of two or three periodic pulse streams.

### Key Controls & Concepts

#### 1. Major Generator ($a$) and Minor Generator ($b$)
- **Generator $a$ (Major):** Defines the larger rhythmic pulse (e.g., 4 ticks).
- **Generator $b$ (Minor):** Defines the smaller counter-pulse (e.g., 3 ticks).
- Condition: $a > b > 0$.
- The common product cycle is $L = a \times b$. For $4 \div 3$, the cycle length is $12$ ticks.

#### 2. Resultant ($r$) and Phase Coincidence
- The resultant $r$ contains every moment where either generator strikes.
- The visualizer displays Generator $a$ (top track), Generator $b$ (middle track), and the Resultant $r$ (bottom track).
- **Coincidence Accents ($>$):** Ticks where both generators fire simultaneously.
- **Coprime Metric Downbeats:** In coprime pairs like 3:2, 4:3, or 5:4, Generator $a$ provides the primary metric downbeat accents across interior measures when grouped by $a$ or $ab$, while Generator $b$ provides accents when grouped by $b$.

#### 3. Fractioning Around the Axis of Symmetry ($a \div \underline{b}$)
- Toggle **Fractioning** to batch Generator $b$ pulses into blocks of length $a$ across an expanded cycle $L = a^2$.
- Generates balanced, palindromic rhythmic structures (symmetrical around the midpoint of the timeline).

#### 4. Three-Generator Polyphony ($a \div b \div c$)
- Activate the third generator ($c$) to create three-part interferences across $L = a \times b \times c$.
- Automatically computes both the primary theme $r$ and the complementary countertheme $r'$, giving you an instant two-part contrapuntal rhythmic arrangement.

#### 5. Metric Grouping
- **Group by $ab$:** Treats the entire common product cycle as one large measure.
- **Group by $a$:** Slices the cycle into equal bars of length $a$.
- **Group by $b$:** Slices the cycle into equal bars of length $b$.

#### 6. Variations & Permutations
- **Retrograde:** Plays the duration pattern backwards, reversing syncopation.
- **Circular Permutations ($C_1, C_2, \dots$):** Shifts the starting point of the duration series by one attack, rotating the groove while preserving the total cycle length.

#### 7. Transport & Sound Mixer
- Adjust master BPM (40 to 240).
- Independently mix or mute Generator $a$ (resonant woodblock), Generator $b$ (high-Q clave), and Resultant $r$ (resonant rimshot).
- Export your groove as a multi-channel Standard MIDI File (.mid) or JSON preset.

---

## 3. Harmony Studio (Book II & Book V)

The Harmony Studio generates chord progressions along cyclic paths, with live voice-leading, modal borrowing, and per-chord density sculpting.

### 3.1 The Top Formula Bar

1. **Tonic Root Key:** Select your home pitch center (C through B).
2. **Global Chord Density Default:**
   - **Triad ($S_5$):** 3-note foundational voicings.
   - **7th ($S_7$):** 4-note rich voicings.
   - **9th ($S_9$):** 5-note lush voicings.
   *Note: This sets the default for newly added chords. You can override density chord-by-chord in the Master Progression Lane.*
3. **Progression Length:** Set the total number of chords in your progression (4 to 32 chords).
4. **Tempo:** Set playback speed in BPM.
5. **Harmonic System Selection (Book V):**
   - **Type I: Diatonic System (Chapter 2):** Chords are constructed strictly from in-scale pitches of your selected mode or synthetic scale.
   - **Type II: Diatonic-Symmetric System (Chapter 4):** Roots follow diatonic scale steps, but all chords share an invariant structure quality (e.g., all Dominant 7ths or all Minor 7ths).
   - **Type III: Symmetric System (Chapter 5):** Roots progress by chromatic semitone octave divisions based on roots of 2:
     - $C_6$ ($\sqrt{2}$): Tritone axis (6 semitones, 2 tonics)
     - $C_4$ ($\sqrt[3]{2}$): Major thirds / augmented axis (4 semitones, 3 tonics)
     - $C_3$ ($\sqrt[4]{2}$): Minor thirds / diminished axis (3 semitones, 4 tonics)
     - $C_2$ ($\sqrt[6]{2}$): Whole-tone axis (2 semitones, 6 tonics)
     - $C_1$ ($\sqrt[12]{2}$): Chromatic semitone axis
     - $C_0$: Static root axis with internal voice transformations
6. **Invariant Quality Selector:**
   When Type II or Type III is active, pick your invariant chord quality:
   - For 7ths: `Maj7`, `Min7`, `Dom7`, `m7b5`, `Dim7`.
   - For Triads: `Maj`, `Min`, `Dim`, `Aug`.
7. **Voice-Leading Transformation Mode (Book V, Ch. 2):**
   - **Minimal Motion (Greedy):** Connects chords with the shortest possible voice steps.
   - **Clockwise ($T_{\circlearrowright}$):** Cyclically shifts factor roles forward ($1 \to 3 \to 5 \to 7 \to 1$).
   - **Counterclockwise ($T_{\circlearrowleft}$):** Cyclically shifts factor roles backward ($1 \to 7 \to 5 \to 3 \to 1$).
   - **Constant Tone ($T_{\text{const}}$):** Locks shared pitch classes in their exact registers while smoothly moving remaining voices.
8. **Quick Add Cycle Formula Buttons:**
   - **Diatonic Cycles (Scale Steps):**
     - `+ C3 ↓` (3rd down / mediant fall)
     - `+ C3 ↑` (3rd up)
     - `+ C5 ↓` (5th down / circle of fifths)
     - `+ C5 ↑` (5th up / fourth down)
     - `+ C7 ↓` (7th down / step up)
     - `+ C7 ↑` (7th up / step down)
   - **Symmetric Octave Divisions (Roots of 2):**
     - `+ C6 (√2)` (Tritone axis: 6 semitones)
     - `+ C4 (∛2)` (Major 3rd axis: 4 semitones)
     - `+ C3 (∜2)` (Minor 3rd axis: 3 semitones)
     - `+ C2 (⁶√2)` (Whole-tone axis: 2 semitones)
     - `+ C1 (¹²√2)` (Chromatic axis: 1 semitone)
     - `+ C0` (Static root with voice permutations)

---

### 3.2 Master Progression Lane & Modal Interchange

The Master Progression Lane is your primary harmonic canvas.

#### 1. Reading the Chord Cards
- **Top-Left Badge:** Shows current chord density (`S5`, `S7`, or `S9`).
- **Center:** Chord Symbol (e.g., `Cmaj7`, `Dm7`, `G9`, `F#7`).
- **Below Symbol:** Roman numeral analysis (e.g., `I`, `ii`, `V`, `bVII`).
- **Bottom Tag:** Name of the scale or mode the chord originates from (e.g., `Ionian`, `Phrygian`).
- **Background Color:** Color-coded to match the parent mode.

#### 2. Per-Chord Density Overrides
To change the density of an individual chord:
1. Click the chord card in the Master Progression Lane.
2. In the floating inspector popover, locate **Chord Density (Structure)**.
3. Click `Triad (S5)`, `7th (S7)`, or `9th (S9)`.
4. The chord instantly rebuilds its pitch classes and re-voices cleanly. The change persists even if you modify formula cycles or swap parent scales.

#### 3. Batch Density Overrides
To change the density of multiple chords at once:
1. Click and drag across a sequence of chords (e.g., chords 1 through 4).
2. The popover displays: `Batch Edit: Chords #1 to #4`.
3. Click `Triad`, `7th`, or `9th`.
4. All selected chords update their densities simultaneously with adaptive voice leading.

#### 4. Modal Interchange (Borrowing Chords)
To borrow a chord from a parallel mode:
1. Click any chord in the Master Progression Lane.
2. In the popover, look at the **Modal Interchange (Scale)** list.
3. Every active parallel scale displays what chord would be played at this step along your formula.
4. Click any scale (e.g., `Phrygian`, `Dorian`, or `Hungarian Minor`) to immediately borrow that chord into your master progression.

#### 5. Batch Chunk Mode
Want your verse in Ionian and your chorus in Dorian?
1. Click and drag across the second half of your progression.
2. In the popover, select `Dorian`.
3. All selected chords are swapped to Dorian in one click.
4. Alternatively, use the **50/50 Split** button in the header for an instant half-and-half modal distribution.

---

### 3.3 Parallel Mode Rails

Located directly beneath the Master Progression Lane:
- Displays your selected parallel scales (e.g., `Ionian (Major)`, `Phrygian`, `Dorian`, `Hungarian Minor`, `Whole-Tone`) running along the exact same formula.
- Click any chord card in any rail to audition its sound.
- Click the swap button on any rail card to inject it directly into the master progression at that step.
- Use the **+ Add Parallel Scale** button to add church modes, synthetic scales, or symmetric scales to your comparative workspace.

---

### 3.4 Interactive Visualizers

- **Virtual 88-Key Piano:** Lights up active chord tones, roots, and extensions in real time during playback or selection. Click keys to audition individual notes.
- **Interactive 15-Fret Guitar Fretboard:** Displays pitch classes and scale degrees across standard guitar tuning (E-A-D-G-B-E).

---

### 3.5 Exporting Your Work

The **Harmony Export Panel** provides live progression readouts:
1. **Standard Chord Symbols:** `Cmaj7 - Am7 - Dm9 - G7`
2. **Roman Numeral Analysis:** `I - vi - ii - V`
3. **Nashville Number System:** `1maj7 - 6m7 - 2m9 - 57`
4. **Copy to Clipboard:** 1-click button to paste progressions into lyrics sheets, charts, or lead sheets.
5. **Download MIDI (.mid):** Generates a Standard MIDI File containing voiced polyphonic chords and tempo markers, ready to drag and drop into Ableton Live, Logic Pro, Reaper, Cubase, FL Studio, or Studio One.

---

## 4. Compositional Cookbook & Recipes

### Recipe 1: Gershwin-Style Polyrhythmic Resultant Groove
**Goal:** Create a classic syncopated 4:3 resultant rhythm matching Gershwin's Broadway compositions.
1. Open the **Rhythm Studio**.
2. Set Major Generator $a = 4$.
3. Set Minor Generator $b = 3$.
4. Select **Metric Grouping: Group by a**.
5. Set Tempo to 116 BPM.
6. The resultant $r$ generates the 5-duration syncopated series: `[3, 1, 2, 2, 1, 3]`.
7. Notice the metric downbeat accents marking the start of each 4-tick measure.
8. Click **Download MIDI** and drop the resultant track into your drum sampler or bassline track.

---

### Recipe 2: Coltrane Multi-Tonic Changes ($\sqrt[3]{2}$)
**Goal:** Generate the 3-tonic augmented axis changes used in John Coltrane's *Giant Steps*.
1. Open the **Harmony Studio**.
2. Set Tonic Key to `C`.
3. Set Harmonic System to **Type III: Symmetric**.
4. Set Invariant Quality to `Maj7`.
5. Under Quick Add, click `+ C4 (∛2)` three times.
6. Set Progression Length to `6`.
7. The progression produces:
   $$C\text{maj7} \to E\text{maj7} \to A\flat\text{maj7} \to C\text{maj7} \to E\text{maj7} \to A\flat\text{maj7}$$
8. Select Voice Leading Mode: **Minimal** or **Clockwise ($T_{\circlearrowright}$)**.
9. Audition the seamless voice leading across the three major thirds centers.

---

### Recipe 3: Building a Classical Cadence with Variable Density
**Goal:** Build dynamic tension across an 8-chord cycle, expanding into a lush 9th before resolving to a clean triad.
1. Select the **Classical Cadential Turn** preset (`I -> ii -> V -> I`).
2. Set Progression Length to `8`.
3. The baseline density is $S_7$ (4-note 7ths).
4. Click chord #3 (the pre-dominant chord) and change its density to `9th (S9)`.
5. Click chord #7 (the penultimate dominant chord) and change its density to `9th (S9)`.
6. Click chord #8 (the final resolution chord) and change its density to `Triad (S5)`.
7. Play the progression: notice how the tension expands into 5-note ninth voicings during cadential approaches, then collapses into a clean, grounded 3-note triad on the final downbeat.

---

### Recipe 4: Modal Interchange Bridge (Phrygian Darkening)
**Goal:** Create an evocative, dark cinematic turn in an otherwise major progression.
1. In the **Harmony Studio**, select the **Mediant Fall ($C_3 \downarrow$)** preset in `C Ionian`.
2. Ensure `Phrygian` is active in your Parallel Mode Rails.
3. Click chord #4 in the Master Progression Lane.
4. In the popover, select `Phrygian`.
5. The 4th chord borrows the dark Phrygian chord color ($C\text{m7}$ or $A\flat\text{maj7}$).
6. Toggle Voice Leading to **Constant Tone ($T_{\text{const}}$)** to hear the shared common tones lock in place while the modal shift colors the harmony.

---

### Recipe 5: Zero Cycle Ambient Voice Transformation ($C_0$)
**Goal:** Create an evolving ambient harmonic bed over a static pedal point.
1. Set Tonic Key to `D`.
2. Clear the formula.
3. Click `+ C0` four times.
4. Set Harmonic System to **Type I: Diatonic** or **Type III: Symmetric**.
5. Set Voice Leading Mode to **Clockwise ($T_{\circlearrowright}$)**.
6. Set Chord Density to `S7` or `S9`.
7. The root remains anchored on `D`, while the upper voices rotate factor roles through the algebraic permutation loop, creating continuous, hypnotic voice movement without shifting the bass.

---

## 5. Frequently Asked Questions (FAQ)

**Q: Why do coprime polyrhythms have accents on generator attacks rather than only at tick 0?**  
A: In coprime polyrhythms ($\gcd(a, b) = 1$), the mathematical coincidence of both generators occurs exclusively at $t = 0$. In musical practice, as explained in Schillinger Book I Chapter 2 and Chapter 8, the attacks of the grouping generator establish the metric downbeats of each measure. Without this, coprime polyrhythms would have no internal accents after the very first tick.

**Q: Can I mix Triads, 7ths, and 9ths in the same progression?**  
A: Yes. Set your overall baseline density in the top bar, then click any chord (or drag across a chunk of chords) in the Master Progression Lane to override its density to Triad ($S_5$), 7th ($S_7$), or 9th ($S_9$). The voice-leading engine automatically adapts to variable voice counts.

**Q: How does modal interchange interact with custom densities?**  
A: Your custom density choices are preserved. If you make chord #3 a 9th and then borrow a chord from Phrygian for that step, the borrowed Phrygian chord is automatically generated as a 9th.

**Q: Can I import the MIDI files into my DAW?**  
A: Yes. All MIDI files exported by Schillinger Tools Studio conform to Standard MIDI File (SMF Format 0) specifications and are compatible with all modern DAWs (Ableton, Logic, Reaper, Cubase, Studio One, FL Studio, Bitwig) and notation software (Sibelius, Dorico, MuseScore).
