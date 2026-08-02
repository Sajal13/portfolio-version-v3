import { z } from 'zod';
import { emailSchema } from './common';

export const LoginFormSchema = z.object({
  email: emailSchema,
  password: z
    .string('Password is required.')
    .min(8, 'Password must be at least 8 characters.')
});

export type LoginFormSchemaType = z.infer<typeof LoginFormSchema>;
