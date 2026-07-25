'use client';

import * as React from 'react';
import { Portal } from 'utils/Portal';
import { useEscapeKey, useOutsideClick } from 'utils/useOverlay';
import { cn } from 'utils/cn';
import { DropdownMenuItemProps, DropdownMenuProps } from 'types/dropdownMenu';
import DropdownMenuProvider, {
  useDropdownMenuContext
} from 'providers/DropdownMenuContext';

function DropdownMenu({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  side = 'bottom',
  align = 'start',
  children
}: React.PropsWithChildren<DropdownMenuProps>) {
  return (
    <DropdownMenuProvider
      open={openProp}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      side={side}
      align={align}
    >
      {children}
    </DropdownMenuProvider>
  );
}

function DropdownMenuTrigger({
  onClick,
  ...props
}: React.ComponentProps<'button'>) {
  const { open, setOpen, triggerRef } = useDropdownMenuContext(
    'DropdownMenuTrigger'
  );

  return (
    <button
      type="button"
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      data-slot="dropdown-menu-trigger"
      aria-haspopup="menu"
      aria-expanded={open}
      onClick={(e) => {
        onClick?.(e);
        setOpen(!open);
      }}
      {...props}
    />
  );
}

function DropdownMenuContent({
  className,
  onKeyDown,
  ...props
}: React.ComponentProps<'div'>) {
  const { open, setOpen, triggerRef, floatingRef, coords } =
    useDropdownMenuContext('DropdownMenuContent');

  useEscapeKey(open, () => {
    setOpen(false);
    triggerRef.current?.focus();
  });
  useOutsideClick(open, [triggerRef, floatingRef], () => setOpen(false));

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
        data-slot="dropdown-menu-content"
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

function DropdownMenuItem({
  className,
  disabled,
  onSelect,
  onClick,
  onKeyDown,
  ...props
}: DropdownMenuItemProps) {
  const { setOpen, triggerRef } = useDropdownMenuContext('DropdownMenuItem');

  const select = () => {
    if (disabled) return;
    onSelect?.();
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      data-slot="dropdown-menu-item"
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

function DropdownMenuSeparator({
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

function DropdownMenuLabel({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'px-2 py-1.5 text-xs font-medium text-neutral-400',
        className
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
};
