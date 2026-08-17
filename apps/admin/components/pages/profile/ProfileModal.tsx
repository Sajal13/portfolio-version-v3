'use client';

import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Profile } from '@repo/types';
import { Modal, Button, Input, useToast, Label } from '@repo/ui/components';
import { useProfileMutation } from 'hooks/mutations/useProfileMutations';
import { useForm, Controller, type Resolver } from 'react-hook-form';
import {
  profileFormSchema,
  ProfileFormValues
} from 'utils/schemas/profile.schema';

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  profile?: Profile;
}

const defaultValues: ProfileFormValues = {
  description: '',
  totalYearsOfExperience: 0,
  totalProjects: 0,
  totalClients: 0
};

const ProfileModal = ({ open, onClose, profile }: ProfileModalProps) => {
  const isEditMode = !!profile;
  const { toast } = useToast();
  const { createProfile, updateProfile } = useProfileMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema) as Resolver<ProfileFormValues>,
    defaultValues
  });
  useEffect(() => {
    if (open) {
      reset(
        profile
          ? {
              description: profile.description,
              totalYearsOfExperience: profile.totalYearsOfExperience,
              totalProjects: profile.totalProjects,
              totalClients: profile.totalClients
            }
          : defaultValues
      );
    }
  }, [open, profile, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (isEditMode) {
        await updateProfile.mutateAsync(values);
        toast({ variant: 'success', title: 'Profile updated successfully.' });
      } else {
        await createProfile.mutateAsync(values);
        toast({ variant: 'success', title: 'Profile created successfully.' });
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
    isSubmitting || createProfile.isPending || updateProfile.isPending;

  return (
    <Modal isOpen={open} onClose={onClose}>
      <Modal.Content>
        <Modal.Header>
          {isEditMode ? 'Edit Profile Info' : 'Add Profile Info'}
          <Modal.Close
            aria-label="Close modal"
            className="text-xl leading-none cursor-pointer"
          >
            &times;
          </Modal.Close>
        </Modal.Header>

        <form onSubmit={onSubmit}>
          <Modal.Body className="flex flex-col gap-6">
            <div>
              <Label htmlFor="totalYearsOfExperience" className="mb-2" required>
                Description
              </Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Input
                    id="description"
                    type="text"
                    placeholder="Enter the description"
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
            <div>
              <Label htmlFor="totalYearsOfExperience" className="mb-2" required>
                Total Years of Experience
              </Label>
              <Controller
                name="totalYearsOfExperience"
                control={control}
                render={({ field }) => (
                  <Input
                    id="totalYearsOfExperience"
                    type="number"
                    step={0.1}
                    min={0}
                    placeholder="e.g. 5"
                    aria-invalid={!!errors.totalYearsOfExperience}
                    autoComplete="off"
                    {...field}
                  />
                )}
              />
              {errors.totalYearsOfExperience && (
                <p className="text-xs text-error-500">
                  {errors.totalYearsOfExperience.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="totalProjects" className="mb-2" required>
                Total Projects
              </Label>
              <Controller
                name="totalProjects"
                control={control}
                render={({ field }) => (
                  <Input
                    id="totalProjects"
                    type="number"
                    min={0}
                    placeholder="e.g. 20"
                    aria-invalid={!!errors.totalProjects}
                    autoComplete="off"
                    {...field}
                  />
                )}
              />
              {errors.totalProjects && (
                <p className="text-xs text-error-500">
                  {errors.totalProjects.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="totalClients" className="mb-2" required>
                Total Clients
              </Label>
              <Controller
                name="totalClients"
                control={control}
                render={({ field }) => (
                  <Input
                    id="totalClients"
                    type="number"
                    min={0}
                    placeholder="e.g. 15"
                    aria-invalid={!!errors.totalClients}
                    autoComplete="off"
                    {...field}
                  />
                )}
              />
              {errors.totalClients && (
                <p className="text-xs text-error-500">
                  {errors.totalClients.message}
                </p>
              )}
            </div>
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
              {isEditMode ? 'Save changes' : 'Create'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal>
  );
};

export default ProfileModal;
