'use client';

import React, { PropsWithChildren } from 'react';
import { TooltipContextValue, TooltipProps } from 'types/tooltip';
import { useFloatingPosition } from 'utils/useOverlay';

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

const TooltipProvider = ({
  delayDuration,
  side,
  align,
  children
}: PropsWithChildren<TooltipProps>) => {
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
    timeoutRef.current = setTimeout(() => setOpen(true), delayDuration);
  }, [delayDuration]);

  const hide = React.useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(false);
  }, []);

  return (
    <TooltipContext.Provider
      value={{ open, show, hide, triggerRef, floatingRef, coords }}
    >
      {children}
    </TooltipContext.Provider>
  );
};

export const useTooltipContext = (component: string) => {
  const ctx = React.useContext(TooltipContext);
  if (!ctx) throw new Error(`${component} must be used within a <Tooltip>`);
  return ctx;
};

export default TooltipProvider;
