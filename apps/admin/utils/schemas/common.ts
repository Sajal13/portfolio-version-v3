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

export const urlSchema = z
  .string({ message: 'Link is required' })
  .min(1, 'Link is required')
  .regex(
    /^https:\/\/([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$/,
    'Must be a valid HTTPS URL (e.g. https://example.com/something)'
  )
  .max(2048, 'URL must not exceed 2048 characters')
  .refine((url) => !url.includes('localhost') && !url.includes('127.0.0.1'), {
    message: 'Localhost URLs are not allowed'
  })
  .refine((url) => !url.includes('..'), {
    message: 'URL contains invalid path segments'
  });
