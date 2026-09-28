import { describe, it, expect } from 'vitest';
import {
  calculateSchillingerRhythm,
  applyRhythmVariations,
  computeBinarySync,
  computeFractionedSync,
  computeTrinomialSync,
} from './engine';

describe('Schillinger Book I Mathematical Engine', () => {
  it('passes Test Case 1: Standard 3 ÷ 2', () => {
    const res = calculateSchillingerRhythm(3, 2, 'binary');
    expect(res.totalLength).toBe(6);
    expect(res.durations).toEqual([2, 1, 1, 2]);
    expect(res.accentIndices).toContain(0); // Tick 0 is coincidence
  });

  it('passes Test Case 2: Standard 4 ÷ 3', () => {
    const res = calculateSchillingerRhythm(4, 3, 'binary');
    expect(res.totalLength).toBe(12);
    expect(res.durations).toEqual([3, 1, 2, 2, 1, 3]);
    expect(res.accentIndices).toContain(0);
  });

  it('correctly assigns metric accents for coprime polyrhythms based on metric grouping (Book I Ch. 2 & 8)', () => {
    // 3 ÷ 2 grouped by a (attacks of a at tick 0 and 3)
    const resA = calculateSchillingerRhythm(3, 2, 'binary', 'a');
    expect(resA.accentIndices).toEqual([0, 2]);

    // 3 ÷ 2 grouped by b (attacks of b at tick 0, 2, 4)
    const resB = calculateSchillingerRhythm(3, 2, 'binary', 'b');
    expect(resB.accentIndices).toEqual([0, 1, 3]);
  });

  it('passes Test Case 3: Fractioned 3 ÷ 2̲', () => {
    const res = calculateSchillingerRhythm(3, 2, 'fractioned');
    expect(res.totalLength).toBe(9); // 3^2
    expect(res.durations).toEqual([2, 1, 1, 1, 1, 1, 2]);
  });

  it('passes Test Case 4: Fractioned 4 ÷ 3̲', () => {
    const res = calculateSchillingerRhythm(4, 3, 'fractioned');
    expect(res.totalLength).toBe(16); // 4^2
    expect(res.durations).toEqual([3, 1, 2, 1, 1, 1, 1, 2, 1, 3]);
  });

  it('correctly handles variations (Retrograde and Circular Permutation)', () => {
    const originalDurations = [3, 1, 2, 2, 1, 3];
    const originalAccents = [0];

    // Retrograde
    const reversed = applyRhythmVariations(originalDurations, originalAccents, true, 0);
    expect(reversed.durations).toEqual([3, 1, 2, 2, 1, 3]); // Palindromic!

    const asymmetric = [2, 1, 1, 4];
    const revAsymmetric = applyRhythmVariations(asymmetric, [0], true, 0);
    expect(revAsymmetric.durations).toEqual([4, 1, 1, 2]);
    expect(revAsymmetric.accentIndices).toEqual([3]);

    // Rotate by 1
    const rotated = applyRhythmVariations(asymmetric, [0], false, 1);
    expect(rotated.durations).toEqual([1, 1, 4, 2]);
    expect(rotated.accentIndices).toEqual([3]);
  });

  it('handles Three-generator synchronization (2 ÷ 3 ÷ 5)', () => {
    const res = computeTrinomialSync(2, 3, 5);
    expect(res.totalLength).toBe(30);
    expect(res.durations.reduce((a, b) => a + b, 0)).toBe(30);
    // Complementary factors: 30/2=15, 30/3=10, 30/5=6
    expect(res.counterthemeDurations.reduce((a, b) => a + b, 0)).toBe(30);
  });
});
