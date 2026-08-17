import { ExperienceStatus, ExperienceType } from '@repo/types';
import { z } from 'zod';

export const experienceFormSchema = z
  .object({
    experienceType: z.enum(ExperienceType, {
      error: 'Experience type is required'
    }),
    title: z.string().min(1, 'Title is required'),
    company: z.string().min(1, 'Company is required'),
    location: z.string().min(1, 'Location is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    description: z.string().min(1, 'Description is required'),
    status: z.enum(ExperienceStatus),
    tools: z.array(z.number()).min(1, 'Select at least one tool')
  })
  .refine(
    (data) =>
      !data.endDate || new Date(data.endDate) >= new Date(data.startDate),
    { message: 'End date cannot be before start date', path: ['endDate'] }
  );

export type ExperienceFormSchemaType = z.infer<typeof experienceFormSchema>;
