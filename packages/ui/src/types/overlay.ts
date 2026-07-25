/* ------------------------------------------------------------------ */
/* Positioning — the replacement for Floating UI / Radix's Popper      */
/* ------------------------------------------------------------------ */

export type FloatingSide = 'top' | 'bottom' | 'left' | 'right';
export type FloatingAlign = 'start' | 'center' | 'end';

export const OPPOSITE_SIDE: Record<FloatingSide, FloatingSide> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left'
};

export type UseFloatingPositionOptions = {
  open: boolean;
  side?: FloatingSide;
  align?: FloatingAlign;
  sideOffset?: number;
  alignOffset?: number;
};
