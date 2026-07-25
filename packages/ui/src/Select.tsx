'use client';

import React from 'react';
import { Portal } from 'utils/Portal';
import { useEscapeKey, useOutsideClick } from 'utils/useOverlay';
import { cn } from 'utils/cn';
import { SelectItemProps, SelectProps } from 'types/select';
import SelectProvider, { useSelectContext } from 'providers/SelectContext';

function Select({
  value: valueProp,
  defaultValue,
  onValueChange,
  children
}: React.PropsWithChildren<SelectProps>) {
  return (
    <SelectProvider
      value={valueProp}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
    >
      {children}
    </SelectProvider>
  );
}

function SelectTrigger({
  className,
  onClick,
  children,
  ...props
}: React.ComponentProps<'button'>) {
  const { open, setOpen, triggerRef } = useSelectContext('SelectTrigger');

  return (
    <button
      type="button"
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      role="combobox"
      aria-expanded={open}
      data-slot="select-trigger"
      className={cn(
        `flex h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-main
         bg-secondary-700 px-4 text-sm text-white outline-none transition-colors
         focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
         disabled:cursor-not-allowed disabled:opacity-50`,
        className
      )}
      onClick={(e) => {
        onClick?.(e);
        setOpen(!open);
      }}
      {...props}
    >
      {children}
      <ChevronDownIcon className="size-4 shrink-0 text-neutral-400" />
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

function CheckIcon({ className }: { className?: string }) {
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
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function SelectValue({
  placeholder,
  className
}: {
  placeholder?: string;
  className?: string;
}) {
  const { selectedLabel } = useSelectContext('SelectValue');
  return (
    <span
      className={cn(
        'truncate',
        !selectedLabel && 'text-neutral-400',
        className
      )}
    >
      {selectedLabel ?? placeholder}
    </span>
  );
}

function SelectContent({
  className,
  onKeyDown,
  ...props
}: React.ComponentProps<'div'>) {
  const { open, setOpen, triggerRef, floatingRef, coords, triggerWidth } =
    useSelectContext('SelectContent');

  useEscapeKey(open, () => setOpen(false));
  useOutsideClick(open, [triggerRef, floatingRef], () => setOpen(false));

  React.useEffect(() => {
    if (!open) return;
    const selected = floatingRef.current?.querySelector<HTMLElement>(
      '[role="option"][data-state="checked"]'
    );
    const first = floatingRef.current?.querySelector<HTMLElement>(
      '[role="option"]:not([data-disabled])'
    );
    (selected ?? first)?.focus();
  }, [open, floatingRef]);

  if (!open) return null;

  return (
    <Portal>
      <div
        ref={floatingRef as React.RefObject<HTMLDivElement>}
        data-slot="select-content"
        role="listbox"
        style={{
          position: 'fixed',
          top: coords?.top ?? -9999,
          left: coords?.left ?? -9999,
          minWidth: triggerWidth ?? undefined
        }}
        className={cn(
          'z-50 max-h-64 overflow-auto rounded-md border border-main bg-secondary-700 p-1 text-white shadow-md outline-none transition-opacity',
          coords ? 'opacity-100' : 'opacity-0',
          className
        )}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
          e.preventDefault();
          const items = Array.from(
            (e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>(
              '[role="option"]:not([data-disabled])'
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

function SelectItem({
  value,
  disabled,
  className,
  children,
  onClick,
  onKeyDown,
  ...props
}: SelectItemProps) {
  const {
    value: selectedValue,
    setValue,
    setOpen,
    triggerRef,
    labelMap
  } = useSelectContext('SelectItem');
  const checked = selectedValue === value;

  // register this item's label so SelectValue can display text instead of the raw value
  React.useEffect(() => {
    labelMap.current.set(
      value,
      typeof children === 'string' ? children : value
    );
  }, [value, children, labelMap]);

  const select = () => {
    if (disabled) return;
    setValue(value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div
      role="option"
      aria-selected={checked}
      tabIndex={disabled ? -1 : 0}
      data-slot="select-item"
      data-state={checked ? 'checked' : 'unchecked'}
      data-disabled={disabled ? '' : undefined}
      className={cn(
        `flex cursor-pointer items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors
         hover:bg-primary-500 hover:text-white focus-visible:bg-primary-500 focus-visible:text-white
         data-[state=checked]:font-medium
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
    >
      {children}
      {checked && <CheckIcon className="size-4" />}
    </div>
  );
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
