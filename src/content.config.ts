import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Glossary terms live as markdown so a non-developer can add one without
 * touching a component. Every field is required: a missing definition fails
 * the build with the file name, which is the F-011 acceptance criterion.
 */
const glossary = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/glossary' }),
  schema: z.object({
    term: z.string().min(1),
    termEn: z.string().min(1),
    definition: z.string().min(1).max(280),
    definitionEn: z.string().min(1).max(280),
    order: z.number().int().nonnegative(),
  }),
});

export const collections = { glossary };
