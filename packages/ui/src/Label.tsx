import * as React from 'react';
import { cn } from 'utils/cn';

// No JS needed for the "clicking the label focuses the input" behavior —
// that's native <label htmlFor="..."> behavior in every browser.
// This is one of the few things Radix's Label wraps that you get for free.
type LabelProps = React.ComponentProps<'label'> & {
  required?: boolean;
};

function Label({ className, required, children, ...props }: LabelProps) {
  return (
    <label
      data-slot="label"
      className={cn(
        'flex select-none items-center gap-1 text-sm font-medium leading-none text-white',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        'has-[+*[data-disabled]]:opacity-50',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-error-500">*</span>}
    </label>
  );
}

export { Label };
export type { LabelProps };
