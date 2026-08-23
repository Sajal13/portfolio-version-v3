import { ChangePasswordPayload } from '@repo/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from 'api/USERS_API';
import { queryKeys } from 'lib/queryKeys';

export const useUserMutations = () => {
  const queryClient = useQueryClient();

  const invalidateUserList = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.user.list() });

  const deleteUser = useMutation({
    mutationFn: (id: number) => usersApi.delete(id),
    onSuccess: invalidateUserList
  });

  const changePassword = useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      usersApi.changePassword(payload)
  });

  return {
    deleteUser,
    changePassword
  };
};
