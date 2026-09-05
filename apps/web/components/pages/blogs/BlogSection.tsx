import React from 'react';
import { backendFetch, parseOrThrow } from '@repo/api-client';
import { Blog, SuccessApiResponse } from '@repo/types';
import PageHeader from 'components/common/PageHeader';
import { STALE_TIME } from 'utils/config';
import BlogContainer from './BlogContainer';

const BlogsSection = async () => {
  const res = await backendFetch('/blogs', {
    method: 'GET',
    cache: { tags: ['blogs'], revalidate: STALE_TIME }
  });
  const { data } = await parseOrThrow<SuccessApiResponse<Blog[]>>(res);

  if (!data || data.length === 0) {
    return <p className="text-error-300 text-center">No data to show</p>;
  }

  return (
    <section id="blog" className="px-6 py-16 md:py-24">
      <BlogContainer blogs={data} />
    </section>
  );
};

export default BlogsSection;
