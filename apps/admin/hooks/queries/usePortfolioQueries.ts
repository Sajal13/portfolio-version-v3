import { useQuery } from '@tanstack/react-query';
import { portfolioApi } from 'api/PORTFOLIO_API';
import { queryKeys } from 'lib/queryKeys';

export const useGetAllPortfolios = () =>
  useQuery({
    queryKey: queryKeys.portfolio.list(),
    queryFn: () => portfolioApi.getAll()
  });

export const useGetPortfolioById = (id: number) =>
  useQuery({
    queryKey: queryKeys.portfolio.single(id),
    queryFn: () => portfolioApi.getById(id),
    enabled: !!id
  });
