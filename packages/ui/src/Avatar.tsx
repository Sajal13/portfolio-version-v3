'use client';

import React from 'react';
import { cn } from '@/utils/cn';

/**
 * Usage:
 *   <Avatar>
 *     <AvatarFallback>SD</AvatarFallback>
 *     <AvatarImage src="/me.jpg" alt="Sajal Das" />
 *   </Avatar>
 *
 * Fallback goes FIRST in markup, Image goes SECOND — both are absolutely
 * positioned so the later element (Image) paints on top once it loads.
 * If the image errors, AvatarImage renders nothing and the Fallback
 * underneath is what's visible. No load-order library logic needed.
 */

type AvatarProps = React.ComponentProps<'span'> & {
  size?: 'sm' | 'base' | 'md' | 'lg';
};

const sizeClass: Record<NonNullable<AvatarProps['size']>, string> = {
  sm: 'size-8 text-xs',
  base: 'size-9 text-sm',
  md: 'size-10 text-base',
  lg: 'size-12 text-lg'
};

function Avatar({ className, size = 'base', ...props }: AvatarProps) {
  return (
    <span
      data-slot="avatar"
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-full bg-neutral-500',
        sizeClass[size],
        className
      )}
      {...props}
    />
  );
}

type AvatarImageProps = React.ComponentProps<'img'>;

function AvatarImage({
  className,
  onError,
  alt = '',
  ...props
}: AvatarImageProps) {
  const [failed, setFailed] = React.useState(false);

  if (failed) return null;

  return (
    <img
      data-slot="avatar-image"
      alt={alt}
      className={cn('absolute inset-0 size-full object-cover', className)}
      onError={(e) => {
        setFailed(true);
        onError?.(e);
      }}
      {...props}
    />
  );
}

type AvatarFallbackProps = React.ComponentProps<'span'>;

function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
  return (
    <span
      data-slot="avatar-fallback"
      className={cn(
        'absolute inset-0 flex items-center justify-center rounded-full bg-neutral-500 font-medium uppercase text-white',
        className
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
export type { AvatarProps };
