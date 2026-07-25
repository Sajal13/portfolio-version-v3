'use client';

import React, { PropsWithChildren } from 'react';
import {
  CollapsibleContextValue,
  CollapsibleProps
} from '../types/collapsible';

const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(
  null
);

const CollapsibleProvider = ({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled,
  children
}: PropsWithChildren<CollapsibleProps>) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? (openProp as boolean) : uncontrolledOpen;

  const toggle = React.useCallback(() => {
    if (disabled) return;
    const next = !open;
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  }, [disabled, open, isControlled, onOpenChange]);
  return (
    <CollapsibleContext.Provider value={{ open, toggle, disabled }}>
      {children}
    </CollapsibleContext.Provider>
  );
};

export const useCollapsibleContext = (component: string) => {
  const ctx = React.useContext(CollapsibleContext);
  if (!ctx) throw new Error(`${component} must be used within a <Collapsible>`);
  return ctx;
};

export default CollapsibleProvider;
