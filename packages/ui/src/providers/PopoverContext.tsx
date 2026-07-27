'use client';

import React, { PropsWithChildren } from 'react';
import { PopoverContextValue, PopoverProps } from '../types/popover';
import { useFloatingPosition } from '../utils/useOverlay';

const PopoverContext = React.createContext<PopoverContextValue | null>(null);

export const PopoverProvider = ({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  side = 'bottom',
  align = 'center',
  children
}: PropsWithChildren<PopoverProps>) => {
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
    sideOffset: 8
  });

  return (
    <PopoverContext.Provider
      value={{ open, setOpen, triggerRef, floatingRef, coords }}
    >
      {children}
    </PopoverContext.Provider>
  );
};

export const usePopoverContext = (component: string) => {
  const ctx = React.useContext(PopoverContext);
  if (!ctx) throw new Error(`${component} must be used within a <Popover>`);
  return ctx;
};
