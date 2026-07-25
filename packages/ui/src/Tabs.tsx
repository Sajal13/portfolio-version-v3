'use client';

import TabsProvider, { useTabsContext } from 'providers/TabsContext';
import * as React from 'react';
import { TabsContentProps, TabsProps } from 'types/tabs';
import { cn } from 'utils/cn';

function Tabs(props: TabsProps) {
  return (
    <TabsProvider {...props}>
      <TabsRoot {...props} />
    </TabsProvider>
  );
}

function TabsRoot({
  className,
  children,
  ...props
}: React.PropsWithChildren<TabsProps>) {
  return (
    <div
      data-slot="tabs"
      className={cn('flex flex-col gap-2', className)}
      {...props}
    >
      {children}
    </div>
  );
}

function TabsList({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="tabs-list"
      role="tablist"
      className={cn(
        'inline-flex h-9 w-fit items-center justify-center rounded-md bg-secondary-700 p-1 text-neutral-400',
        className
      )}
      {...props}
    />
  );
}

type TabsTriggerProps = React.ComponentProps<'button'> & { value: string };

function TabsTrigger({
  value,
  className,
  onClick,
  onKeyDown,
  ...props
}: TabsTriggerProps) {
  const {
    value: activeValue,
    setValue,
    idPrefix
  } = useTabsContext('TabsTrigger');
  const active = activeValue === value;

  return (
    <button
      type="button"
      role="tab"
      id={`${idPrefix}-trigger-${value}`}
      aria-controls={`${idPrefix}-content-${value}`}
      aria-selected={active}
      data-state={active ? 'active' : 'inactive'}
      tabIndex={active ? 0 : -1}
      className={cn(
        `inline-flex h-[calc(100%-1px)] flex-1 cursor-pointer items-center justify-center gap-1.5
         rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap outline-none transition-all
         focus-visible:ring-2 focus-visible:ring-primary-500
         disabled:pointer-events-none disabled:opacity-50
         data-[state=active]:bg-primary-500 data-[state=active]:text-white
         data-[state=inactive]:text-neutral-400 data-[state=inactive]:hover:text-white`,
        className
      )}
      onClick={(e) => {
        onClick?.(e);
        setValue(value);
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        // Roving tabindex: Left/Right arrows move focus (and selection) between sibling tabs
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        const list = e.currentTarget.closest('[role="tablist"]');
        if (!list) return;
        const tabs = Array.from(
          list.querySelectorAll<HTMLButtonElement>('[role="tab"]')
        );
        const currentIndex = tabs.indexOf(e.currentTarget);
        const nextIndex =
          e.key === 'ArrowRight'
            ? (currentIndex + 1) % tabs.length
            : (currentIndex - 1 + tabs.length) % tabs.length;
        tabs[nextIndex]?.focus();
        tabs[nextIndex]?.click();
      }}
      {...props}
    />
  );
}

function TabsContent({ value, className, ...props }: TabsContentProps) {
  const { value: activeValue, idPrefix } = useTabsContext('TabsContent');
  const active = activeValue === value;

  if (!active) return null;

  return (
    <div
      data-slot="tabs-content"
      role="tabpanel"
      id={`${idPrefix}-content-${value}`}
      aria-labelledby={`${idPrefix}-trigger-${value}`}
      tabIndex={0}
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
