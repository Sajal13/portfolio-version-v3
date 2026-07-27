'use client';

import React from 'react';
import { Portal } from '@/utils/Portal';
import { useEscapeKey, useFocusTrap, useScrollLock } from '@/utils/useOverlay';
import { cn } from '@/utils/cn';

type DrawerContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DrawerContext = React.createContext<DrawerContextValue | null>(null);

function useDrawerContext(component: string) {
  const ctx = React.useContext(DrawerContext);
  if (!ctx) throw new Error(`${component} must be used within a <Drawer>`);
  return ctx;
}

type DrawerProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
};

function Drawer({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children
}: DrawerProps) {
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
    <DrawerContext.Provider value={{ open, setOpen }}>
      {children}
    </DrawerContext.Provider>
  );
}

function DrawerTrigger({ onClick, ...props }: React.ComponentProps<'button'>) {
  const { setOpen } = useDrawerContext('DrawerTrigger');
  return (
    <button
      type="button"
      onClick={(e) => {
        onClick?.(e);
        setOpen(true);
      }}
      {...props}
    />
  );
}

type DrawerContentProps = React.ComponentProps<'div'> & {
  showHandle?: boolean;
};

// Note: because content unmounts immediately when `open` becomes false,
// dragging past the dismiss threshold snaps the drawer away rather than
// animating it sliding fully off-screen. A true exit animation needs a
// small state machine (open -> closing -> closed) — worth adding if the
// snap bothers you, skipped here to keep this readable.
function DrawerContent({
  className,
  children,
  showHandle = true,
  ...props
}: DrawerContentProps) {
  const { open, setOpen } = useDrawerContext('DrawerContent');
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [dragY, setDragY] = React.useState(0);
  const dragState = React.useRef<{ startY: number; dragging: boolean } | null>(
    null
  );

  useScrollLock(open);
  useEscapeKey(open, () => setOpen(false));
  useFocusTrap(contentRef, open);

  React.useEffect(() => {
    if (open) setDragY(0);
  }, [open]);

  const onPointerDown = (e: React.PointerEvent) => {
    dragState.current = { startY: e.clientY, dragging: true };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current?.dragging) return;
    const delta = e.clientY - dragState.current.startY;
    setDragY(Math.max(0, delta));
  };

  const onPointerUp = () => {
    if (!dragState.current) return;
    dragState.current.dragging = false;
    if (dragY > 100) setOpen(false);
    setDragY(0);
  };

  if (!open) return null;

  return (
    <Portal>
      <div
        data-slot="drawer-overlay"
        className="fixed inset-0 z-50 bg-black/60"
        onClick={() => setOpen(false)}
      />
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        data-slot="drawer-content"
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col gap-4 rounded-t-lg border-t border-main bg-secondary-700 p-6 text-white shadow-lg',
          className
        )}
        style={{
          transform: `translateY(${dragY}px)`,
          transition: dragState.current?.dragging
            ? 'none'
            : 'transform 200ms ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {showHandle && (
          <div
            className="mx-auto h-1.5 w-12 shrink-0 cursor-grab touch-none rounded-full bg-neutral-500/40 active:cursor-grabbing"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          />
        )}
        {children}
      </div>
    </Portal>
  );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1.5 text-center sm:text-left',
        className
      )}
      {...props}
    />
  );
}

function DrawerFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('mt-auto flex flex-col gap-2', className)} {...props} />
  );
}

function DrawerTitle({ className, ...props }: React.ComponentProps<'h2'>) {
  return <h2 className={cn('text-lg font-semibold', className)} {...props} />;
}

function DrawerDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return <p className={cn('text-sm text-neutral-400', className)} {...props} />;
}

export {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription
};
export type { DrawerProps };
