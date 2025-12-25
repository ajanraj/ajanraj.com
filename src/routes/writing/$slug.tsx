import { createFileRoute, notFound } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Markdown } from "@/components/Markdown";
import { allPosts } from "content-collections";

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
        ...(loaderData.coverImage ? [{ property: "og:image", content: loaderData.coverImage }] : []),
        { property: "article:published_time", content: loaderData.publishedAt },
        ...(loaderData.tags
          ? loaderData.tags.map((tag: string) => ({ property: "article:tag", content: tag }))
          : []),
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: loaderData.title },
        { name: "twitter:description", content: description },
        ...(loaderData.coverImage ? [{ name: "twitter:image", content: loaderData.coverImage }] : []),
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

  return (
    <main className="border-t border-dashed px-8 pt-8">
      <div className="relative">
        <article>
          <header className="mb-8">
            {metadata.coverImage && (
              <div className="mb-6">
                <img
                  alt={`Cover image for ${metadata.title}`}
                  className="rounded-lg"
                  src={metadata.coverImage}
                />
              </div>
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
                {metadata.tags.map((tag: string) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            )}
          </header>
          <Markdown content={metadata.content} className="prose prose-invert max-w-none" />
        </article>
      </div>
    </main>
  );
}
