import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'utils/cn';

const badgeVariants = cva(
  `inline-flex w-fit shrink-0 items-center gap-1 whitespace-nowrap rounded-md
   border px-2 py-0.5 text-xs font-medium transition-colors
   [&_svg]:pointer-events-none [&_svg]:size-3`,
  {
    variants: {
      variant: {
        filled: 'border-transparent',
        outline: 'bg-transparent'
      },
      color: {
        white: '',
        primary: '',
        secondary: '',
        tertiary: '',
        success: '',
        error: '',
        info: '',
        warning: '',
        orange: '',
        neutral: ''
      }
    },
    compoundVariants: [
      {
        variant: 'filled',
        color: 'white',
        className: 'bg-white text-neutral-700'
      },
      {
        variant: 'filled',
        color: 'primary',
        className: 'bg-primary-subtle border-primary-500 text-white'
      },
      {
        variant: 'filled',
        color: 'secondary',
        className: 'bg-secondary-subtle border-secondary-500 text-white'
      },
      {
        variant: 'filled',
        color: 'tertiary',
        className: 'bg-tertiary-subtle border-tertiary-500 text-white'
      },
      {
        variant: 'filled',
        color: 'success',
        className: 'bg-success-subtle border-success-500 text-white'
      },
      {
        variant: 'filled',
        color: 'error',
        className: 'bg-error-subtle border-error-500 text-white'
      },
      {
        variant: 'filled',
        color: 'info',
        className: 'bg-info-subtle border-info-500 text-white'
      },
      {
        variant: 'filled',
        color: 'warning',
        className: 'bg-warning-subtle bg-warning-500 text-white'
      },
      {
        variant: 'filled',
        color: 'orange',
        className: 'bg-orange-subtle border-orange-500 text-white'
      },
      {
        variant: 'filled',
        color: 'neutral',
        className: 'bg-neutral-subtle border-neutral-500 text-white'
      },

      {
        variant: 'outline',
        color: 'white',
        className: 'border-main text-white'
      },
      {
        variant: 'outline',
        color: 'primary',
        className: 'border-primary-500 text-primary-500'
      },
      {
        variant: 'outline',
        color: 'secondary',
        className: 'border-secondary-500 text-secondary-500'
      },
      {
        variant: 'outline',
        color: 'tertiary',
        className: 'border-tertiary-500 text-tertiary-500'
      },
      {
        variant: 'outline',
        color: 'success',
        className: 'border-success-500 text-success-500'
      },
      {
        variant: 'outline',
        color: 'error',
        className: 'border-error-500 text-error-500'
      },
      {
        variant: 'outline',
        color: 'info',
        className: 'border-info-500 text-info-500'
      },
      {
        variant: 'outline',
        color: 'warning',
        className: 'border-warning-500 text-warning-500'
      },
      {
        variant: 'outline',
        color: 'orange',
        className: 'border-orange-500 text-orange-500'
      },
      {
        variant: 'outline',
        color: 'neutral',
        className: 'border-neutral-500 text-neutral-200'
      }
    ],
    defaultVariants: {
      variant: 'filled',
      color: 'primary'
    }
  }
);

type BadgeProps = React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants>;

function Badge({ className, variant, color, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, color, className }))}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
export type { BadgeProps };
