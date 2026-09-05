import { backendFetch, parseOrThrow } from '@repo/api-client';
import { SuccessApiResponse, Testimonial } from '@repo/types';
import { STALE_TIME } from 'utils/config';
import { TestimonialsCarousel } from './TestimonialCarousel';

const TestimonialsSection = async () => {
  const res = await backendFetch('/testimonials', {
    method: 'GET',
    cache: { tags: ['testimonial'], revalidate: STALE_TIME }
  });
  const { data } = await parseOrThrow<SuccessApiResponse<Testimonial[]>>(res);

  if (!data) {
    return <p className="text-error-300 text-center">No data to show</p>;
  }

  const sorted = [...data].sort((a, b) => a.order - b.order);

  return (
    <section
      id="testimonials"
      className="border-t border-white/5 px-6 py-8 md:py-12"
    >
      <TestimonialsCarousel testimonials={sorted} />
    </section>
  );
};

export default TestimonialsSection;
