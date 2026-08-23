import { ChangePasswordPayload, SuccessApiResponse, User } from '@repo/types';
import { baseApiFetch } from './api';

const URL = '/api/users';

export const usersApi = {
  getAll: async () => {
    const res = await baseApiFetch<SuccessApiResponse<User[]>>(URL);

    return res.data;
  },

  delete: async (id: number) => {
    const res = await baseApiFetch<SuccessApiResponse>(`${URL}/${id}`, {
      method: 'DELETE'
    });

    return res;
  },
  changePassword: async (payload: ChangePasswordPayload) => {
    const res = await baseApiFetch<SuccessApiResponse>(URL, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
    return res;
  }
};
