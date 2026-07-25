import { FloatingAlign, FloatingSide } from './overlay';

export type HoverCardContextValue = {
  open: boolean;
  show: () => void;
  hide: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  floatingRef: React.RefObject<HTMLElement | null>;
  coords: { top: number; left: number } | null;
};

export type HoverCardProps = {
  openDelay?: number;
  closeDelay?: number;
  side?: FloatingSide;
  align?: FloatingAlign;
};
