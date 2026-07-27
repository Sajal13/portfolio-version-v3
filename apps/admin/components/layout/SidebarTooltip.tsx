"use client";

import * as React from "react";
import { cn } from "@repo/ui/utils";

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
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (!active) return;
    timeoutRef.current = setTimeout(() => setVisible(true), 150);
  };
  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {active && visible && (
        <span
          role="tooltip"
          className={cn(
            "pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap",
            "rounded-md bg-secondary-700 px-2 py-1 text-xs text-white shadow-md",
            "animate-in fade-in-0 zoom-in-95"
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}
