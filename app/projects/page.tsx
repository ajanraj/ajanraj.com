import Link from "next/link";
import ProjectCard from "@/components/project-card";
import RESUME from "@/data/resume";

export default function ProjectsPage() {
	return (
		<main className="border-t border-dashed px-8 pt-8">
			<div>
				<h1 className="font-medium text-4xl tracking-tight">Projects</h1>
				<p className="mt-2 text-muted-foreground">
					A collection of projects I've built throughout my journey as a
					developer and hobbyist.
				</p>
			</div>

			{/* Projects Grid */}
			<div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
				{RESUME.projects.map((project, _index) => (
					<ProjectCard key={project.slug} project={project} />
				))}
			</div>

			{/* Empty state */}
			{RESUME.projects.length === 0 && (
				<div className="py-16 text-center">
					<h3 className="font-medium text-xl">No projects found</h3>
					<p className="mt-2 text-muted-foreground">
						Try selecting a different technology filter
					</p>
				</div>
			)}

			{/* Other projects section */}
			<div className="mt-16">
				<h2 className="mb-4 font-medium text-2xl tracking-tight">
					More Projects
				</h2>
				<p className="mb-6 opacity-80">
					Additional smaller projects and experiments can be found on my{" "}
					<Link
						className="text-muted-foreground underline underline-offset-4 transition hover:text-foreground"
						href="https://github.com/ajanraj"
					>
						GitHub profile
					</Link>
					.
				</p>
			</div>
		</main>
	);
}
