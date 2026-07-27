'use client';

import React from 'react';
import { Portal } from '@/utils/Portal';
import { useEscapeKey, useFocusTrap, useScrollLock } from '@/utils/useOverlay';
import { cn } from '@/utils/cn';
import { buttonVariants } from './Button';
import AlertDialogProvider, {
  useAlertDialogContext
} from '@/providers/AlertDialogContext';
import { AlertDialogProps } from '@/types/alertDialog';

function AlertDialog({
  open: openProp,
  defaultOpen,
  onOpenChange,
  children
}: React.PropsWithChildren<AlertDialogProps>) {
  return (
    <AlertDialogProvider
      open={openProp}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      {children}
    </AlertDialogProvider>
  );
}

function AlertDialogTrigger({
  onClick,
  ...props
}: React.ComponentProps<'button'>) {
  const { setOpen } = useAlertDialogContext('AlertDialogTrigger');
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

function AlertDialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  const { open, setOpen } = useAlertDialogContext('AlertDialogContent');
  const contentRef = React.useRef<HTMLDivElement>(null);

  useScrollLock(open);
  useEscapeKey(open, () => setOpen(false));
  useFocusTrap(contentRef, open);

  if (!open) return null;

  return (
    <Portal>
      {/* No onClick here — unlike Dialog, an alert requires an explicit
          Cancel/Action choice, so clicking the overlay doesn't dismiss it */}
      <div
        data-slot="alert-dialog-overlay"
        className="fixed inset-0 z-50 bg-black/60"
      />
      <div
        ref={contentRef}
        role="alertdialog"
        aria-modal="true"
        data-slot="alert-dialog-content"
        className={cn(
          `fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4
           rounded-lg border border-main bg-secondary-700 p-6 text-white shadow-lg`,
          className
        )}
        {...props}
      >
        {children}
      </div>
    </Portal>
  );
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  );
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        className
      )}
      {...props}
    />
  );
}

function AlertDialogTitle({ className, ...props }: React.ComponentProps<'h2'>) {
  return <h2 className={cn('text-lg font-semibold', className)} {...props} />;
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<'p'>) {
  return <p className={cn('text-sm text-neutral-400', className)} {...props} />;
}

function AlertDialogAction({
  className,
  onClick,
  ...props
}: React.ComponentProps<'button'>) {
  const { setOpen } = useAlertDialogContext('AlertDialogAction');
  return (
    <button
      type="button"
      className={cn(
        buttonVariants({
          variant: 'filled',
          color: 'primary',
          shape: 'rounded',
          size: 'base'
        }),
        className
      )}
      onClick={(e) => {
        onClick?.(e);
        setOpen(false);
      }}
      {...props}
    />
  );
}

function AlertDialogCancel({
  className,
  onClick,
  ...props
}: React.ComponentProps<'button'>) {
  const { setOpen } = useAlertDialogContext('AlertDialogCancel');
  return (
    <button
      type="button"
      className={cn(
        buttonVariants({
          variant: 'outline',
          color: 'white',
          shape: 'rounded',
          size: 'base'
        }),
        className
      )}
      onClick={(e) => {
        onClick?.(e);
        setOpen(false);
      }}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel
};
