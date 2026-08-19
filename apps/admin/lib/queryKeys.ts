export const queryKeys = {
  blogs: {
    all: ['blogs'] as const,
    list: () => [...queryKeys.blogs.all, 'list'] as const,
    single: (id: number) => [...queryKeys.blogs.all, 'detail', id] as const
  },
  tools: {
    all: ['tools'] as const,
    list: () => [...queryKeys.tools.all, 'list'] as const,
    single: (id: number) => [...queryKeys.tools.all, 'detail', id] as const
  },
  profile: {
    all: ['profile'] as const
  },
  resume: {
    all: ['resume'] as const
  },
  skills: {
    all: ['skills'] as const,
    list: () => [...queryKeys.skills.all, 'list'] as const,
    single: (id: number) => [...queryKeys.skills.all, 'detail', id] as const
  },
  experiences: {
    all: ['experiences'] as const,
    list: () => [...queryKeys.experiences.all, 'list'] as const,
    single: (id: number) =>
      [...queryKeys.experiences.all, 'single', id] as const
  },
  portfolio: {
    all: ['portfolio'] as const,
    list: () => [...queryKeys.experiences.all, 'list'] as const,
    single: (id: number) =>
      [...queryKeys.experiences.all, 'single', id] as const
  },
  testimonial: {
    all: ['testimonial'] as const,
    list: () => [...queryKeys.testimonial.all, 'list'] as const,
    single: (id: number) =>
      [...queryKeys.testimonial.all, 'single', id] as const
  },
  contact: {
    all: ['contact'] as const,
    list: () => [...queryKeys.contact.all, 'list'] as const,
    single: (id: number) => [...queryKeys.contact.all, 'single', id] as const
  }
};
