'use client';

import React from 'react';
import { Portal } from '../utils/Portal';
import {
  useFloatingPosition,
  useEscapeKey,
  useOutsideClick
} from '../utils/useOverlay';
import { cn } from '../utils/cn';

type MenubarContextValue = {
  openValue: string | null;
  setOpenValue: (v: string | null) => void;
};

const MenubarContext = React.createContext<MenubarContextValue | null>(null);

function useMenubarContext(component: string) {
  const ctx = React.useContext(MenubarContext);
  if (!ctx) throw new Error(`${component} must be used within <Menubar>`);
  return ctx;
}

function Menubar({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  const [openValue, setOpenValue] = React.useState<string | null>(null);

  return (
    <MenubarContext.Provider value={{ openValue, setOpenValue }}>
      <div
        role="menubar"
        data-slot="menubar"
        className={cn(
          'flex items-center gap-1 rounded-md border border-main bg-secondary-700 p-1',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </MenubarContext.Provider>
  );
}

type MenubarMenuContextValue = {
  value: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  floatingRef: React.RefObject<HTMLElement | null>;
  coords: { top: number; left: number } | null;
};

const MenubarMenuContext = React.createContext<MenubarMenuContextValue | null>(
  null
);

function useMenubarMenuContext(component: string) {
  const ctx = React.useContext(MenubarMenuContext);
  if (!ctx) throw new Error(`${component} must be used within <MenubarMenu>`);
  return ctx;
}

let menubarMenuIdCounter = 0;

function MenubarMenu({ children }: { children: React.ReactNode }) {
  const value = React.useRef(`menubar-menu-${++menubarMenuIdCounter}`).current;
  const { openValue } = useMenubarContext('MenubarMenu');
  const open = openValue === value;
  const { triggerRef, floatingRef, coords } = useFloatingPosition({
    open,
    side: 'bottom',
    align: 'start',
    sideOffset: 4
  });

  return (
    <MenubarMenuContext.Provider
      value={{ value, triggerRef, floatingRef, coords }}
    >
      {children}
    </MenubarMenuContext.Provider>
  );
}

function MenubarTrigger({
  className,
  onClick,
  onMouseEnter,
  ...props
}: React.ComponentProps<'button'>) {
  const { openValue, setOpenValue } = useMenubarContext('MenubarTrigger');
  const { value, triggerRef } = useMenubarMenuContext('MenubarTrigger');
  const open = openValue === value;

  return (
    <button
      type="button"
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      role="menuitem"
      aria-haspopup="menu"
      aria-expanded={open}
      data-state={open ? 'open' : 'closed'}
      data-slot="menubar-trigger"
      className={cn(
        `flex cursor-pointer select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium text-neutral-300
         outline-none transition-colors hover:bg-secondary-500/30 hover:text-white
         data-[state=open]:bg-primary-500 data-[state=open]:text-white`,
        className
      )}
      onClick={(e) => {
        onClick?.(e);
        setOpenValue(open ? null : value);
      }}
      onMouseEnter={(e) => {
        onMouseEnter?.(e);
        // once one menu is open, hovering a sibling trigger switches directly — no click needed
        if (openValue !== null && openValue !== value) setOpenValue(value);
      }}
      {...props}
    />
  );
}

function MenubarContent({
  className,
  onKeyDown,
  ...props
}: React.ComponentProps<'div'>) {
  const { openValue, setOpenValue } = useMenubarContext('MenubarContent');
  const { value, triggerRef, floatingRef, coords } =
    useMenubarMenuContext('MenubarContent');
  const open = openValue === value;

  useEscapeKey(open, () => {
    setOpenValue(null);
    triggerRef.current?.focus();
  });
  useOutsideClick(open, [triggerRef, floatingRef], () => setOpenValue(null));

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
        data-slot="menubar-content"
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

type MenubarItemProps = React.ComponentProps<'div'> & {
  disabled?: boolean;
  onSelect?: () => void;
};

function MenubarItem({
  className,
  disabled,
  onSelect,
  onClick,
  onKeyDown,
  ...props
}: MenubarItemProps) {
  const { setOpenValue } = useMenubarContext('MenubarItem');
  const { triggerRef } = useMenubarMenuContext('MenubarItem');

  const select = () => {
    if (disabled) return;
    onSelect?.();
    setOpenValue(null);
    triggerRef.current?.focus();
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

function MenubarSeparator({
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

function MenubarLabel({ className, ...props }: React.ComponentProps<'div'>) {
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
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel
};
