import { useQuery } from '@tanstack/react-query';
import { testimonialApi } from 'api/TESTIMONIAL_API';
import { queryKeys } from 'lib/queryKeys';

export const useGetAllTestimonials = () =>
  useQuery({
    queryKey: queryKeys.testimonial.list(),
    queryFn: () => testimonialApi.getAll()
  });

export const useGetTestimonialById = (id: number) =>
  useQuery({
    queryKey: queryKeys.testimonial.single(id),
    queryFn: () => testimonialApi.getById(id),
    enabled: !!id
  });
