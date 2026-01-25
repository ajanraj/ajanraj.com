import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import { enterMotion } from "@/components/motion/enter";
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
  const reduceMotion = useReducedMotion() ?? false;
  const pageMotion = enterMotion({ reduceMotion, y: 12, duration: 0.32 });
  const sectionMotion = (delay = 0) => enterMotion({ reduceMotion, y: 10, duration: 0.28, delay });
  const itemMotion = (delay = 0) => enterMotion({ reduceMotion, y: 8, duration: 0.22, delay });
  const hoverTransition: Transition = {
    duration: reduceMotion ? 0 : 0.15,
    ease: [0.25, 0.1, 0.25, 1],
  };

  return (
    <motion.main className="border-t border-dashed px-8 pt-8" {...pageMotion}>
      <motion.div {...sectionMotion(0.04)}>
        <h1 className="page-heading font-medium text-3xl md:text-5xl tracking-tight">Writing</h1>
        <p className="mt-2 text-muted-foreground">Some of my notes and thoughts.</p>
      </motion.div>
      <motion.table className="mt-8 w-full" {...sectionMotion(0.08)}>
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
          {posts.map((post, index) => (
            <motion.tr
              className="group hover:bg-muted/50"
              key={post.slug}
              {...itemMotion(0.12 + index * 0.03)}
              animate="rest"
              initial="rest"
              whileHover="hover"
            >
              <td className="whitespace-nowrap p-0 font-mono text-muted-foreground text-sm">
                <Link to="/writing/$slug" params={{ slug: post.slug }} className="block px-0 py-3">
                  {formatDate(post.publishedAt)}
                </Link>
              </td>
              <td className="p-0">
                <Link className="block px-6 py-3" params={{ slug: post.slug }} to="/writing/$slug">
                  <motion.span
                    className="line-clamp-1"
                    transition={hoverTransition}
                    variants={{ rest: { x: 0 }, hover: { x: 4 } }}
                  >
                    {post.title}
                  </motion.span>
                </Link>
              </td>
              <td className="hidden p-0 text-muted-foreground text-sm md:table-cell">
                <Link className="block px-4 py-3" params={{ slug: post.slug }} to="/writing/$slug">
                  <motion.span
                    className="line-clamp-1"
                    transition={hoverTransition}
                    variants={{ rest: { x: 0 }, hover: { x: 4 } }}
                  >
                    {post.summary}
                  </motion.span>
                </Link>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
    </motion.main>
  );
}
