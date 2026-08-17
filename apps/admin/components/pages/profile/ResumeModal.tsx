'use client';

import React, { useEffect, useState } from 'react';
import { Modal, Button, useToast, Label } from '@repo/ui/components';
import { useQueryClient } from '@tanstack/react-query';
import FileUploader from 'components/base/FileUploader';
import { useFileUpload } from 'hooks/useFileUpload';
import { queryKeys } from 'lib/queryKeys';

interface ResumeModalProps {
  open: boolean;
  onClose: () => void;
  currentResumeName?: string;
}

const ResumeModal = ({
  open,
  onClose,
  currentResumeName
}: ResumeModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const uploadResume = useFileUpload();

  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!open) setFile(null);
  }, [open]);

  const handleDrop = (files: File[]) => {
    const dropped = files?.[0];
    if (dropped) {
      setFile(dropped);
      toast({ variant: 'success', title: 'Resume removed successful.' });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({ variant: 'error', title: 'Please select a PDF file first.' });
      return;
    }

    try {
      await uploadResume.mutateAsync({ file, folder: 'resume' });
      queryClient.invalidateQueries({ queryKey: queryKeys.resume.all });
      toast({ variant: 'success', title: 'Resume uploaded successfully.' });
      onClose();
    } catch (error) {
      toast({
        variant: 'error',
        title:
          error instanceof Error ? error.message : 'Failed to upload resume.'
      });
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose}>
      <Modal.Content>
        <Modal.Header>
          {currentResumeName ? 'Replace Resume' : 'Upload Resume'}
          <Modal.Close
            aria-label="Close modal"
            className="text-xl leading-none cursor-pointer"
          >
            &times;
          </Modal.Close>
        </Modal.Header>

        <Modal.Body className="flex flex-col gap-3">
          <Label>Resume (PDF)</Label>
          <FileUploader
            files={file ? [file] : undefined}
            previewUrls={
              !file && currentResumeName ? [currentResumeName] : undefined
            }
            onDrop={handleDrop}
            onRemove={() => setFile(null)}
            fileType={['application/pdf', '.pdf']}
          />
        </Modal.Body>

        <Modal.Footer className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            color="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="filled"
            color="primary"
            onClick={handleUpload}
            disabled={uploadResume.isPending || !file}
          >
            {uploadResume.isPending ? 'Uploading...' : 'Upload'}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default ResumeModal;
