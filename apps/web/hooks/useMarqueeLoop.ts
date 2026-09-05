'use client';

import { useCallback, useEffect, useRef } from 'react';
import {
  CARD_GAP,
  CARD_WIDTH,
  MARQUEE_SPEED_PX_PER_SEC,
  NUDGE_SCRUB_DURATION
} from 'data/portfolio';
import gsap from 'gsap';
import type { MarqueeDirection } from 'types/portfolio';

interface UseMarqueeLoopOptions {
  direction: MarqueeDirection;
  /** false = render once, no autoplay (not enough items) */
  loop: boolean;
}

/**
 * Drives an infinite horizontal marquee for a track that renders its
 * children TWICE back-to-back (see PortfolioRow). Looping is done by
 * tweening `x` between 0 and -distance, where distance is the width of
 * ONE set of items — that's seamless because the second set is visually
 * identical to the first, so snapping back at the end of the cycle is
 * invisible.
 *
 * "left"  → content scrolls leftward  (x: 0 → -distance)
 * "right" → content scrolls rightward (x: -distance → 0)
 */
export const useMarqueeLoop = (
  trackRef: React.RefObject<HTMLDivElement | null>,
  { direction, loop }: UseMarqueeLoopOptions
) => {
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const scrubTweenRef = useRef<gsap.core.Tween | null>(null);
  const distanceRef = useRef(0);
  const hoverPausedRef = useRef(false);
  const navPausedRef = useRef(false);

  const applyPauseState = useCallback(() => {
    const tween = tweenRef.current;
    if (!tween) return;
    if (hoverPausedRef.current || navPausedRef.current) {
      tween.pause();
    } else {
      tween.play();
    }
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !loop) return;

    const distance = track.scrollWidth / 2;
    if (!distance) return;
    distanceRef.current = distance;

    const startX = direction === 'left' ? 0 : -distance;
    const endX = direction === 'left' ? -distance : 0;

    const tween = gsap.fromTo(
      track,
      { x: startX },
      {
        x: endX,
        duration: distance / MARQUEE_SPEED_PX_PER_SEC,
        ease: 'none',
        repeat: -1
      }
    );
    tweenRef.current = tween;

    return () => {
      scrubTweenRef.current?.kill();
      tween.kill();
      tweenRef.current = null;
    };
  }, [direction, loop, trackRef]);

  const onHoverStart = useCallback(() => {
    hoverPausedRef.current = true;
    applyPauseState();
  }, [applyPauseState]);

  const onHoverEnd = useCallback(() => {
    hoverPausedRef.current = false;
    applyPauseState();
  }, [applyPauseState]);

  /** Nudges the loop forward/back by roughly one card, without breaking the seamless cycle. */
  const nudge = useCallback(
    (steps: 1 | -1) => {
      const tween = tweenRef.current;
      const distance = distanceRef.current;
      if (!tween || !distance) return;

      navPausedRef.current = true;
      tween.pause();
      scrubTweenRef.current?.kill();

      const cardStep = CARD_WIDTH + CARD_GAP;
      const timeStep = (cardStep / distance) * tween.duration();
      // totalTime (not time) so this keeps working across repeat cycles instead
      // of clamping at each cycle's 0/duration boundary.
      const nextTotalTime = Math.max(0, tween.totalTime() + steps * timeStep);

      scrubTweenRef.current = gsap.to(tween, {
        totalTime: nextTotalTime,
        duration: NUDGE_SCRUB_DURATION,
        ease: 'power2.out',
        onComplete: () => {
          navPausedRef.current = false;
          applyPauseState();
        }
      });
    },
    [applyPauseState]
  );

  return { onHoverStart, onHoverEnd, nudge };
};
