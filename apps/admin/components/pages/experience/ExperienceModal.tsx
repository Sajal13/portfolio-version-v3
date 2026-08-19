'use client';

import React, { useCallback, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ExperienceStatus, ExperienceType } from '@repo/types';
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

const experienceTypeOptions: SearchableSelectOption[] = [
  { value: ExperienceType.fullTime, label: 'Full Time' },
  { value: ExperienceType.partTime, label: 'Part Time' },
  { value: ExperienceType.education, label: 'Education' }
];

const experienceStatusOptions: SearchableSelectOption[] = [
  { value: ExperienceStatus.active, label: 'Active' },
  { value: ExperienceStatus.inactive, label: 'Inactive' }
];

// Options are static/local, so "loading" just means filtering the fixed
// list client-side rather than hitting the network like Tools does.
const loadExperienceTypeOptions = async (query: string) => {
  if (!query.trim()) return experienceTypeOptions;
  const q = query.toLowerCase();
  return experienceTypeOptions.filter((opt) =>
    opt.label.toLowerCase().includes(q)
  );
};

const loadExperienceStatusOptions = async (query: string) => {
  if (!query.trim()) return experienceStatusOptions;
  const q = query.toLowerCase();
  return experienceStatusOptions.filter((opt) =>
    opt.label.toLowerCase().includes(q)
  );
};

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

// The actual form UI, keyed/remounted per editId+open so that controlled
// Select components always initialize with the correct resolved value
// instead of inheriting stale internal state from a previous render.
const ExperienceForm = ({
  editId,
  isEditMode,
  onClose
}: {
  editId?: number;
  isEditMode: boolean;
  onClose: () => void;
}) => {
  const { toast } = useToast();
  const { createExperience, updateExperience } = useExperienceMutations();
  const { data: toolsOptions } = useGetAllTools();

  const { data: experience, isLoading: isExperienceLoading } =
    useGetExperienceById(editId ?? 0);

  // Build the form values from the fetched experience once it's available.
  // Falls back to defaultValues while loading / in create mode.
  const resolvedValues = useMemo<ExperienceFormSchemaType>(() => {
    if (!isEditMode || !experience) return defaultValues;
    return {
      experienceType: experience.experienceType,
      title: experience.title,
      company: experience.company,
      location: experience.location,
      startDate: experience.startDate?.slice(0, 10) ?? '',
      endDate: experience.endDate?.slice(0, 10) ?? '',
      description: experience.description,
      status: experience.status,
      tools: experience.tools?.map((tool) => tool.id) ?? []
    };
  }, [isEditMode, experience]);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ExperienceFormSchemaType>({
    resolver: zodResolver(
      experienceFormSchema
    ) as Resolver<ExperienceFormSchemaType>,
    defaultValues: resolvedValues,
    // `values` keeps the form in sync whenever resolvedValues changes
    // (e.g. once the async experience query resolves), without the
    // race conditions of a manual reset() inside a useEffect.
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
    if (!isEditMode || !experience) return undefined;
    return experience.tools?.map((tool) => ({
      label: tool.name,
      value: String(tool.id)
    }));
  }, [isEditMode, experience]);

  // Seed the selected label for Type/Status the same way Tools does, so
  // SearchableSelect can render the correct text immediately in edit
  // mode without waiting on any fetch/filter cycle.
  const initialExperienceTypeOptions = useMemo<
    SearchableSelectOption[] | undefined
  >(() => {
    if (!isEditMode || !experience) return undefined;
    const match = experienceTypeOptions.find(
      (opt) => opt.value === experience.experienceType
    );
    return match ? [match] : undefined;
  }, [isEditMode, experience]);

  const initialStatusOptions = useMemo<
    SearchableSelectOption[] | undefined
  >(() => {
    if (!isEditMode || !experience) return undefined;
    const match = experienceStatusOptions.find(
      (opt) => opt.value === experience.status
    );
    return match ? [match] : undefined;
  }, [isEditMode, experience]);

  const experienceType = watch('experienceType');

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      ...values,
      endDate: values.endDate?.trim() ? values.endDate : undefined
    };
    try {
      if (isEditMode && editId) {
        const res = await updateExperience.mutateAsync({ id: editId, payload });
        if (res.success) {
          toast({
            variant: 'success',
            title: res.message ?? 'Experience updated successfully.'
          });
        } else {
          toast({
            variant: 'error',
            title: res.message ?? 'Something went wrong.'
          });
        }
      } else {
        const res = await createExperience.mutateAsync(payload);
        if (res.success) {
          toast({
            variant: 'success',
            title: res.message ?? 'Experience created successfully.'
          });
        } else {
          toast({
            variant: 'error',
            title: res.message ?? 'Failed to delete.'
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
    isSubmitting || createExperience.isPending || updateExperience.isPending;

  return (
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
                  <SearchableSelect
                    placeholder="Select experience type"
                    value={field.value}
                    onValueChange={(val) =>
                      field.onChange(val as ExperienceType)
                    }
                    loadOptions={loadExperienceTypeOptions}
                    initialOptions={
                      initialExperienceTypeOptions ?? experienceTypeOptions
                    }
                  />
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
                <p className="text-xs text-error-500">{errors.title.message}</p>
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
                  <DateTimePicker
                    id="startDate"
                    placeholder="Select Date"
                    value={field.value}
                    iconPosition="end"
                    onChange={(formatted) => field.onChange(formatted)}
                    mode="date"
                    aria-invalid={!!errors.startDate}
                    className="w-full"
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
                  <DateTimePicker
                    id="endDate"
                    placeholder="Select Date"
                    value={field.value}
                    iconPosition="end"
                    onChange={(formatted) => field.onChange(formatted)}
                    mode="date"
                    aria-invalid={!!errors.endDate}
                    className="w-full"
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
                  <SearchableSelect
                    placeholder="Select status"
                    value={field.value}
                    onValueChange={(val) =>
                      field.onChange(val as ExperienceStatus)
                    }
                    loadOptions={loadExperienceStatusOptions}
                    initialOptions={
                      initialStatusOptions ?? experienceStatusOptions
                    }
                  />
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
  );
};

const ExperienceModal = ({ open, onClose, editId }: ExperienceModalProps) => {
  const isEditMode = typeof editId === 'number';

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

        {/*
          Keying on open + editId forces a full remount of the form
          (and therefore of every Controller/Select inside it) each
          time the modal opens for a specific record. This guarantees
          the Select components initialize fresh with the correct
          resolved value instead of retaining stale internal state
          from a previous open/close cycle.
        */}
        {open && (
          <ExperienceForm
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

export default ExperienceModal;
