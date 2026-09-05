'use client';

import { Fragment, useLayoutEffect, useRef } from 'react';
import { cn } from '@repo/ui/utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ExperienceCard from './ExperienceCard';
import { experienceTypeLabel } from './experience-meta';
import { TimelineEntry } from './group-experience';

gsap.registerPlugin(ScrollTrigger);

interface ExperienceTimelineProps {
  entries: TimelineEntry[];
}

const ExperienceTimeline = ({ entries }: ExperienceTimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const desktopRef = useRef<HTMLDivElement>(null); // measurement reference for the bar
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<Array<HTMLDivElement | null>>([]);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const mobileCardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const desktop = desktopRef.current;
    if (!container || !desktop || !entries.length) return;

    const ctx = gsap.context(() => {
      const positionLine = () => {
        const firstDot = dotRefs.current[0];
        const lastDot = dotRefs.current[dotRefs.current.length - 1];
        if (!firstDot || !lastDot) return;

        const desktopTop = desktop.getBoundingClientRect().top;
        const top =
          firstDot.getBoundingClientRect().top -
          desktopTop +
          firstDot.offsetHeight / 2;
        const bottom =
          lastDot.getBoundingClientRect().top -
          desktopTop +
          lastDot.offsetHeight / 2;

        [trackRef.current, progressRef.current].forEach((el) => {
          if (!el) return;
          el.style.top = `${top}px`;
          el.style.height = `${Math.max(bottom - top, 0)}px`;
        });
      };

      positionLine();

      const desktopCards = cardRefs.current.filter(Boolean) as HTMLDivElement[];

      gsap.set(progressRef.current, { scaleY: 0, transformOrigin: 'top' });
      gsap.set(desktopCards, { autoAlpha: 0, y: 48 });

      // The progress LINE is a single continuous visual, so it's correct to
      // scrub it against the whole container's scroll range.
      gsap.to(progressRef.current, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom-=80',
          end: 'bottom center',
          scrub: 0.6,
          invalidateOnRefresh: true
        }
      });

      // Each CARD's reveal must be tied to that specific card entering the
      // viewport — not to a fraction of the container's overall timeline.
      // Using index/length as a progress fraction (the old approach) has
      // no relationship to where that card physically sits on screen, so
      // on a tall container the whole reveal sequence can finish well
      // before the later cards have actually scrolled into view. This
      // mirrors the mobile batch below: each card animates on its own
      // entrance.
      if (desktopCards.length) {
        ScrollTrigger.batch(desktopCards, {
          // Pushed from 'top 85%' to 'top 90%': the trigger now fires while
          // the card is still lower on screen (closer to the viewport's
          // bottom edge), giving the y: 48 -> 0 slide real travel distance
          // to be visible before the card reaches a natural reading
          // position — instead of firing when it's already mostly in view.
          start: 'top center',
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              stagger: 0.1,
              ease: 'power2.out'
            }),
          onLeaveBack: (batch) =>
            gsap.to(batch, { autoAlpha: 0, y: 48, stagger: 0.1 })
        });
      }

      const mobileCards = mobileCardRefs.current.filter(
        Boolean
      ) as HTMLDivElement[];
      if (mobileCards.length) {
        gsap.set(mobileCards, { autoAlpha: 0, y: 32 });
        ScrollTrigger.batch(mobileCards, {
          start: 'top bottom-=60',
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              stagger: 0.1,
              ease: 'power2.out'
            }),
          onLeaveBack: (batch) =>
            gsap.to(batch, { autoAlpha: 0, y: 32, stagger: 0.1 })
        });
      }

      const ro = new ResizeObserver(() => {
        positionLine();
        ScrollTrigger.refresh();
      });
      ro.observe(desktop);

      return () => ro.disconnect();
    }, container);

    return () => ctx.revert();
  }, [entries.length]);

  let lastGroup: string | null = null;

  return (
    <div ref={containerRef} className="relative">
      {/* ---------------- MOBILE: simple stacked list, own DOM tree ---------------- */}
      <div className="relative md:hidden">
        <div className="absolute left-4 top-0 bottom-0 w-px -translate-x-1/2 bg-white/10" />
        <div className="flex flex-col gap-10">
          {entries.map((entry, i) => {
            const showGroupLabel =
              entry.isGroupStart && entry.groupType !== lastGroup;
            if (showGroupLabel) lastGroup = entry.groupType;
            return (
              <Fragment key={entry.experience.id}>
                {showGroupLabel && (
                  <p className="pl-10 font-mono text-xs tracking-widest text-neutral-500">
                    // {experienceTypeLabel[entry.groupType]}
                  </p>
                )}
                <div className="relative pl-10">
                  <div
                    className={cn(
                      'absolute left-4 top-7 h-3 w-3 -translate-x-1/2 rounded-full',
                      entry.experience.endDate === null
                        ? 'bg-info-400 shadow-info-400/50 shadow-[0_0_12px]'
                        : 'bg-violet-400'
                    )}
                  />
                  <ExperienceCard
                    experience={entry.experience}
                    ref={(el) => {
                      mobileCardRefs.current[i] = el;
                    }}
                  />
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>

      {/* ---------------- DESKTOP: own DOM tree, no shared grid tracks ---------------- */}
      <div ref={desktopRef} className="relative hidden md:block!">
        <div
          ref={trackRef}
          className="absolute left-1/2 w-px -translate-x-1/2 bg-white/10"
        />
        <div
          ref={progressRef}
          className="from-info-400 to-violet-400 absolute left-1/2 w-px -translate-x-1/2 bg-gradient-to-b"
        />

        <div className="flex flex-col gap-16">
          {(() => {
            lastGroup = null;
            return entries.map((entry, i) => {
              const showGroupLabel =
                entry.isGroupStart && entry.groupType !== lastGroup;
              if (showGroupLabel) lastGroup = entry.groupType;
              const side: 'left' | 'right' = i % 2 === 0 ? 'right' : 'left';

              return (
                <Fragment key={entry.experience.id}>
                  {showGroupLabel && (
                    <p className="text-center font-mono text-xs tracking-widest text-neutral-500 lg:hidden">
                      // {experienceTypeLabel[entry.groupType]}
                    </p>
                  )}
                  <div
                    className={cn(
                      'relative flex',
                      side === 'right' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {/* connector dash, absolutely centered — never depends on card width */}
                    <span
                      className={cn(
                        'absolute top-7 h-px w-8 border-t border-dashed border-white/20',
                        side === 'right' ? 'left-1/2' : 'right-1/2'
                      )}
                    />
                    {/* dot, absolutely centered */}
                    <div
                      ref={(el) => {
                        dotRefs.current[i] = el;
                      }}
                      className={cn(
                        'border-background absolute left-1/2 top-7 z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2',
                        entry.experience.endDate === null
                          ? 'bg-info-400 shadow-info-400/50 shadow-[0_0_12px]'
                          : 'bg-violet-400'
                      )}
                    />

                    {/* card width is EXPLICITLY calc'd — never inferred from
                        sibling content, so it can't blow out or collapse */}
                    <ExperienceCard
                      experience={entry.experience}
                      className="w-[calc(50%-2.5rem)]"
                      ref={(el) => {
                        cardRefs.current[i] = el;
                      }}
                    />
                  </div>
                </Fragment>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
};

export default ExperienceTimeline;
