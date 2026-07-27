'use client';

import React from 'react';
import { Portal } from '../utils/Portal';
import { useEscapeKey, useOutsideClick } from '../utils/useOverlay';
import { cn } from '../utils/cn';
import { PopoverProps } from '../types/popover';
import { PopoverProvider, usePopoverContext } from '../providers/PopoverContext';

function Popover({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  side = 'bottom',
  align = 'center',
  children
}: React.PropsWithChildren<PopoverProps>) {
  return (
    <PopoverProvider
      open={openProp}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      side={side}
      align={align}
    >
      {children}
    </PopoverProvider>
  );
}

function PopoverTrigger({ onClick, ...props }: React.ComponentProps<'button'>) {
  const { open, setOpen, triggerRef } = usePopoverContext('PopoverTrigger');

  return (
    <button
      type="button"
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      data-slot="popover-trigger"
      aria-expanded={open}
      onClick={(e) => {
        onClick?.(e);
        setOpen(!open);
      }}
      {...props}
    />
  );
}

function PopoverContent({ className, ...props }: React.ComponentProps<'div'>) {
  const { open, setOpen, triggerRef, floatingRef, coords } =
    usePopoverContext('PopoverContent');

  useEscapeKey(open, () => setOpen(false));
  useOutsideClick(open, [triggerRef, floatingRef], () => setOpen(false));

  if (!open) return null;

  return (
    <Portal>
      <div
        ref={floatingRef as React.RefObject<HTMLDivElement>}
        data-slot="popover-content"
        role="dialog"
        style={{
          position: 'fixed',
          top: coords?.top ?? -9999,
          left: coords?.left ?? -9999
        }}
        className={cn(
          'z-50 w-72 rounded-md border border-main bg-secondary-700 p-4 text-white shadow-md outline-none transition-opacity',
          coords ? 'opacity-100' : 'opacity-0',
          className
        )}
        {...props}
      />
    </Portal>
  );
}

export { Popover, PopoverTrigger, PopoverContent };
