import {
  Portfolio,
  PortfolioPayload,
  UpdatePortfolioPositionPayload,
  SuccessApiResponse
} from '@repo/types';
import { baseApiFetch } from './api';

const URL = '/api/portfolio';

export const portfolioApi = {
  getAll: async () => {
    const res = await baseApiFetch<SuccessApiResponse<Portfolio[]>>(URL);
    return res.data;
  },
  getById: async (id: number) => {
    const res = await baseApiFetch<SuccessApiResponse<Portfolio>>(
      `${URL}/${id}`
    );
    return res.data;
  },
  create: async (payload: PortfolioPayload) => {
    const res = await baseApiFetch<SuccessApiResponse<Portfolio>>(URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    return res;
  },
  update: async (id: number, payload: PortfolioPayload) => {
    const res = await baseApiFetch<SuccessApiResponse<Portfolio>>(
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
      method: 'Delete'
    });
    return res;
  },
  updatePosition: async (payload: UpdatePortfolioPositionPayload) => {
    const res = await baseApiFetch<SuccessApiResponse>(URL, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    return res;
  }
};
