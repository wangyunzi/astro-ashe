import { defineCollection, z } from "astro:content";

const titleSchema = z.union([z.string(), z.array(z.string())]).transform((value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => item.trim())
      .filter(Boolean)
      .join(", ");
  }

  return value.trim();
});

const stringListSchema = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((value) => {
    if (!value) {
      return [];
    }

    const values = Array.isArray(value) ? value : [value];
    return values.map((item) => item.trim()).filter(Boolean);
  });

const posts = defineCollection({
  type: "content",
  schema: z.object({
    title: titleSchema,
    description: z.string().optional(),
    date: z.coerce.date(),
    image: z.string().optional(),
    categories: stringListSchema,
    tags: stringListSchema,
    author: z.string().default("Ashe Editor"),
    authorBio: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false)
  })
});

const albums = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    cover: z.string().optional(),
    draft: z.boolean().default(false)
  })
});

const feedItemSchema = z.object({
    title: z.string(),
    titleEn: z.string().optional(),
    site: z.string().url(),
    feed: z.string().url(),
    feedCandidates: z.array(z.string().url()).optional(),
    description: z.string().optional(),
    descriptionEn: z.string().optional(),
    avatar: z.string().optional(),
    category: z.string().optional(),
    enabled: z.boolean().default(true),
    order: z.number().optional()
  });

const feeds = defineCollection({
  type: "data",
  schema: feedItemSchema
});

const pages = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    titleEn: z.string().optional(),
    description: z.string().optional(),
    descriptionEn: z.string().optional(),
    permalink: z.string(),
    groups: z
      .array(
        z.object({
          title: z.string(),
          titleEn: z.string().optional(),
          items: z.array(
            z.object({
              title: z.string(),
              titleEn: z.string().optional(),
              description: z.string(),
              descriptionEn: z.string().optional(),
              href: z.string(),
              avatar: z.string().optional(),
              icon: z.string().optional(),
              feed: z.string().optional(),
              category: z.string().optional()
            })
          )
        })
      )
      .optional()
      .default([]),
    friendsGroupTitle: z.string().optional(),
    extraFeeds: z.array(feedItemSchema).optional().default([]),
    feedPage: z
      .object({
        title: z.string(),
        titleEn: z.string().optional(),
        description: z.string(),
        descriptionEn: z.string().optional(),
        path: z.string().optional(),
        limit: z.number().optional()
      })
      .optional(),
    draft: z.boolean().default(false)
  })
});

export const collections = { posts, albums, feeds, pages };
