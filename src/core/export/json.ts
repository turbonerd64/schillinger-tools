import { ResultantOutput, RhythmVariationState } from '../rhythm/types';

export interface SchillingerPresetFile {
  version: '1.0';
  system: 'Schillinger System of Musical Composition';
  module: 'Book I: Theory of Rhythm';
  createdAt: string;
  resultant: ResultantOutput;
  variations: RhythmVariationState;
  bpm: number;
}

export function exportRhythmToJson(
  resultant: ResultantOutput,
  variations: RhythmVariationState,
  bpm: number
): string {
  const payload: SchillingerPresetFile = {
    version: '1.0',
    system: 'Schillinger System of Musical Composition',
    module: 'Book I: Theory of Rhythm',
    createdAt: new Date().toISOString(),
    resultant,
    variations,
    bpm,
  };
  return JSON.stringify(payload, null, 2);
}

export function downloadJsonFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.json') ? filename : `${filename}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
