import { createFileRoute, notFound, Link } from '@tanstack/react-router'
import { ExternalLink, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import RESUME from '@/data/resume'

export const Route = createFileRoute('/projects/$slug')({
	loader: ({ params }) => {
		const project = RESUME.projects.find((p) => p.slug === params.slug)
		if (!project) {
			throw notFound()
		}
		return project
	},
	component: ProjectPage,
	notFoundComponent: () => <div>Project not found</div>,
})

function ProjectPage() {
	const project = Route.useLoaderData()

	return (
		<main className="border-t border-dashed px-8 pt-8">
			<div className="mb-8">
				<div className="flex items-start justify-between">
					<div>
						<h1 className="font-medium text-4xl tracking-tight">
							{project.name}
						</h1>
						<p className="mt-2 text-lg text-muted-foreground">
							{project.description}
						</p>
					</div>
					<Badge variant="secondary">{project.year}</Badge>
				</div>

				<div className="mt-6 flex flex-wrap gap-2">
					{project.stack.map((tech) => (
						<Badge key={tech} variant="outline">
							{tech}
						</Badge>
					))}
				</div>

				<div className="mt-6 flex gap-4">
					{project.githubUrl && (
						<Button asChild variant="outline">
							<Link to={project.githubUrl} target="_blank">
								<Github className="mr-2 h-4 w-4" />
								View Source
							</Link>
						</Button>
					)}
					{project.liveUrl && (
						<Button asChild>
							<Link to={project.liveUrl} target="_blank">
								<ExternalLink className="mr-2 h-4 w-4" />
								Live Demo
							</Link>
						</Button>
					)}
				</div>
			</div>

			{project.imagePath && (
				<div className="mt-8 overflow-hidden rounded-xl border">
					<img
						alt={`${project.name} screenshot`}
						className="w-full"
						src={project.imagePath}
					/>
				</div>
			)}
		</main>
	)
}
