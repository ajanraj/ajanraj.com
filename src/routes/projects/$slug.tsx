import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import RESUME from "@/data/resume";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = RESUME.projects.find((p) => p.slug === params.slug);
    if (!project) {
      throw notFound();
    }
    return project;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Project Not Found | Ajan Raj" }] };
    }
    return {
      meta: [
        { title: `${loaderData.name} | Ajan Raj` },
        { name: "description", content: loaderData.description },
        { property: "og:title", content: `${loaderData.name} | Ajan Raj` },
        { property: "og:description", content: loaderData.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `https://ajanraj.com/projects/${loaderData.slug}` },
        ...(loaderData.imagePath ? [{ property: "og:image", content: loaderData.imagePath }] : []),
        { name: "twitter:card", content: loaderData.imagePath ? "summary_large_image" : "summary" },
        { name: "twitter:title", content: `${loaderData.name} | Ajan Raj` },
        { name: "twitter:description", content: loaderData.description },
        ...(loaderData.imagePath ? [{ name: "twitter:image", content: loaderData.imagePath }] : []),
      ],
      links: [{ rel: "canonical", href: `https://ajanraj.com/projects/${loaderData.slug}` }],
    };
  },
  component: ProjectPage,
  notFoundComponent: () => <div>Project not found</div>,
});

function ProjectPage() {
  const project = Route.useLoaderData();

  return (
    <main className="border-t border-dashed px-8 pt-8">
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="page-heading font-medium text-3xl md:text-5xl tracking-tight">
              {project.name}
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">{project.description}</p>
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
          <img alt={`${project.name} screenshot`} className="w-full" src={project.imagePath} />
        </div>
      )}
    </main>
  );
}
