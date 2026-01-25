import { createFileRoute, notFound } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Markdown } from "@/components/Markdown";
import { allPosts } from "content-collections";
import { enterMotion } from "@/components/motion/enter";

const postsMetadata = allPosts.reduce(
  (acc, post) => {
    if (!post.private && post.published !== false) {
      acc[post.slug] = post;
    }
    return acc;
  },
  {} as Record<string, (typeof allPosts)[number]>,
);

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const Route = createFileRoute("/writing/$slug")({
  loader: ({ params }) => {
    const post = postsMetadata[params.slug];
    if (!post) {
      throw notFound();
    }
    return post;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Post Not Found | Ajan Raj" }] };
    }
    const description = loaderData.summary || loaderData.excerpt || "";
    return {
      meta: [
        { title: `${loaderData.title} | Ajan Raj` },
        { name: "description", content: description },
        { name: "author", content: loaderData.author || "Ajan Raj" },
        { property: "og:title", content: loaderData.title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `https://ajanraj.com/writing/${loaderData.slug}` },
        ...(loaderData.coverImage
          ? [{ property: "og:image", content: loaderData.coverImage }]
          : []),
        { property: "article:published_time", content: loaderData.publishedAt },
        ...(loaderData.tags
          ? loaderData.tags.map((tag: string) => ({ property: "article:tag", content: tag }))
          : []),
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: loaderData.title },
        { name: "twitter:description", content: description },
        ...(loaderData.coverImage
          ? [{ name: "twitter:image", content: loaderData.coverImage }]
          : []),
      ],
      links: [{ rel: "canonical", href: `https://ajanraj.com/writing/${loaderData.slug}` }],
    };
  },
  component: WritingPost,
  notFoundComponent: () => <div>Post not found</div>,
});

function WritingPost() {
  const metadata = Route.useLoaderData();
  const formattedDate = formatDate(metadata.publishedAt);
  const reduceMotion = useReducedMotion() ?? false;
  const pageMotion = enterMotion({ reduceMotion, y: 12, duration: 0.32 });
  const sectionMotion = (delay = 0) => enterMotion({ reduceMotion, y: 10, duration: 0.28, delay });
  const itemMotion = (delay = 0) => enterMotion({ reduceMotion, y: 8, duration: 0.22, delay });

  return (
    <motion.main className="border-t border-dashed px-8 pt-8" {...pageMotion}>
      <div className="relative">
        <article>
          <motion.header className="mb-8" {...sectionMotion(0.04)}>
            {metadata.coverImage && (
              <motion.div className="mb-6" {...sectionMotion(0.08)}>
                <img
                  alt={`Cover image for ${metadata.title}`}
                  className="rounded-lg"
                  src={metadata.coverImage}
                />
              </motion.div>
            )}
            <h1 className="page-heading mb-2 font-bold text-2xl md:text-4xl">{metadata.title}</h1>
            {metadata.excerpt && (
              <p className="mb-4 text-muted-foreground text-xl">{metadata.excerpt}</p>
            )}
            <div className="flex items-center text-muted-foreground text-sm">
              {metadata.author && <span className="mr-4">By {metadata.author}</span>}
              <time dateTime={metadata.publishedAt}>{formattedDate}</time>
              {metadata.readingTime && (
                <span className="ml-4">{metadata.readingTime} min read</span>
              )}
            </div>
            {metadata.tags && metadata.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {metadata.tags.map((tag: string, index: number) => (
                  <motion.div key={tag} {...itemMotion(0.12 + index * 0.04)}>
                    <Badge>{tag}</Badge>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.header>
          <motion.div {...sectionMotion(0.12)}>
            <Markdown className="prose prose-invert max-w-none" content={metadata.content} />
          </motion.div>
        </article>
      </div>
    </motion.main>
  );
}
