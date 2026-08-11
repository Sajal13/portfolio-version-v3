import { useMutation, useQueryClient } from '@tanstack/react-query';
import { blogApi } from 'api/BLOG_API';
import { queryKeys } from 'lib/queryKeys';
import { BlogPayload } from 'utils/schemas/blog.schema';

export const useBlogMutations = () => {
  const queryClient = useQueryClient();

  const invalidateBlogsList = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.blogs.list() });

  const createBlog = useMutation({
    mutationFn: (payload: BlogPayload) => blogApi.create(payload),
    onSuccess: invalidateBlogsList
  });

  const updateBlog = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: BlogPayload }) =>
      blogApi.update(id, payload),
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(queryKeys.blogs.single(id), data.data);
      invalidateBlogsList();
    }
  });

  const deleteBlog = useMutation({
    mutationFn: (id: number) => blogApi.delete(id),
    onSuccess: invalidateBlogsList
  });

  return { createBlog, updateBlog, deleteBlog };
};
