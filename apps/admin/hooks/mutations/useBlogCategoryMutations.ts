import { Blog } from '@repo/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { blogCategoryApi } from 'api/BLOG_CATEGORY_API';
import { queryKeys } from 'lib/queryKeys';

const patchCategoryInBlogsCache = (
  queryClient: QueryClient,
  categoryId: number,
  patch: Partial<Pick<Blog['category'], 'name'>>
) => {
  queryClient.setQueriesData<Blog[]>(
    { queryKey: queryKeys.blogs.list() },
    (old) =>
      old?.map((blog) =>
        blog.category.id === categoryId
          ? { ...blog, category: { ...blog.category, ...patch } }
          : blog
      )
  );

  queryClient.setQueriesData<Blog>(
    {
      queryKey: queryKeys.blogs.all,
      predicate: (query) => query.queryKey[1] === 'detail'
    },
    (old) =>
      old && old.category.id === categoryId
        ? { ...old, category: { ...old.category, ...patch } }
        : old
  );
};

export const useBlogCategoryMutations = () => {
  const queryClient = useQueryClient();

  const invalidateBlogCategoriesList = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.blogCategory.list() });

  const createBlogCategory = useMutation({
    mutationFn: (payload: { name: string }) => blogCategoryApi.create(payload),
    onSuccess: invalidateBlogCategoriesList
  });

  const updateBlogCategory = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { name: string } }) =>
      blogCategoryApi.update(id, payload),
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(queryKeys.blogCategory.single(id), data.data);
      invalidateBlogCategoriesList();
      patchCategoryInBlogsCache(queryClient, id, {
        name: data?.data?.name
      });
    }
  });

  const deleteBlogCategory = useMutation({
    mutationFn: (id: number) => blogCategoryApi.delete(id),
    onSuccess: (_data, id) => {
      invalidateBlogCategoriesList();
      queryClient.invalidateQueries({ queryKey: queryKeys.blogs.all });
    }
  });

  return { createBlogCategory, updateBlogCategory, deleteBlogCategory };
};
