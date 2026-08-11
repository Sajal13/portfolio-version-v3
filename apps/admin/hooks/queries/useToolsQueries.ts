import { useQuery } from '@tanstack/react-query';
import { toolApi } from 'api/TOOLS_API';
import { STALE_TIME } from 'lib/config';
import { queryKeys } from 'lib/queryKeys';

export const useGetAllTools = () =>
  useQuery({
    queryKey: queryKeys.tools.list(),
    queryFn: () => toolApi.getAll(),
    staleTime: STALE_TIME
  });

export const useGetToolById = (id?: number) =>
  useQuery({
    queryKey: queryKeys.tools.single(id as number),
    queryFn: () => toolApi.getById(id as number),
    staleTime: STALE_TIME,
    enabled: !!id
  });
