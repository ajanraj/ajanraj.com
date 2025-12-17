import { createFileRoute, notFound } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Suspense, lazy, useMemo } from "react";

// Pre-compile all MDX files at build time using Vite's glob import
const mdxModules = import.meta.glob("/content/writing/*.mdx", { eager: false });

// Import frontmatter at build time
const frontmatterModules = import.meta.glob("/content/writing/*.mdx", {
  eager: true,
  import: "frontmatter",
}) as Record<
  string,
  {
    title: string;
    publishedAt: string;
    summary: string;
    excerpt?: string;
    coverImage?: string;
    author?: string;
    readingTime?: number;
    tags?: string[];
    private?: boolean;
    published?: boolean;
  }
>;

// Build a map of slug to metadata at build time
const postsMetadata = Object.entries(frontmatterModules).reduce(
  (acc, [path, frontmatter]) => {
    const slug = path.replace("/content/writing/", "").replace(".mdx", "");
    if (!frontmatter.private && frontmatter.published !== false) {
      acc[slug] = { ...frontmatter, slug };
    }
    return acc;
  },
  {} as Record<string, (typeof frontmatterModules)[string] & { slug: string }>,
);

// Format date helper function
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
  component: WritingPost,
  notFoundComponent: () => <div>Post not found</div>,
});

function WritingPost() {
  const metadata = Route.useLoaderData();
  const formattedDate = formatDate(metadata.publishedAt);

  // Dynamically import the MDX component
  const MDXContent = useMemo(() => {
    const importPath = `/content/writing/${metadata.slug}.mdx`;
    const loader = mdxModules[importPath];
    if (!loader) {
      return () => <div>MDX file not found</div>;
    }
    return lazy(() => loader() as Promise<{ default: React.ComponentType }>);
  }, [metadata.slug]);

  return (
    <main className="px-8 pt-4">
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
            <h1 className="mb-2 font-bold text-3xl">{metadata.title}</h1>
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
          <div className="prose prose-invert max-w-none">
            <Suspense fallback={<div>Loading content...</div>}>
              <MDXContent />
            </Suspense>
          </div>
        </article>
      </div>
    </main>
  );
}
