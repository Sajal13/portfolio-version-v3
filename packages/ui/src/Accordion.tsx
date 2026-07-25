'use client';

import * as React from 'react';
import {
  AccordionContextValue,
  AccordionItemProps,
  AccordionProps
} from 'types/accordion';
import { cn } from 'utils/cn';

const AccordionContext = React.createContext<AccordionContextValue | null>(
  null
);

function useAccordionContext(component: string) {
  const ctx = React.useContext(AccordionContext);
  if (!ctx) throw new Error(`${component} must be used within an <Accordion>`);
  return ctx;
}

const AccordionItemContext = React.createContext<string | null>(null);

function Accordion({
  type = 'single',
  collapsible = true,
  value: valueProp,
  defaultValue,
  onValueChange,
  className,
  children,
  ...props
}: AccordionProps) {
  const toArray = (v: string | string[] | undefined): string[] =>
    v === undefined ? [] : Array.isArray(v) ? v : [v];

  const [uncontrolled, setUncontrolled] = React.useState<string[]>(
    toArray(defaultValue)
  );
  const isControlled = valueProp !== undefined;
  const openValues = isControlled ? toArray(valueProp) : uncontrolled;

  const toggle = React.useCallback(
    (itemValue: string) => {
      const isOpen = openValues.includes(itemValue);
      let next: string[];

      if (type === 'multiple') {
        next = isOpen
          ? openValues.filter((v) => v !== itemValue)
          : [...openValues, itemValue];
      } else {
        next = isOpen ? (collapsible ? [] : openValues) : [itemValue];
      }

      if (!isControlled) setUncontrolled(next);
      onValueChange?.(type === 'multiple' ? next : (next[0] ?? ''));
    },
    [type, collapsible, openValues, isControlled, onValueChange]
  );

  const isOpen = React.useCallback(
    (value: string) => openValues.includes(value),
    [openValues]
  );

  return (
    <AccordionContext.Provider value={{ isOpen, toggle }}>
      <div data-slot="accordion" className={className} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({
  value,
  className,
  children,
  ...props
}: AccordionItemProps) {
  const { isOpen } = useAccordionContext('AccordionItem');

  return (
    <AccordionItemContext.Provider value={value}>
      <div
        data-slot="accordion-item"
        data-state={isOpen(value) ? 'open' : 'closed'}
        className={cn('border-b border-main last:border-b-0', className)}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

function useAccordionItemValue(component: string) {
  const value = React.useContext(AccordionItemContext);
  if (value === null)
    throw new Error(`${component} must be used within an <AccordionItem>`);
  return value;
}

function AccordionTrigger({
  className,
  children,
  onClick,
  ...props
}: React.ComponentProps<'button'>) {
  const { isOpen, toggle } = useAccordionContext('AccordionTrigger');
  const itemValue = useAccordionItemValue('AccordionTrigger');
  const open = isOpen(itemValue);

  return (
    <button
      type="button"
      data-slot="accordion-trigger"
      data-state={open ? 'open' : 'closed'}
      aria-expanded={open}
      className={cn(
        `flex w-full flex-1 cursor-pointer items-center justify-between gap-4 py-4 text-left text-sm
         font-medium text-white outline-none transition-all hover:underline
         focus-visible:ring-2 focus-visible:ring-primary-500
         [&[data-state=open]>svg]:rotate-180`,
        className
      )}
      onClick={(e) => {
        onClick?.(e);
        toggle(itemValue);
      }}
      {...props}
    >
      {children}
      <ChevronDownIcon className="size-4 shrink-0 text-neutral-400 transition-transform duration-200" />
    </button>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  const { isOpen } = useAccordionContext('AccordionContent');
  const itemValue = useAccordionItemValue('AccordionContent');
  const open = isOpen(itemValue);

  return (
    <div
      data-slot="accordion-content"
      data-state={open ? 'open' : 'closed'}
      className={cn(
        'grid overflow-hidden text-sm text-neutral-300 transition-[grid-template-rows] duration-300 ease-in-out',
        open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
      )}
    >
      <div className="overflow-hidden">
        <div className={cn('pb-4 pt-0', className)} {...props}>
          {children}
        </div>
      </div>
    </div>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
