import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const alertVariants = cva(
  'relative flex w-full gap-3 rounded-lg border px-4 py-3 text-sm [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0',
  {
    variants: {
      color: {
        neutral:
          'border-main bg-secondary-700 text-white [&>svg]:text-neutral-200',
        info: 'border-info-500/40 bg-info-500/10 text-info-500 [&>svg]:text-info-500',
        success:
          'border-success-500/40 bg-success-500/10 text-success-500 [&>svg]:text-success-500',
        warning:
          'border-warning-500/40 bg-warning-500/10 text-warning-500 [&>svg]:text-warning-500',
        error:
          'border-error-500/40 bg-error-500/10 text-error-500 [&>svg]:text-error-500'
      }
    },
    defaultVariants: {
      color: 'neutral'
    }
  }
);

type AlertProps = React.ComponentProps<'div'> &
  VariantProps<typeof alertVariants>;

function Alert({ className, color, ...props }: AlertProps) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ color, className }))}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn('font-medium leading-none', className)}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn('text-sm opacity-90 [&_p]:leading-relaxed', className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription, alertVariants };
export type { AlertProps };
