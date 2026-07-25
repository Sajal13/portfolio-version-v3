'use client';

import * as React from 'react';
import { cn } from 'utils/cn';

type CheckboxProps = Omit<React.ComponentProps<'input'>, 'type' | 'size'> & {
  onCheckedChange?: (checked: boolean) => void;
};

function Checkbox({
  className,
  onCheckedChange,
  onChange,
  id,
  ...props
}: CheckboxProps) {
  const autoId = React.useId();
  const inputId = id ?? autoId;

  return (
    <span data-slot="checkbox" className="relative inline-flex size-4 shrink-0">
      <input
        id={inputId}
        type="checkbox"
        onChange={(e) => {
          onChange?.(e);
          onCheckedChange?.(e.target.checked);
        }}
        className={cn(
          `peer size-4 shrink-0 cursor-pointer appearance-none rounded-sm border border-main bg-secondary-700
           outline-none transition-colors
           checked:border-primary-500 checked:bg-primary-500
           focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
           disabled:cursor-not-allowed disabled:opacity-50`,
          className
        )}
        {...props}
      />
      <CheckIcon className="pointer-events-none absolute inset-0 m-auto size-3 scale-0 text-white transition-transform peer-checked:scale-100" />
    </span>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export { Checkbox };
export type { CheckboxProps };
