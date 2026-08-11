import { SuccessApiResponse, Tool, ToolPayload } from '@repo/types';
import { baseApiFetch } from './api';

const URL = `/api/tools`;

export const toolApi = {
  getAll: async () => {
    const res = await baseApiFetch<SuccessApiResponse<Tool[]>>(URL);
    return res.data;
  },
  getById: async (id: number) => {
    const res = await baseApiFetch<SuccessApiResponse<Tool>>(`${URL}/${id}`);
    return res.data;
  },
  create: async (payload: ToolPayload) => {
    const res = await baseApiFetch<SuccessApiResponse<Tool>>(URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return res;
  },

  update: async (id: number, payload: ToolPayload) => {
    const res = await baseApiFetch<SuccessApiResponse<Tool>>(`${URL}/${id}`, {
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
