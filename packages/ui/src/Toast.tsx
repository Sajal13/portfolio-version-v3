'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { cn } from 'utils/cn';

type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

type Toast = {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

type ToastInput = Omit<Toast, 'id'>;

type ToastContextValue = {
  toast: (input: ToastInput) => string;
  dismiss: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

/**
 * const { toast } = useToast();
 * toast({ title: "Message sent", variant: "success" });
 */
function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx)
    throw new Error(
      'useToast must be used within a <ToastProvider> — put it once in your root layout'
    );
  return ctx;
}

let toastIdCounter = 0;

/**
 * Put this once near the root, wrapping your app:
 *
 *   // app/layout.tsx
 *   <ToastProvider>{children}</ToastProvider>
 *
 * Then anywhere deeper in the tree:
 *
 *   const { toast } = useToast();
 *   toast({ title: "Saved", description: "Your changes were saved.", variant: "success" });
 */
function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback(
    (input: ToastInput) => {
      const id = `toast-${++toastIdCounter}`;
      const duration = input.duration ?? 4000;
      setToasts((prev) => [...prev, { id, ...input }]);
      if (duration > 0) setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {mounted &&
        createPortal(
          <div
            data-slot="toast-viewport"
            className="fixed bottom-0 right-0 z-100 flex w-full max-w-sm flex-col gap-2 p-4 sm:bottom-4 sm:right-4"
          >
            {toasts.map((t) => (
              <ToastCard key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

const variantClass: Record<ToastVariant, string> = {
  default: 'border-main bg-secondary-700 text-white',
  success: 'border-success-500/40 bg-success-500/10 text-success-500',
  error: 'border-error-500/40 bg-error-500/10 text-error-500',
  warning: 'border-warning-500/40 bg-warning-500/10 text-warning-500',
  info: 'border-info-500/40 bg-info-500/10 text-info-500'
};

function ToastCard({
  toast,
  onDismiss
}: {
  toast: Toast;
  onDismiss: () => void;
}) {
  return (
    <div
      role="status"
      data-slot="toast"
      className={cn(
        'flex items-start gap-3 rounded-lg border p-4 shadow-lg',
        variantClass[toast.variant ?? 'default']
      )}
    >
      <div className="flex-1">
        {toast.title && <p className="text-sm font-medium">{toast.title}</p>}
        {toast.description && (
          <p className="mt-0.5 text-sm opacity-80">{toast.description}</p>
        )}
      </div>
      <button
        type="button"
        aria-label="Dismiss"
        className="cursor-pointer text-current opacity-60 outline-none transition-opacity hover:opacity-100"
        onClick={onDismiss}
      >
        <CloseIcon className="size-4" />
      </button>
    </div>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export { ToastProvider, useToast };
export type { Toast, ToastInput, ToastVariant };
