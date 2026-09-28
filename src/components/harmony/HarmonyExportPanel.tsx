import React, { useState } from 'react';
import { ChordItem, formatProgression } from '../../core/harmony/engine';
import { downloadMidiFile, downloadMultiTrackMidiFile, MidiNoteEvent } from '../../core/export/midi';
import {
  HarmonyGroovePattern,
  GrooveStyle,
  generateProgressionArrangement,
} from '../../core/harmony/groove';
import { Copy, Check, Music, Code, Sparkles, Layers } from 'lucide-react';

interface HarmonyExportPanelProps {
  chords: ChordItem[];
  bpm: number;
  tonicRoot: number;
  activeGroove?: HarmonyGroovePattern;
  grooveStyle?: GrooveStyle;
  includePercussion?: boolean;
}

export const HarmonyExportPanel: React.FC<HarmonyExportPanelProps> = ({
  chords,
  bpm,
  tonicRoot,
  activeGroove,
  grooveStyle = 'comping',
  includePercussion = true,
}) => {
  const [format, setFormat] = useState<'symbols' | 'roman' | 'nashville'>('symbols');
  const [copiedText, setCopiedText] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [midiSuccess, setMidiSuccess] = useState(false);
  const [multiTrackSuccess, setMultiTrackSuccess] = useState(false);

  const formattedString = formatProgression(chords, tonicRoot, format);

  const handleCopyText = () => {
    navigator.clipboard.writeText(formattedString);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCopyJson = () => {
    const payload = JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        format,
        progressionString: formattedString,
        progression: chords.map((c) => ({
          step: c.stepIndex + 1,
          chord: c.chordName,
          roman: c.romanNumeral,
          scale: c.sourceScaleName,
          pitchClasses: c.pitchClasses,
          voicedMidi: c.voicedMidiNotes,
        })),
      },
      null,
      2
    );
    navigator.clipboard.writeText(payload);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleExportMidi = () => {
    // Export 1 chord per full measure (16 atomic time units = 4 quarter notes)
    // with all voiced pitches triggered simultaneously as a true polyphonic block
    const notes: MidiNoteEvent[] = chords.map((c) => ({
      durationUnits: 16,
      pitches: c.voicedMidiNotes && c.voicedMidiNotes.length > 0 ? c.voicedMidiNotes : [60],
      velocity: 85,
      gateRatio: 0.95,
      isAccented: false,
    }));

    downloadMidiFile(notes, 'schillinger_harmony_progression', bpm, 'Schillinger Chords');
    setMidiSuccess(true);
    setTimeout(() => setMidiSuccess(false), 2500);
  };

  const handleExportGroovingMidi = () => {
    if (!activeGroove) return;
    const arrangement = generateProgressionArrangement(
      chords,
      activeGroove,
      grooveStyle,
      includePercussion
    );
    downloadMultiTrackMidiFile(
      arrangement.tracks,
      `schillinger_${activeGroove.id}_arrangement`,
      bpm,
      `Schillinger ${activeGroove.name}`
    );
    setMultiTrackSuccess(true);
    setTimeout(() => setMultiTrackSuccess(false), 2500);
  };


  return (
    <div className="bg-white rounded-2xl border-2 border-slate-900 p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wider font-mono">
          Harmonic Progression Export &amp; Formats
        </h3>

        {/* Format Selector Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-300">
          <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-500 uppercase px-1.5">
            Format:
          </span>
          <button
            onClick={() => setFormat('symbols')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold transition-all ${
              format === 'symbols'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            Chord Symbols
          </button>
          <button
            onClick={() => setFormat('roman')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold transition-all ${
              format === 'roman'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            Roman Numerals
          </button>
          <button
            onClick={() => setFormat('nashville')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold transition-all ${
              format === 'nashville'
                ? 'bg-[#c84b31] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            Nashville Numbers
          </button>
        </div>
      </div>

      {/* Formatted Chord String */}
      <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
            {format === 'symbols'
              ? 'Lead Sheet Chord Symbols:'
              : format === 'roman'
              ? 'Schillinger Roman Numerals:'
              : 'Nashville Number System:'}
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {chords.length} steps
          </span>
        </div>
        <div className="text-base sm:text-lg font-mono font-black text-slate-900 select-all break-words tracking-tight bg-white p-3 rounded-lg border border-slate-300 shadow-2xs">
          {formattedString}
        </div>
      </div>

      {/* Export Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={handleCopyText}
          className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-100 text-slate-900 text-xs sm:text-sm font-extrabold font-mono transition-all shadow-2xs active:scale-95"
        >
          {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#c84b31]" />}
          <span>
            {copiedText
              ? 'Copied!'
              : format === 'symbols'
              ? 'Copy Chords'
              : format === 'roman'
              ? 'Copy Roman'
              : 'Copy Nashville'}
          </span>
        </button>

        <button
          onClick={handleCopyJson}
          className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-100 text-slate-900 text-xs sm:text-sm font-extrabold font-mono transition-all shadow-2xs active:scale-95"
        >
          {copiedJson ? <Check className="w-4 h-4 text-emerald-600" /> : <Code className="w-4 h-4 text-slate-700" />}
          <span>{copiedJson ? 'JSON Copied!' : 'Copy JSON'}</span>
        </button>

        <button
          onClick={handleExportMidi}
          className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-100 text-slate-900 text-xs sm:text-sm font-extrabold font-mono transition-all shadow-2xs active:scale-95"
          title="Export standard sustained block chords (Format 0)"
        >
          {midiSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Music className="w-4 h-4 text-slate-700" />}
          <span>{midiSuccess ? 'MIDI Downloaded!' : 'Pad MIDI (SMF 0)'}</span>
        </button>

        <button
          onClick={handleExportGroovingMidi}
          className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl border-2 border-[#c84b31] bg-[#fdf0ec] text-[#c84b31] hover:bg-[#c84b31] hover:text-white text-xs sm:text-sm font-extrabold font-mono transition-all shadow-2xs active:scale-95"
          title="Export multi-track arrangement with drums, bass, and rhythmic chords (Format 1)"
        >
          {multiTrackSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Sparkles className="w-4 h-4" />}
          <span>{multiTrackSuccess ? 'Multi-Track Saved!' : 'Grooving MIDI (SMF 1)'}</span>
        </button>
      </div>
    </div>
  );
};

