import { useQuery } from '@tanstack/react-query';
import { resumeApi } from 'api/RESUME_API';
import { STALE_TIME } from 'lib/config';
import { queryKeys } from 'lib/queryKeys';

export const useResumeGet = () =>
  useQuery({
    queryKey: queryKeys.resume.all,
    queryFn: async () => {
      try {
        return await resumeApi.getResume();
      } catch {
        // No resume uploaded yet.
        return null;
      }
    },
    staleTime: STALE_TIME,
    retry: false
  });
