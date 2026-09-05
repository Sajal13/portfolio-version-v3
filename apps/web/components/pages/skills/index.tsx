import React from 'react';
import { backendFetch, parseOrThrow } from '@repo/api-client';
import { Skill, SuccessApiResponse } from '@repo/types';
import PageHeader from 'components/common/PageHeader';
import { STALE_TIME } from 'utils/config';
import SkillsGraph from './SkillGraph';

const SkillsSection = async () => {
  const res = await backendFetch('/skills', {
    method: 'GET',
    cache: { tags: ['skills'], revalidate: STALE_TIME }
  });
  const { data } = await parseOrThrow<SuccessApiResponse<Skill[]>>(res);

  if (!data) {
    return <p className="text-error-300 text-center">No data to show</p>;
  }

  return (
    <section id="capabilities" className="px-6 py-8 md:py-12">
      <PageHeader eyebrow="// capabilities" heading="Skill Graph" index="02" />
      <SkillsGraph skills={data} />
    </section>
  );
};

export default SkillsSection;
