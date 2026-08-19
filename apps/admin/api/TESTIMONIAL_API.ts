import {
  SuccessApiResponse,
  Testimonial,
  TestimonialPayload,
  UpdateTestimonialPositionPayload
} from '@repo/types';
import { baseApiFetch } from './api';

const URL = '/api/testimonial';

export const testimonialApi = {
  getAll: async () => {
    const res = await baseApiFetch<SuccessApiResponse<Testimonial[]>>(URL);
    return res.data;
  },

  getById: async (id: number) => {
    const res = await baseApiFetch<SuccessApiResponse<Testimonial>>(
      `${URL}/${id}`
    );
    return res.data;
  },

  create: async (payload: TestimonialPayload) => {
    const res = await baseApiFetch<SuccessApiResponse<Testimonial>>(URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return res;
  },

  update: async (id: number, payload: TestimonialPayload) => {
    const res = await baseApiFetch<SuccessApiResponse<Testimonial>>(
      `${URL}/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(payload)
      }
    );

    return res;
  },

  delete: async (id: number) => {
    const res = await baseApiFetch<SuccessApiResponse>(`${URL}/${id}`, {
      method: 'DELETE'
    });
    return res;
  },

  updatePosition: async (payload: UpdateTestimonialPositionPayload) => {
    const res = await baseApiFetch<SuccessApiResponse>(URL, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    return res;
  }
};
