import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from 'api/ANALYTICS_API';
import { queryKeys } from 'lib/queryKeys';

export const useAnalyticsSummary = () => {
  return useQuery({
    queryKey: queryKeys.analytics.summary(),
    queryFn: analyticsApi.getSummary,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false
  });
};
