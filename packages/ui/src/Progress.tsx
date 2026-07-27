import React from 'react';
import type { Color } from '@/types/base';
import { cn } from '@/utils/cn';

type ProgressProps = Omit<React.ComponentProps<'div'>, 'color'> & {
  value?: number;
  color?: Color;
};

const colorClass: Record<Color, string> = {
  white: 'bg-white',
  primary: 'bg-primary-500',
  secondary: 'bg-secondary-500',
  tertiary: 'bg-tertiary-500',
  success: 'bg-success-500',
  error: 'bg-error-500',
  info: 'bg-info-500',
  warning: 'bg-warning-500',
  orange: 'bg-orange-500',
  neutral: 'bg-neutral-500'
};

function Progress({
  className,
  value = 0,
  color = 'primary',
  ...props
}: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      data-slot="progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      className={cn(
        'relative h-2 w-full overflow-hidden rounded-full bg-neutral-500/20',
        className
      )}
      {...props}
    >
      <div
        data-slot="progress-indicator"
        className={cn(
          'h-full transition-all duration-300 ease-out',
          colorClass[color]
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export { Progress };
export type { ProgressProps };
