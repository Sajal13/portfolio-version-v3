import { AnalyticsSummary, SuccessApiResponse } from '@repo/types';
import { baseApiFetch } from './api';

const URL = '/api/analytics';

export const analyticsApi = {
  getSummary: async () => {
    const res = await baseApiFetch<SuccessApiResponse<AnalyticsSummary>>(URL);
    return res.data;
  }
};
