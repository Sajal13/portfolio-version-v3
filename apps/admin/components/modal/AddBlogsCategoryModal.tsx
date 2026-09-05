'use client';

import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Label, Modal, useToast } from '@repo/ui/components';
import { useBlogCategoryMutations } from 'hooks/mutations/useBlogCategoryMutations';
import { useGetBlogCategoryById } from 'hooks/queries/useBlogCategoryQueries';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

interface AddBlogsCategoryModalProps {
  onClose: () => void;
  isOpen: boolean;
  editId?: number;
}

const AddBlogCategoryFormSchema = z.object({
  name: z.string('Name is required.').min(1, { message: 'Name is required' })
});

type AddBlogCategoryFormValues = z.infer<typeof AddBlogCategoryFormSchema>;

const defaultValues: AddBlogCategoryFormValues = {
  name: ''
};

const AddBlogsCategoryModal = ({
  onClose,
  isOpen,
  editId
}: AddBlogsCategoryModalProps) => {
  const isEditMode = typeof editId === 'number';

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<AddBlogCategoryFormValues>({
    resolver: zodResolver(AddBlogCategoryFormSchema),
    defaultValues
  });

  const { createBlogCategory, updateBlogCategory } = useBlogCategoryMutations();
  const { data: blogCategory, isLoading: isBlogCategoryLoading } =
    useGetBlogCategoryById(editId);
  const { toast } = useToast();

  // Hydrate form once the category loads in edit mode
  useEffect(() => {
    if (isEditMode && blogCategory) {
      reset({
        name: blogCategory.name
      });
    }
  }, [isEditMode, blogCategory, reset]);

  // Clean slate whenever the modal closes, so re-opening for "Add" is fresh
  useEffect(() => {
    if (!isOpen) {
      reset(defaultValues);
    }
  }, [isOpen, reset]);

  const isBusy = createBlogCategory.isPending || updateBlogCategory.isPending;

  const onFormSubmit = async (data: AddBlogCategoryFormValues) => {
    const payload = {
      name: data.name
    };

    try {
      if (isEditMode && editId) {
        const res = await updateBlogCategory.mutateAsync({
          id: editId,
          payload
        });
        if (res.success) {
          toast({
            variant: 'success',
            title: res.message ?? 'Blog category updated successfully.'
          });
        } else {
          toast({
            variant: 'error',
            title: res.message ?? 'Failed to update blog category.'
          });
        }
      } else {
        const res = await createBlogCategory.mutateAsync(payload);
        if (res.success) {
          toast({
            variant: 'success',
            title: res.message ?? 'Blog category created successfully.'
          });
        } else {
          toast({
            variant: 'error',
            title: res.message ?? 'Failed to create blog category.'
          });
        }
      }
      onClose();
    } catch (error) {
      toast({
        variant: 'error',
        title:
          error instanceof Error
            ? error.message
            : 'An error occurred while saving the blog category.'
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Content className="max-w-120">
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Modal.Header>
            {isEditMode ? 'Edit Blog Category' : 'Add Blog Category'}
            <Modal.Close
              aria-label="Close modal"
              className="text-xl leading-none cursor-pointer"
            >
              &times;
            </Modal.Close>
          </Modal.Header>
          <Modal.Body>
            {isEditMode && isBlogCategoryLoading ? (
              <div className="py-10 text-center text-sm text-secondary-300">
                Loading category...
              </div>
            ) : (
              <>
                <Label htmlFor="name" className="mb-2">
                  Category Name
                </Label>
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <Input
                      id="name"
                      placeholder="Enter category name..."
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
              </>
            )}
          </Modal.Body>
          <Modal.Footer className=" sticky bottom-0 left-0 bg-secondary-700 flex justify-end gap-3">
            <Button variant="outline" color="secondary" onClick={onClose}>
              Close
            </Button>
            <Button
              type="submit"
              variant="filled"
              color="primary"
              disabled={isBusy}
            >
              {isEditMode ? 'Save changes' : 'Add Category'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal>
  );
};

export default AddBlogsCategoryModal;
