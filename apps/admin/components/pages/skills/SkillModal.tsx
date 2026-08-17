'use client';

import React, { useEffect, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Modal,
  Button,
  Input,
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
import { categoryOptions, parentOptions, titleOptions } from 'data/skill';
import { useSkillMutations } from 'hooks/mutations/useSkillMutations';
import { useGetSkillById } from 'hooks/queries/useSkillQueries';
import { useForm, Controller, type Resolver } from 'react-hook-form';
import {
  skillFormSchema,
  SkillFormSchemaType
} from 'utils/schemas/skills.schema';

interface SkillsModalProps {
  open: boolean;
  onClose: () => void;
  editId?: number;
}

const defaultValues: SkillFormSchemaType = {
  title: '',
  progress: 0,
  category: '',
  parent: '',
  isActive: true
};

const loadTitleOptions = async (
  query: string
): Promise<SearchableSelectOption[]> => {
  if (!query.trim()) return titleOptions;
  const q = query.toLowerCase();
  return titleOptions.filter((opt) => opt.label.toLowerCase().includes(q));
};

const loadCategoryOptions = async (
  query: string
): Promise<SearchableSelectOption[]> => {
  if (!query.trim()) return categoryOptions;
  const q = query.toLowerCase();
  return categoryOptions.filter((opt) => opt.label.toLowerCase().includes(q));
};

const loadParentOptions = async (
  query: string
): Promise<SearchableSelectOption[]> => {
  if (!query.trim()) return parentOptions;
  const q = query.toLowerCase();
  return parentOptions.filter((opt) => opt.label.toLowerCase().includes(q));
};

const SkillsModal = ({ open, onClose, editId }: SkillsModalProps) => {
  const isEditMode = typeof editId === 'number';
  const { toast } = useToast();
  const { createSkill, updateSkill } = useSkillMutations();

  const { data: skill, isLoading: isSkillLoading } = useGetSkillById(
    editId ?? 0
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<SkillFormSchemaType>({
    resolver: zodResolver(skillFormSchema) as Resolver<SkillFormSchemaType>,
    defaultValues
  });

  useEffect(() => {
    if (open) {
      reset(
        skill
          ? {
              title: skill.title,
              progress: skill.progress,
              category: skill.category,
              parent: skill.parent,
              isActive: skill.isActive
            }
          : defaultValues
      );
    }
  }, [open, skill, reset]);

  const initialTitleOptions = useMemo<
    SearchableSelectOption[] | undefined
  >(() => {
    if (!isEditMode || !skill) return undefined;
    const match = titleOptions.find((opt) => opt.value === skill.title);
    return match ? [match] : undefined;
  }, [isEditMode, skill]);

  const initialCategoryOptions = useMemo<
    SearchableSelectOption[] | undefined
  >(() => {
    if (!isEditMode || !skill) return undefined;
    const match = categoryOptions.find((opt) => opt.value === skill.category);
    return match ? [match] : undefined;
  }, [isEditMode, skill]);

  const initialParentOptions = useMemo<
    SearchableSelectOption[] | undefined
  >(() => {
    if (!isEditMode || !skill) return undefined;
    const match = parentOptions.find((opt) => opt.value === skill.parent);
    return match ? [match] : undefined;
  }, [isEditMode, skill]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (isEditMode && editId) {
        await updateSkill.mutateAsync({ id: editId, payload: values });
        toast({ variant: 'success', title: 'Skill updated successfully.' });
      } else {
        await createSkill.mutateAsync(values);
        toast({ variant: 'success', title: 'Skill created successfully.' });
      }
      onClose();
    } catch (error) {
      toast({
        variant: 'error',
        title: error instanceof Error ? error.message : 'Something went wrong.'
      });
    }
  });

  const isBusy = isSubmitting || createSkill.isPending || updateSkill.isPending;

  return (
    <Modal isOpen={open} onClose={onClose}>
      <Modal.Content>
        <Modal.Header>
          {isEditMode ? 'Edit Skill' : 'Add Skill'}
          <Modal.Close
            aria-label="Close modal"
            className="text-xl leading-none"
          >
            &times;
          </Modal.Close>
        </Modal.Header>

        <form onSubmit={onSubmit}>
          <Modal.Body className="flex flex-col gap-6">
            {isEditMode && isSkillLoading ? (
              <div className="py-10 text-center text-sm text-secondary-300">
                Loading skill...
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
                      <SearchableSelect
                        placeholder="Select or search a skill"
                        value={field.value || null}
                        onValueChange={(val) =>
                          field.onChange((val as string) ?? '')
                        }
                        loadOptions={loadTitleOptions}
                        initialOptions={initialTitleOptions}
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
                  <Label htmlFor="progress" className="mb-2" required>
                    Progress
                  </Label>
                  <Controller
                    name="progress"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="progress"
                        type="number"
                        min={0}
                        max={100}
                        placeholder="e.g. 80"
                        aria-invalid={!!errors.progress}
                        autoComplete="off"
                        {...field}
                      />
                    )}
                  />
                  {errors.progress && (
                    <p className="text-xs text-error-500">
                      {errors.progress.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="category" className="mb-2" required>
                    Category
                  </Label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <SearchableSelect
                        placeholder="Select category"
                        value={field.value || null}
                        onValueChange={(val) =>
                          field.onChange((val as string) ?? '')
                        }
                        loadOptions={loadCategoryOptions}
                        initialOptions={initialCategoryOptions}
                      />
                    )}
                  />
                  {errors.category && (
                    <p className="text-xs text-error-500">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="parent" className="mb-2" required>
                    Parent
                  </Label>
                  <Controller
                    name="parent"
                    control={control}
                    render={({ field }) => (
                      <SearchableSelect
                        placeholder="Select parent type"
                        value={field.value || null}
                        onValueChange={(val) =>
                          field.onChange((val as string) ?? '')
                        }
                        loadOptions={loadParentOptions}
                        initialOptions={initialParentOptions}
                      />
                    )}
                  />
                  {errors.parent && (
                    <p className="text-xs text-error-500">
                      {errors.parent.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="isActive" className="mb-2" required>
                    Status
                  </Label>
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value ? 'true' : 'false'}
                        onValueChange={(val) => field.onChange(val === 'true')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Active</SelectItem>
                          <SelectItem value="false">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.isActive && (
                    <p className="text-xs text-error-500">
                      {errors.isActive.message}
                    </p>
                  )}
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
              {isEditMode ? 'Save changes' : 'Create skill'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal>
  );
};

export default SkillsModal;
