import { useQuery } from '@tanstack/react-query';
import { blogApi } from 'api/BLOG_API';
import { STALE_TIME } from 'lib/config';
import { queryKeys } from 'lib/queryKeys';

export const useGetAllBlogs = () =>
  useQuery({
    queryKey: queryKeys.blogs.list(),
    queryFn: () => blogApi.getAll(),
    staleTime: STALE_TIME
  });

export const useGetBlogById = (id?: number) =>
  useQuery({
    queryKey: queryKeys.blogs.single(id as number),
    queryFn: () => blogApi.getById(id as number),
    staleTime: STALE_TIME,
    enabled: !!id
  });
