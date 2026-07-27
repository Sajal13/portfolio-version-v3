'use client';

import React from 'react';
import RadioGroupProvider, {
  useRadioGroupContext
} from '@/providers/RadioGroupContext';
import { RadioGroupItemProps, RadioGroupProps } from '@/types/radioGroup';
import { cn } from '@/utils/cn';

function RadioGroup(props: RadioGroupProps) {
  return (
    <RadioGroupProvider {...props}>
      <RadioGroupRoot {...props} />
    </RadioGroupProvider>
  );
}

function RadioGroupRoot({
  value: valueProp,
  defaultValue,
  onValueChange,
  name,
  className,
  ...props
}: RadioGroupProps) {
  return (
    <div
      data-slot="radio-group"
      role="radiogroup"
      className={cn('grid gap-3', className)}
      {...props}
    />
  );
}
function RadioGroupItem({
  value,
  className,
  id,
  ...props
}: RadioGroupItemProps) {
  const {
    name,
    value: groupValue,
    setValue
  } = useRadioGroupContext('RadioGroupItem');
  const autoId = React.useId();
  const inputId = id ?? autoId;
  const checked = groupValue === value;

  return (
    <span
      data-slot="radio-group-item"
      className="relative inline-flex size-4 shrink-0"
    >
      <input
        id={inputId}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => setValue(value)}
        className={cn(
          `peer size-4 shrink-0 cursor-pointer appearance-none rounded-full border border-main bg-secondary-700
           outline-none transition-colors
           checked:border-primary-500
           focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
           disabled:cursor-not-allowed disabled:opacity-50`,
          className
        )}
        {...props}
      />
      <span className="pointer-events-none absolute inset-0 m-auto size-2 scale-0 rounded-full bg-primary-500 transition-transform peer-checked:scale-100" />
    </span>
  );
}

export { RadioGroup, RadioGroupItem };
