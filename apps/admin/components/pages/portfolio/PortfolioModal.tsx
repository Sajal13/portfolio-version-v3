'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProjectType } from '@repo/types';
import {
  Modal,
  Button,
  Input,
  Textarea,
  SearchableSelect,
  useToast,
  type SearchableSelectOption,
  Label,
  DateTimePicker
} from '@repo/ui/components';
import FileUploader from 'components/base/FileUploader';
import { usePortfolioMutations } from 'hooks/mutations/usePortfolioMutations';
import { useGetPortfolioById } from 'hooks/queries/usePortfolioQueries';
import { useGetAllTools } from 'hooks/queries/useToolsQueries';
import { useFileUpload } from 'hooks/useFileUpload';
import {
  useForm,
  Controller,
  type Resolver,
  type ControllerRenderProps
} from 'react-hook-form';
import {
  portfolioFormSchema,
  PortfolioFormSchemaType
} from 'utils/schemas/portfolio.schema';

interface PortfolioModalProps {
  open: boolean;
  onClose: () => void;
  editId?: number;
}

const projectTypeOptions: SearchableSelectOption[] = [
  { value: ProjectType.backend, label: 'Backend' },
  { value: ProjectType.featured, label: 'Featured' },
  { value: ProjectType.frontend, label: 'Frontend' },
  { value: ProjectType.fullstack, label: 'Fullstack' },
  { value: ProjectType.native, label: 'Native' }
];

const loadProjectTypeOptions = async (query: string) => {
  if (!query.trim()) return projectTypeOptions;
  const q = query.toLowerCase();
  return projectTypeOptions.filter((opt) =>
    opt.label.toLowerCase().includes(q)
  );
};

const defaultValues: PortfolioFormSchemaType = {
  title: '',
  description: '',
  publishedDate: '',
  projectType: ProjectType.featured,
  tools: [],
  image: '',
  liveLink: '',
  githubLink: ''
};

// The actual form UI, keyed/remounted per editId+open so that controlled
// Select components always initialize with the correct resolved value
// instead of inheriting stale internal state from a previous render.
const PortfolioForm = ({
  editId,
  isEditMode,
  onClose
}: {
  editId?: number;
  isEditMode: boolean;
  onClose: () => void;
}) => {
  const { toast } = useToast();
  const { createPortfolio, updatePortfolio } = usePortfolioMutations();
  const uploadImage = useFileUpload();
  const { data: toolsOptions } = useGetAllTools();

  const { data: portfolio, isLoading: isPortfolioLoading } =
    useGetPortfolioById(editId ?? 0);

  const [imageUrl, setImageUrl] = useState('');

  const resolvedValues = useMemo<PortfolioFormSchemaType>(() => {
    if (!isEditMode || !portfolio) return defaultValues;
    return {
      title: portfolio.title,
      description: portfolio.description,
      publishedDate: portfolio.publishedDate?.slice(0, 10) ?? '',
      projectType: portfolio.projectType,
      tools: portfolio.tools?.map((tool) => tool.id) ?? [],
      image: portfolio.image,
      liveLink: portfolio.liveLink,
      githubLink: portfolio.githubLink
    };
  }, [isEditMode, portfolio]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<PortfolioFormSchemaType>({
    resolver: zodResolver(
      portfolioFormSchema
    ) as Resolver<PortfolioFormSchemaType>,
    defaultValues: resolvedValues,
    values: resolvedValues
  });

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

  const initialToolOptions = useMemo<
    SearchableSelectOption[] | undefined
  >(() => {
    if (!isEditMode || !portfolio) return undefined;
    return portfolio.tools?.map((tool) => ({
      label: tool.name,
      value: String(tool.id)
    }));
  }, [isEditMode, portfolio]);

  const initialProjectTypeOptions = useMemo<
    SearchableSelectOption[] | undefined
  >(() => {
    if (!isEditMode || !portfolio) return undefined;
    const match = projectTypeOptions.find(
      (opt) => opt.value === portfolio.projectType
    );
    return match ? [match] : undefined;
  }, [isEditMode, portfolio]);

  const handleImageDrop = async (
    files: File[],
    field: ControllerRenderProps<PortfolioFormSchemaType, 'image'>
  ) => {
    const file = files?.[0];
    if (!file) return;

    field.onChange(file); // local preview immediately
    try {
      const uploadedImage = await uploadImage.mutateAsync({
        file,
        folder: 'portfolio'
      });
      setImageUrl(uploadedImage.url);
      toast({ variant: 'success', title: 'Cover image uploaded.' });
    } catch {
      field.onChange('');
      toast({ variant: 'error', title: 'Failed to upload cover image.' });
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    const resolvedImage =
      imageUrl || (typeof values.image === 'string' ? values.image : '');

    const payload = {
      ...values,
      image: resolvedImage,
      publishedDate: values.publishedDate?.trim()
        ? values.publishedDate
        : undefined
    };

    try {
      if (isEditMode && editId) {
        await updatePortfolio.mutateAsync({ id: editId, payload });
        toast({ variant: 'success', title: 'Portfolio updated successfully.' });
      } else {
        await createPortfolio.mutateAsync(payload);
        toast({ variant: 'success', title: 'Portfolio created successfully.' });
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
    isSubmitting || createPortfolio.isPending || updatePortfolio.isPending;

  return (
    <form onSubmit={onSubmit}>
      <Modal.Body className="flex flex-col gap-6">
        {isEditMode && isPortfolioLoading ? (
          <div className="py-10 text-center text-sm text-secondary-300">
            Loading portfolio...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title" className="mb-2" required>
                Title
              </Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    id="title"
                    placeholder="e.g. Abcd project"
                    autoComplete="off"
                    aria-invalid={!!errors.title}
                    {...field}
                  />
                )}
              />
              {errors.title && (
                <p className="text-xs text-error-500">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="projectType" className="mb-2" required>
                Project Type
              </Label>
              <Controller
                name="projectType"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    placeholder="Select project type"
                    value={field.value}
                    onValueChange={(val) => field.onChange(val as ProjectType)}
                    loadOptions={loadProjectTypeOptions}
                    initialOptions={
                      initialProjectTypeOptions ?? projectTypeOptions
                    }
                  />
                )}
              />
              {errors.projectType && (
                <p className="text-xs text-error-500">
                  {errors.projectType.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="publishedDate" className="mb-2">
                Published Date
              </Label>
              <Controller
                name="publishedDate"
                control={control}
                render={({ field }) => (
                  <DateTimePicker
                    id="publishedDate"
                    placeholder="Select Date"
                    value={field.value}
                    iconPosition="end"
                    onChange={(formatted) => field.onChange(formatted)}
                    mode="date"
                    aria-invalid={!!errors.publishedDate}
                    className="w-full"
                  />
                )}
              />
              {errors.publishedDate && (
                <p className="text-xs text-error-500">
                  {errors.publishedDate.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="liveLink" className="mb-2" required>
                Live Link
              </Label>
              <Controller
                name="liveLink"
                control={control}
                render={({ field }) => (
                  <Input
                    id="liveLink"
                    placeholder="https://example.com"
                    autoComplete="off"
                    aria-invalid={!!errors.liveLink}
                    {...field}
                  />
                )}
              />
              {errors.liveLink && (
                <p className="text-xs text-error-500">
                  {errors.liveLink.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="githubLink" className="mb-2" required>
                GitHub Link
              </Label>
              <Controller
                name="githubLink"
                control={control}
                render={({ field }) => (
                  <Input
                    id="githubLink"
                    placeholder="https://github.com/example"
                    autoComplete="off"
                    aria-invalid={!!errors.githubLink}
                    {...field}
                  />
                )}
              />
              {errors.githubLink && (
                <p className="text-xs text-error-500">
                  {errors.githubLink.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
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
                <p className="text-xs text-error-500">{errors.tools.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description" className="mb-2" required>
                Description
              </Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="description"
                    rows={4}
                    placeholder="Describe the project and what it uses"
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
                Cover Image
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
          {isEditMode ? 'Save changes' : 'Create portfolio'}
        </Button>
      </Modal.Footer>
    </form>
  );
};

const PortfolioModal = ({ open, onClose, editId }: PortfolioModalProps) => {
  const isEditMode = typeof editId === 'number';

  return (
    <Modal isOpen={open} onClose={onClose}>
      <Modal.Content>
        <Modal.Header>
          {isEditMode ? 'Edit Portfolio' : 'Add Portfolio'}
          <Modal.Close
            aria-label="Close modal"
            className="text-xl leading-none cursor-pointer"
          >
            &times;
          </Modal.Close>
        </Modal.Header>

        {/*
          Keying on open + editId forces a full remount of the form
          (and therefore of every Controller/Select inside it) each
          time the modal opens for a specific record. This guarantees
          the Select/Uploader components initialize fresh with the
          correct resolved value instead of retaining stale internal
          state from a previous open/close cycle.
        */}
        {open && (
          <PortfolioForm
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

export default PortfolioModal;
