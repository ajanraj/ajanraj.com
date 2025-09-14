import { Check, CircleDot, ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RESUME from "@/data/resume";

export default async function ProjectPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const project = RESUME.projects.find((p) => p.slug === slug);

	// Handle case where project doesn't exist or shouldn't be shown
	if (!project) {
		notFound();
	}

	return (
		<main className="border-t border-dashed px-8 pt-8">
			{/* Project header */}
			<div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
				<div>
					<h1 className="text-4xl">{project.name}</h1>
					<p className="mt-2 text-muted-foreground">{project.description}</p>
				</div>
				<div className="flex flex-wrap gap-3">
					{project.githubUrl && (
						<Button size="sm" variant="outline">
							<Link
								className="flex items-center gap-2"
								href={project.githubUrl}
								rel="noopener noreferrer"
								target="_blank"
							>
								<Github size={18} />
								<span>GitHub</span>
							</Link>
						</Button>
					)}
					{project.liveUrl && (
						<Button size="sm" variant="outline">
							<Link
								className="flex items-center gap-2"
								href={project.liveUrl}
								rel="noopener noreferrer"
								target="_blank"
							>
								<ExternalLink size={18} />
								<span>Live Demo</span>
							</Link>
						</Button>
					)}
				</div>
			</div>

			{/* Project image */}
			{project.imagePath && (
				<div className="mb-10 overflow-hidden rounded-xl border shadow-xs">
					<Image
						alt={`${project.name} screenshot`}
						className="h-auto w-full rounded-xl object-cover"
						height={675}
						src={project.imagePath}
						width={1200}
					/>
				</div>
			)}

			{/* Project details */}
			<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
				{/* Main content */}
				<div className="space-y-6 md:col-span-2">
					<section>
						<h2 className="mb-3 text-2xl">Overview</h2>
						<div className="space-y-4">
							<p className="opacity-80">
								{project.longDescription || project.description}
							</p>
						</div>
					</section>

					{project.keyFeatures && (
						<section>
							<h2 className="mb-3 text-2xl">Key Features</h2>
							<ul className="list-inside list-disc space-y-2 pl-2">
								{project.keyFeatures.map((feature: string) => (
									<li className="opacity-80" key={feature}>
										{feature}
									</li>
								))}
							</ul>
						</section>
					)}

					{project.challenges && (
						<section>
							<h2 className="mb-3 text-2xl">Challenges & Solutions</h2>
							<div>
								<p>{project.challenges}</p>
							</div>
						</section>
					)}
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					<section className="rounded-md border p-4 shadow-sm">
						<h3 className="mb-3 text-lg">Status</h3>
						{project.inProgress ? (
							<Badge className="animate-pulse border-yellow-800/30 bg-yellow-800/20 text-xs text-yellow-700 backdrop-blur">
								<CircleDot className="size-4" /> In Progress
							</Badge>
						) : (
							<Badge className="border-green-800/30 bg-green-800/20 text-green-700 text-xs backdrop-blur">
								<Check className="size-4" /> Completed
							</Badge>
						)}
					</section>

					{project.awards && project.awards.length > 0 && (
						<section className="rounded-md border p-4 shadow-sm">
							<h3 className="mb-3 text-lg">Awards</h3>
							<ul className="space-y-2 text-sm">
								{project.awards.map((award: string) => (
									<li key={award}>{award}</li>
								))}
							</ul>
						</section>
					)}

					<section className="rounded-md border p-4 shadow-sm">
						<h3 className="mb-3 text-lg">Tech Stack</h3>
						<div className="flex flex-wrap gap-2">
							{project.stack.map((tech: string) => (
								<Badge className="" key={tech} variant="outline">
									{tech}
								</Badge>
							))}
						</div>
					</section>

					{project.year && (
						<section className="rounded-md border p-4 shadow-sm">
							<h3 className="mb-2 text-lg">Year</h3>
							<p className="">{project.year}</p>
						</section>
					)}

					{project.collaborators && project.collaborators.length > 0 && (
						<section className="rounded-md border p-4 shadow-sm">
							<h3 className="mb-3 text-lg">Collaborators</h3>
							<ul className="space-y-4">
								{project.collaborators.map(
									(collaborator: {
										name: string;
										portfolio?: string;
										twitter?: string;
									}) => (
										<li key={collaborator.name}>
											{collaborator.name}
											<div className="mt-1 flex gap-2">
												{collaborator.portfolio && (
													<Link
														className="text-muted-foreground text-xs underline underline-offset-4 transition-colors hover:text-foreground"
														href={collaborator.portfolio}
														rel="noopener noreferrer"
														target="_blank"
													>
														Portfolio
													</Link>
												)}
												{collaborator.twitter && (
													<Link
														className="text-muted-foreground text-xs underline underline-offset-4 transition-colors hover:text-foreground"
														href={collaborator.twitter}
														rel="noopener noreferrer"
														target="_blank"
													>
														Twitter
													</Link>
												)}
											</div>
										</li>
									)
								)}
							</ul>
						</section>
					)}
				</div>
			</div>

			{/* Related projects section */}
			<section className="mt-16">
				<h2 className="mb-6 text-2xl">Related Projects</h2>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{RESUME.projects
						.filter((p) => p.slug !== project.slug)
						.slice(0, 3)
						.map((relatedProject) => (
							<Link
								className="rounded-md border p-4 transition-all duration-200 ease-in-out hover:bg-muted/25"
								href={`/projects/${relatedProject.slug}`}
								key={relatedProject.slug}
							>
								<h3>{relatedProject.name}</h3>
								<p className="mt-1 line-clamp-2 text-muted-foreground text-sm">
									{relatedProject.description}
								</p>
							</Link>
						))}
				</div>
			</section>
		</main>
	);
}
