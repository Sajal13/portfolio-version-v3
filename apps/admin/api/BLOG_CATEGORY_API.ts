import { SuccessApiResponse, BlogCategory } from '@repo/types';
import { baseApiFetch } from './api';

const BLOG_CATEGORY_API_URL = '/api/blog-category';

interface CategoryPayload {
  name: string;
}

export const blogCategoryApi = {
  getAll: async () => {
    const res = await baseApiFetch<SuccessApiResponse<BlogCategory[]>>(
      `${BLOG_CATEGORY_API_URL}`
    );
    return res.data;
  },
  getById: async (id: number) => {
    const res = await baseApiFetch<SuccessApiResponse<BlogCategory>>(
      `${BLOG_CATEGORY_API_URL}/${id}`
    );
    return res.data;
  },
  create: async (payload: CategoryPayload) => {
    const res = await baseApiFetch<SuccessApiResponse<BlogCategory>>(
      `${BLOG_CATEGORY_API_URL}`,
      {
        method: 'POST',
        body: JSON.stringify(payload)
      }
    );

    console.log('create blog category response:', res);
    return res;
  },
  update: async (id: number, payload: CategoryPayload) => {
    const res = await baseApiFetch<SuccessApiResponse<BlogCategory>>(
      `${BLOG_CATEGORY_API_URL}/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(payload)
      }
    );
    return res;
  },
  delete: async (id: number) => {
    const res = await baseApiFetch<SuccessApiResponse>(
      `${BLOG_CATEGORY_API_URL}/${id}`,
      {
        method: 'DELETE'
      }
    );
    return res;
  }
};
