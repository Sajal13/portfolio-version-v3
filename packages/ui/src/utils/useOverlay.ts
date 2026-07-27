'use client';

import * as React from 'react';
import {
  FloatingSide,
  OPPOSITE_SIDE,
  UseFloatingPositionOptions
} from '@/types/overlay';

/**
 * Computes fixed-position coordinates for a floating element relative to
 * its trigger. Flips to the opposite side if the preferred side doesn't
 * fit in the viewport, then clamps to viewport edges. This is a simplified
 * version of what Floating UI does — one flip attempt, no auto-placement
 * across all 4 sides, no arrow/middleware pipeline.
 */
function useFloatingPosition({
  open,
  side = 'bottom',
  align = 'center',
  sideOffset = 6,
  alignOffset = 0
}: UseFloatingPositionOptions) {
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const floatingRef = React.useRef<HTMLElement | null>(null);
  const [coords, setCoords] = React.useState<{
    top: number;
    left: number;
  } | null>(null);
  const [actualSide, setActualSide] = React.useState<FloatingSide>(side);

  const updatePosition = React.useCallback(() => {
    const trigger = triggerRef.current;
    const floating = floatingRef.current;
    if (!trigger || !floating) return;

    const triggerRect = trigger.getBoundingClientRect();
    const floatingRect = floating.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const fits = (candidate: FloatingSide) => {
      if (candidate === 'top')
        return triggerRect.top - floatingRect.height - sideOffset >= 0;
      if (candidate === 'bottom')
        return triggerRect.bottom + floatingRect.height + sideOffset <= vh;
      if (candidate === 'left')
        return triggerRect.left - floatingRect.width - sideOffset >= 0;
      return triggerRect.right + floatingRect.width + sideOffset <= vw;
    };

    const finalSide =
      !fits(side) && fits(OPPOSITE_SIDE[side]) ? OPPOSITE_SIDE[side] : side;

    let top = 0;
    let left = 0;

    if (finalSide === 'top' || finalSide === 'bottom') {
      top =
        finalSide === 'top'
          ? triggerRect.top - floatingRect.height - sideOffset
          : triggerRect.bottom + sideOffset;
      if (align === 'start') left = triggerRect.left + alignOffset;
      else if (align === 'end')
        left = triggerRect.right - floatingRect.width - alignOffset;
      else
        left =
          triggerRect.left +
          triggerRect.width / 2 -
          floatingRect.width / 2 +
          alignOffset;
    } else {
      left =
        finalSide === 'left'
          ? triggerRect.left - floatingRect.width - sideOffset
          : triggerRect.right + sideOffset;
      if (align === 'start') top = triggerRect.top + alignOffset;
      else if (align === 'end')
        top = triggerRect.bottom - floatingRect.height - alignOffset;
      else
        top =
          triggerRect.top +
          triggerRect.height / 2 -
          floatingRect.height / 2 +
          alignOffset;
    }

    const padding = 8;
    left = Math.min(Math.max(left, padding), vw - floatingRect.width - padding);
    top = Math.min(Math.max(top, padding), vh - floatingRect.height - padding);

    setCoords({ top, left });
    setActualSide(finalSide);
  }, [side, align, sideOffset, alignOffset]);

  React.useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }
    // measure after the floating element has painted so its real size is known
    updatePosition();
    const handle = () => updatePosition();
    window.addEventListener('scroll', handle, true);
    window.addEventListener('resize', handle);
    return () => {
      window.removeEventListener('scroll', handle, true);
      window.removeEventListener('resize', handle);
    };
  }, [open, updatePosition]);

  return { triggerRef, floatingRef, coords, side: actualSide };
}

/* ------------------------------------------------------------------ */
/* Dismissal behavior                                                  */
/* ------------------------------------------------------------------ */

function useEscapeKey(enabled: boolean, onEscape: () => void) {
  React.useEffect(() => {
    if (!enabled) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onEscape();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [enabled, onEscape]);
}

function useOutsideClick(
  enabled: boolean,
  refs: Array<React.RefObject<HTMLElement | null>>,
  onOutside: () => void
) {
  React.useEffect(() => {
    if (!enabled) return;
    const handler = (e: PointerEvent) => {
      const target = e.target as Node;
      const isInside = refs.some((ref) => ref.current?.contains(target));
      if (!isInside) onOutside();
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, [enabled, refs, onOutside]);
}

/* ------------------------------------------------------------------ */
/* Modal-only behavior (Dialog)                                        */
/* ------------------------------------------------------------------ */

function useScrollLock(active: boolean) {
  React.useEffect(() => {
    if (!active) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [active]);
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>,
  active: boolean
) {
  React.useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const getFocusable = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

    getFocusable()[0]?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const items = getFocusable();

      if (items.length === 0) return;

      const first = items[0]!;
      const last = items[items.length - 1]!;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [active, containerRef]);
}

export {
  useFloatingPosition,
  useEscapeKey,
  useOutsideClick,
  useScrollLock,
  useFocusTrap
};
