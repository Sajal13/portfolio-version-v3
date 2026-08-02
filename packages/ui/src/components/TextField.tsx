import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

const inputVariants = cva(
  `flex w-full min-w-0 rounded-md border border-main bg-secondary-700 text-white
   placeholder:text-neutral-400 outline-none transition-colors
   file:border-0 file:bg-transparent file:text-sm file:font-medium
   focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500/30
   disabled:cursor-not-allowed disabled:opacity-50
   aria-invalid:border-error-500 aria-invalid:ring-2 aria-invalid:ring-error-500/30`,
  {
    variants: {
      size: {
        sm: 'h-8 px-3 text-xs',
        base: 'h-9 px-4 text-sm',
        md: 'h-10 px-5 text-sm',
        lg: 'h-11 px-7 text-base'
      }
    },
    defaultVariants: {
      size: 'base'
    }
  }
);

// native <input> has its own "size" attribute (a number) — omit it so our
// own Size union ("sm" | "base" | "md" | "lg") doesn't collide with it.
type InputProps = Omit<React.ComponentProps<'input'>, 'size'> &
  VariantProps<typeof inputVariants> & {
    /** Optional leading icon. Wraps the input in a relative container and
     * adds left padding only when present — bare usage is unaffected. */
    icon?: React.ReactNode;
  };

function Input({ className, size, type = 'text', icon, ...props }: InputProps) {
  if (!icon) {
    return (
      <input
        type={type}
        data-slot="input"
        className={cn(inputVariants({ size, className }))}
        {...props}
      />
    );
  }

  return (
    <div className="relative w-full">
      <span
        aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
      >
        {icon}
      </span>
      <input
        type={type}
        data-slot="input"
        className={cn(inputVariants({ size, className }), 'pl-10')}
        {...props}
      />
    </div>
  );
}

export { Input, inputVariants };
export type { InputProps };
