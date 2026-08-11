import { z } from 'zod';

export const blogFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(200, 'Title is too long'),
  image: z
    .union([z.instanceof(File), z.string()])
    .refine((val) => (val instanceof File ? true : val.length > 0), {
      message: 'Cover image is required'
    }),
  markdown: z
    .union([z.instanceof(File), z.string()])
    .refine((val) => (val instanceof File ? true : val.length > 0), {
      message: 'Markdown file is required'
    }),
  tools: z.array(z.number()).min(1, 'Select at least one tool')
});

export type BlogFormValues = z.infer<typeof blogFormSchema>;

export interface BlogPayload {
  title: string;
  image: string;
  markdownId: string;
  tools: number[];
}
