import { useQuery } from '@tanstack/react-query';
import { contactApi } from 'api/CONTACT_API';
import { STALE_TIME } from 'lib/config';
import { queryKeys } from 'lib/queryKeys';

export const useGetAllContact = () =>
  useQuery({
    queryKey: queryKeys.contact.list(),
    queryFn: () => contactApi.getAll(),
    staleTime: STALE_TIME
  });

export const useGetContactById = (id: number) =>
  useQuery({
    queryKey: queryKeys.contact.single(id),
    queryFn: () => contactApi.getById(id),
    staleTime: STALE_TIME,
    enabled: !!id
  });
