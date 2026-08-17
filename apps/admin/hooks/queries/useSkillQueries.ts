import { useQuery } from '@tanstack/react-query';
import { skillsApi } from 'api/SKILLS_API';
import { STALE_TIME } from 'lib/config';
import { queryKeys } from 'lib/queryKeys';

export const useGetAllSkills = () =>
  useQuery({
    queryKey: queryKeys.skills.list(),
    queryFn: () => skillsApi.getAll(),
    staleTime: STALE_TIME
  });

export const useGetSkillById = (id: number) =>
  useQuery({
    queryKey: queryKeys.skills.single(id),
    queryFn: () => skillsApi.getById(id),
    staleTime: STALE_TIME,
    enabled: !!id
  });
