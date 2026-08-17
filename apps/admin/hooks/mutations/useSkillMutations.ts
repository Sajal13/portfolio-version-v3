import { SkillsPayload } from '@repo/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { skillsApi } from 'api/SKILLS_API';
import { queryKeys } from 'lib/queryKeys';

export const useSkillMutations = () => {
  const queryClient = useQueryClient();

  const invalidateSkillList = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.skills.list() });

  const createSkill = useMutation({
    mutationFn: (payload: SkillsPayload) => skillsApi.create(payload),
    onSuccess: invalidateSkillList
  });

  const updateSkill = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: SkillsPayload }) =>
      skillsApi.update(id, payload),
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(queryKeys.skills.single(id), data.data);
      invalidateSkillList();
    }
  });

  const deleteSkill = useMutation({
    mutationFn: (id: number) => skillsApi.delete(id),
    onSuccess: invalidateSkillList
  });

  return {
    createSkill,
    updateSkill,
    deleteSkill
  };
};
