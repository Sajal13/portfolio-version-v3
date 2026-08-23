import z from 'zod';

export const skillFormSchema = z.object({
  title: z
    .number('Please select a tool')
    .int()
    .positive('Please select a tool'),
  progress: z.coerce.number('Must be a number').min(0, 'Must be 0 or greater'),
  category: z.string('Category is required.').min(1, 'Category is required.'),
  parent: z.string('Parent is required.').min(1, 'Parent is required.'),
  isActive: z.boolean()
});

export type SkillFormSchemaType = z.infer<typeof skillFormSchema>;
