'use client';

import React, { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Modal,
  Button,
  Input,
  Textarea,
  useToast,
  Label
} from '@repo/ui/components';
import FileUploader from 'components/base/FileUploader';
import { useTestimonialMutations } from 'hooks/mutations/useTestimonialMutations';
import { useGetTestimonialById } from 'hooks/queries/useTestimonialQueries';
// Adjust this import to whatever your Blog/Portfolio form actually uses
// for uploading images (same hook `uploadImage.mutateAsync` came from).
import { useFileUpload } from 'hooks/useFileUpload';
import {
  useForm,
  Controller,
  type Resolver,
  type ControllerRenderProps
} from 'react-hook-form';
import {
  testimonialFormSchema,
  TestimonialFormSchemaType
} from 'utils/schemas/testimonial.schema';

interface TestimonialModalProps {
  open: boolean;
  onClose: () => void;
  editId?: number;
}

const defaultValues: TestimonialFormSchemaType = {
  name: '',
  designation: '',
  company: '',
  description: '',
  image: ''
};

// The actual form UI, keyed/remounted per editId+open so the Uploader
// always initializes fresh with the correct resolved value instead of
// inheriting stale internal state from a previous render.
const TestimonialForm = ({
  editId,
  isEditMode,
  onClose
}: {
  editId?: number;
  isEditMode: boolean;
  onClose: () => void;
}) => {
  const { toast } = useToast();
  const { createTestimonial, updateTestimonial } = useTestimonialMutations();
  const uploadImage = useFileUpload();

  const { data: testimonial, isLoading: isTestimonialLoading } =
    useGetTestimonialById(editId ?? 0);

  // Tracks the actually-uploaded photo URL, separate from the form field
  // (which briefly holds a raw File right after drop, for preview).
  const [imageUrl, setImageUrl] = useState('');

  // Build the form values from the fetched testimonial once it's
  // available. Falls back to defaultValues while loading / in create mode.
  const resolvedValues = useMemo<TestimonialFormSchemaType>(() => {
    if (!isEditMode || !testimonial) return defaultValues;
    return {
      name: testimonial.name,
      designation: testimonial.designation,
      company: testimonial.company,
      description: testimonial.description,
      image: testimonial.image
    };
  }, [isEditMode, testimonial]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<TestimonialFormSchemaType>({
    resolver: zodResolver(
      testimonialFormSchema
    ) as Resolver<TestimonialFormSchemaType>,
    defaultValues: resolvedValues,
    // `values` keeps the form in sync whenever resolvedValues changes
    // (e.g. once the async testimonial query resolves), without the
    // race conditions of a manual reset() inside a useEffect.
    values: resolvedValues
  });

  const handleImageDrop = async (
    files: File[],
    field: ControllerRenderProps<TestimonialFormSchemaType, 'image'>
  ) => {
    const file = files?.[0];
    if (!file) return;

    field.onChange(file); // local preview immediately
    try {
      const uploadedImage = await uploadImage.mutateAsync({
        file,
        folder: 'testimonial'
      });
      setImageUrl(uploadedImage.url);
      toast({ variant: 'success', title: 'Photo uploaded.' });
    } catch {
      field.onChange('');
      toast({ variant: 'error', title: 'Failed to upload photo.' });
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    const resolvedImage =
      imageUrl || (typeof values.image === 'string' ? values.image : '');

    const payload = {
      ...values,
      image: resolvedImage
    };

    try {
      if (isEditMode && editId) {
        const res = await updateTestimonial.mutateAsync({
          id: editId,
          payload
        });
        if (res.success) {
          toast({
            variant: 'success',
            title: res.message ?? 'Testimonial updated successfully.'
          });
        } else {
          toast({
            variant: 'error',
            title: res.message ?? 'Testimonial updated failed.'
          });
        }
      } else {
        const res = await createTestimonial.mutateAsync(payload);
        if (res.success) {
          toast({
            variant: 'success',
            title: res.message ?? 'Testimonial created successfully.'
          });
        } else {
          toast({
            variant: 'error',
            title: res.message ?? 'Testimonial created successfully.'
          });
        }
      }
      onClose();
    } catch (error) {
      toast({
        variant: 'error',
        title: error instanceof Error ? error.message : 'Something went wrong.'
      });
    }
  });

  const isBusy =
    isSubmitting || createTestimonial.isPending || updateTestimonial.isPending;

  return (
    <form onSubmit={onSubmit}>
      <Modal.Body className="flex flex-col gap-6">
        {isEditMode && isTestimonialLoading ? (
          <div className="py-10 text-center text-sm text-secondary-300">
            Loading testimonial...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="mb-2" required>
                Name
              </Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    id="name"
                    placeholder="e.g. Jane Doe"
                    autoComplete="off"
                    aria-invalid={!!errors.name}
                    {...field}
                  />
                )}
              />
              {errors.name && (
                <p className="text-xs text-error-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="designation" className="mb-2" required>
                Designation
              </Label>
              <Controller
                name="designation"
                control={control}
                render={({ field }) => (
                  <Input
                    id="designation"
                    placeholder="e.g. Product Manager"
                    autoComplete="off"
                    aria-invalid={!!errors.designation}
                    {...field}
                  />
                )}
              />
              {errors.designation && (
                <p className="text-xs text-error-500">
                  {errors.designation.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="company" className="mb-2" required>
                Company
              </Label>
              <Controller
                name="company"
                control={control}
                render={({ field }) => (
                  <Input
                    id="company"
                    placeholder="e.g. Acme Inc."
                    autoComplete="off"
                    aria-invalid={!!errors.company}
                    {...field}
                  />
                )}
              />
              {errors.company && (
                <p className="text-xs text-error-500">
                  {errors.company.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description" className="mb-2" required>
                Testimonial
              </Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="description"
                    rows={4}
                    placeholder="What did they say about working with you?"
                    aria-invalid={!!errors.description}
                    {...field}
                  />
                )}
              />
              {errors.description && (
                <p className="text-xs text-error-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label required htmlFor="image" className="mb-2">
                Photo
              </Label>
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <FileUploader
                    files={
                      field.value instanceof File ? [field.value] : undefined
                    }
                    previewUrls={
                      typeof field.value === 'string' && field.value
                        ? [field.value]
                        : undefined
                    }
                    onDrop={(files) => handleImageDrop(files, field)}
                    onRemove={() => {
                      field.onChange('');
                      setImageUrl('');
                      toast({ variant: 'success', title: 'Photo removed.' });
                    }}
                    fileType={['image/png', 'image/jpeg', 'image/webp']}
                    error={!!errors.image}
                    errorText={errors.image?.message as string}
                    errorClassName="text-xs"
                  />
                )}
              />
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="flex justify-end gap-3 sticky bottom-0 left-0 bg-secondary-700">
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
          disabled={isBusy || uploadImage.isPending}
        >
          {isEditMode ? 'Save changes' : 'Create testimonial'}
        </Button>
      </Modal.Footer>
    </form>
  );
};

const TestimonialModal = ({ open, onClose, editId }: TestimonialModalProps) => {
  const isEditMode = typeof editId === 'number';

  return (
    <Modal isOpen={open} onClose={onClose}>
      <Modal.Content>
        <Modal.Header>
          {isEditMode ? 'Edit Testimonial' : 'Add Testimonial'}
          <Modal.Close
            aria-label="Close modal"
            className="text-xl leading-none cursor-pointer"
          >
            &times;
          </Modal.Close>
        </Modal.Header>

        {/*
          Keying on open + editId forces a full remount of the form
          (and therefore the Uploader) each time the modal opens for a
          specific record, so it initializes fresh with the correct
          resolved value instead of retaining stale internal state.
        */}
        {open && (
          <TestimonialForm
            key={editId ?? 'create'}
            editId={editId}
            isEditMode={isEditMode}
            onClose={onClose}
          />
        )}
      </Modal.Content>
    </Modal>
  );
};

export default TestimonialModal;
