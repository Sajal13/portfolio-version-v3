import { FloatingAlign, FloatingSide } from './overlay';

export type TooltipContextValue = {
  open: boolean;
  show: () => void;
  hide: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  floatingRef: React.RefObject<HTMLElement | null>;
  coords: { top: number; left: number } | null;
};

export type TooltipProps = {
  delayDuration?: number;
  side?: FloatingSide;
  align?: FloatingAlign;
};
