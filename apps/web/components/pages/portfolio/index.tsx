import React from 'react';
import { backendFetch, parseOrThrow } from '@repo/api-client';
import { Portfolio, SuccessApiResponse } from '@repo/types';
import { STALE_TIME } from 'utils/config';
import { PortfolioMarquee } from './PortfolioMarquee';

const PortfolioSection = async () => {
  const res = await backendFetch('/portfolio', {
    method: 'GET',
    cache: { tags: ['portfolio'], revalidate: STALE_TIME }
  });

  const { data } = await parseOrThrow<SuccessApiResponse<Portfolio[]>>(res);

  if (!data || data.length === 0) {
    return <p className="text-error-300 text-center">No data to show</p>;
  }

  return <PortfolioMarquee items={data} />;
};

export default PortfolioSection;
