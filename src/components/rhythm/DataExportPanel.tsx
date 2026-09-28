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
    downloadMidiFile(notes, filename, bpm, `Schillinger Resultant`);

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
    <div className="bg-white rounded-2xl border-2 border-slate-900 p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#c84b31]" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Pattern Data & Export
          </h2>
        </div>
        {downloadSuccess && (
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> {downloadSuccess}
          </span>
        )}
      </div>

      {/* Formatted Equation Display */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Resultant Formula</span>
          <span>Total Cycle: <strong>{resultant.totalLength}</strong> units</span>
        </div>
        <div className="text-base sm:text-lg font-mono font-extrabold text-slate-900 break-all bg-white p-3 rounded-lg border-2 border-slate-300 select-all">
          r = {durationString}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={handleCopyArray}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold transition-all shadow-2xs active:scale-95"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied Array!' : 'Copy Array'}</span>
        </button>

        <button
          onClick={handleExportMidi}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-[#c84b31] bg-[#fdf0ec] text-[#c84b31] hover:bg-[#c84b31] hover:text-white text-xs font-bold transition-all shadow-2xs active:scale-95"
        >
          <Music className="w-4 h-4" />
          <span>Export MIDI (.mid)</span>
        </button>

        <button
          onClick={handleExportJson}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold transition-all shadow-2xs active:scale-95"
        >
          <Code className="w-4 h-4" />
          <span>Save Preset (.json)</span>
        </button>
      </div>
    </div>
  );
};
