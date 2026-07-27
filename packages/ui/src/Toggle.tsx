'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const toggleVariants = cva(
  `inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium
   outline-none transition-colors
   hover:bg-secondary-500/20 hover:text-white
   focus-visible:ring-2 focus-visible:ring-primary-500
   disabled:pointer-events-none disabled:opacity-50
   data-[state=on]:bg-primary-500 data-[state=on]:text-white
   [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0`,
  {
    variants: {
      variant: {
        default: 'bg-transparent text-neutral-400',
        outline: 'border border-main bg-secondary-700 text-neutral-400'
      },
      size: {
        sm: 'h-8 min-w-8 px-2',
        base: 'h-9 min-w-9 px-2.5',
        lg: 'h-10 min-w-10 px-3'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'base'
    }
  }
);

type ToggleProps = Omit<React.ComponentProps<'button'>, 'onChange'> &
  VariantProps<typeof toggleVariants> & {
    pressed?: boolean;
    defaultPressed?: boolean;
    onPressedChange?: (pressed: boolean) => void;
  };

function Toggle({
  pressed: pressedProp,
  defaultPressed = false,
  onPressedChange,
  variant,
  size,
  className,
  onClick,
  ...props
}: ToggleProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultPressed);
  const isControlled = pressedProp !== undefined;
  const pressed = isControlled ? (pressedProp as boolean) : uncontrolled;

  return (
    <button
      type="button"
      data-slot="toggle"
      data-state={pressed ? 'on' : 'off'}
      aria-pressed={pressed}
      className={cn(toggleVariants({ variant, size, className }))}
      onClick={(e) => {
        onClick?.(e);
        const next = !pressed;
        if (!isControlled) setUncontrolled(next);
        onPressedChange?.(next);
      }}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
export type { ToggleProps };
