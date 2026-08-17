import { SuccessApiResponse, Skill, SkillsPayload } from '@repo/types';
import { baseApiFetch } from './api';

const URL = '/api/skills';

export const skillsApi = {
  getAll: async () => {
    const res = await baseApiFetch<SuccessApiResponse<Skill[]>>(URL, {
      method: 'GET'
    });

    return res.data;
  },

  getById: async (id: number) => {
    const res = await baseApiFetch<SuccessApiResponse<Skill>>(`${URL}/${id}`, {
      method: 'GET'
    });

    return res.data;
  },

  create: async (payload: SkillsPayload) => {
    const res = await baseApiFetch<SuccessApiResponse<Skill>>(URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    return res;
  },

  update: async (id: number, payload: SkillsPayload) => {
    const res = await baseApiFetch<SuccessApiResponse<Skill>>(`${URL}/${id}`, {
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
