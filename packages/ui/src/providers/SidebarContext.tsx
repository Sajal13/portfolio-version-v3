'use client';

import React from 'react';
import { SidebarContextValue, SidebarProviderProps } from '../types/sidebar';
import { cn } from '../utils/cn';

const SIDEBAR_WIDTH = '17.5rem';
const SIDEBAR_WIDTH_COLLAPSED = '3rem';
const SIDEBAR_STORAGE_KEY = 'sidebar:open';
const SIDEBAR_MOBILE_BREAKPOINT = 768;

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx)
    throw new Error('useSidebar must be used within a <SidebarProvider>');
  return ctx;
}

export function SidebarProvider({
  defaultOpen = true,
  className,
  style,
  children,
  ...props
}: SidebarProviderProps) {
  const [open, setOpenState] = React.useState(defaultOpen);
  const [isMobile, setIsMobile] = React.useState(false);
  const [openMobile, setOpenMobile] = React.useState(false);

  React.useEffect(() => {
    const stored = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (stored !== null) setOpenState(stored === 'true');

    const mq = window.matchMedia(
      `(max-width: ${SIDEBAR_MOBILE_BREAKPOINT - 1}px)`
    );
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const setOpen = React.useCallback((next: boolean) => {
    setOpenState(next);
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
  }, []);

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) setOpenMobile((v) => !v);
    else setOpen(!open);
  }, [isMobile, open, setOpen]);

  // Cmd/Ctrl + B toggles, matching most app sidebars
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'b' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleSidebar]);

  return (
    <SidebarContext.Provider
      value={{
        open,
        setOpen,
        toggleSidebar,
        isMobile,
        openMobile,
        setOpenMobile
      }}
    >
      <div
        data-slot="sidebar-wrapper"
        style={
          {
            '--sidebar-width': SIDEBAR_WIDTH,
            '--sidebar-width-collapsed': SIDEBAR_WIDTH_COLLAPSED,
            ...style
          } as React.CSSProperties
        }
        className={cn('flex min-h-svh w-full', className)}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}
