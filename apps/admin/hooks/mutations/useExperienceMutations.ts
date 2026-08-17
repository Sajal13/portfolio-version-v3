import {
  ExperiencePayload,
  UpdateExperiencePositionPayload
} from '@repo/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { experienceApi } from 'api/EXPERIENCE_API';
import { queryKeys } from 'lib/queryKeys';

export const useExperienceMutations = () => {
  const queryClient = useQueryClient();

  const invalidateExperienceList = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.experiences.list() });

  const createExperience = useMutation({
    mutationFn: (payload: ExperiencePayload) => experienceApi.create(payload),
    onSuccess: invalidateExperienceList
  });

  const updateExperience = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ExperiencePayload }) =>
      experienceApi.update(id, payload),
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(queryKeys.experiences.single(id), data.data);
      invalidateExperienceList();
    }
  });

  const updateExperiencePositions = useMutation({
    mutationFn: (payload: UpdateExperiencePositionPayload) =>
      experienceApi.updatePositions(payload),
    onSuccess: invalidateExperienceList
  });

  const deleteExperience = useMutation({
    mutationFn: (id: number) => experienceApi.delete(id),
    onSuccess: invalidateExperienceList
  });

  return {
    createExperience,
    updateExperience,
    updateExperiencePositions,
    deleteExperience
  };
};
