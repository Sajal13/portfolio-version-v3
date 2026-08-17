'use client';

import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Button, Input, useToast, Label } from '@repo/ui/components';
import FileUploader from 'components/base/FileUploader';
import { useToolMutations } from 'hooks/mutations/useToolMutations';
import { useGetToolById } from 'hooks/queries/useToolsQueries';
import { useFileUpload } from 'hooks/useFileUpload';
import {
  useForm,
  Controller,
  type ControllerRenderProps
} from 'react-hook-form';
import { urlSchema } from 'utils/schemas/common';
import { z } from 'zod';

const toolFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name is too long'),
  docUrl: urlSchema,
  icon: z.union([z.instanceof(File), z.string()]).optional()
});

type ToolFormValues = z.infer<typeof toolFormSchema>;

interface ToolsModalProps {
  open: boolean;
  onClose: () => void;
  editId?: number;
}

const defaultValues: ToolFormValues = {
  name: '',
  docUrl: '',
  icon: ''
};

const ToolsModal = ({ open, onClose, editId }: ToolsModalProps) => {
  const isEditMode = typeof editId === 'number';
  const { toast } = useToast();
  const { createTool, updateTool } = useToolMutations();

  const { data: tool, isLoading: isToolLoading } = useGetToolById(editId);
  const uploadIcon = useFileUpload();

  const [iconUrl, setIconUrl] = useState('');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ToolFormValues>({
    resolver: zodResolver(toolFormSchema),
    defaultValues
  });

  // Hydrate form + upload state once the tool loads in edit mode
  useEffect(() => {
    if (isEditMode && tool) {
      reset({
        name: tool.name,
        docUrl: tool.docUrl,
        icon: tool.icon ?? ''
      });
      setIconUrl(tool.icon ?? '');
    }
  }, [isEditMode, tool, reset]);

  // Clean slate whenever the modal closes, so re-opening for "Add" is fresh
  useEffect(() => {
    if (!open) {
      reset(defaultValues);
      setIconUrl('');
    }
  }, [open, reset]);

  const handleIconDrop = async (
    files: File[],
    field: ControllerRenderProps<ToolFormValues, 'icon'>
  ) => {
    const file = files?.[0];
    if (!file) return;

    field.onChange(file); // local preview immediately
    try {
      const uploaded = await uploadIcon.mutateAsync({ file, folder: 'tools' });
      setIconUrl(uploaded.url);
      toast({ variant: 'success', title: 'Icon uploaded.' });
    } catch {
      field.onChange('');
      toast({ variant: 'error', title: 'Failed to upload icon.' });
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      name: values.name,
      docUrl: values.docUrl,
      ...(iconUrl ? { icon: iconUrl } : {})
    };

    try {
      if (isEditMode && editId) {
        await updateTool.mutateAsync({ id: editId, payload });
        toast({ variant: 'success', title: 'Tool updated successfully.' });
      } else {
        await createTool.mutateAsync(payload);
        toast({ variant: 'success', title: 'Tool created successfully.' });
      }
      onClose();
    } catch (error) {
      toast({
        variant: 'error',
        title: error instanceof Error ? error.message : 'Something went wrong.'
      });
    }
  });

  const isBusy = isSubmitting || uploadIcon.isPending;

  return (
    <Modal isOpen={open} onClose={onClose}>
      <Modal.Content>
        <Modal.Header>
          {isEditMode ? 'Edit Tool' : 'Add Tool'}
          <Modal.Close
            aria-label="Close modal"
            className="text-xl leading-none cursor-pointer"
          >
            &times;
          </Modal.Close>
        </Modal.Header>

        <form onSubmit={onSubmit}>
          <Modal.Body className="flex flex-col gap-6">
            {isEditMode && isToolLoading ? (
              <div className="py-10 text-center text-sm text-secondary-300">
                Loading tool...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="mb-2" required>
                    Title
                  </Label>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="name"
                        placeholder="Tool name..."
                        aria-invalid={!!errors.name}
                        autoComplete="off"
                        {...field}
                      />
                    )}
                  />
                  {errors.name && (
                    <p className="text-xs text-error-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="docUrl" className="mb-2" required>
                    Documentation URL
                  </Label>
                  <Controller
                    name="docUrl"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="docUrl"
                        type="url"
                        placeholder="https://react.dev"
                        aria-invalid={!!errors.docUrl}
                        autoComplete="off"
                        {...field}
                      />
                    )}
                  />
                  {errors.docUrl && (
                    <p className="text-xs text-error-500">
                      {errors.docUrl.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="icon" className="mb-2">
                    Icon
                  </Label>
                  <Controller
                    name="icon"
                    control={control}
                    render={({ field }) => (
                      <FileUploader
                        files={
                          field.value instanceof File
                            ? [field.value]
                            : undefined
                        }
                        previewUrls={
                          typeof field.value === 'string' && field.value
                            ? [field.value]
                            : undefined
                        }
                        onDrop={(files) => handleIconDrop(files, field)}
                        onRemove={() => {
                          field.onChange('');
                          setIconUrl('');
                          toast({
                            variant: 'success',
                            title: 'Icon removed.'
                          });
                        }}
                        fileType={[
                          'image/png',
                          'image/jpeg',
                          'image/webp',
                          'image/svg+xml'
                        ]}
                        error={!!errors.icon}
                        errorText={errors.icon?.message as string}
                        errorClassName="text-xs"
                      />
                    )}
                  />
                </div>
              </div>
            )}
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
              type="submit"
              variant="filled"
              color="primary"
              disabled={isBusy}
            >
              {isEditMode ? 'Save changes' : 'Create tool'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal>
  );
};

export default ToolsModal;
