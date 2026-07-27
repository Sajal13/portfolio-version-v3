'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import type { Color } from '../types/base';
import { cn } from '../utils/cn';

const sliderVariants = cva(
  `h-1.5 w-full cursor-pointer appearance-none rounded-full outline-none
   focus-visible:ring-2 focus-visible:ring-offset-2
   disabled:cursor-not-allowed disabled:opacity-50
   [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:cursor-pointer
   [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-sm
   [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0`,
  {
    variants: {
      color: {
        white:
          'focus-visible:ring-white [&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:bg-white',
        primary:
          'focus-visible:ring-primary-500 [&::-webkit-slider-thumb]:bg-primary-500 [&::-moz-range-thumb]:bg-primary-500',
        secondary:
          'focus-visible:ring-secondary-500 [&::-webkit-slider-thumb]:bg-secondary-500 [&::-moz-range-thumb]:bg-secondary-500',
        tertiary:
          'focus-visible:ring-tertiary-500 [&::-webkit-slider-thumb]:bg-tertiary-500 [&::-moz-range-thumb]:bg-tertiary-500',
        success:
          'focus-visible:ring-success-500 [&::-webkit-slider-thumb]:bg-success-500 [&::-moz-range-thumb]:bg-success-500',
        error:
          'focus-visible:ring-error-500 [&::-webkit-slider-thumb]:bg-error-500 [&::-moz-range-thumb]:bg-error-500',
        info: 'focus-visible:ring-info-500 [&::-webkit-slider-thumb]:bg-info-500 [&::-moz-range-thumb]:bg-info-500',
        warning:
          'focus-visible:ring-warning-500 [&::-webkit-slider-thumb]:bg-warning-500 [&::-moz-range-thumb]:bg-warning-500',
        orange:
          'focus-visible:ring-orange-500 [&::-webkit-slider-thumb]:bg-orange-500 [&::-moz-range-thumb]:bg-orange-500',
        neutral:
          'focus-visible:ring-neutral-500 [&::-webkit-slider-thumb]:bg-neutral-500 [&::-moz-range-thumb]:bg-neutral-500'
      }
    },
    defaultVariants: {
      color: 'primary'
    }
  }
);

const colorVar: Record<Color, string> = {
  white: '--color-white',
  primary: '--color-primary-500',
  secondary: '--color-secondary-500',
  tertiary: '--color-tertiary-500',
  success: '--color-success-500',
  error: '--color-error-500',
  info: '--color-info-500',
  warning: '--color-warning-500',
  orange: '--color-orange-500',
  neutral: '--color-neutral-500'
};

type SliderProps = Omit<
  React.ComponentProps<'input'>,
  'type' | 'size' | 'value' | 'defaultValue' | 'onChange' | 'color'
> &
  VariantProps<typeof sliderVariants> & {
    value?: number;
    defaultValue?: number;
    onValueChange?: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
  };

function Slider({
  className,
  color = 'primary',
  value,
  defaultValue = 0,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  ...props
}: SliderProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? (value as number) : uncontrolled;
  const percent = ((current - min) / (max - min)) * 100;
  const resolvedColor = color ?? 'primary';

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={current}
      onChange={(e) => {
        const next = Number(e.target.value);
        if (!isControlled) setUncontrolled(next);
        onValueChange?.(next);
      }}
      data-slot="slider"
      className={cn(sliderVariants({ color, className }))}
      style={{
        background: `linear-gradient(to right, var(${colorVar[resolvedColor]}) ${percent}%, rgba(115,115,115,0.3) ${percent}%)`
      }}
      {...props}
    />
  );
}

export { Slider };
export type { SliderProps };
