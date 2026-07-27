import React from 'react';
import { cn } from '@/utils/cn';

/**
 * Native overflow scrolling styled via the browser's own scrollbar
 * pseudo-elements — not a custom draggable JS thumb like Radix's version.
 * Far less code, and visually near-identical in every evergreen browser.
 */
function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="scroll-area"
      className={cn(
        `overflow-auto
         scrollbar-thin [scrollbar-color:rgba(115,115,115,0.5)_transparent]
         [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2
         [&::-webkit-scrollbar-track]:bg-transparent
         [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-500/40
         hover:[&::-webkit-scrollbar-thumb]:bg-neutral-500/60`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { ScrollArea };
