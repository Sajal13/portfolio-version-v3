import { useQuery } from '@tanstack/react-query';
import { blogCategoryApi } from 'api/BLOG_CATEGORY_API';
import { STALE_TIME } from 'lib/config';
import { queryKeys } from 'lib/queryKeys';

export const useGetAllBlogCategory = () =>
  useQuery({
    queryKey: queryKeys.blogCategory.list(),
    queryFn: () => blogCategoryApi.getAll(),
    staleTime: STALE_TIME
  });

export const useGetBlogCategoryById = (id?: number) =>
  useQuery({
    queryKey: queryKeys.blogCategory.single(id as number),
    queryFn: () => blogCategoryApi.getById(id as number),
    staleTime: STALE_TIME,
    enabled: !!id
  });
