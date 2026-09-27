# Schillinger Tools Studio

> An interactive mathematical visualizer and compositional engine based on **The Schillinger System of Musical Composition** by Joseph Schillinger (1941).

Live at: **https://schillingertools.arman.love**

---

## 🎹 Modules Overview

### Module 1: Rhythm Resultant Engine (Book I: Theory of Rhythm)
- **Binary Synchronization ($a \div b$):** Computes resultant rhythmic interferences across common product cycles $L = a \times b$.
- **Fractioning Around the Axis of Symmetry ($a \div \underline{b}$):** Symmetrical batched synchronization over $L = a^2$ with $N_b = a - b + 1$ minor generator groups.
- **Three-Generator Interference ($a \div b \div c$):** Book I Chapter 6 trinomial engine producing primary themes $r$ and complementary counterthemes $r'$.
- **Metric Grouping:** Bar framing by $ab$ (single measure), $a$ (measures of length $a$), or $b$ (measures of length $b$).
- **Multi-Lane Comparative Visualizer:** Responsive vector graph rendering Generator $a$, Generator $b$, atomic pulse grid, and Resultant $r$ with phase coincidence accent markers ($>$).
- **Acoustic Percussion Synthesizer:** Real-time Web Audio API engine simulating physical resonant woodblocks, claves, and rimshots with lookahead scheduling.
- **Variations & Permutations:** Instant Retrograde (inversion) and Circular Permutations (rotations).
- **Data Export:** In-memory Standard MIDI (.mid) generation and JSON preset export.

### Module 2: Harmony Cycles & Parent Scales (Book II & Book V) — *Foundations Active*
- Non-functional harmony systems: Symmetrical Cycles ($C_3, C_4, C_0, C_6$), Multi-Tonic Polarities, and Parent Pitch-Scales.
- Architecture and data models established in `src/core/harmony/types.ts`.

---

## 🚀 Development & Build

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run Vitest test suite
npm test

# Build production bundle
npm run build
```

---

## 🐳 Docker Deployment

The application is containerized with an ultra-lightweight multi-stage Alpine Nginx build (< 15 MB RAM) connected to Traefik on the `coolify` network:

```bash
docker compose up -d --build
```
