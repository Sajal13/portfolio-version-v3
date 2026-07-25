'use client';

import React from 'react';
import type { VariantProps } from 'class-variance-authority';
import { cn } from 'utils/cn';
import { toggleVariants } from './Toggle';

type ToggleGroupContextValue = {
  value: string[];
  toggle: (value: string) => void;
  variant?: VariantProps<typeof toggleVariants>['variant'];
  size?: VariantProps<typeof toggleVariants>['size'];
};

const ToggleGroupContext = React.createContext<ToggleGroupContextValue | null>(
  null
);

function useToggleGroupContext(component: string) {
  const ctx = React.useContext(ToggleGroupContext);
  if (!ctx) throw new Error(`${component} must be used within a <ToggleGroup>`);
  return ctx;
}

type ToggleGroupProps = Omit<
  React.ComponentProps<'div'>,
  'defaultValue' | 'onChange'
> &
  VariantProps<typeof toggleVariants> & {
    type?: 'single' | 'multiple';
    value?: string | string[];
    defaultValue?: string | string[];
    onValueChange?: (value: string | string[]) => void;
  };

function ToggleGroup({
  type = 'single',
  value: valueProp,
  defaultValue,
  onValueChange,
  variant,
  size,
  className,
  children,
  ...props
}: ToggleGroupProps) {
  const toArray = (v: string | string[] | undefined): string[] =>
    v === undefined ? [] : Array.isArray(v) ? v : [v];

  const [uncontrolled, setUncontrolled] = React.useState<string[]>(
    toArray(defaultValue)
  );
  const isControlled = valueProp !== undefined;
  const selected = isControlled ? toArray(valueProp) : uncontrolled;

  const toggle = React.useCallback(
    (itemValue: string) => {
      let next: string[];
      if (type === 'multiple') {
        next = selected.includes(itemValue)
          ? selected.filter((v) => v !== itemValue)
          : [...selected, itemValue];
      } else {
        next = selected.includes(itemValue) ? [] : [itemValue];
      }
      if (!isControlled) setUncontrolled(next);
      onValueChange?.(type === 'multiple' ? next : (next[0] ?? ''));
    },
    [type, selected, isControlled, onValueChange]
  );

  return (
    <ToggleGroupContext.Provider
      value={{ value: selected, toggle, variant, size }}
    >
      <div
        data-slot="toggle-group"
        role="group"
        className={cn('flex w-fit items-center gap-1', className)}
        {...props}
      >
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
}

type ToggleGroupItemProps = React.ComponentProps<'button'> &
  VariantProps<typeof toggleVariants> & { value: string };

function ToggleGroupItem({
  value,
  variant,
  size,
  className,
  onClick,
  ...props
}: ToggleGroupItemProps) {
  const {
    value: selected,
    toggle,
    variant: groupVariant,
    size: groupSize
  } = useToggleGroupContext('ToggleGroupItem');
  const pressed = selected.includes(value);

  return (
    <button
      type="button"
      data-slot="toggle-group-item"
      data-state={pressed ? 'on' : 'off'}
      aria-pressed={pressed}
      className={cn(
        toggleVariants({
          variant: variant ?? groupVariant,
          size: size ?? groupSize,
          className
        })
      )}
      onClick={(e) => {
        onClick?.(e);
        toggle(value);
      }}
      {...props}
    />
  );
}

export { ToggleGroup, ToggleGroupItem };
export type { ToggleGroupProps, ToggleGroupItemProps };
