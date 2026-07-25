import React from 'react';
import { cn } from 'utils/cn';

// `animate-pulse` is a built-in Tailwind utility (no config or JS needed)
function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('animate-pulse rounded-md bg-neutral-500/20', className)}
      {...props}
    />
  );
}

export { Skeleton };
