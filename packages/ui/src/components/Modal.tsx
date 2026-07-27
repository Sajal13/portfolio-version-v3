'use client';

import React, {
  HTMLAttributes,
  ButtonHTMLAttributes,
  useEffect,
  useRef,
  useCallback,
  useState,
  createContext,
  useContext
} from 'react';
import { Portal } from '../utils/Portal';
import { cn } from '../utils/cn';

/**
 * Two ways to use this now:
 *
 * 1) Controlled — exactly like before, no changes needed except wrapping
 *    your existing children in <Modal.Content>:
 *
 *      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
 *        <Modal.Content>
 *          <Modal.Header>Title</Modal.Header>
 *          <Modal.Body>...</Modal.Body>
 *        </Modal.Content>
 *      </Modal>
 *
 * 2) Self-managed — Modal owns its own open state, use Modal.Trigger to open it:
 *
 *      <Modal>
 *        <Modal.Trigger>Open</Modal.Trigger>
 *        <Modal.Content>
 *          <Modal.Header>Title</Modal.Header>
 *          <Modal.Body>...</Modal.Body>
 *        </Modal.Content>
 *      </Modal>
 *
 * Why the split: Modal.Trigger needs to always be in the DOM (so it's
 * clickable to open the modal), while the panel itself should only exist
 * while open. Previously both lived directly under <Modal>, which only
 * rendered anything at all when isOpen was true — so a trigger button
 * placed there could never be clicked.
 */

type ModalContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const ModalContext = createContext<ModalContextValue | null>(null);

function useModalContext(component: string) {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error(`${component} must be used within a <Modal>`);
  return ctx;
}

interface ModalProps {
  /** Controlled usage — pass both to drive open state from outside, same as before */
  isOpen?: boolean;
  onClose?: () => void;
  /** Self-managed usage — Modal tracks its own state; use with <Modal.Trigger> */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

interface ModalComponent extends React.FC<ModalProps> {
  Trigger: React.FC<ButtonHTMLAttributes<HTMLButtonElement>>;
  Content: React.FC<HTMLAttributes<HTMLDivElement>>;
  Header: React.FC<HTMLAttributes<HTMLDivElement>>;
  Body: React.FC<HTMLAttributes<HTMLDivElement>>;
  Footer: React.FC<HTMLAttributes<HTMLDivElement>>;
  Close: React.FC<ButtonHTMLAttributes<HTMLButtonElement>>;
}

const Modal: ModalComponent = ({
  isOpen: isOpenProp,
  onClose,
  defaultOpen = false,
  onOpenChange,
  children
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  // controlled the instant isOpen is passed in — same trigger condition as before
  const isControlled = isOpenProp !== undefined;
  const open = isControlled ? (isOpenProp as boolean) : uncontrolledOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      if (!next) onClose?.();
      onOpenChange?.(next);
    },
    [isControlled, onClose, onOpenChange]
  );

  return (
    <ModalContext.Provider value={{ open, setOpen }}>
      {children}
    </ModalContext.Provider>
  );
};

Modal.displayName = 'Modal';

// ✅ Trigger — new. Always rendered, opens the modal on click.
const ModalTrigger: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  onClick,
  ...props
}) => {
  const { setOpen } = useModalContext('Modal.Trigger');
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
};
ModalTrigger.displayName = 'Modal.Trigger';
Modal.Trigger = ModalTrigger;

// ✅ Content — this is your original Modal body: the portal, overlay, scroll
// lock, escape-to-close, and focus trap, all unchanged from before.
const ModalContent: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  const { open, setOpen } = useModalContext('Modal.Content');
  const modalRef = useRef<HTMLDivElement>(null);

  // 🔒 Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // ⎋ ESC close
  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    },
    [setOpen]
  );

  useEffect(() => {
    if (open) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [open, handleEsc]);

  // 🎯 Focus trap
  useEffect(() => {
    if (!open || !modalRef.current) return;

    const node = modalRef.current;

    const focusable = node.querySelectorAll<
      HTMLButtonElement | HTMLAnchorElement | HTMLInputElement
    >(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    first?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    node.addEventListener('keydown', handleTab);

    return () => {
      node.removeEventListener('keydown', handleTab);
    };
  }, [open]);

  if (!open) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[10px]">
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/50 animate-fade-in"
          onClick={() => setOpen(false)}
        />

        {/* Modal */}
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          className={cn(
            'relative z-10 w-[calc(100%-4px)] max-w-184.5 max-h-[calc(95vh-20px)] rounded-lg overflow-y-auto! bg-secondary-700 drop-shadow-modal',
            'animate-scale-in',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    </Portal>
  );
};
ModalContent.displayName = 'Modal.Content';
Modal.Content = ModalContent;

// ✅ Header
const ModalHeader: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      'font-medium text-xl md:text-2xl flex justify-between items-center',
      'px-4 py-5 md:px-9 md:py-8 border-b border-b-main sticky top-0 inset-x-0 bg-secondary-700 z-20',
      className
    )}
    {...props}
  />
);
ModalHeader.displayName = 'Modal.Header';
Modal.Header = ModalHeader;

// ✅ Body
const ModalBody: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      'px-4 py-8 md:px-6 md:py-9 flex-1 overflow-y-auto',
      className
    )}
    {...props}
  />
);
ModalBody.displayName = 'Modal.Body';
Modal.Body = ModalBody;

// ✅ Footer
const ModalFooter: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      'px-6 py-5 md:px-9 md:py-8 border-t border-t-main',
      className
    )}
    {...props}
  />
);
ModalFooter.displayName = 'Modal.Footer';
Modal.Footer = ModalFooter;

// ✅ Close — new. Drop anywhere inside Modal.Content to close on click.
const ModalClose: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  onClick,
  ...props
}) => {
  const { setOpen } = useModalContext('Modal.Close');
  return (
    <button
      type="button"
      onClick={(e) => {
        onClick?.(e);
        setOpen(false);
      }}
      {...props}
    />
  );
};

ModalClose.displayName = 'Modal.Close';
Modal.Close = ModalClose;

export default Modal;
