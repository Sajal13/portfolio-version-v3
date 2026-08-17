import {
  Experience,
  ExperiencePayload,
  UpdateExperiencePositionPayload,
  SuccessApiResponse
} from '@repo/types';
import { baseApiFetch } from './api';

const URL = '/api/experiences';

export const experienceApi = {
  getAll: async () => {
    const res = await baseApiFetch<SuccessApiResponse<Experience[]>>(URL, {
      method: 'GET'
    });
    return res.data;
  },

  getById: async (id: number) => {
    const res = await baseApiFetch<SuccessApiResponse<Experience>>(
      `${URL}/${id}`,
      { method: 'GET' }
    );
    return res.data;
  },

  create: async (payload: ExperiencePayload) => {
    const res = await baseApiFetch<SuccessApiResponse<Experience>>(URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return res;
  },

  update: async (id: number, payload: ExperiencePayload) => {
    const res = await baseApiFetch<SuccessApiResponse<Experience>>(
      `${URL}/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(payload)
      }
    );
    return res;
  },

  updatePositions: async (payload: UpdateExperiencePositionPayload) => {
    const res = await baseApiFetch<SuccessApiResponse>(`${URL}`, {
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
