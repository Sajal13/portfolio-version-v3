import { ToolPayload } from '@repo/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toolApi } from 'api/TOOLS_API';
import { queryKeys } from 'lib/queryKeys';

export const useToolMutations = () => {
  const queryClient = useQueryClient();

  const invalidateToolList = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.tools.list() });

  const createTool = useMutation({
    mutationFn: (payload: ToolPayload) => toolApi.create(payload),
    onSuccess: invalidateToolList
  });

  const updateTool = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ToolPayload }) =>
      toolApi.update(id, payload),
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(queryKeys.tools.single(id), data.data);
      invalidateToolList();
    }
  });

  const deleteTool = useMutation({
    mutationFn: (id: number) => toolApi.delete(id),
    onSuccess: invalidateToolList
  });

  return {
    createTool,
    updateTool,
    deleteTool
  };
};
