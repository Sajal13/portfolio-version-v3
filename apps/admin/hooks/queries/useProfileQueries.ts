import { Profile } from '@repo/types';
import { useQuery } from '@tanstack/react-query';
import { profileApi } from 'api/PROFILE_API';
import { STALE_TIME } from 'lib/config';
import { queryKeys } from 'lib/queryKeys';

const isProfileRecord = (value: unknown): value is Profile =>
  !!value &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  'id' in (value as Record<string, unknown>);

export const useProfileGet = () =>
  useQuery({
    queryKey: queryKeys.profile.all,
    queryFn: async () => {
      try {
        const res = await profileApi.getProfile();
        return isProfileRecord(res?.data) ? res : null;
      } catch {
        // No profile created yet (genuine error/404 case).
        return null;
      }
    },
    staleTime: STALE_TIME,
    retry: false
  });
