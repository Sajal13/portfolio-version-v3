'use client';

import React from 'react';
import { Modal, Button } from '@repo/ui/components';

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  title?: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
}

const DeleteConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  isDeleting,
  title = 'Delete item',
  description = 'Are you sure you want to delete this item? This action cannot be undone.',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel'
}: DeleteConfirmationModalProps) => {
  return (
    <Modal isOpen={open} onClose={onClose}>
      <Modal.Content className="max-w-md">
        <Modal.Header>
          {title}{' '}
          <Modal.Close
            aria-label="Close modal"
            className="text-xl leading-none cursor-pointer"
          >
            &times;
          </Modal.Close>
        </Modal.Header>
        <Modal.Body>
          <p className="text-sm text-secondary-300">{description}</p>
        </Modal.Body>
        <Modal.Footer className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            color="secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="filled"
            color="error"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : confirmLabel}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default DeleteConfirmationModal;
