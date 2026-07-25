'use client';

import React from 'react';

/**
 * A minimal, dependency-free version of Radix's Slot.
 *
 * What it's for: when `asChild` is true, instead of rendering our own
 * <button>, we want to take whatever single child was passed in
 * (e.g. a <Link>, an <a>, a custom component) and merge OUR props
 * (className, style, event handlers, ref) onto THAT element instead.
 *
 * Example:
 *   <Button asChild><Link href="/contact">Contact</Link></Button>
 * renders a single <a> with the button's classes + Link's own props,
 * instead of an invalid <button><a>...</a></button> nesting.
 */

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') {
        ref(node);
      } else {
        (ref as React.RefObject<T | null>).current = node;
      }
    }
  };
}

function mergeProps(
  slotProps: Record<string, unknown>,
  childProps: Record<string, unknown>
) {
  const merged: Record<string, unknown> = { ...slotProps, ...childProps };

  for (const key in childProps) {
    const slotValue = slotProps[key];
    const childValue = childProps[key];
    const isEventHandler = /^on[A-Z]/.test(key);

    if (
      isEventHandler &&
      typeof slotValue === 'function' &&
      typeof childValue === 'function'
    ) {
      // both the Button and the child define e.g. onClick — call both
      merged[key] = (...args: unknown[]) => {
        (childValue as (...a: unknown[]) => void)(...args);
        (slotValue as (...a: unknown[]) => void)(...args);
      };
    } else if (key === 'className') {
      merged[key] = [slotValue, childValue].filter(Boolean).join(' ');
    } else if (key === 'style') {
      merged[key] = { ...(slotValue as object), ...(childValue as object) };
    }
  }

  return merged;
}

type SlotProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
};

function Slot({ children, ref, ...slotProps }: SlotProps) {
  if (!React.isValidElement(children)) {
    if (children) {
      console.error(
        'Button: asChild expects a single valid React element as its child.'
      );
    }
    return null;
  }

  const childProps = children.props as Record<string, unknown>;
  // React 19 exposes ref as a regular prop on function components;
  // older elements/host elements still carry it as element.ref.
  const childRef =
    (children as unknown as { ref?: React.Ref<HTMLElement> }).ref ??
    (childProps.ref as React.Ref<HTMLElement> | undefined);

  return React.cloneElement(children, {
    ...mergeProps(slotProps, childProps),
    ref: ref ? mergeRefs(ref, childRef) : childRef
  } as Record<string, unknown>);
}

export { Slot };
