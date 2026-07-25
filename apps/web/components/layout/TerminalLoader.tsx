'use client';

import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import {
  TERMINAL_LINES,
  TYPE_SPEED_MS,
  LINE_PAUSE_MS,
  HOLD_BEFORE_EXIT_MS
} from 'data/gsap';

interface TerminalLoaderProps {
  onComplete: () => void;
}

export default function TerminalLoader({ onComplete }: TerminalLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [lines, setLines] = useState<string[]>(['']);
  const [typingDone, setTypingDone] = useState(false);

  useGSAP(
    () => {
      // Entrance: terminal card fades + scales in.
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.94, y: 12 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );

      // Blinking cursor, runs the whole time the loader is visible.
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'steps(1)'
      });

      // Drive the typewriter effect with plain timers — mutating text
      // through React state keeps this predictable and easy to follow,
      // while GSAP handles all the actual motion/easing work above.
      let lineIndex = 0;
      let charIndex = 0;
      let cancelled = false;

      const typeNextChar = () => {
        if (cancelled) return;

        const currentFullLine = TERMINAL_LINES[lineIndex];

        if (!currentFullLine) return;

        if (charIndex <= currentFullLine.length) {
          setLines((prev) => {
            const next = [...prev];
            next[lineIndex] = currentFullLine.slice(0, charIndex);
            return next;
          });

          // Nudge the progress bar forward as characters are typed.
          const totalChars = TERMINAL_LINES.join('').length;
          const typedSoFar =
            TERMINAL_LINES.slice(0, lineIndex).join('').length + charIndex;
          gsap.to(progressBarRef.current, {
            width: `${Math.min((typedSoFar / totalChars) * 100, 100)}%`,
            duration: 0.15,
            ease: 'power1.out'
          });

          charIndex += 1;
          setTimeout(typeNextChar, TYPE_SPEED_MS);
          return;
        }

        // Finished this line — move to the next one, if any.
        lineIndex += 1;
        charIndex = 0;

        if (lineIndex < TERMINAL_LINES.length) {
          setLines((prev) => [...prev, '']);
          setTimeout(typeNextChar, LINE_PAUSE_MS);
        } else {
          setTypingDone(true);
          setTimeout(runExitAnimation, HOLD_BEFORE_EXIT_MS);
        }
      };

      const runExitAnimation = () => {
        const tl = gsap.timeline({ onComplete });

        tl.to(cardRef.current, {
          opacity: 0,
          scale: 0.96,
          duration: 0.35,
          ease: 'power2.in'
        }).to(
          containerRef.current,
          {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.inOut'
          },
          '-=0.1'
        );
      };

      const startDelay = setTimeout(typeNextChar, 400);

      return () => {
        cancelled = true;
        clearTimeout(startDelay);
      };
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-100 flex-center bg-black"
    >
      <div
        ref={cardRef}
        className="w-[90%] max-w-2xl overflow-hidden rounded-lg border border-neutral-800 bg-[#0d1117] shadow-2xl"
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-neutral-800 bg-[#161b22] px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          <span className="ml-3 font-mono text-xs text-neutral-500">
            sajal@portfolio: ~
          </span>
        </div>

        {/* Body */}
        <div className="min-h-70 px-6 py-5 font-mono text-sm leading-relaxed">
          {lines.map((line, i) => {
            const isCommand = TERMINAL_LINES[i]?.startsWith('$ ');
            const isLast = i === lines.length - 1;

            return (
              <div
                key={i}
                className={isCommand ? 'text-neutral-200' : 'text-emerald-400'}
              >
                {line}
                {isLast && !typingDone && (
                  <span ref={i === lines.length - 1 ? cursorRef : undefined}>
                    ▍
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full bg-neutral-800">
          <div ref={progressBarRef} className="h-full w-0 bg-emerald-500" />
        </div>
      </div>
    </div>
  );
}
