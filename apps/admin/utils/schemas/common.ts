import z from 'zod';

export const emailSchema = z
  .string({ message: 'Email is required' })
  .min(1, 'Email is required')
  .regex(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    'Must be a valid email address (e.g. example@domain.com)'
  )
  .max(254, 'Email must not exceed 254 characters')
  .refine((email) => !email.includes('..'), {
    message: 'Email contains invalid consecutive dots'
  })
  .refine((email) => !email.startsWith('.') && !email.endsWith('.'), {
    message: 'Email must not start or end with a dot'
  });

export const optionalEmailSchema = z
  .union([emailSchema, z.literal('')])
  .optional();
