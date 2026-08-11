import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

const boxVariants = cva(
  [
    'appearance-none rounded cursor-pointer transition-colors',
    'border border-white bg-neutral-700',
    'checked:bg-purple-600 checked:border-purple-600',
    'indeterminate:bg-purple-600 indeterminate:border-purple-600',
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

type IndeterminateCheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size'
> &
  VariantProps<typeof boxVariants> & {
    indeterminate?: boolean;
    label?: React.ReactNode;
    labelClassName?: string;
  };

export function IndeterminateCheckbox({
  className,
  size,
  indeterminate = false,
  checked = false,
  label,
  labelClassName,
  ...props
}: IndeterminateCheckboxProps) {
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = !checked && indeterminate;
    }
  }, [checked, indeterminate]);

  const showIcon = checked || indeterminate;

  return (
    <label className="inline-flex cursor-pointer items-center gap-2">
      <span className="relative inline-flex items-center justify-center">
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          className={cn(boxVariants({ size }), className)}
          {...props}
        />

        {showIcon && (
          <svg
            className="pointer-events-none absolute inset-0 m-auto size-[65%] text-white"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          >
            {checked ? <path d="M3 8l3.5 3.5L13 5" /> : <path d="M3 8h10" />}
          </svg>
        )}
      </span>

      {label && <span className={cn('text-xs', labelClassName)}>{label}</span>}
    </label>
  );
}

export { boxVariants as IndeterminateCheckboxVariants };
export type { IndeterminateCheckboxProps };
