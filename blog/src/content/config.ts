import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.string(),
    column: z.string().optional(),
    keywords: z.array(z.string()).default([]),
    pubDate: z.date().optional(),
    updatedDate: z.date().optional(),
    description: z.string().optional(),
    coverImage: z.string().optional(),
  }).passthrough(),
});

export const collections = { posts: postsCollection };
