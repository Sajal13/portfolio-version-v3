'use client';

import React from 'react';
import { HoverCardContextValue, HoverCardProps } from 'types/hoverCard';
import { useFloatingPosition } from 'utils/useOverlay';

const HoverCardContext = React.createContext<HoverCardContextValue | null>(
  null
);

const HoverCardProvider = ({
  children,
  openDelay = 300,
  closeDelay = 150,
  side = 'bottom',
  align = 'center'
}: React.PropsWithChildren<HoverCardProps>) => {
  const [open, setOpen] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const { triggerRef, floatingRef, coords } = useFloatingPosition({
    open,
    side,
    align,
    sideOffset: 8
  });

  const show = React.useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setOpen(true), openDelay);
  }, [openDelay]);

  const hide = React.useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    // small delay before closing so the pointer has time to travel
    // from the trigger to the card without it disappearing mid-move
    timeoutRef.current = setTimeout(() => setOpen(false), closeDelay);
  }, [closeDelay]);

  return (
    <HoverCardContext.Provider
      value={{ open, show, hide, triggerRef, floatingRef, coords }}
    >
      {children}
    </HoverCardContext.Provider>
  );
};

export const useHoverCardContext = (component: string) => {
  const ctx = React.useContext(HoverCardContext);
  if (!ctx) throw new Error(`${component} must be used within a <HoverCard>`);
  return ctx;
};

export default HoverCardProvider;
