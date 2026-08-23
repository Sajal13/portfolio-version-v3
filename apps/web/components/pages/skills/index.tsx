import React from 'react';
import { backendFetch, parseOrThrow } from '@repo/api-client';
import { Skill, SuccessApiResponse } from '@repo/types';
import { STALE_TIME } from 'utils/config';
import SkillsGraph from './SkillGraph';

const SkillsSection = async () => {
  const res = await backendFetch('/skills', {
    method: 'GET',
    cache: { tags: ['profile'], revalidate: STALE_TIME }
  });
  const { data } = await parseOrThrow<SuccessApiResponse<Skill[]>>(res);

  if (!data) {
    return <p className="text-error-300 text-center">No data to show</p>;
  }

  console.log(data);
  return <SkillsGraph skills={data} />;
};

export default SkillsSection;
