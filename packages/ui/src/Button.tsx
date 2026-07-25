'use client';

import * as React from 'react';
import { Slot } from './Slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'utils/cn';

/**
 * These stay exactly as you had them in types/base.ts —
 * cva will infer the same union types from the keys below,
 * so you can keep importing Size/Color/Shape/Variant anywhere
 * else in the app without duplicating the definitions.
 */
// export type Size = "sm" | "base" | "md" | "lg";
// export type Color = "primary" | "secondary" | "tertiary" | "success" | "error" | "info" | "warning" | "orange" | "neutral" | "white";
// export type Shape = "rounded" | "circle";
// export type Variant = "filled" | "outline" | "link";

const buttonVariants = cva(
  `inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium
   transition-all duration-300 ease-in-out cursor-pointer
   disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50
   outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500
   [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 shrink-0`,
  {
    variants: {
      variant: {
        filled: '',
        outline: 'border border-main bg-secondary-700',
        link: 'bg-transparent'
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
      },
      shape: {
        rounded: 'rounded-md',
        circle: 'rounded-full p-0'
      },
      size: {
        sm: '',
        base: '',
        md: '',
        lg: ''
      }
    },
    compoundVariants: [
      // ---- shape + size → dimensions ----
      { shape: 'rounded', size: 'sm', className: 'h-8 px-3 gap-1.5 text-xs' },
      { shape: 'rounded', size: 'base', className: 'h-9 px-4 gap-2 text-sm' },
      { shape: 'rounded', size: 'md', className: 'h-10 px-5 gap-2 text-sm' },
      {
        shape: 'rounded',
        size: 'lg',
        className: 'h-11 px-7 gap-2.5 text-base'
      },

      { shape: 'circle', size: 'sm', className: 'size-8 text-sm' },
      { shape: 'circle', size: 'base', className: 'size-9 text-base' },
      { shape: 'circle', size: 'md', className: 'size-10 text-lg' },
      { shape: 'circle', size: 'lg', className: 'size-12 text-xl' },

      // ---- variant: filled + color ----
      {
        variant: 'filled',
        color: 'white',
        className: 'bg-white text-neutral-700 hover:bg-white/90'
      },
      {
        variant: 'filled',
        color: 'primary',
        className:
          'bg-primary-500 text-white hover:bg-primary-hover active:bg-primary-active'
      },
      {
        variant: 'filled',
        color: 'secondary',
        className:
          'bg-secondary-500 text-white hover:bg-secondary-hover active:bg-secondary-active'
      },
      {
        variant: 'filled',
        color: 'tertiary',
        className:
          'bg-tertiary-500 text-white hover:bg-tertiary-hover active:bg-tertiary-active'
      },
      {
        variant: 'filled',
        color: 'success',
        className:
          'bg-success-500 text-white hover:bg-success-hover active:bg-success-active'
      },
      {
        variant: 'filled',
        color: 'error',
        className:
          'bg-error-500 text-white hover:bg-error-hover active:bg-error-active'
      },
      {
        variant: 'filled',
        color: 'info',
        className:
          'bg-info-500 text-white hover:bg-info-hover active:bg-info-active'
      },
      {
        variant: 'filled',
        color: 'warning',
        className:
          'bg-warning-500 text-white hover:bg-warning-hover active:bg-warning-active'
      },
      {
        variant: 'filled',
        color: 'orange',
        className:
          'bg-orange-500 text-white hover:bg-orange-hover active:bg-orange-active'
      },
      {
        variant: 'filled',
        color: 'neutral',
        className:
          'bg-neutral-500 text-white hover:bg-neutral-hover active:bg-neutral-active'
      },

      // ---- variant: outline + color ----
      {
        variant: 'outline',
        color: 'white',
        className:
          'text-white hover:bg-white hover:text-neutral-500 active:bg-white/90 active:text-neutral-500'
      },
      {
        variant: 'outline',
        color: 'primary',
        className:
          'text-primary-500 hover:bg-primary-hover hover:text-white active:bg-primary-active active:text-white'
      },
      {
        variant: 'outline',
        color: 'secondary',
        className:
          'text-secondary-500 hover:bg-secondary-hover hover:text-white active:bg-secondary-active active:text-white'
      },
      {
        variant: 'outline',
        color: 'tertiary',
        className:
          'text-tertiary-500 hover:bg-tertiary-hover hover:text-white active:bg-tertiary-active active:text-white'
      },
      {
        variant: 'outline',
        color: 'success',
        className:
          'text-success-500 hover:bg-success-hover hover:text-white active:bg-success-active active:text-white'
      },
      {
        variant: 'outline',
        color: 'error',
        className:
          'text-error-500 hover:bg-error-hover hover:text-white active:bg-error-active active:text-white'
      },
      {
        variant: 'outline',
        color: 'info',
        className:
          'text-info-500 hover:bg-info-hover hover:text-white active:bg-info-active active:text-white'
      },
      {
        variant: 'outline',
        color: 'warning',
        className:
          'text-warning-500 hover:bg-warning-hover hover:text-white active:bg-warning-active active:text-white'
      },
      {
        variant: 'outline',
        color: 'orange',
        className:
          'text-orange-500 hover:bg-orange-hover hover:text-white active:bg-orange-active active:text-white'
      },
      {
        variant: 'outline',
        color: 'neutral',
        className:
          'text-neutral-200 hover:bg-neutral-hover hover:text-white active:bg-neutral-active active:text-white'
      },

      // ---- variant: link + color ----
      {
        variant: 'link',
        color: 'white',
        className: 'text-white hover:text-white/90'
      },
      {
        variant: 'link',
        color: 'primary',
        className: 'text-primary-500 hover:text-primary-hover'
      },
      {
        variant: 'link',
        color: 'secondary',
        className: 'text-secondary-500 hover:text-secondary-hover'
      },
      {
        variant: 'link',
        color: 'tertiary',
        className: 'text-tertiary-500 hover:text-tertiary-hover'
      },
      {
        variant: 'link',
        color: 'success',
        className: 'text-success-500 hover:text-success-hover'
      },
      {
        variant: 'link',
        color: 'error',
        className: 'text-error-500 hover:text-error-hover'
      },
      {
        variant: 'link',
        color: 'info',
        className: 'text-info-500 hover:text-info-hover'
      },
      {
        variant: 'link',
        color: 'warning',
        className: 'text-warning-500 hover:text-warning-hover'
      },
      {
        variant: 'link',
        color: 'orange',
        className: 'text-orange-500 hover:text-orange-hover'
      },
      {
        variant: 'link',
        color: 'neutral',
        className: 'text-neutral-200 hover:text-neutral-500'
      },

      // ---- link always overrides sizing (text-only button, no box) ----
      { variant: 'link', className: 'h-auto p-0 rounded-none' }
    ],
    defaultVariants: {
      variant: 'outline',
      color: 'white',
      shape: 'rounded',
      size: 'base'
    }
  }
);

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    type?: 'submit' | 'button' | 'reset';
    ref?: React.Ref<HTMLButtonElement>;
  };

function Button({
  size = 'base',
  variant = 'outline',
  color = 'white',
  shape = 'rounded',
  className,
  type = 'button',
  asChild = false,
  ref,
  children,
  ...rest
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      ref={ref}
      type={asChild ? undefined : type}
      className={cn(buttonVariants({ size, variant, color, shape, className }))}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
