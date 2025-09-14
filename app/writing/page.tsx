import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import Link from "next/link";

const MDX_EXTENSION_REGEX = /\.mdx$/;

// Format date helper function
function formatDate(dateString: string) {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
	});
}

// Type for post metadata
type PostMetadata = {
	title: string;
	publishedAt: string;
	summary: string;
	slug: string;
};

// Function to get all posts
function getPosts(): PostMetadata[] {
	// Get all files from the content directory
	const contentDirectory = path.join(process.cwd(), "content/writing");
	const filenames = fs.readdirSync(contentDirectory);

	// Get the frontmatter from each file
	const posts = filenames
		.filter((filename) => filename.endsWith(".mdx"))
		.map((filename) => {
			const filePath = path.join(contentDirectory, filename);
			const fileContent = fs.readFileSync(filePath, "utf8");
			const { data } = matter(fileContent);
			if (data.private) {
				return null;
			}
			return {
				title: data.title,
				publishedAt: data.publishedAt,
				summary: data.summary,
				slug: filename.replace(MDX_EXTENSION_REGEX, ""),
			};
		})
		.filter(Boolean) as PostMetadata[];

	return posts.sort(
		(a, b) =>
			new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
	);
}

export default function WritingPage() {
	const posts = getPosts();

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
						{/* TODO: add views */}
						{/* <th className="text-left py-2 px-4 text-sm text-muted-foreground/65 font-normal">
              views
            </th> */}
					</tr>
				</thead>
				<tbody className="divide-y divide-border">
					{posts.map((post) => (
						<tr
							className="group relative transition-colors hover:bg-muted/50"
							key={post.slug}
						>
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
									href={`/writing/${post.slug}`}
								/>
							</td>
							{/* <td className="py-3 px-4 text-sm text-muted-foreground">here</td> */}
						</tr>
					))}
				</tbody>
			</table>
		</main>
	);
}
