import { useMutation, useQueryClient } from '@tanstack/react-query';
import { contactApi } from 'api/CONTACT_API';
import { queryKeys } from 'lib/queryKeys';

export const useContactMutations = () => {
  const queryClient = useQueryClient();

  const invalidateContactList = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.contact.list() });

  const deleteContact = useMutation({
    mutationFn: (id: number) => contactApi.delete(id),
    onSuccess: invalidateContactList
  });

  return {
    deleteContact
  };
};
