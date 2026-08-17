import { SuccessApiResponse, Profile, ProfilePayload } from '@repo/types';
import { baseApiFetch } from './api';

const URL = '/api/profile';
export const profileApi = {
  getProfile: async () => {
    const res = await baseApiFetch<SuccessApiResponse<Profile>>(URL, {
      method: 'GET'
    });
    return res;
  },

  create: async (payload: ProfilePayload) => {
    const res = await baseApiFetch<SuccessApiResponse<Profile>>(URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    return res;
  },

  update: async (payload: ProfilePayload) => {
    const res = await baseApiFetch<SuccessApiResponse<Profile>>(URL, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });

    return res;
  }
};
