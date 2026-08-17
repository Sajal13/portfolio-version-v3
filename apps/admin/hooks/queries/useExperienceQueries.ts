import { useQuery } from '@tanstack/react-query';
import { experienceApi } from 'api/EXPERIENCE_API';
import { STALE_TIME } from 'lib/config';
import { queryKeys } from 'lib/queryKeys';

export const useGetAllExperiences = () =>
  useQuery({
    queryKey: queryKeys.experiences.list(),
    queryFn: () => experienceApi.getAll(),
    staleTime: STALE_TIME
  });

export const useGetExperienceById = (id: number) =>
  useQuery({
    queryKey: queryKeys.experiences.single(id),
    queryFn: () => experienceApi.getById(id),
    staleTime: STALE_TIME,
    enabled: !!id
  });
