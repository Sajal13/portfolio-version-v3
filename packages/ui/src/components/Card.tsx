import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

const cardVariants = cva(
  'flex flex-col gap-6 rounded-lg border border-main bg-secondary-700 py-6 text-white',
  {
    variants: {
      variant: {
        default: '',
        // Only the *static* part lives here — size/repeat/position. The
        // actual image differs per usage, so it's supplied via the
        // `illustrationSrc` prop and applied as an inline `backgroundImage`
        // rather than baked into a Tailwind arbitrary-value class per card.
        illustration: 'bg-cover bg-no-repeat bg-right'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

interface CardProps
  extends React.ComponentProps<'div'>, VariantProps<typeof cardVariants> {
  /**
   * Public-folder path to the illustration, e.g.
   * "/assets/image/illustrations/card_illustration.webp".
   * Only applies when variant="illustration". Resolves at runtime against
   * whichever app renders this component — @repo/ui never needs its own
   * copy of the asset.
   */
  illustrationSrc?: string;
}

function Card({
  className,
  variant,
  illustrationSrc,
  style,
  ...props
}: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant }), className)}
      style={
        variant === 'illustration'
          ? {
              backgroundImage: illustrationSrc
                ? `url('${illustrationSrc}')`
                : `url('/assets/image/illustrations/card_illustration.webp')`,
              ...style
            }
          : style
      }
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        'grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto]',
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('font-semibold leading-none', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-sm text-neutral-400', className)}
      {...props}
    />
  );
}

// Optional slot for a button/icon in the top-right of the header,
// e.g. <CardHeader><CardTitle/><CardAction><Button/></CardAction></CardHeader>
function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('px-6', className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent
};
