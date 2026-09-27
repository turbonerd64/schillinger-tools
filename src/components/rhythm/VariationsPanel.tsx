import React from 'react';
import { ResultantOutput, RhythmVariationState } from '../../core/rhythm/types';
import { ArrowLeftRight, RotateCw, RefreshCw, Cpu, Check, Copy } from 'lucide-react';

interface VariationsPanelProps {
  resultant: ResultantOutput;
  variations: RhythmVariationState;
  setVariations: React.Dispatch<React.SetStateAction<RhythmVariationState>>;
  displayedDurations: number[];
}

export const VariationsPanel: React.FC<VariationsPanelProps> = ({
  resultant,
  variations,
  setVariations,
  displayedDurations,
}) => {
  const { a, b } = resultant.generators;

  // Distributive Square calculation from Chapter 12: (a + b)^2 = a^2 + ab + ab + b^2
  const distSquareA2 = a * a;
  const distSquareAB = a * b;
  const distSquareB2 = b * b;
  const distSquareFormula = `${distSquareA2} + ${distSquareAB} + ${distSquareAB} + ${distSquareB2}`;
  const distSquareSum = distSquareA2 + 2 * distSquareAB + distSquareB2;

  const handleToggleReverse = () => {
    setVariations((prev) => ({ ...prev, isReversed: !prev.isReversed }));
  };

  const handleRotate = (delta: number) => {
    setVariations((prev) => ({
      ...prev,
      rotationOffset: prev.rotationOffset + delta,
    }));
  };

  const handleResetVariations = () => {
    setVariations({ isReversed: false, rotationOffset: 0 });
  };

  return (
    <div className="bg-schillinger-card rounded-2xl border border-schillinger-border p-5 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-schillinger-border/60 pb-3">
        <div className="flex items-center gap-2">
          <RotateCw className="w-4 h-4 text-schillinger-accentC" />
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            Variations & Permutations (Chapter 9 & 12)
          </h2>
        </div>
        {(variations.isReversed || variations.rotationOffset !== 0) && (
          <button
            onClick={handleResetVariations}
            className="text-[11px] font-mono text-schillinger-accentB hover:underline flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* Variation Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Retrograde (Reverse) */}
        <button
          onClick={handleToggleReverse}
          className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
            variations.isReversed
              ? 'bg-schillinger-accentB/20 border-schillinger-accentB text-white font-bold'
              : 'bg-schillinger-panel/70 border-schillinger-border text-gray-300 hover:text-white hover:border-gray-500'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <ArrowLeftRight className="w-4 h-4 text-schillinger-accentB" />
            <div className="text-left">
              <div className="text-xs font-mono font-semibold">Retrograde (Reverse)</div>
              <div className="text-[10px] text-schillinger-textMuted">Invert time sequence</div>
            </div>
          </div>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded ${
              variations.isReversed ? 'bg-schillinger-accentB text-black font-bold' : 'bg-schillinger-bg text-gray-500'
            }`}
          >
            {variations.isReversed ? 'ACTIVE' : 'OFF'}
          </span>
        </button>

        {/* Circular Permutation (Rotate) */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-schillinger-panel/70 border border-schillinger-border">
          <div className="text-left">
            <div className="text-xs font-mono font-semibold text-gray-200">Circular Permutation</div>
            <div className="text-[10px] text-schillinger-textMuted">
              Shift: <span className="text-schillinger-accentA font-bold font-mono">{variations.rotationOffset}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleRotate(-1)}
              className="w-7 h-7 rounded-lg bg-schillinger-bg border border-schillinger-border text-xs font-mono hover:text-white hover:border-gray-500 active:scale-95"
              title="Rotate Left (-1)"
            >
              ◀
            </button>
            <button
              onClick={() => handleRotate(1)}
              className="w-7 h-7 rounded-lg bg-schillinger-bg border border-schillinger-border text-xs font-mono hover:text-white hover:border-gray-500 active:scale-95"
              title="Rotate Right (+1)"
            >
              ▶
            </button>
          </div>
        </div>
      </div>

      {/* Distributive Powers Teaser (Chapter 12) */}
      <div className="bg-schillinger-panel/60 rounded-xl p-3.5 border border-schillinger-border/70 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-schillinger-accentA" />
            Distributive Square of Binomial (Chapter 12)
          </span>
          <span className="text-[11px] font-mono text-schillinger-accentA font-bold">
            (a + b)² = {distSquareSum}
          </span>
        </div>
        <p className="text-[11px] text-schillinger-textMuted font-mono">
          ({a} + {b})² → a² + ab + ab + b² = <span className="text-white font-bold">{distSquareFormula}</span>
        </p>
        <p className="text-[10px] text-gray-500 leading-relaxed">
          In Schillinger's system, powers express harmonic contrast across measures, generating organic counterthemes to the primary resultant.
        </p>
      </div>
    </div>
  );
};
