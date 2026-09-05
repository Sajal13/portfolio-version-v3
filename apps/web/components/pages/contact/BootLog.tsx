'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { BOOT_LINES } from './contact.constants';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

export default function BootLog() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<Array<HTMLDivElement | null>>([]);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      lineRefs.current.forEach((el, i) => {
        if (el) el.textContent = BOOT_LINES[i] ?? '';
      });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          once: true
        }
      });

      BOOT_LINES.forEach((line, i) => {
        const el = lineRefs.current[i];
        if (!el) return;
        tl.to(
          el,
          {
            text: { value: line },
            duration: line.length * 0.018,
            ease: 'none'
          },
          i === 0 ? 0 : '+=0.2'
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="mb-6">
      {BOOT_LINES.map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            lineRefs.current[i] = el;
          }}
          className={i === 0 ? 'text-[#00D4FF]' : 'text-gray-500'}
        />
      ))}
    </div>
  );
}
