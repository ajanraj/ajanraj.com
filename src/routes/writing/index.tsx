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
  component: WritingPage,
});

function WritingPage() {
  const posts = Route.useLoaderData();

  return (
    <main className="border-t border-dashed p-8">
      <div>
        <h1 className="text-3xl tracking-tight">Writing</h1>
        <p className="mt-2 text-lg text-muted-foreground">some of my notes</p>
      </div>
      <table className="mt-8 w-full">
        <thead>
          <tr className="border-border border-b">
            <th className="px-0 py-2 text-left font-normal text-muted-foreground/65 text-sm">
              date
            </th>
            <th className="px-6 py-2 text-left font-normal text-muted-foreground/65 text-sm">
              title
            </th>
            <th className="hidden px-4 py-2 text-left font-normal text-muted-foreground/65 text-sm md:table-cell">
              summary
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {posts.map((post) => (
            <tr className="group relative transition-colors hover:bg-muted/50" key={post.slug}>
              <td className="whitespace-nowrap px-0 py-3 font-mono text-muted-foreground text-sm">
                {formatDate(post.publishedAt)}
              </td>
              <td className="px-6 py-3">
                <span className="line-clamp-1">{post.title}</span>
              </td>
              <td className="hidden px-4 py-3 text-muted-foreground text-sm md:table-cell">
                <span className="line-clamp-1">{post.summary}</span>
              </td>
              <td className="absolute inset-0">
                <Link
                  aria-label={`Read post: ${post.title}`}
                  className="absolute inset-0 z-10"
                  to="/writing/$slug"
                  params={{ slug: post.slug }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
