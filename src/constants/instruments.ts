export const INSTRUMENTS = [
  // Cordas
  'bass',
  'electric_guitar',
  'acoustic_guitar',
  'classical_guitar',
  'ukulele',
  'violin',
  'viola',
  'cello',
  'double_bass',
  'banjo',
  'mandolin',
  'harp',
  // Teclas
  'piano',
  'keyboard',
  'organ',
  'synthesizer',
  // Sopros
  'flute',
  'clarinet',
  'saxophone',
  'trumpet',
  'trombone',
  'tuba',
  'harmonica',
  // Percussão
  'drums',
  'percussion',
  'cajon',
  'marimba',
  // Voz
  'vocals',
  // Outro
  'other',
] as const;

export type Instrument = (typeof INSTRUMENTS)[number];
