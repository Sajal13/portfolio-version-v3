'use client';

import Image from 'next/image';
import { FaQuoteLeft } from '@repo/icons/fa';
import type { Testimonial } from '@repo/types';
import {
  Card,
  CardContent,
  CardFooter,
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@repo/ui/components';
import { cn } from '@repo/ui/utils';

interface TestimonialCardProps {
  testimonial: Testimonial;
  isActive: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

// Rough heuristic for "will this overflow 3 clamped lines at card width".
// Swap for a ResizeObserver-based overflow check if you want it pixel-exact.
const LONG_QUOTE_THRESHOLD = 180;

export function TestimonialCard({
  testimonial,
  isActive,
  ref
}: TestimonialCardProps) {
  const isLong = testimonial.description.length > LONG_QUOTE_THRESHOLD;

  const quote = (
    <p
      className={cn(
        'line-clamp-3 font-sans text-lg leading-relaxed transition-colors duration-700 sm:text-xl',
        isActive ? 'text-neutral-200' : 'text-neutral-600'
      )}
    >
      {testimonial.description}
    </p>
  );

  return (
    <div
      ref={ref}
      data-active={isActive}
      className="group relative shrink-0 basis-full origin-left will-change-transform sm:basis-[75%] lg:basis-[62%] h-full"
    >
      {/* variant="illustration" with no illustrationSrc falls back to the
          default asset — active card only, to match the "active card is
          scaled up + full color" treatment. FaQuoteLeft stays as the quote
          mark itself; that's separate from the Card's corner illustration. */}
      <Card
        variant={isActive ? 'illustration' : 'default'}
        className={cn(
          'border-l-2 relative overflow-hidden z-0 bg-transparent! p-0 transition-border duration-700 ease-out h-full min-h-70',
          'after:absolute after:top-0 after:left-0 after:h-full after:w-full',
          'after:bg-black/40 after:-z-1',
          isActive ? 'border-primary-600' : 'border-white/10'
        )}
      >
        <CardContent className="px-8 pt-8 sm:px-10 sm:pt-10">
          <FaQuoteLeft
            className={cn(
              'mb-6 h-8 w-8 transition-colors duration-700',
              isActive ? 'text-primary-600/70' : 'text-white/10'
            )}
          />

          {isLong ? (
            <Tooltip side="top" align="start">
              <TooltipTrigger className="block w-full text-left">
                {quote}
              </TooltipTrigger>
              <TooltipContent className="max-h-64 max-w-sm mx-2 overflow-y-auto overscroll-contain text-sm leading-relaxed sm:max-w-md">
                {testimonial.description}
              </TooltipContent>
            </Tooltip>
          ) : (
            quote
          )}
        </CardContent>

        <CardFooter className="items-center gap-4 px-8 pb-8 sm:px-10 sm:pb-10">
          <div
            className={cn(
              'relative h-11 w-11 shrink-0 overflow-hidden rounded-full border transition-[border-color,filter] duration-700',
              isActive
                ? 'grayscale-0 border-cyan-400/40'
                : 'grayscale border-white/10'
            )}
          >
            <Image
              src={testimonial.image}
              alt={testimonial.name}
              fill
              sizes="44px"
              className="object-cover"
            />
          </div>

          <div>
            <p
              className={cn(
                'font-mono text-sm font-semibold transition-colors duration-700',
                isActive ? 'text-white' : 'text-neutral-500'
              )}
            >
              {testimonial.name}
            </p>
            <p
              className={cn(
                'font-mono text-xs uppercase tracking-wider transition-colors duration-700',
                isActive ? 'text-cyan-400/80' : 'text-neutral-700'
              )}
            >
              {testimonial.designation} // {testimonial.company}
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
