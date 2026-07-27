import React from 'react';
import { cn } from '../utils/cn';

type SeparatorProps = React.ComponentProps<'div'> & {
  orientation?: 'horizontal' | 'vertical';
};

function Separator({
  className,
  orientation = 'horizontal',
  ...props
}: SeparatorProps) {
  return (
    <div
      data-slot="separator"
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'shrink-0 bg-neutral-500/20',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className
      )}
      {...props}
    />
  );
}

export { Separator };
export type { SeparatorProps };
