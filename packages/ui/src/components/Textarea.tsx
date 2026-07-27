import React from 'react';
import { cn } from '../utils/cn';

type TextareaProps = React.ComponentProps<'textarea'>;

function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        `flex min-h-20 w-full resize-y rounded-md border border-main bg-secondary-700
         px-4 py-2 text-sm text-white outline-none transition-colors
         placeholder:text-neutral-400
         focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
         disabled:cursor-not-allowed disabled:opacity-50
         aria-invalid:border-error-500 aria-invalid:ring-error-500/40`,
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
export type { TextareaProps };
