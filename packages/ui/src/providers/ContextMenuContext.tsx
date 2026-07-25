'use client';

import React from 'react';

type ContextMenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  position: { x: number; y: number };
  setPosition: (pos: { x: number; y: number }) => void;
  floatingRef: React.RefObject<HTMLElement | null>;
};

const ContextMenuContext = React.createContext<ContextMenuContextValue | null>(
  null
);

const ContextMenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const floatingRef = React.useRef<HTMLElement | null>(null);

  return (
    <ContextMenuContext.Provider
      value={{ open, setOpen, position, setPosition, floatingRef }}
    >
      {children}
    </ContextMenuContext.Provider>
  );
};

export const useContextMenuContext = (component: string) => {
  const ctx = React.useContext(ContextMenuContext);
  if (!ctx) throw new Error(`${component} must be used within a <ContextMenu>`);
  return ctx;
};

export default ContextMenuProvider;
