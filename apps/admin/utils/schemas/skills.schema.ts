import z from 'zod';

export const skillFormSchema = z.object({
  title: z.string('Title is required.').min(1, 'Title is required.'),
  progress: z.coerce.number('Must be a number').min(0, 'Must be 0 or greater'),
  category: z.string('Category is required.').min(1, 'Category is required.'),
  parent: z.string('Parent is required.').min(1, 'Parent is required.'),
  isActive: z.boolean()
});

export type SkillFormSchemaType = z.infer<typeof skillFormSchema>;
