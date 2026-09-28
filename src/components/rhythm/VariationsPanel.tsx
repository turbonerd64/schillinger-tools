import React from 'react';
import { ResultantOutput, RhythmVariationState } from '../../core/rhythm/types';
import { ArrowLeftRight, RotateCw, RefreshCw, Cpu } from 'lucide-react';

interface VariationsPanelProps {
  resultant: ResultantOutput;
  variations: RhythmVariationState;
  setVariations: React.Dispatch<React.SetStateAction<RhythmVariationState>>;
}

export const VariationsPanel: React.FC<VariationsPanelProps> = ({
  resultant,
  variations,
  setVariations,
}) => {
  const { a, b } = resultant.generators;

  // Distributive Square calculation: (a + b)^2 = a^2 + ab + ab + b^2
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
    <div className="bg-white rounded-2xl border-2 border-slate-900 p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <RotateCw className="w-4 h-4 text-[#c84b31]" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Variations & Permutations
          </h2>
        </div>
        {(variations.isReversed || variations.rotationOffset !== 0) && (
          <button
            onClick={handleResetVariations}
            className="text-xs font-mono font-bold text-[#c84b31] hover:underline flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* Variation Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Retrograde (Reverse) */}
        <button
          onClick={handleToggleReverse}
          className={`flex items-center justify-between p-3.5 rounded-xl border-2 transition-all ${
            variations.isReversed
              ? 'bg-[#c84b31] border-[#c84b31] text-white shadow-sm'
              : 'bg-slate-50 border-slate-300 text-slate-800 hover:border-slate-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <ArrowLeftRight className="w-4 h-4" />
            <div className="text-left">
              <div className="text-xs font-mono font-bold">Retrograde (Reverse)</div>
              <div className="text-[10px] opacity-80">Invert time sequence</div>
            </div>
          </div>
          <span
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
              variations.isReversed
                ? 'bg-white text-[#c84b31] border-white'
                : 'bg-white text-slate-500 border-slate-300'
            }`}
          >
            {variations.isReversed ? 'ACTIVE' : 'OFF'}
          </span>
        </button>

        {/* Circular Permutation (Rotate) */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border-2 border-slate-300">
          <div className="text-left">
            <div className="text-xs font-mono font-bold text-slate-900">Circular Permutation</div>
            <div className="text-[10px] text-slate-500">
              Shift: <span className="text-[#c84b31] font-bold font-mono">{variations.rotationOffset}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleRotate(-1)}
              className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-xs font-mono font-bold hover:border-slate-900 active:scale-95 transition-all flex items-center justify-center"
              title="Rotate Left (-1)"
            >
              ◀
            </button>
            <button
              onClick={() => handleRotate(1)}
              className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-xs font-mono font-bold hover:border-slate-900 active:scale-95 transition-all flex items-center justify-center"
              title="Rotate Right (+1)"
            >
              ▶
            </button>
          </div>
        </div>
      </div>

      {/* Distributive Powers Preview */}
      <div className="bg-[#fdf0ec] rounded-xl p-3.5 border border-[#c84b31]/30 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#c84b31] flex items-center gap-1.5 font-mono">
            <Cpu className="w-3.5 h-3.5" />
            Distributive Square of Binomial
          </span>
          <span className="text-xs font-mono text-[#c84b31] font-bold">
            (a + b)² = {distSquareSum}
          </span>
        </div>
        <p className="text-xs text-slate-800 font-mono">
          ({a} + {b})² → a² + ab + ab + b² = <span className="font-bold">{distSquareFormula}</span>
        </p>
      </div>
    </div>
  );
};
