import { Blog, SuccessApiResponse } from '@repo/types';
import { BlogPayload } from 'utils/schemas/blog.schema';
import { baseApiFetch } from './api';

const URL = `/api/blogs`;

export const blogApi = {
  getAll: async () => {
    const res = await baseApiFetch<SuccessApiResponse<Blog[]>>(URL);
    return res.data;
  },
  getById: async (id: number) => {
    const res = await baseApiFetch<SuccessApiResponse<Blog>>(`${URL}/${id}`);
    return res.data;
  },
  create: async (payload: BlogPayload) => {
    const res = await baseApiFetch<SuccessApiResponse<Blog>>(`${URL}`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return res;
  },
  update: async (id: number, payload: BlogPayload) => {
    const res = await baseApiFetch<SuccessApiResponse<Blog>>(`${URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    return res;
  },
  delete: async (id: number) => {
    const res = await baseApiFetch<SuccessApiResponse>(`${URL}/${id}`, {
      method: 'DELETE'
    });
    return res;
  }
};
