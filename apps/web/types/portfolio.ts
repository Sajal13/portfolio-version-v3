export type MarqueeDirection = 'left' | 'right';

export interface MarqueeRowHandle {
  nudge: (steps: 1 | -1) => void;
  pause: () => void;
  resume: () => void;
}
