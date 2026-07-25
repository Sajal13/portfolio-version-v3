'use client';

import React from 'react';
import { AlertDialogContextValue, AlertDialogProps } from 'types/alertDialog';

const AlertDialogContext = React.createContext<AlertDialogContextValue | null>(
  null
);

const AlertDialogProvider = ({
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  children
}: React.PropsWithChildren<AlertDialogProps>) => {
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
    <AlertDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  );
};

export const useAlertDialogContext = (component: string) => {
  const ctx = React.useContext(AlertDialogContext);
  if (!ctx)
    throw new Error(`${component} must be used within an <AlertDialog>`);
  return ctx;
};

export default AlertDialogProvider;
