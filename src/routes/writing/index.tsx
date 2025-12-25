import { createFileRoute, Link } from "@tanstack/react-router";
import { allPosts } from "content-collections";

type PostMetadata = {
  title: string;
  publishedAt: string;
  summary: string;
  slug: string;
};

const sortedPosts: PostMetadata[] = allPosts
  .filter((post) => !post.private && post.published !== false)
  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  .map((post) => ({
    title: post.title,
    publishedAt: post.publishedAt,
    summary: post.summary,
    slug: post.slug,
  }));

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
  });
}

export const Route = createFileRoute("/writing/")({
  loader: () => sortedPosts,
  head: () => ({
    meta: [
      { title: "Writing | Ajan Raj" },
      {
        name: "description",
        content: "Notes and thoughts on software engineering, technology, and more.",
      },
      { property: "og:title", content: "Writing | Ajan Raj" },
      {
        property: "og:description",
        content: "Notes and thoughts on software engineering, technology, and more.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://ajanraj.com/writing" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Writing | Ajan Raj" },
      {
        name: "twitter:description",
        content: "Notes and thoughts on software engineering, technology, and more.",
      },
    ],
    links: [{ rel: "canonical", href: "https://ajanraj.com/writing" }],
  }),
  component: WritingPage,
});

function WritingPage() {
  const posts = Route.useLoaderData();

  return (
    <main className="border-t border-dashed px-8 pt-8">
      <div>
        <h1 className="page-heading font-medium text-3xl md:text-5xl tracking-tight">Writing</h1>
        <p className="mt-2 text-muted-foreground">Some of my notes and thoughts.</p>
      </div>
      <table className="mt-8 w-full">
        <thead>
          <tr className="border-border border-b">
            <th className="w-16 px-0 py-2 text-left font-normal text-muted-foreground/65 text-sm">
              date
            </th>
            <th className="md:w-1/3 px-6 py-2 text-left font-normal text-muted-foreground/65 text-sm">
              title
            </th>
            <th className="hidden w-2/3 px-4 py-2 text-left font-normal text-muted-foreground/65 text-sm md:table-cell">
              summary
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {posts.map((post) => (
            <tr key={post.slug} className="group transition-colors hover:bg-muted/50">
              <td className="whitespace-nowrap p-0 font-mono text-muted-foreground text-sm">
                <Link to="/writing/$slug" params={{ slug: post.slug }} className="block px-0 py-3">
                  {formatDate(post.publishedAt)}
                </Link>
              </td>
              <td className="p-0">
                <Link to="/writing/$slug" params={{ slug: post.slug }} className="block px-6 py-3">
                  <span className="line-clamp-1">{post.title}</span>
                </Link>
              </td>
              <td className="hidden p-0 text-muted-foreground text-sm md:table-cell">
                <Link to="/writing/$slug" params={{ slug: post.slug }} className="block px-4 py-3">
                  <span className="line-clamp-1">{post.summary}</span>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
