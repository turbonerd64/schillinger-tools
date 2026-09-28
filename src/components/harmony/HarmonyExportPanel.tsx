import React, { useState } from 'react';
import { ChordItem } from '../../core/harmony/engine';
import { downloadMidiFile, MidiNoteEvent } from '../../core/export/midi';
import { Copy, Check, Music, Code, Download } from 'lucide-react';

interface HarmonyExportPanelProps {
  chords: ChordItem[];
  bpm: number;
}

export const HarmonyExportPanel: React.FC<HarmonyExportPanelProps> = ({ chords, bpm }) => {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [midiSuccess, setMidiSuccess] = useState(false);

  const chordString = chords.map((c) => c.chordName).join(' - ');

  const handleCopyText = () => {
    navigator.clipboard.writeText(chordString);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCopyJson = () => {
    const payload = JSON.stringify(
      {
        timestamp: new Date().toISOString(),
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
    // Generate MIDI file: 1 measure (4 beats = 16 atomic units) per chord
    const notes: MidiNoteEvent[] = [];
    chords.forEach((c) => {
      // Add each voiced note
      c.voicedMidiNotes.forEach((pitch, voiceIdx) => {
        notes.push({
          durationUnits: 4, // 1 beat or full chord duration
          isAccented: voiceIdx === 0,
          pitch,
        });
      });
    });

    downloadMidiFile(notes, 'schillinger_harmony_progression', bpm, 'Schillinger Chords');
    setMidiSuccess(true);
    setTimeout(() => setMidiSuccess(false), 2500);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-900 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Harmonic Progression Export
        </h3>
        {midiSuccess && (
          <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> MIDI Exported
          </span>
        )}
      </div>

      {/* Formatted Chord String */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
          Chord Progression String:
        </div>
        <div className="text-sm font-mono font-bold text-slate-900 select-all break-words">
          {chordString}
        </div>
      </div>

      {/* Export Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={handleCopyText}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold transition-all shadow-2xs active:scale-95"
        >
          {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          <span>{copiedText ? 'Copied Symbols!' : 'Copy Chord Symbols'}</span>
        </button>

        <button
          onClick={handleExportMidi}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-[#c84b31] bg-[#fdf0ec] text-[#c84b31] hover:bg-[#c84b31] hover:text-white text-xs font-bold transition-all shadow-2xs active:scale-95"
        >
          <Music className="w-4 h-4" />
          <span>Export Voiced MIDI (.mid)</span>
        </button>

        <button
          onClick={handleCopyJson}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold transition-all shadow-2xs active:scale-95"
        >
          {copiedJson ? <Check className="w-4 h-4 text-emerald-600" /> : <Code className="w-4 h-4" />}
          <span>{copiedJson ? 'Copied JSON!' : 'Copy Progression JSON'}</span>
        </button>
      </div>
    </div>
  );
};
