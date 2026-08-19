import { Contact, SuccessApiResponse } from '@repo/types';
import { baseApiFetch } from './api';

const URL = '/api/contact';

export const contactApi = {
  getAll: async () => {
    const res = await baseApiFetch<SuccessApiResponse<Contact[]>>(URL, {
      method: 'GET'
    });
    return res.data;
  },

  getById: async (id: number) => {
    const res = await baseApiFetch<SuccessApiResponse<Contact>>(
      `${URL}/${id}`,
      {
        method: 'GET'
      }
    );

    return res.data;
  },

  delete: async (id: number) => {
    const res = await baseApiFetch<SuccessApiResponse>(`${URL}/${id}`, {
      method: 'DELETE'
    });

    return res;
  }
};
