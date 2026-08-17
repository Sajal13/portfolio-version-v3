import { z } from 'zod';

export const profileFormSchema = z.object({
  description: z
    .string('Description is required.')
    .min(1, 'Description is required.'),
  totalYearsOfExperience: z.coerce
    .number('Must be a number')
    .min(0, 'Must be 0 or greater'),
  totalProjects: z.coerce
    .number('Must be a number')
    .min(0, 'Must be 0 or greater'),
  totalClients: z.coerce
    .number('Must be a number')
    .min(0, 'Must be 0 or greater')
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
