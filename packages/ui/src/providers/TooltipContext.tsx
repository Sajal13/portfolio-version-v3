'use client';

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';

type Side = 'top' | 'bottom' | 'left' | 'right';
type Align = 'start' | 'center' | 'end';

interface TooltipContextValue {
  open: boolean;
  coords: { top: number; left: number } | null;
  triggerRef: React.RefObject<HTMLElement | null>;
  floatingRef: React.RefObject<HTMLElement | null>;
  show: () => void;
  hide: () => void;
}

const TooltipContext = createContext<TooltipContextValue | null>(null);

const GAP = 8; // px between trigger and floating panel
const VIEWPORT_MARGIN = 8; // px minimum distance kept from any viewport edge
const HIDE_GRACE_MS = 100; // time allowed to move the pointer from trigger to panel

interface TooltipProviderProps {
  delayDuration?: number;
  side?: Side;
  align?: Align;
  children: React.ReactNode;
}

export function TooltipProvider({
  delayDuration = 200,
  side = 'top',
  align = 'center',
  children
}: TooltipProviderProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null
  );
  const triggerRef = useRef<HTMLElement | null>(null);
  const floatingRef = useRef<HTMLElement | null>(null);
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (showTimer.current) clearTimeout(showTimer.current);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    showTimer.current = null;
    hideTimer.current = null;
  };

  // Computes position from the trigger's live rect (accounts for any
  // ancestor transform automatically, since getBoundingClientRect already
  // reflects it) and clamps the result so it can never land off-screen.
  const computeCoords = useCallback(() => {
    const trigger = triggerRef.current;
    const floating = floatingRef.current;
    if (!trigger) return null;

    const triggerRect = trigger.getBoundingClientRect();
    const floatingRect = floating?.getBoundingClientRect();
    const floatingWidth = floatingRect?.width ?? 240;
    const floatingHeight = floatingRect?.height ?? 0;

    let top = 0;
    let left = 0;

    switch (side) {
      case 'top':
        top = triggerRect.top - floatingHeight - GAP;
        break;
      case 'bottom':
        top = triggerRect.bottom + GAP;
        break;
      case 'left':
      case 'right':
        top = triggerRect.top;
        break;
    }

    if (side === 'left') left = triggerRect.left - floatingWidth - GAP;
    else if (side === 'right') left = triggerRect.right + GAP;
    else if (align === 'start') left = triggerRect.left;
    else if (align === 'end') left = triggerRect.right - floatingWidth;
    else left = triggerRect.left + triggerRect.width / 2 - floatingWidth / 2;

    const maxLeft = window.innerWidth - floatingWidth - VIEWPORT_MARGIN;
    const maxTop = window.innerHeight - floatingHeight - VIEWPORT_MARGIN;
    left = Math.min(
      Math.max(left, VIEWPORT_MARGIN),
      Math.max(maxLeft, VIEWPORT_MARGIN)
    );
    top = Math.min(
      Math.max(top, VIEWPORT_MARGIN),
      Math.max(maxTop, VIEWPORT_MARGIN)
    );

    return { top, left };
  }, [side, align]);

  const show = useCallback(() => {
    clearTimers();
    showTimer.current = setTimeout(() => setOpen(true), delayDuration);
  }, [delayDuration]);

  // Grace period before actually closing — lets the pointer travel from the
  // trigger onto the floating panel (e.g. to scroll a long tooltip) without
  // it disappearing mid-transition.
  const hide = useCallback(() => {
    clearTimers();
    hideTimer.current = setTimeout(() => setOpen(false), HIDE_GRACE_MS);
  }, []);

  // Recompute position once the panel has mounted/measured, and keep it
  // pinned while scrolling/resizing with it open.
  useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }

    setCoords(computeCoords());

    const onReposition = () => setCoords(computeCoords());
    window.addEventListener('scroll', onReposition, true);
    window.addEventListener('resize', onReposition);

    return () => {
      window.removeEventListener('scroll', onReposition, true);
      window.removeEventListener('resize', onReposition);
    };
  }, [open, computeCoords]);

  const value = useMemo(
    () => ({ open, coords, triggerRef, floatingRef, show, hide }),
    [open, coords, show, hide]
  );

  return (
    <TooltipContext.Provider value={value}>{children}</TooltipContext.Provider>
  );
}

export function useTooltipContext(component: string) {
  const ctx = useContext(TooltipContext);
  if (!ctx) {
    throw new Error(`${component} must be used within a <Tooltip>`);
  }
  return ctx;
}
