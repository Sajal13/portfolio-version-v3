import { ProjectType } from '@repo/types';
import { z } from 'zod';
import { urlSchema } from './common';

export const portfolioFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  publishedDate: z.string().optional(),
  projectType: z.enum(ProjectType, {
    error: 'Project type is required'
  }),
  tools: z.array(z.number()).min(1, 'Select at least one tool'),
  image: z
    .union([z.string(), z.instanceof(File)])
    .refine((val) => (typeof val === 'string' ? val.trim().length > 0 : true), {
      message: 'Cover image is required'
    }),
  liveLink: urlSchema,
  githubLink: urlSchema
});

export type PortfolioFormSchemaType = z.infer<typeof portfolioFormSchema>;
