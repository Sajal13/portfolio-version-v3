import { ProfilePayload } from '@repo/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from 'api/PROFILE_API';
import { queryKeys } from 'lib/queryKeys';

export const useProfileMutation = () => {
  const queryClient = useQueryClient();

  const invalidateProfileList = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });

  const createProfile = useMutation({
    mutationFn: (payload: ProfilePayload) => profileApi.create(payload),
    onSuccess: invalidateProfileList
  });

  const updateProfile = useMutation({
    mutationFn: (payload: ProfilePayload) => profileApi.update(payload),
    onSuccess: invalidateProfileList
  });

  return {
    createProfile,
    updateProfile
  };
};
