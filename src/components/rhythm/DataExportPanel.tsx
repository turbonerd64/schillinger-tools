import React, { useState } from 'react';
import { ResultantOutput, RhythmVariationState } from '../../core/rhythm/types';
import { downloadMidiFile, MidiNoteEvent } from '../../core/export/midi';
import { exportRhythmToJson, downloadJsonFile } from '../../core/export/json';
import { Download, Copy, Check, FileText, Music, Code } from 'lucide-react';

interface DataExportPanelProps {
  resultant: ResultantOutput;
  variations: RhythmVariationState;
  displayedDurations: number[];
  displayedAccents: number[];
  bpm: number;
}

export const DataExportPanel: React.FC<DataExportPanelProps> = ({
  resultant,
  variations,
  displayedDurations,
  displayedAccents,
  bpm,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const durationString = displayedDurations.join(' + ');
  const arrayString = `[${displayedDurations.join(', ')}]`;

  const handleCopyArray = () => {
    navigator.clipboard.writeText(arrayString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportMidi = () => {
    const accentSet = new Set(displayedAccents);
    const notes: MidiNoteEvent[] = displayedDurations.map((dur, i) => ({
      durationUnits: dur,
      isAccented: accentSet.has(i),
    }));

    const filename = `schillinger_${resultant.mode}_${resultant.generators.a}_${resultant.generators.b}`;
    downloadMidiFile(notes, filename, bpm, `Schillinger ${resultant.mode}`);

    setDownloadSuccess('MIDI File Downloaded');
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  const handleExportJson = () => {
    const jsonStr = exportRhythmToJson(resultant, variations, bpm);
    const filename = `schillinger_preset_${resultant.generators.a}_${resultant.generators.b}.json`;
    downloadJsonFile(jsonStr, filename);

    setDownloadSuccess('JSON Preset Downloaded');
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  return (
    <div className="bg-schillinger-card rounded-2xl border border-schillinger-border p-5 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-schillinger-border/60 pb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-schillinger-resultant" />
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            Pattern Data & Export
          </h2>
        </div>
        {downloadSuccess && (
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1 animate-pulse">
            <Check className="w-3 h-3" /> {downloadSuccess}
          </span>
        )}
      </div>

      {/* Formatted Equation Display */}
      <div className="bg-schillinger-panel/90 border border-schillinger-border rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between text-xs text-schillinger-textMuted font-mono">
          <span>Resultant Formula (Book I)</span>
          <span>Sum: {resultant.totalLength} units</span>
        </div>
        <div className="text-sm sm:text-base font-mono font-bold text-schillinger-resultant break-all leading-relaxed bg-schillinger-bg/80 p-3 rounded-lg border border-schillinger-border/70 select-all">
          r = {durationString}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Copy Array */}
        <button
          onClick={handleCopyArray}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-schillinger-panel border border-schillinger-border hover:border-gray-500 hover:text-white text-gray-300 text-xs font-mono transition-all active:scale-95 shadow-sm"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-schillinger-accentA" />}
          <span>{copied ? 'Copied Array!' : 'Copy Array'}</span>
        </button>

        {/* Export MIDI */}
        <button
          onClick={handleExportMidi}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-schillinger-accentA/20 to-schillinger-resultant/20 border border-schillinger-accentA/40 hover:border-schillinger-accentA text-white text-xs font-mono font-bold transition-all active:scale-95 shadow-sm"
        >
          <Music className="w-4 h-4 text-schillinger-accentA" />
          <span>Export MIDI (.mid)</span>
        </button>

        {/* Export JSON */}
        <button
          onClick={handleExportJson}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-schillinger-panel border border-schillinger-border hover:border-gray-500 hover:text-white text-gray-300 text-xs font-mono transition-all active:scale-95 shadow-sm"
        >
          <Code className="w-4 h-4 text-schillinger-accentB" />
          <span>Save Preset (.json)</span>
        </button>
      </div>
    </div>
  );
};
