'use client';

import React from 'react';
import { Portal } from 'utils/Portal';
import { useEscapeKey, useFocusTrap, useScrollLock } from 'utils/useOverlay';
import { cn } from 'utils/cn';
import { SheetProps } from 'types/sheet';
import SheetProvider, { useSheetContext } from 'providers/SheetContext';

function Sheet({
  open: openProp,
  defaultOpen,
  onOpenChange,
  children
}: React.PropsWithChildren<SheetProps>) {
  return (
    <SheetProvider
      open={openProp}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      {children}
    </SheetProvider>
  );
}

function SheetTrigger({ onClick, ...props }: React.ComponentProps<'button'>) {
  const { setOpen } = useSheetContext('SheetTrigger');
  return (
    <button
      type="button"
      onClick={(e) => {
        onClick?.(e);
        setOpen(true);
      }}
      {...props}
    />
  );
}

const sideClass: Record<'top' | 'bottom' | 'left' | 'right', string> = {
  top: 'inset-x-0 top-0 border-b',
  bottom: 'inset-x-0 bottom-0 border-t',
  left: 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
  right: 'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm'
};

type SheetContentProps = React.ComponentProps<'div'> & {
  side?: 'top' | 'bottom' | 'left' | 'right';
  showClose?: boolean;
};

function SheetContent({
  className,
  children,
  side = 'right',
  showClose = true,
  ...props
}: SheetContentProps) {
  const { open, setOpen } = useSheetContext('SheetContent');
  const contentRef = React.useRef<HTMLDivElement>(null);

  useScrollLock(open);
  useEscapeKey(open, () => setOpen(false));
  useFocusTrap(contentRef, open);

  if (!open) return null;

  return (
    <Portal>
      <div
        data-slot="sheet-overlay"
        className="fixed inset-0 z-50 bg-black/60"
        onClick={() => setOpen(false)}
      />
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        data-slot="sheet-content"
        className={cn(
          'fixed z-50 flex flex-col gap-4 border-main bg-secondary-700 p-6 text-white shadow-lg',
          sideClass[side],
          className
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
        {showClose && (
          <button
            type="button"
            aria-label="Close"
            className="absolute right-4 top-4 cursor-pointer rounded-md text-neutral-400 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-primary-500"
            onClick={() => setOpen(false)}
          >
            <CloseIcon className="size-4" />
          </button>
        )}
      </div>
    </Portal>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-1.5', className)} {...props} />;
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('mt-auto flex flex-col gap-2', className)} {...props} />
  );
}

function SheetTitle({ className, ...props }: React.ComponentProps<'h2'>) {
  return <h2 className={cn('text-lg font-semibold', className)} {...props} />;
}

function SheetDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return <p className={cn('text-sm text-neutral-400', className)} {...props} />;
}

export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription
};
