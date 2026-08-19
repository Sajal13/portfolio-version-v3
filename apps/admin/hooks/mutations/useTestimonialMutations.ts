import {
  TestimonialPayload,
  UpdateTestimonialPositionPayload
} from '@repo/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { testimonialApi } from 'api/TESTIMONIAL_API';
import { queryKeys } from 'lib/queryKeys';

export const useTestimonialMutations = () => {
  const queryClient = useQueryClient();

  const invalidateList = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.testimonial.list() });

  const createTestimonial = useMutation({
    mutationFn: (payload: TestimonialPayload) => testimonialApi.create(payload),
    onSuccess: invalidateList
  });

  const updateTestimonial = useMutation({
    mutationFn: ({
      id,
      payload
    }: {
      id: number;
      payload: TestimonialPayload;
    }) => testimonialApi.update(id, payload),
    onSuccess: invalidateList
  });

  const deleteTestimonial = useMutation({
    mutationFn: (id: number) => testimonialApi.delete(id),
    onSuccess: invalidateList
  });

  const updateTestimonialPositions = useMutation({
    mutationFn: (payload: UpdateTestimonialPositionPayload) =>
      testimonialApi.updatePosition(payload)
  });

  return {
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    updateTestimonialPositions
  };
};
