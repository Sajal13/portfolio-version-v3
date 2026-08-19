import { PortfolioPayload, UpdatePortfolioPositionPayload } from '@repo/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { portfolioApi } from 'api/PORTFOLIO_API';
import { queryKeys } from 'lib/queryKeys';

export const usePortfolioMutations = () => {
  const queryClient = useQueryClient();

  const invalidateList = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.portfolio.list() });

  const createPortfolio = useMutation({
    mutationFn: (payload: PortfolioPayload) => portfolioApi.create(payload),
    onSuccess: invalidateList
  });

  const updatePortfolio = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PortfolioPayload }) =>
      portfolioApi.update(id, payload),
    onSuccess: invalidateList
  });

  const deletePortfolio = useMutation({
    mutationFn: (id: number) => portfolioApi.delete(id),
    onSuccess: invalidateList
  });

  const updatePortfolioPositions = useMutation({
    mutationFn: (payload: UpdatePortfolioPositionPayload) =>
      portfolioApi.updatePosition(payload)
  });

  return {
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    updatePortfolioPositions
  };
};
