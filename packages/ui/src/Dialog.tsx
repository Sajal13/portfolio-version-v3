'use client';

import * as React from 'react';
import { Portal } from 'utils/Portal';
import { useEscapeKey, useFocusTrap, useScrollLock } from 'utils/useOverlay';
import { cn } from 'utils/cn';
import { DialogContentProps, DialogProps } from 'types/dialog';
import DialogProvider, { useDialogContext } from 'providers/DialogContext';

function Dialog({ children, ...props }: React.PropsWithChildren<DialogProps>) {
  return <DialogProvider {...props}>{children}</DialogProvider>;
}

function DialogTrigger({ onClick, ...props }: React.ComponentProps<'button'>) {
  const { setOpen } = useDialogContext('DialogTrigger');
  return (
    <button
      type="button"
      data-slot="dialog-trigger"
      onClick={(e) => {
        onClick?.(e);
        setOpen(true);
      }}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showClose = true,
  ...props
}: DialogContentProps) {
  const { open, setOpen } = useDialogContext('DialogContent');
  const contentRef = React.useRef<HTMLDivElement>(null);

  useScrollLock(open);
  useEscapeKey(open, () => setOpen(false));
  useFocusTrap(contentRef, open);

  if (!open) return null;

  return (
    <Portal>
      <div
        data-slot="dialog-overlay"
        data-state={open ? 'open' : 'closed'}
        className="fixed inset-0 z-50 bg-black/60"
        onClick={() => setOpen(false)}
      />
      <div
        ref={contentRef}
        data-slot="dialog-content"
        role="dialog"
        aria-modal="true"
        data-state={open ? 'open' : 'closed'}
        className={cn(
          `fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4
           rounded-lg border border-main bg-secondary-700 p-6 text-white shadow-lg`,
          className
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
        {showClose && (
          <button
            type="button"
            data-slot="dialog-close"
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

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        'flex flex-col gap-1.5 text-center sm:text-left',
        className
      )}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        className
      )}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: React.ComponentProps<'h2'>) {
  return (
    <h2
      data-slot="dialog-title"
      className={cn('text-lg font-semibold leading-none', className)}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="dialog-description"
      className={cn('text-sm text-neutral-400', className)}
      {...props}
    />
  );
}

function DialogClose({ onClick, ...props }: React.ComponentProps<'button'>) {
  const { setOpen } = useDialogContext('DialogClose');
  return (
    <button
      type="button"
      data-slot="dialog-close"
      onClick={(e) => {
        onClick?.(e);
        setOpen(false);
      }}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose
};
