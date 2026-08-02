'use client';

import React from 'react';
import { useSidebar } from '../providers/SidebarContext';
import { cn } from '../utils/cn';
import { Sheet, SheetContent } from './Sheet';

type SidebarProps = React.ComponentProps<'div'> & { side?: 'left' | 'right' };

function Sidebar({
  side = 'left',
  className,
  children,
  ...props
}: SidebarProps) {
  const { isMobile, openMobile, setOpenMobile, open } = useSidebar();

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          side={side}
          showClose={true}
          className="ease-in-out transition-all duration-300"
        >
          <div className="flex h-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      data-slot="sidebar"
      data-state={open ? 'expanded' : 'collapsed'}
      className={cn(
        'sticky top-0 left-0 flex h-svh shrink-0 flex-col overflow-hidden border-main bg-neutral-500 text-white transition-all duration-300 ease-linear',
        side === 'left' ? 'border-r' : 'border-l',
        open ? 'w-(--sidebar-width)' : 'w-(--sidebar-width-collapsed)',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<'button'>) {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      type="button"
      data-slot="sidebar-trigger"
      aria-label="Toggle sidebar"
      className={cn(
        'flex size-8 cursor-pointer items-center justify-center rounded-md text-neutral-400 outline-none transition-colors hover:bg-secondary-500/30 hover:text-white',
        className
      )}
      onClick={(e) => {
        onClick?.(e);
        toggleSidebar();
      }}
      {...props}
    >
      <MenuIcon className="size-4" />
    </button>
  );
}

function MenuIcon({ className }: { className?: string }) {
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
      <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn('flex flex-col gap-2 p-3', className)}
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn('mt-auto flex flex-col gap-2 p-3', className)}
      {...props}
    />
  );
}

function SidebarContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn(
        'flex flex-1 flex-col gap-2 overflow-y-auto p-3',
        className
      )}
      {...props}
    />
  );
}

function SidebarGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-group"
      className={cn('flex flex-col gap-1', className)}
      {...props}
    />
  );
}

function SidebarGroupLabel({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { open } = useSidebar();
  return (
    <div
      data-slot="sidebar-group-label"
      className={cn(
        'px-2 py-1 text-xs font-medium text-neutral-400 transition-opacity',
        !open && 'pointer-events-none opacity-0',
        className
      )}
      {...props}
    />
  );
}

function SidebarMenu({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="sidebar-menu"
      className={cn('flex flex-col gap-1', className)}
      {...props}
    />
  );
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="sidebar-menu-item" className={className} {...props} />;
}

type SidebarMenuButtonProps = React.ComponentProps<'button'> & {
  isActive?: boolean;
  icon?: React.ReactNode;
};

function SidebarMenuButton({
  className,
  isActive,
  icon,
  children,
  ...props
}: SidebarMenuButtonProps) {
  const { open, isMobile } = useSidebar();
  return (
    <button
      type="button"
      data-slot="sidebar-menu-button"
      data-active={isActive ? '' : undefined}
      className={cn(
        `flex w-full cursor-pointer items-center gap-2 overflow-hidden rounded-md px-2 py-1.5 text-sm text-neutral-300
         outline-none transition-colors hover:bg-secondary-500/30 hover:text-white
         data-active:bg-primary-500 data-active:text-white`,
        className,
        !open ? 'justify-center' : 'justify-start'
      )}
      {...props}
    >
      {icon}
      {/* label stays in the DOM (sr-only) when collapsed, so screen readers still get it */}
      <span className={cn('truncate', !open && !isMobile && 'sr-only')}>
        {children}
      </span>
    </button>
  );
}

export {
  Sidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
};
