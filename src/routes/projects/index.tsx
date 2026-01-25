import { createFileRoute } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import ProjectCard from "@/components/project-card";
import RESUME from "@/data/resume";
import { enterMotion } from "@/components/motion/enter";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects | Ajan Raj" },
      {
        name: "description",
        content:
          "A collection of projects built throughout my journey as a developer and hobbyist. Showcasing skills and interests in software development.",
      },
      { property: "og:title", content: "Projects | Ajan Raj" },
      {
        property: "og:description",
        content:
          "A collection of projects built throughout my journey as a developer and hobbyist. Showcasing skills and interests in software development.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://ajanraj.com/projects" },
      { name: "twitter:title", content: "Projects | Ajan Raj" },
      {
        name: "twitter:description",
        content:
          "A collection of projects built throughout my journey as a developer and hobbyist. Showcasing skills and interests in software development.",
      },
    ],
    links: [{ rel: "canonical", href: "https://ajanraj.com/projects" }],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const reduceMotion = useReducedMotion() ?? false;
  const pageMotion = enterMotion({ reduceMotion, y: 12, duration: 0.32 });
  const sectionMotion = (delay = 0) => enterMotion({ reduceMotion, y: 10, duration: 0.28, delay });
  const itemMotion = (delay = 0) => enterMotion({ reduceMotion, y: 8, duration: 0.22, delay });

  return (
    <motion.main className="border-t border-dashed px-8 pt-8" {...pageMotion}>
      <motion.div {...sectionMotion(0.04)}>
        <h1 className="page-heading font-medium text-3xl md:text-5xl tracking-tight">Projects</h1>
        <p className="mt-2 text-muted-foreground">
          A collection of projects I've built throughout my journey as a developer and hobbyist.
        </p>
      </motion.div>

      {/* Projects Grid */}
      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
        {RESUME.projects.map((project, index) => (
          <motion.div key={project.slug} {...itemMotion(0.1 + index * 0.04)}>
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </div>

      {/* Empty state */}
      {RESUME.projects.length === 0 && (
        <motion.div className="py-16 text-center" {...sectionMotion(0.12)}>
          <h3 className="font-medium text-xl">No projects found</h3>
          <p className="mt-2 text-muted-foreground">Try selecting a different technology filter</p>
        </motion.div>
      )}

      {/* Other projects section */}
      <motion.div className="mt-16" {...sectionMotion(0.22)}>
        <h2 className="mb-4 font-medium text-2xl tracking-tight">More Projects</h2>
        <p className="mb-6 opacity-80">
          Additional smaller projects and experiments can be found on my{" "}
          <a
            className="text-muted-foreground underline underline-offset-4 transition hover:text-foreground"
            href="https://github.com/ajanraj"
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub profile
          </a>
          .
        </p>
      </motion.div>
    </motion.main>
  );
}
