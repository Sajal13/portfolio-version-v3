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
  }
};
