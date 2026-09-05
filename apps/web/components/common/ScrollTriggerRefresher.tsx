'use client';

import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Keeps every ScrollTrigger on the page in sync with the real document height.
 *
 * Pinned sections (e.g. PortfolioMarquee) insert a pin-spacer that changes
 * document.body's height asynchronously, after other ScrollTriggers (e.g.
 * ExperienceTimeline) may have already been created with start/end values
 * baked in against the OLD height. Rather than trying to time a single
 * refresh() call to run after that specific change (fragile — depends on
 * exact effect/frame ordering across unrelated components), this watches
 * body height directly and refreshes whenever it moves, regardless of
 * what caused the change or which component caused it.
 */
export function ScrollTriggerRefresher() {
  useEffect(() => {
    let frame: number;

    const scheduleRefresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    const ro = new ResizeObserver(scheduleRefresh);
    ro.observe(document.body);

    // Belt-and-suspenders: catches any late layout shift from images/fonts
    // that finish after `load` in edge cases the observer might race.
    window.addEventListener('load', scheduleRefresh);

    return () => {
      ro.disconnect();
      window.removeEventListener('load', scheduleRefresh);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
