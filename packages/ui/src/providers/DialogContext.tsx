'use client';

import React, { PropsWithChildren } from 'react';
import { DialogContextValue, DialogProps } from '../types/dialog';

const DialogContext = React.createContext<DialogContextValue | null>(null);

export const DialogProvider = ({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children
}: PropsWithChildren<DialogProps>) => {
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
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
};
export const useDialogContext = (component: string) => {
  const ctx = React.useContext(DialogContext);
  if (!ctx) throw new Error(`${component} must be used within a <Dialog>`);
  return ctx;
};
