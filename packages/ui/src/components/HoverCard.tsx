'use client';

import React from 'react';
import  {
  HoverCardProvider,
  useHoverCardContext
} from '../providers/HoverCardContext';
import { HoverCardProps } from '../types/hoverCard';
import { Portal } from '../utils/Portal';
import { cn } from '../utils/cn';

function HoverCard({
  openDelay,
  closeDelay,
  side,
  align,
  children
}: React.PropsWithChildren<HoverCardProps>) {
  return (
    <HoverCardProvider
      openDelay={openDelay}
      closeDelay={closeDelay}
      side={side}
      align={align}
    >
      {children}
    </HoverCardProvider>
  );
}

function HoverCardTrigger({
  onMouseEnter,
  onMouseLeave,
  ...props
}: React.ComponentProps<'a'>) {
  const { show, hide, triggerRef } = useHoverCardContext('HoverCardTrigger');

  return (
    <a
      ref={triggerRef as React.RefObject<HTMLAnchorElement>}
      data-slot="hover-card-trigger"
      onMouseEnter={(e) => {
        onMouseEnter?.(e);
        show();
      }}
      onMouseLeave={(e) => {
        onMouseLeave?.(e);
        hide();
      }}
      {...props}
    />
  );
}

function HoverCardContent({
  className,
  onMouseEnter,
  onMouseLeave,
  ...props
}: React.ComponentProps<'div'>) {
  const { open, show, hide, floatingRef, coords } =
    useHoverCardContext('HoverCardContent');

  if (!open) return null;

  return (
    <Portal>
      <div
        ref={floatingRef as React.RefObject<HTMLDivElement>}
        data-slot="hover-card-content"
        style={{
          position: 'fixed',
          top: coords?.top ?? -9999,
          left: coords?.left ?? -9999
        }}
        className={cn(
          'z-50 w-64 rounded-md border border-main bg-secondary-700 p-4 text-sm text-white shadow-md transition-opacity',
          coords ? 'opacity-100' : 'opacity-0',
          className
        )}
        onMouseEnter={(e) => {
          onMouseEnter?.(e);
          show();
        }}
        onMouseLeave={(e) => {
          onMouseLeave?.(e);
          hide();
        }}
        {...props}
      />
    </Portal>
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };
