'use client';

import React from 'react';
import {
  DropdownMenuContextValue,
  DropdownMenuProps
} from '@/types/dropdownMenu';
import { useFloatingPosition } from '../utils/useOverlay';

const DropdownMenuContext =
  React.createContext<DropdownMenuContextValue | null>(null);

const DropdownMenuProvider = ({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  side,
  align,
  children
}: React.PropsWithChildren<DropdownMenuProps>) => {
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

  const { triggerRef, floatingRef, coords } = useFloatingPosition({
    open,
    side,
    align,
    sideOffset: 4
  });

  return (
    <DropdownMenuContext.Provider
      value={{ open, setOpen, triggerRef, floatingRef, coords }}
    >
      {children}
    </DropdownMenuContext.Provider>
  );
};
export const useDropdownMenuContext = (component: string) => {
  const ctx = React.useContext(DropdownMenuContext);
  if (!ctx)
    throw new Error(`${component} must be used within a <DropdownMenu>`);
  return ctx;
};

export default DropdownMenuProvider;
