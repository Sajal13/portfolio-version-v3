'use client';

import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { Portfolio } from '@repo/types';
import PageHeader from 'components/common/PageHeader';
import { CARD_GAP, CARD_WIDTH } from 'data/portfolio';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MarqueeNavButton } from './MarqueeNavButton';
import { PortfolioCard } from './PortfolioCard';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);

ScrollTrigger.config({ ignoreMobileResize: true });

const MOBILE_BREAKPOINT = 640;
const MOBILE_SIDE_INSET = 32;

interface PortfolioMarqueeProps {
  items: Portfolio[];
}

export function PortfolioMarquee({ items }: PortfolioMarqueeProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const indexRef = useRef(0);

  const [containerWidth, setContainerWidth] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(items.length <= 1);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(Math.round(entry!.contentRect?.width));
    });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const isMobile = containerWidth > 0 && containerWidth < MOBILE_BREAKPOINT;
  const cardWidth =
    containerWidth === 0
      ? CARD_WIDTH
      : isMobile
        ? containerWidth - MOBILE_SIDE_INSET * 2
        : CARD_WIDTH;
  const cardStep = cardWidth + CARD_GAP;
  const sidePadding = isMobile
    ? Math.max(0, (containerWidth - cardWidth) / 2)
    : 24;

  useGSAP(
    () => {
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section || items.length === 0 || containerWidth === 0) {
        return;
      }

      const distance = (items.length - 1) * cardStep;
      indexRef.current = 0;

      if (distance <= 0) {
        setAtStart(true);
        setAtEnd(true);
        return;
      }

      const tween = gsap.to(track, {
        x: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${distance}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const index = Math.round(self.progress * (items.length - 1));
            indexRef.current = index;
            setAtStart(index <= 0);
            setAtEnd(index >= items.length - 1);
          }
        }
      });

      stRef.current = tween.scrollTrigger ?? null;

      // This section's pin spacer just changed the total document height,
      // which shifts the pixel position of every ScrollTrigger BELOW it
      // (e.g. the Experience timeline). Force a global recompute so those
      // triggers pick up the new layout instead of using stale start/end
      // values cached before this pin spacer existed.
      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { scope: sectionRef, dependencies: [items, cardStep, containerWidth] }
  );

  const step = (direction: 1 | -1) => {
    const st = stRef.current;
    if (!st) return;

    const targetIndex = gsap.utils.clamp(
      0,
      items.length - 1,
      indexRef.current + direction
    );
    const targetY = st.start + targetIndex * cardStep;

    gsap.to(window, {
      duration: 0.8,
      ease: 'power2.out',
      scrollTo: { y: targetY }
    });
  };

  return (
    <div
      ref={sectionRef}
      id="portfolio"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 py-8 md:py-12"
    >
      <PageHeader
        eyebrow="// digital monuments"
        heading="Featured Works"
        index="03"
        hasNavigation
      >
        <div className="flex gap-2">
          <MarqueeNavButton
            direction="prev"
            onClick={() => step(-1)}
            disabled={atStart}
          />
          <MarqueeNavButton
            direction="next"
            onClick={() => step(1)}
            disabled={atEnd}
          />
        </div>
      </PageHeader>

      <div
        ref={trackRef}
        className="flex gap-6"
        style={{
          width: 'max-content',
          paddingLeft: sidePadding,
          paddingRight: sidePadding
        }}
      >
        {items.map((item) => (
          <div key={item.id} className="shrink-0">
            <PortfolioCard project={item} width={cardWidth} />
          </div>
        ))}
      </div>
    </div>
  );
}
