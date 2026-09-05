import { backendFetch, parseOrThrow } from '@repo/api-client';
import { Experience, SuccessApiResponse } from '@repo/types';
import PageHeader from 'components/common/PageHeader';
import { STALE_TIME } from 'utils/config';
import ExperienceTimeline from './ExperienceTimeline';
import { buildTimelineEntries } from './group-experience';

const ExperienceSection = async () => {
  const res = await backendFetch('/experiences', {
    method: 'GET',
    cache: { tags: ['experience'], revalidate: STALE_TIME }
  });
  const { data } = await parseOrThrow<SuccessApiResponse<Experience[]>>(res);
  console.log(data);
  const entries = buildTimelineEntries(data ?? []);

  if (!entries.length) return null;

  return (
    <section id="experience" className="relative px-6 py-8 md:py-12! lg:py-20!">
      <PageHeader
        eyebrow="// career.log"
        heading="Signal Timeline"
        index="04"
      />
      <ExperienceTimeline entries={entries} />
    </section>
  );
};

export default ExperienceSection;
