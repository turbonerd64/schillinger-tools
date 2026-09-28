import { describe, it, expect } from 'vitest';
import {
  HARMONY_GROOVE_PRESETS,
  createGrooveFromRhythmState,
  generateProgressionArrangement,
} from './groove';
import { ChordItem } from './engine';

describe('Harmony Groove Coupling Engine', () => {
  const dummyChords: ChordItem[] = [
    {
      id: 'chord_0',
      stepIndex: 0,
      degreeIndex: 0,
      rootPitchClass: 0, // C
      rootName: 'C',
      chordName: 'Cmaj7',
      quality: 'maj7',
      pitchClasses: [0, 4, 7, 11],
      voicedMidiNotes: [48, 60, 64, 67, 71],
      romanNumeral: 'I',
      sourceScaleId: 'ionian',
      sourceScaleName: 'Ionian (Major)',
      sourceColor: '#c84b31',
    },
    {
      id: 'chord_1',
      stepIndex: 1,
      degreeIndex: 5,
      rootPitchClass: 9, // A
      rootName: 'A',
      chordName: 'Am7',
      quality: 'm7',
      pitchClasses: [9, 0, 4, 7],
      voicedMidiNotes: [45, 57, 60, 64, 67],
      romanNumeral: 'vi',
      sourceScaleId: 'ionian',
      sourceScaleName: 'Ionian (Major)',
      sourceColor: '#c84b31',
    },
  ];

  it('verifies all curated harmony groove presets have valid cycle lengths', () => {
    expect(HARMONY_GROOVE_PRESETS.length).toBeGreaterThanOrEqual(5);

    for (const preset of HARMONY_GROOVE_PRESETS) {
      const sumDurations = preset.durations.reduce((a, b) => a + b, 0);
      expect(sumDurations).toBe(preset.totalLength);
      expect(preset.accentIndices.length).toBeGreaterThan(0);
      expect(preset.totalLength).toBeGreaterThan(0);
    }
  });

  it('creates custom groove directly from rhythm parameters', () => {
    const custom = createGrooveFromRhythmState(4, 3, 'binary', 'ab');
    expect(custom.totalLength).toBe(12);
    expect(custom.durations).toEqual([3, 1, 2, 2, 1, 3]);
  });

  it('generates sustained chord arrangement timeline', () => {
    const preset = HARMONY_GROOVE_PRESETS.find((p) => p.id === 'sustained')!;
    const arrangement = generateProgressionArrangement(dummyChords, preset, 'sustained');

    expect(arrangement.totalTimelineUnits).toBe(32); // 2 chords * 16 units
    expect(arrangement.chordSteps.length).toBe(2);
    expect(arrangement.tracks.length).toBe(3); // Chords, Bass, Percussion

    const chordTrack = arrangement.tracks.find((t) => t.name === 'Rhythmic Harmony')!;
    expect(chordTrack.notes.length).toBe(2);
    expect(chordTrack.notes[0].durationUnits).toBe(16);
    expect(chordTrack.notes[0].pitches).toEqual([60, 64, 67, 71]);
  });

  it('generates comping arrangement following the Gershwin 4:3 resultant', () => {
    const preset = HARMONY_GROOVE_PRESETS.find((p) => p.id === 'gershwin_4_3')!;
    const arrangement = generateProgressionArrangement(dummyChords, preset, 'comping');

    expect(arrangement.totalTimelineUnits).toBe(24); // 2 chords * 12 units
    const chordTrack = arrangement.tracks.find((t) => t.name === 'Rhythmic Harmony')!;
    // 6 attacks per chord * 2 chords = 12 notes
    expect(chordTrack.notes.length).toBe(12);

    // Verify first chord note durations mirror [3, 1, 2, 2, 1, 3]
    const chord1Durations = chordTrack.notes.slice(0, 6).map((n) => n.durationUnits);
    expect(chord1Durations).toEqual([3, 1, 2, 2, 1, 3]);

    // Check accented note has higher velocity
    expect(chordTrack.notes[0].velocity).toBe(115);
  });

  it('generates bass & chords split texture with sustained bass on downbeat', () => {
    const preset = HARMONY_GROOVE_PRESETS.find((p) => p.id === 'gershwin_4_3')!;
    const arrangement = generateProgressionArrangement(dummyChords, preset, 'bass_chords');

    const bassTrack = arrangement.tracks.find((t) => t.name === 'Bass Ground')!;
    // In bass_chords, bass plays 1 sustained event per chord
    expect(bassTrack.notes.length).toBe(2);
    expect(bassTrack.notes[0].durationUnits).toBe(12);
    expect(bassTrack.notes[0].pitches).toEqual([48]); // C bass
    expect(bassTrack.notes[1].pitches).toEqual([45]); // A bass

    const chordTrack = arrangement.tracks.find((t) => t.name === 'Rhythmic Harmony')!;
    // Upper chords comp across the 6 resultant attacks
    expect(chordTrack.notes.length).toBe(12);
  });

  it('generates linear arpeggio texture dispersing upper voices', () => {
    const preset = HARMONY_GROOVE_PRESETS.find((p) => p.id === 'gershwin_4_3')!;
    const arrangement = generateProgressionArrangement(dummyChords, preset, 'arpeggio');

    const chordTrack = arrangement.tracks.find((t) => t.name === 'Rhythmic Harmony')!;
    expect(chordTrack.notes.length).toBe(12);

    // Each arpeggio strike should contain exactly 1 pitch
    for (const note of chordTrack.notes) {
      expect(note.pitches.length).toBe(1);
    }
  });
});
