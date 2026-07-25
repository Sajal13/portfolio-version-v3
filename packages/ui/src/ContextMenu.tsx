'use client';

import React from 'react';
import { Portal } from 'utils/Portal';
import { useEscapeKey, useOutsideClick } from 'utils/useOverlay';
import { cn } from 'utils/cn';
import ContextMenuProvider, {
  useContextMenuContext
} from 'providers/ContextMenuContext';

function ContextMenu({ children }: { children: React.ReactNode }) {
  return <ContextMenuProvider>{children}</ContextMenuProvider>;
}

function ContextMenuTrigger({
  className,
  onContextMenu,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  const { setOpen, setPosition } = useContextMenuContext('ContextMenuTrigger');

  return (
    <div
      data-slot="context-menu-trigger"
      className={className}
      onContextMenu={(e) => {
        onContextMenu?.(e);
        e.preventDefault();
        setPosition({ x: e.clientX, y: e.clientY });
        setOpen(true);
      }}
      {...props}
    >
      {children}
    </div>
  );
}

function ContextMenuContent({
  className,
  onKeyDown,
  ...props
}: React.ComponentProps<'div'>) {
  const { open, setOpen, position, floatingRef } =
    useContextMenuContext('ContextMenuContent');
  const [coords, setCoords] = React.useState<{
    top: number;
    left: number;
  } | null>(null);

  useEscapeKey(open, () => setOpen(false));
  useOutsideClick(open, [floatingRef], () => setOpen(false));

  // clamp so a right-click near the viewport edge doesn't render off-screen
  React.useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }
    const el = floatingRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const padding = 8;
    const left = Math.min(position.x, window.innerWidth - rect.width - padding);
    const top = Math.min(
      position.y,
      window.innerHeight - rect.height - padding
    );
    setCoords({ top, left });
  }, [open, position, floatingRef]);

  React.useEffect(() => {
    if (!open) return;
    const items = floatingRef.current?.querySelectorAll<HTMLElement>(
      '[role="menuitem"]:not([data-disabled])'
    );
    items?.[0]?.focus();
  }, [open, floatingRef]);

  if (!open) return null;

  return (
    <Portal>
      <div
        ref={floatingRef as React.RefObject<HTMLDivElement>}
        data-slot="context-menu-content"
        role="menu"
        style={{
          position: 'fixed',
          top: coords?.top ?? -9999,
          left: coords?.left ?? -9999
        }}
        className={cn(
          'z-50 min-w-40 rounded-md border border-main bg-secondary-700 p-1 text-white shadow-md outline-none transition-opacity',
          coords ? 'opacity-100' : 'opacity-0',
          className
        )}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
          e.preventDefault();
          const items = Array.from(
            (e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>(
              '[role="menuitem"]:not([data-disabled])'
            )
          );
          const currentIndex = items.indexOf(
            document.activeElement as HTMLElement
          );
          const nextIndex =
            e.key === 'ArrowDown'
              ? (currentIndex + 1) % items.length
              : (currentIndex - 1 + items.length) % items.length;
          items[nextIndex]?.focus();
        }}
        {...props}
      />
    </Portal>
  );
}

type ContextMenuItemProps = React.ComponentProps<'div'> & {
  disabled?: boolean;
  onSelect?: () => void;
};

function ContextMenuItem({
  className,
  disabled,
  onSelect,
  onClick,
  onKeyDown,
  ...props
}: ContextMenuItemProps) {
  const { setOpen } = useContextMenuContext('ContextMenuItem');

  const select = () => {
    if (disabled) return;
    onSelect?.();
    setOpen(false);
  };

  return (
    <div
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      data-disabled={disabled ? '' : undefined}
      className={cn(
        `flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors
         hover:bg-primary-500 hover:text-white focus-visible:bg-primary-500 focus-visible:text-white
         data-disabled:pointer-events-none data-disabled:opacity-50`,
        className
      )}
      onClick={(e) => {
        onClick?.(e);
        select();
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          select();
        }
      }}
      {...props}
    />
  );
}

function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      role="separator"
      className={cn('my-1 h-px bg-neutral-500/20', className)}
      {...props}
    />
  );
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator
};
