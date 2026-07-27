import React from 'react';
import { cn } from '../utils/cn';

// Modern browsers support the CSS `aspect-ratio` property natively —
// no padding-top hack, no ResizeObserver, no library needed.
type AspectRatioProps = React.ComponentProps<'div'> & {
  ratio?: number; // e.g. 16 / 9, 1, 4 / 3
};

function AspectRatio({
  ratio = 16 / 9,
  className,
  style,
  ...props
}: AspectRatioProps) {
  return (
    <div
      data-slot="aspect-ratio"
      className={cn('relative w-full', className)}
      style={{ aspectRatio: ratio, ...style }}
      {...props}
    />
  );
}

export { AspectRatio };
export type { AspectRatioProps };
