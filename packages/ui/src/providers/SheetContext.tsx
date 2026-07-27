'use client';

import React from 'react';
import { SheetContextValue, SheetProps } from '../types/sheet';

const SheetContext = React.createContext<SheetContextValue | null>(null);

const SheetProvider = ({
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  children
}: React.PropsWithChildren<SheetProps>) => {
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? (openProp as boolean) : uncontrolled;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
};
export const useSheetContext = (component: string) => {
  const ctx = React.useContext(SheetContext);
  if (!ctx) throw new Error(`${component} must be used within a <Sheet>`);
  return ctx;
};

export default SheetProvider;
