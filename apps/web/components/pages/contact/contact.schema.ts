import { z } from 'zod';

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name needs at least 2 characters.')
    .max(80, 'Keep it under 80 characters.'),
  email: z.string().trim().email('Enter a valid email address.'),
  message: z
    .string()
    .trim()
    .min(10, 'Give me at least a sentence to work with.')
    .max(2000, 'Keep it under 2000 characters.'),
  website: z.string().max(0, 'Something went wrong. Please try again.')
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export type StepField = 'name' | 'email' | 'message';
