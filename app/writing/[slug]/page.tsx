import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const MDX_EXTENSION_REGEX = /\.mdx$/;

import type { Metadata } from "next";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import "highlight.js/styles/vs2015.css";
import { notFound } from "next/navigation";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import remarkSmartyPants from "remark-smartypants";
import {
	Callout,
	CalloutDescription,
	CalloutTitle,
} from "@/components/callout";
import { Badge } from "@/components/ui/badge";

const components = {
	Callout,
	CalloutTitle,
	CalloutDescription,
	// Add this custom img component
	img: ({
		src,
		alt,
		...props
	}: {
		src?: string;
		alt?: string;
		[key: string]: unknown;
	}) => {
		// Handle both absolute and relative image paths
		const imageSrc = src?.startsWith("/") ? src : `/${src}`;

		return (
			<div className="my-6">
				<Image
					alt={alt || ""}
					className="mx-auto rounded-lg"
					height={500}
					priority={true}
					quality={85}
					sizes="(max-width: 768px) 100vw, 800px"
					src={imageSrc}
					width={800}
					{...props}
				/>
				{alt && (
					<p className="mt-2 text-center text-muted-foreground text-sm">
						{alt}
					</p>
				)}
			</div>
		);
	},
};

type Heading = {
	id: string;
	text: string;
	level: number;
};

function extractHeadings(content: string) {
	const headingRegex = /^#{1,6}\s+(.+)$/gm;
	const headings: Heading[] = [];
	let match: RegExpExecArray | null = null;

	let result: RegExpExecArray | null = headingRegex.exec(content);
	while (result !== null) {
		match = result;
		result = headingRegex.exec(content);
		const text = match[1];
		const level = match[0].split("#").length - 1;

		// Match the exact ID format that the browser is creating
		// Replace non-alphanumeric characters with hyphens and preserve trailing hyphens
		const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
		// Importantly, do NOT trim trailing hyphens as they're preserved in the browser IDs
		//.replace(/(^-|-$)/g, '');

		headings.push({ text, level, slug });
	}

	return headings;
}

// Format date helper function
function formatDate(dateString: string) {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

// Get post by slug
function getBlogPost(slug: string) {
	const filePath = path.join(process.cwd(), `content/writing/${slug}.mdx`);

	// Check if file exists
	try {
		const fileContent = fs.readFileSync(filePath, "utf8");
		const { data: metadata, content } = matter(fileContent);
		// Filter out unpublished posts and private posts (for backward compatibility)
		if (metadata.private || metadata.published === false) {
			return null;
		}
		return { metadata, content };
	} catch (_error) {
		return null;
	}
}

// Generate metadata for the page
export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const post = await getBlogPost(slug);

	if (!post) {
		return {
			title: "Post Not Found",
		};
	}

	const { metadata } = post;

	const ogImage =
		metadata.coverImage || metadata.images?.[0] || "/default-og-image.jpg";

	return {
		title: `${metadata.title} | Ajan Raj's Writing`,
		description:
			metadata.excerpt || `Read ${metadata.title} on Ajan Raj's Writing`,
		keywords: metadata.tags || [],
		authors: [{ name: metadata.author || "Ajan Raj" }],
		openGraph: {
			title: metadata.title,
			description:
				metadata.excerpt || `Read ${metadata.title} on Ajan Raj's Writing`,
			type: "article",
			publishedTime: metadata.publishedAt,
			url: `https://ajanraj.com/writing/${slug}`,
			images: [
				{
					url: ogImage,
					width: 1200,
					height: 630,
					alt: metadata.title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: metadata.title,
			description:
				metadata.excerpt || `Read ${metadata.title} on Ajan Raj's Writing`,
			images: [ogImage],
		},
		alternates: {
			canonical: `https://ajanraj.com/writing/${slug}`,
		},
	};
}

export default async function Page({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	// Read the file content with gray-matter
	const post = await getBlogPost(slug);

	if (!post) {
		notFound();
	}

	const { metadata, content } = post;
	const formattedDate = formatDate(metadata.publishedAt);
	const _headings = extractHeadings(content);

	return (
		<main className="px-8 pt-4">
			<div className="relative">
				{/* Main article with right margin on large screens */}
				<article>
					<header className="mb-8">
						{metadata.coverImage && (
							<div className="mb-6">
								<Image
									alt={`Cover image for ${metadata.title}`}
									className="rounded-lg"
									height={630}
									priority
									src={metadata.coverImage}
									width={1200}
								/>
							</div>
						)}
						<h1 className="mb-2 font-bold text-3xl">{metadata.title}</h1>
						{metadata.excerpt && (
							<p className="mb-4 text-muted-foreground text-xl">
								{metadata.excerpt}
							</p>
						)}
						<div className="flex items-center text-muted-foreground text-sm">
							{metadata.author && (
								<span className="mr-4">By {metadata.author}</span>
							)}
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
					<div className="prose max-w-none">
						<MDXRemote
							components={{
								...components,
								h1: ({ children }) => (
									<h1
										id={children
											?.toString()
											.toLowerCase()
											.replace(/[^a-z0-9]+/g, "-")}
									>
										{children}
									</h1>
								),
								h2: ({ children }) => (
									<h2
										id={children
											?.toString()
											.toLowerCase()
											.replace(/[^a-z0-9]+/g, "-")}
									>
										{children}
									</h2>
								),
								h3: ({ children }) => (
									<h3
										id={children
											?.toString()
											.toLowerCase()
											.replace(/[^a-z0-9]+/g, "-")}
									>
										{children}
									</h3>
								),
							}}
							options={{
								mdxOptions: {
									remarkPlugins: [remarkMath, remarkGfm, remarkSmartyPants],
									rehypePlugins: [
										rehypeKatex,
										[rehypeHighlight, { detect: true }],
									],
								},
							}}
							source={content}
						/>
					</div>
				</article>
			</div>
		</main>
	);
}

// This generates the static paths at build time
export function generateStaticParams() {
	const contentDirectory = path.join(process.cwd(), "content/writing");
	const filenames = fs.readdirSync(contentDirectory);
	const slugs = filenames
		.filter((filename) => filename.endsWith(".mdx"))
		.map((filename) => {
			const filePath = path.join(contentDirectory, filename);
			const fileContent = fs.readFileSync(filePath, "utf8");
			const { data } = matter(fileContent);
			// Only generate static paths for published posts
			if (data.private || data.published === false) {
				return null;
			}
			return filename.replace(MDX_EXTENSION_REGEX, "");
		})
		.filter(Boolean) as string[];

	return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;
