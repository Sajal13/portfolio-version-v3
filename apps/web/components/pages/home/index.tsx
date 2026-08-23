// HeroSection.tsx
import { notFound } from 'next/navigation';
import { backendFetch, parseOrThrow } from '@repo/api-client';
import { Profile, SuccessApiResponse } from '@repo/types';
import { STALE_TIME } from 'utils/config';
import Hero from './Hero';

const HeroSection = async () => {
  const res = await backendFetch('/profile', {
    method: 'GET',
    cache: { tags: ['profile'], revalidate: STALE_TIME }
  });
  const { data } = await parseOrThrow<SuccessApiResponse<Profile>>(res);

  if (!data) {
    return <p className="text-error-300 text-center">No data to show</p>;
  }

  return <Hero profile={data} />;
};

export default HeroSection;
