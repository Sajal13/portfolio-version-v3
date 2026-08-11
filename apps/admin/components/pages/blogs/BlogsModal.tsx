'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Modal,
  Button,
  Input,
  SearchableSelect,
  useToast,
  type SearchableSelectOption,
  Label
} from '@repo/ui/components';
import FileUploader from 'components/base/FileUploader';
import { useBlogMutations } from 'hooks/mutations/useBlogMutations';
import { useGetBlogById } from 'hooks/queries/useBlogQueries';
import { useGetAllTools } from 'hooks/queries/useToolsQueries';
import { useFileUpload } from 'hooks/useFileUpload';
import {
  useForm,
  Controller,
  type ControllerRenderProps
} from 'react-hook-form';
import { blogFormSchema, BlogFormValues } from 'utils/schemas/blog.schema';

interface BlogsModalProps {
  open: boolean;
  onClose: () => void;
  editId?: number;
}

const defaultValues: BlogFormValues = {
  title: '',
  image: '',
  markdown: '',
  tools: []
};

const BlogsModal = ({ open, onClose, editId }: BlogsModalProps) => {
  const isEditMode = typeof editId === 'number';
  const { toast } = useToast();
  const { createBlog, updateBlog } = useBlogMutations();

  const { data: toolsOptions } = useGetAllTools();
  const { data: blog, isLoading: isBlogLoading } = useGetBlogById(editId);

  const uploadImage = useFileUpload();
  const uploadMarkdown = useFileUpload();

  // Source of truth for the actual submit payload — the RHF field values
  // for image/markdown are only used for preview + zod validation.
  const [imageUrl, setImageUrl] = useState('');
  const [markdownId, setMarkdownId] = useState('');
  const [markdownFileName, setMarkdownFileName] = useState('');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues
  });

  // Hydrate form + upload state once the blog loads in edit mode
  useEffect(() => {
    if (isEditMode && blog) {
      reset({
        title: blog.title,
        image: blog.image,
        markdown: blog.markdown.id,
        tools: blog.tools.map((tool) => tool.id)
      });
      setImageUrl(blog.image);
      setMarkdownId(blog.markdown.id);
      setMarkdownFileName(blog.markdown.originalName);
    }
  }, [isEditMode, blog, reset]);

  // Clean slate whenever the modal closes, so re-opening for "Add" is fresh
  useEffect(() => {
    if (!open) {
      reset(defaultValues);
      setImageUrl('');
      setMarkdownId('');
      setMarkdownFileName('');
    }
  }, [open, reset]);

  // --- Tools: SearchableSelect wants string ids + a loadOptions fetcher,
  // our form/API deal in number ids, so the conversion lives at this boundary.
  const toolSelectOptions = useMemo<SearchableSelectOption[]>(
    () =>
      (toolsOptions ?? []).map((tool) => ({
        label: tool.name,
        value: String(tool.id)
      })),
    [toolsOptions]
  );

  const loadToolOptions = useCallback(
    async (query: string) => {
      if (!query.trim()) return toolSelectOptions;
      const q = query.toLowerCase();
      return toolSelectOptions.filter((opt) =>
        opt.label.toLowerCase().includes(q)
      );
    },
    [toolSelectOptions]
  );

  // Seeds labels for already-selected tool ids on an edit load, so chips show
  // "React" instead of "3" before loadOptions has run. Only matters at mount
  // time (see SearchableSelect internals), which lines up with how this modal
  // already gates rendering on `isBlogLoading`.
  const initialToolOptions = useMemo<SearchableSelectOption[] | undefined>(
    () =>
      isEditMode && blog
        ? blog.tools.map((tool) => ({
            label: tool.name,
            value: String(tool.id)
          }))
        : undefined,
    [isEditMode, blog]
  );

  const handleImageDrop = async (
    files: File[],
    field: ControllerRenderProps<BlogFormValues, 'image'>
  ) => {
    const file = files?.[0];
    if (!file) return;

    field.onChange(file); // local preview immediately
    try {
      const uploadedImage = await uploadImage.mutateAsync({
        file,
        folder: 'blogs'
      });
      setImageUrl(uploadedImage.url);
      toast({ variant: 'success', title: 'Cover image uploaded.' });
    } catch {
      field.onChange('');
      toast({ variant: 'error', title: 'Failed to upload cover image.' });
    }
  };

  const handleMarkdownDrop = async (
    files: File[],
    field: ControllerRenderProps<BlogFormValues, 'markdown'>
  ) => {
    const file = files?.[0];
    if (!file) return;

    field.onChange(file);
    try {
      const uploadedMarkdown = await uploadMarkdown.mutateAsync({
        file,
        folder: 'blogs'
      });
      console.log(uploadedMarkdown);
      setMarkdownId(uploadedMarkdown.id);
      setMarkdownFileName(file.name);
      toast({ variant: 'success', title: 'Markdown file uploaded.' });
    } catch {
      field.onChange('');
      toast({ variant: 'error', title: 'Failed to upload markdown file.' });
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    if (!imageUrl) {
      toast({
        variant: 'error',
        title: 'Please upload a cover image before submitting.'
      });
      return;
    }
    if (!markdownId) {
      toast({
        variant: 'error',
        title: 'Please upload a markdown file before submitting.'
      });
      return;
    }

    const payload = {
      title: values.title,
      image: imageUrl,
      markdownId,
      tools: values.tools
    };

    try {
      if (isEditMode && editId) {
        await updateBlog.mutateAsync({ id: editId, payload });
        toast({ variant: 'success', title: 'Blog updated successfully.' });
      } else {
        await createBlog.mutateAsync(payload);
        toast({ variant: 'success', title: 'Blog created successfully.' });
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
    isSubmitting || uploadImage.isPending || uploadMarkdown.isPending;

  return (
    <Modal isOpen={open} onClose={onClose}>
      <Modal.Content>
        <Modal.Header>
          {isEditMode ? 'Edit Blog' : 'Add Blog'}
          <Modal.Close
            aria-label="Close modal"
            className="text-xl leading-none"
          >
            &times;
          </Modal.Close>
        </Modal.Header>

        <form onSubmit={onSubmit}>
          <Modal.Body className="flex flex-col gap-6">
            {isEditMode && isBlogLoading ? (
              <div className="py-10 text-center text-sm text-secondary-300">
                Loading blog...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="">
                  <Label htmlFor="title" className="mb-2" required>
                    Title
                  </Label>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="title"
                        placeholder="Blogs title..."
                        aria-invalid={!!errors.title}
                        autoComplete="off"
                        {...field}
                      />
                    )}
                  />
                  {errors.title && (
                    <p className="text-xs text-error-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="tools" className="mb-2" required>
                    Tools
                  </Label>
                  <Controller
                    name="tools"
                    control={control}
                    render={({ field }) => (
                      <SearchableSelect
                        isMulti
                        placeholder="Select tools used"
                        value={field.value.map(String)}
                        onValueChange={(val) =>
                          field.onChange(((val as string[]) ?? []).map(Number))
                        }
                        loadOptions={loadToolOptions}
                        initialOptions={initialToolOptions}
                      />
                    )}
                  />
                  {errors.tools && (
                    <p className="text-xs text-error-500">
                      {errors.tools.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label required htmlFor="image" className="mb-2">
                    Cover Image
                  </Label>
                  <Controller
                    name="image"
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
                        onDrop={(files) => handleImageDrop(files, field)}
                        onRemove={() => {
                          field.onChange('');
                          setImageUrl('');
                          toast({
                            variant: 'success',
                            title: 'Cover image removed.'
                          });
                        }}
                        fileType={['image/png', 'image/jpeg', 'image/webp']}
                        error={!!errors.image}
                        errorText={errors.image?.message as string}
                        errorClassName="text-xs"
                      />
                    )}
                  />
                </div>

                <div>
                  <Label required htmlFor="markdown" className="mb-2">
                    Markdown File
                  </Label>
                  <Controller
                    name="markdown"
                    control={control}
                    render={({ field }) => (
                      <FileUploader
                        files={
                          field.value instanceof File
                            ? [field.value]
                            : undefined
                        }
                        previewUrls={
                          typeof field.value === 'string' &&
                          field.value &&
                          markdownFileName
                            ? [markdownFileName]
                            : undefined
                        }
                        onDrop={(files) => handleMarkdownDrop(files, field)}
                        onRemove={() => {
                          field.onChange('');
                          setMarkdownId('');
                          setMarkdownFileName('');
                          toast({
                            variant: 'success',
                            title: 'Markdown file removed.'
                          });
                        }}
                        fileType={['.md', 'text/markdown']}
                        error={!!errors.markdown}
                        errorText={errors.markdown?.message as string}
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
              {isEditMode ? 'Save changes' : 'Create blog'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal>
  );
};

export default BlogsModal;
