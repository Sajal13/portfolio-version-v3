import { z } from 'zod';

export const testimonialFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  designation: z.string().min(1, 'Designation is required'),
  company: z.string().min(1, 'Company is required'),
  description: z.string().min(1, 'Description is required'),
  image: z
    .union([z.string(), z.instanceof(File)])
    .refine((val) => (typeof val === 'string' ? val.trim().length > 0 : true), {
      message: 'Photo is required'
    })
});

export type TestimonialFormSchemaType = z.infer<typeof testimonialFormSchema>;
