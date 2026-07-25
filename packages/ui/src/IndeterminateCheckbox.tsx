import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from 'utils/cn';

const checkboxVariants = cva(
  [
    'appearance-none rounded cursor-pointer transition-colors',
    'border border-white bg-neutral-700',
    'focus:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-white/40',
    'focus-visible:ring-offset-1',
    'focus-visible:ring-offset-neutral-900',
    'disabled:cursor-not-allowed',
    'disabled:opacity-50'
  ],
  {
    variants: {
      size: {
        sm: 'size-4',
        base: 'size-4.5',
        md: 'size-5',
        lg: 'size-6'
      }
    },
    defaultVariants: {
      size: 'base'
    }
  }
);

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> &
  VariantProps<typeof checkboxVariants> & {
    indeterminate?: boolean;
    label?: React.ReactNode;
    labelClassName?: string;
  };

export function Checkbox({
  className,
  size,
  indeterminate = false,
  checked = false,
  label,
  labelClassName,
  ...props
}: CheckboxProps) {
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = !checked && indeterminate;
    }
  }, [checked, indeterminate]);

  return (
    <label className="inline-flex cursor-pointer items-center gap-2">
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        className={cn(checkboxVariants({ size }), className)}
        {...props}
      />

      {label && <span className={cn('text-xs', labelClassName)}>{label}</span>}
    </label>
  );
}

export { checkboxVariants };
export type { CheckboxProps };
