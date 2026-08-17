import { UploadedResponse } from 'hooks/useFileUpload';
import { baseApiFetch } from './api';

const URL = '/api/upload/resume';

export const resumeApi = {
  getResume: async () => {
    const res = await baseApiFetch<{ data: UploadedResponse }>(URL, {
      method: 'GET'
    });
    return res.data;
  }
};
