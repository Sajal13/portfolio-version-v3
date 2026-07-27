'use client';

import React from 'react';
import { Portal } from '../utils/Portal';
import { cn } from '../utils/cn';
import { TooltipProps } from '../types/tooltip';
import  { TooltipProvider, useTooltipContext } from '../providers/TooltipContext';

function Tooltip({
  delayDuration = 200,
  side = 'top',
  align = 'center',
  children
}: React.PropsWithChildren<TooltipProps>) {
  return (
    <TooltipProvider delayDuration={delayDuration} side={side} align={align}>
      {children}
    </TooltipProvider>
  );
}

function TooltipTrigger({
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...props
}: React.ComponentProps<'button'>) {
  const { show, hide, triggerRef } = useTooltipContext('TooltipTrigger');

  return (
    <button
      type="button"
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      data-slot="tooltip-trigger"
      onMouseEnter={(e) => {
        onMouseEnter?.(e);
        show();
      }}
      onMouseLeave={(e) => {
        onMouseLeave?.(e);
        hide();
      }}
      onFocus={(e) => {
        onFocus?.(e);
        show();
      }}
      onBlur={(e) => {
        onBlur?.(e);
        hide();
      }}
      {...props}
    />
  );
}

function TooltipContent({ className, ...props }: React.ComponentProps<'div'>) {
  const { open, floatingRef, coords } = useTooltipContext('TooltipContent');

  if (!open) return null;

  return (
    <Portal>
      <div
        ref={floatingRef as React.RefObject<HTMLDivElement>}
        data-slot="tooltip-content"
        role="tooltip"
        style={{
          position: 'fixed',
          top: coords?.top ?? -9999,
          left: coords?.left ?? -9999
        }}
        className={cn(
          'z-50 max-w-xs rounded-md bg-neutral-700 px-3 py-1.5 text-xs text-white shadow-md transition-opacity',
          coords ? 'opacity-100' : 'opacity-0',
          className
        )}
        {...props}
      />
    </Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent };
