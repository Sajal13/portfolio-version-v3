'use client';

import React from 'react';
import { CollapsibleProps } from '../types/collapsible';
import { cn } from '../utils/cn';

import  {
  CollapsibleProvider,
  useCollapsibleContext
} from '../providers/CollapsibleContext';

function CollapsibleRoot({ className, children, ...props }: CollapsibleProps) {
  const { open } = useCollapsibleContext('Collapsible');

  return (
    <div
      data-slot="collapsible"
      data-state={open ? 'open' : 'closed'}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
}

function Collapsible(props: CollapsibleProps) {
  return (
    <CollapsibleProvider {...props}>
      <CollapsibleRoot {...props} />
    </CollapsibleProvider>
  );
}

function CollapsibleTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<'button'>) {
  const { open, toggle, disabled } =
    useCollapsibleContext('CollapsibleTrigger');

  return (
    <button
      type="button"
      data-slot="collapsible-trigger"
      data-state={open ? 'open' : 'closed'}
      aria-expanded={open}
      disabled={disabled}
      className={cn(
        'cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      onClick={(e) => {
        onClick?.(e);
        toggle();
      }}
      {...props}
    />
  );
}

function CollapsibleContent({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  const { open } = useCollapsibleContext('CollapsibleContent');

  return (
    <div
      data-slot="collapsible-content"
      data-state={open ? 'open' : 'closed'}
      className={cn(
        'grid transition-[grid-template-rows] duration-300 ease-in-out',
        open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
      )}
    >
      <div className="overflow-hidden">
        <div className={className} {...props}>
          {children}
        </div>
      </div>
    </div>
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
