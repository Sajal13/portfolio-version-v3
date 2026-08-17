'use client';

import React, { useCallback, useEffect, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ExperienceStatus, ExperienceType } from '@repo/types';
import {
  Modal,
  Button,
  Input,
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SearchableSelect,
  useToast,
  type SearchableSelectOption,
  Label
} from '@repo/ui/components';
import { useExperienceMutations } from 'hooks/mutations/useExperienceMutations';
import { useGetExperienceById } from 'hooks/queries/useExperienceQueries';
import { useGetAllTools } from 'hooks/queries/useToolsQueries';
import { useForm, Controller, type Resolver } from 'react-hook-form';
import {
  experienceFormSchema,
  ExperienceFormSchemaType
} from 'utils/schemas/experience.schema';

interface ExperienceModalProps {
  open: boolean;
  onClose: () => void;
  editId?: number;
}

const experienceTypeOptions = [
  { value: ExperienceType.fullTime, label: 'Full Time' },
  { value: ExperienceType.partTime, label: 'Part Time' },
  { value: ExperienceType.education, label: 'Education' }
];

const experienceStatusOptions = [
  {
    value: ExperienceStatus.active,
    label: 'Active'
  },
  {
    value: ExperienceStatus.inactive,
    label: 'Inactive'
  }
];

const defaultValues: ExperienceFormSchemaType = {
  experienceType: ExperienceType.fullTime,
  title: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  description: '',
  status: ExperienceStatus.active,
  tools: []
};

const ExperienceModal = ({ open, onClose, editId }: ExperienceModalProps) => {
  const isEditMode = typeof editId === 'number';
  const { toast } = useToast();
  const { createExperience, updateExperience } = useExperienceMutations();
  const { data: toolsOptions } = useGetAllTools();

  const { data: experience, isLoading: isExperienceLoading } =
    useGetExperienceById(editId ?? 0);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ExperienceFormSchemaType>({
    resolver: zodResolver(
      experienceFormSchema
    ) as Resolver<ExperienceFormSchemaType>,
    defaultValues
  });

  useEffect(() => {
    if (open) {
      reset(
        experience
          ? {
              experienceType: experience.experienceType,
              title: experience.title,
              company: experience.company,
              location: experience.location,
              startDate: experience.startDate?.slice(0, 10) ?? '',
              endDate: experience.endDate?.slice(0, 10) ?? '',
              description: experience.description,
              status: experience.status,
              tools: experience.tools?.map((tool) => tool.id) ?? []
            }
          : defaultValues
      );
    }
  }, [open, experience, reset]);

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
    if (!isEditMode || !experience) return undefined;
    return experience.tools?.map((tool) => ({
      label: tool.name,
      value: String(tool.id)
    }));
  }, [isEditMode, experience]);

  const experienceType = watch('experienceType');

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      ...values,
      endDate: values.endDate?.trim() ? values.endDate : undefined
    };
    try {
      if (isEditMode && editId) {
        await updateExperience.mutateAsync({ id: editId, payload });
        toast({
          variant: 'success',
          title: 'Experience updated successfully.'
        });
      } else {
        await createExperience.mutateAsync(payload);
        toast({
          variant: 'success',
          title: 'Experience created successfully.'
        });
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
    isSubmitting || createExperience.isPending || updateExperience.isPending;

  return (
    <Modal isOpen={open} onClose={onClose}>
      <Modal.Content>
        <Modal.Header>
          {isEditMode ? 'Edit Experience' : 'Add Experience'}
          <Modal.Close
            aria-label="Close modal"
            className="text-xl leading-none cursor-pointer"
          >
            &times;
          </Modal.Close>
        </Modal.Header>

        <form onSubmit={onSubmit}>
          <Modal.Body className="flex flex-col gap-6">
            {isEditMode && isExperienceLoading ? (
              <div className="py-10 text-center text-sm text-secondary-300">
                Loading experience...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="experienceType" className="mb-2" required>
                    Type
                  </Label>
                  <Controller
                    name="experienceType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience type" />
                        </SelectTrigger>
                        <SelectContent>
                          {experienceTypeOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.experienceType && (
                    <p className="text-xs text-error-500">
                      {errors.experienceType.message}
                    </p>
                  )}
                </div>

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
                        placeholder="e.g. Software Engineer"
                        autoComplete="off"
                        aria-invalid={!!errors.title}
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
                  <Label htmlFor="company" className="mb-2" required>
                    {experienceType === ExperienceType.education
                      ? 'Institute'
                      : 'Company'}
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

                <div>
                  <Label htmlFor="location" className="mb-2" required>
                    Location
                  </Label>
                  <Controller
                    name="location"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="location"
                        placeholder="e.g. USA"
                        autoComplete="off"
                        aria-invalid={!!errors.location}
                        {...field}
                      />
                    )}
                  />
                  {errors.location && (
                    <p className="text-xs text-error-500">
                      {errors.location.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="startDate" className="mb-2" required>
                    Start Date
                  </Label>
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="startDate"
                        type="date"
                        aria-invalid={!!errors.startDate}
                        className="w-full"
                        {...field}
                      />
                    )}
                  />
                  {errors.startDate && (
                    <p className="text-xs text-error-500">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="endDate" className="mb-2">
                    End Date
                  </Label>
                  <Controller
                    name="endDate"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="endDate"
                        type="date"
                        aria-invalid={!!errors.endDate}
                        {...field}
                      />
                    )}
                  />
                  <p className="text-xs text-secondary-300 mt-1">
                    Leave empty if this is a current role.
                  </p>
                  {errors.endDate && (
                    <p className="text-xs text-error-500">
                      {errors.endDate.message}
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
                    <p className="text-xs text-error-500">
                      {errors.tools.message}
                    </p>
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
                        placeholder="Describe your role and responsibilities"
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
                  <Label htmlFor="isActive" className="mb-2" required>
                    Status
                  </Label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {experienceStatusOptions.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.status && (
                    <p className="text-xs text-error-500">
                      {errors.status.message}
                    </p>
                  )}
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
              disabled={isBusy}
            >
              {isEditMode ? 'Save changes' : 'Create experience'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal>
  );
};

export default ExperienceModal;
