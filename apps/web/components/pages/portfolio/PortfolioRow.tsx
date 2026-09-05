'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Portfolio } from '@repo/types';
import { cn } from '@repo/ui/utils';
import { CARD_WIDTH, MIN_ITEMS_TO_AUTOPLAY } from 'data/portfolio';
import { useMarqueeLoop } from 'hooks/useMarqueeLoop';
import type { MarqueeDirection, MarqueeRowHandle } from 'types/portfolio';
import { PortfolioCard } from './PortfolioCard';

interface PortfolioRowProps {
  items: Portfolio[];
  direction: MarqueeDirection;
}

export const PortfolioRow = forwardRef<MarqueeRowHandle, PortfolioRowProps>(
  function PortfolioRow({ items, direction }, ref) {
    const trackRef = useRef<HTMLDivElement>(null);
    const loop = items.length > MIN_ITEMS_TO_AUTOPLAY;
    const { onHoverStart, onHoverEnd, nudge } = useMarqueeLoop(trackRef, {
      direction,
      loop
    });

    useImperativeHandle(
      ref,
      () => ({ nudge, pause: onHoverStart, resume: onHoverEnd }),
      [nudge, onHoverStart, onHoverEnd]
    );

    // Duplicated so the loop can snap back invisibly — see use-marquee-loop.ts.
    const renderedItems = loop ? [...items, ...items] : items;

    return (
      <div
        className="overflow-hidden"
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
      >
        <div
          ref={trackRef}
          className={cn('flex gap-6', loop ? 'w-max' : 'w-full justify-center')}
        >
          {renderedItems.map((item, i) => (
            <PortfolioCard
              key={`${item.id}-${i}`}
              project={item}
              width={CARD_WIDTH}
            />
          ))}
        </div>
      </div>
    );
  }
);
