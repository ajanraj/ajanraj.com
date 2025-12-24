import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";
import matter from "gray-matter";

function extractFrontMatter(content: string) {
  const { data, content: body, excerpt } = matter(content, { excerpt: true });
  return { data, body, excerpt: excerpt || "" };
}

const posts = defineCollection({
  name: "posts",
  directory: "./content/writing",
  include: "*.md",
  schema: z.object({
    title: z.string(),
    publishedAt: z.string(),
    summary: z.string(),
    content: z.string(),
    excerpt: z.string().optional(),
    coverImage: z.string().optional(),
    author: z.string().optional(),
    readingTime: z.number().optional(),
    tags: z.array(z.string()).optional(),
    private: z.boolean().optional(),
    published: z.boolean().optional(),
  }),
  transform: ({ content, ...post }) => {
    const frontMatter = extractFrontMatter(content);

    const headerImageMatch = content.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    const headerImage = headerImageMatch ? headerImageMatch[2] : undefined;

    return {
      ...post,
      slug: post._meta.path,
      excerpt: frontMatter.excerpt,
      description: frontMatter.data.description,
      headerImage,
      content: frontMatter.body,
    };
  },
});

export default defineConfig({
  collections: [posts],
});
