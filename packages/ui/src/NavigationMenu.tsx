'use client';

import React from 'react';
import { Portal } from 'utils/Portal';
import {
  useFloatingPosition,
  useOutsideClick,
  useEscapeKey
} from 'utils/useOverlay';
import { cn } from 'utils/cn';

type NavigationMenuContextValue = {
  openValue: string | null;
  setOpenValue: (v: string | null) => void;
};

const NavigationMenuContext =
  React.createContext<NavigationMenuContextValue | null>(null);

function useNavigationMenuContext(component: string) {
  const ctx = React.useContext(NavigationMenuContext);
  if (!ctx)
    throw new Error(`${component} must be used within <NavigationMenu>`);
  return ctx;
}

function NavigationMenu({
  className,
  children,
  ...props
}: React.ComponentProps<'nav'>) {
  const [openValue, setOpenValue] = React.useState<string | null>(null);

  return (
    <NavigationMenuContext.Provider value={{ openValue, setOpenValue }}>
      <nav
        data-slot="navigation-menu"
        className={cn('relative', className)}
        {...props}
      >
        <ul className="flex items-center gap-1">{children}</ul>
      </nav>
    </NavigationMenuContext.Provider>
  );
}

type NavigationMenuItemContextValue = {
  value: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  floatingRef: React.RefObject<HTMLElement | null>;
  coords: { top: number; left: number } | null;
};

const NavigationMenuItemContext =
  React.createContext<NavigationMenuItemContextValue | null>(null);

function useNavigationMenuItemContext(component: string) {
  const ctx = React.useContext(NavigationMenuItemContext);
  if (!ctx)
    throw new Error(`${component} must be used within <NavigationMenuItem>`);
  return ctx;
}

let navMenuItemIdCounter = 0;

function NavigationMenuItem({
  className,
  children,
  ...props
}: React.ComponentProps<'li'>) {
  const value = React.useRef(`nav-menu-item-${++navMenuItemIdCounter}`).current;
  const { openValue } = useNavigationMenuContext('NavigationMenuItem');
  const open = openValue === value;
  const { triggerRef, floatingRef, coords } = useFloatingPosition({
    open,
    side: 'bottom',
    align: 'center',
    sideOffset: 8
  });

  return (
    <NavigationMenuItemContext.Provider
      value={{ value, triggerRef, floatingRef, coords }}
    >
      <li className={cn('relative', className)} {...props}>
        {children}
      </li>
    </NavigationMenuItemContext.Provider>
  );
}

function NavigationMenuTrigger({
  className,
  children,
  onMouseEnter,
  onMouseLeave,
  onClick,
  ...props
}: React.ComponentProps<'button'>) {
  const { openValue, setOpenValue } = useNavigationMenuContext(
    'NavigationMenuTrigger'
  );
  const { value, triggerRef } = useNavigationMenuItemContext(
    'NavigationMenuTrigger'
  );
  const open = openValue === value;
  const closeTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  return (
    <button
      type="button"
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      data-state={open ? 'open' : 'closed'}
      aria-expanded={open}
      className={cn(
        `flex cursor-pointer items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-neutral-300
         outline-none transition-colors hover:bg-secondary-500/30 hover:text-white
         data-[state=open]:bg-secondary-500/30 data-[state=open]:text-white
         [&[data-state=open]>svg]:rotate-180`,
        className
      )}
      onMouseEnter={(e) => {
        onMouseEnter?.(e);
        if (closeTimeout.current) clearTimeout(closeTimeout.current);
        setOpenValue(value);
      }}
      onMouseLeave={(e) => {
        onMouseLeave?.(e);
        closeTimeout.current = setTimeout(() => setOpenValue(null), 150);
      }}
      onClick={(e) => {
        onClick?.(e);
        setOpenValue(open ? null : value);
      }}
      {...props}
    >
      {children}
      <ChevronDownIcon className="size-3.5 shrink-0 transition-transform duration-200" />
    </button>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function NavigationMenuContent({
  className,
  onMouseEnter,
  onMouseLeave,
  ...props
}: React.ComponentProps<'div'>) {
  const { openValue, setOpenValue } = useNavigationMenuContext(
    'NavigationMenuContent'
  );
  const { value, triggerRef, floatingRef, coords } =
    useNavigationMenuItemContext('NavigationMenuContent');
  const open = openValue === value;
  const closeTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  useEscapeKey(open, () => setOpenValue(null));
  useOutsideClick(open, [triggerRef, floatingRef], () => setOpenValue(null));

  if (!open) return null;

  return (
    <Portal>
      <div
        ref={floatingRef as React.RefObject<HTMLDivElement>}
        data-slot="navigation-menu-content"
        style={{
          position: 'fixed',
          top: coords?.top ?? -9999,
          left: coords?.left ?? -9999
        }}
        className={cn(
          'z-50 min-w-64 rounded-md border border-main bg-secondary-700 p-4 text-white shadow-md transition-opacity',
          coords ? 'opacity-100' : 'opacity-0',
          className
        )}
        onMouseEnter={(e) => {
          onMouseEnter?.(e);
          if (closeTimeout.current) clearTimeout(closeTimeout.current);
        }}
        onMouseLeave={(e) => {
          onMouseLeave?.(e);
          closeTimeout.current = setTimeout(() => setOpenValue(null), 150);
        }}
        {...props}
      />
    </Portal>
  );
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<'a'>) {
  return (
    <a
      className={cn(
        'block rounded-md px-3 py-2 text-sm text-neutral-300 outline-none transition-colors hover:bg-primary-500 hover:text-white',
        className
      )}
      {...props}
    />
  );
}

export {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink
};
