export type PaletteColor = { name: string; stroke: string; dim: string };

// curated, not rainbow-default — cycles per category
export const PALETTE: PaletteColor[] = [
  { name: 'teal', stroke: '#5EEAD4', dim: '#134E4A' },
  { name: 'amber', stroke: '#FBBF24', dim: '#4B3A0A' },
  { name: 'sky', stroke: '#38BDF8', dim: '#0C3A52' },
  { name: 'rose', stroke: '#FB7185', dim: '#4C1D2A' },
  { name: 'violet', stroke: '#A78BFA', dim: '#332155' },
  { name: 'lime', stroke: '#A3E635', dim: '#2F3A0A' }
];

export const CX = 450;
export const CY = 450;
export const R1 = 130; // category ring
export const R2 = 235; // parent hub ring / direct-leaf ring
export const R3 = 335; // leaf-under-parent ring
export const VIEWBOX = 900;
