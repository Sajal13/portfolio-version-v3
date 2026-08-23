import { useQuery } from '@tanstack/react-query';
import { usersApi } from 'api/USERS_API';
import { STALE_TIME } from 'lib/config';
import { queryKeys } from 'lib/queryKeys';

export const useGetAllUsers = () =>
  useQuery({
    queryKey: queryKeys.user.list(),
    queryFn: () => usersApi.getAll(),
    staleTime: STALE_TIME
  });
