import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { Slot } from './Slot';
import { cn } from '../utils/cn';

type SearchInputProps = Omit<React.ComponentProps<'input'>, 'size'> &
  VariantProps<typeof searchInputVariants> & {
    icon?: React.ReactNode;
    iconPosition?: 'start' | 'end';
  };

const searchInputVariants = cva(
  `flex w-full rounded-md border border-main bg-secondary-700
   text-white placeholder:text-neutral-400
   outline-none transition-colors
   focus-visible:ring-2 focus-visible:ring-primary-500
   disabled:cursor-not-allowed disabled:opacity-50
   aria-invalid:border-error-500`,
  {
    variants: {
      size: {
        sm: 'h-8 text-xs',
        base: 'h-9 text-sm',
        md: 'h-10 text-sm',
        lg: 'h-11 text-base'
      },
      iconPosition: {
        none: 'px-4',
        start: 'pl-10 pr-4',
        end: 'pr-10 pl-4'
      }
    },
    defaultVariants: {
      size: 'base',
      iconPosition: 'none'
    }
  }
);

export function SearchInput({
  className,
  size = 'base',
  icon,
  iconPosition = 'start',
  ...props
}: SearchInputProps) {
  return (
    <div className="relative w-full">
      {icon && (
        <div
          className={cn(
            'absolute inset-y-0 flex items-center text-neutral-400',
            iconPosition === 'start' ? 'left-3' : 'right-3'
          )}
        >
          <Slot>{icon}</Slot>
        </div>
      )}

      <input
        {...props}
        className={cn(
          searchInputVariants({
            size,
            iconPosition: icon ? iconPosition : 'none'
          }),
          className
        )}
      />
    </div>
  );
}
