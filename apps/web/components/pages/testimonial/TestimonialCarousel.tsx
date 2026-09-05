'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from '@repo/icons/fa';
import type { Testimonial } from '@repo/types';
import { Button } from '@repo/ui/components';
import { cn } from '@repo/ui/utils';
import PageHeader from 'components/common/PageHeader';
import gsap from 'gsap';
import { TestimonialCard } from './TestimonialCard';

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  autoplayDelay?: number;
}

export const TestimonialsCarousel = ({
  testimonials,
  autoplayDelay = 5000
}: TestimonialsCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isHovering = useRef(false);

  const count = testimonials.length;

  const goTo = useCallback(
    (index: number) => {
      const nextIndex = ((index % count) + count) % count;
      setActiveIndex(nextIndex);
    },
    [count]
  );

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  // Slide the track so the active card's left edge sits at the container's left edge.
  useEffect(() => {
    const activeCard = cardRefs.current[activeIndex];
    if (!activeCard || !trackRef.current) return;

    gsap.to(trackRef.current, {
      x: -activeCard.offsetLeft,
      duration: 0.85,
      ease: 'power3.inOut'
    });

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      gsap.to(card, {
        scale: i === activeIndex ? 1 : 0.94,
        duration: 0.85,
        ease: 'power3.inOut'
      });
    });
  }, [activeIndex]);

  // Autoplay — self-rescheduling timeout. Restarts on every activeIndex
  // change (manual or automatic), so a manual nav click always buys a
  // full `autoplayDelay` window before the next auto-advance.
  useEffect(() => {
    if (count <= 1) return;

    const id = setTimeout(() => {
      if (!isHovering.current) {
        setActiveIndex((i) => (i + 1) % count);
      }
    }, autoplayDelay);

    return () => clearTimeout(id);
  }, [activeIndex, count, autoplayDelay]);

  if (count === 0) return null;

  return (
    <>
      <PageHeader
        eyebrow="// testimonials"
        heading="What They Say"
        index="05"
        hasNavigation
      >
        <div className="flex items-center gap-3">
          <Button
            type="button"
            aria-label="Previous testimonial"
            onClick={prev}
            color="secondary"
            shape="circle"
          >
            <FaChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            aria-label="Next testimonial"
            onClick={next}
            color="secondary"
            shape="circle"
          >
            <FaChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </PageHeader>
      <div
        className="relative"
        onPointerEnter={() => (isHovering.current = true)}
        onPointerLeave={() => (isHovering.current = false)}
      >
        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex item-center gap-6 will-change-transform lg:gap-10"
          >
            {testimonials.map((testimonial, i) => (
              <TestimonialCard
                key={testimonial.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                testimonial={testimonial}
                isActive={i === activeIndex}
              />
            ))}
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {testimonials.map((testimonial, i) => (
              <Button
                key={testimonial.id}
                type="button"
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => goTo(i)}
                className={cn(
                  'h-1.5 min-w-0 p-1 rounded-full transition-all duration-500',
                  i === activeIndex
                    ? 'w-6 bg-violet-400'
                    : 'w-1.5 bg-white/15 hover:bg-white/30'
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
