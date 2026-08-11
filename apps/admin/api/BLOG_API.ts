import { Blog, SuccessApiResponse } from '@repo/types';
import { BlogPayload } from 'utils/schemas/blog.schema';
import { baseApiFetch } from './api';

const URL = `/api/blogs`;

export const blogApi = {
  getAll: async () => {
    const res = await baseApiFetch<SuccessApiResponse<Blog[]>>(URL);
    return res.data;
  },
  getById: async (id: number): Promise<Blog> => {
    const data = await baseApiFetch<{ data: Blog }>(`${URL}/${id}`);
    return data.data;
  },
  create: (payload: BlogPayload) =>
    baseApiFetch<{ data: Blog }>(`${URL}`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  update: (id: number, payload: BlogPayload) =>
    baseApiFetch<{ data: Blog }>(`${URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),
  delete: (id: number) =>
    baseApiFetch(`${URL}/${id}`, {
      method: 'DELETE'
    })
};
