'use client';

import * as React from 'react';
import { cn } from '@repo/ui/utils';
import { createPortal } from 'react-dom';

export function SidebarTooltip({
  label,
  active,
  children
}: {
  label: string;
  active: boolean;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = React.useState(false);
  const [coords, setCoords] = React.useState({ top: 0, left: 0 });
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const show = () => {
    if (!active) return;
    timeoutRef.current = setTimeout(() => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (rect) {
        setCoords({ top: rect.top + rect.height / 2, left: rect.right + 8 });
      }
      setVisible(true);
    }, 150);
  };

  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  return (
    <div
      ref={triggerRef}
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {mounted &&
        active &&
        visible &&
        createPortal(
          <span
            role="tooltip"
            style={{ top: coords.top, left: coords.left }}
            className={cn(
              'pointer-events-none fixed z-50 -translate-y-1/2 whitespace-nowrap',
              'rounded-md bg-secondary-700 p-2 text-sm text-white shadow-md',
              'animate-in fade-in-0 zoom-in-95'
            )}
          >
            {label}
          </span>,
          document.body
        )}
    </div>
  );
}
