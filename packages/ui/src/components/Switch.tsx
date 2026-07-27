'use client';

import React from 'react';
import { cn } from '../utils/cn';

type SwitchProps = Omit<React.ComponentProps<'button'>, 'onChange'> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

function Switch({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  className,
  disabled,
  onClick,
  ...props
}: SwitchProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultChecked);
  const isControlled = checkedProp !== undefined;
  const checked = isControlled ? (checkedProp as boolean) : uncontrolled;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-slot="switch"
      data-state={checked ? 'checked' : 'unchecked'}
      disabled={disabled}
      className={cn(
        `peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-transparent
         outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
         disabled:cursor-not-allowed disabled:opacity-50
         data-[state=checked]:bg-primary-500 data-[state=unchecked]:bg-neutral-500/30`,
        className
      )}
      onClick={(e) => {
        onClick?.(e);
        if (disabled) return;
        const next = !checked;
        if (!isControlled) setUncontrolled(next);
        onCheckedChange?.(next);
      }}
      {...props}
    >
      <span
        data-slot="switch-thumb"
        data-state={checked ? 'checked' : 'unchecked'}
        className={cn(
          'pointer-events-none block size-4 rounded-full bg-white shadow-sm transition-transform',
          checked ? 'translate-x-4.5' : 'translate-x-0.5'
        )}
      />
    </button>
  );
}

export { Switch };
export type { SwitchProps };
