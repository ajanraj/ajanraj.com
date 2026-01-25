"use client";

import { Image as ImageIcon } from "lucide-react";
import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

type Project = {
  name: string;
  slug: string;
  description: string;
  stack: string[];
  imagePath?: string;
  githubUrl?: string;
  liveUrl?: string;
  inProgress?: boolean;
  year: number;
};

export default function ProjectCard({
  project,
  className,
  style,
}: {
  project: Project;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Link
      className={cn(
        "group cursor-pointer overflow-hidden rounded-xl border shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted/50 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none",
        className,
      )}
      to="/projects/$slug"
      params={{ slug: project.slug }}
      style={style}
    >
      <div className="p-4">
        <div className="h-48 w-full overflow-hidden rounded-lg brightness-65 transition-all duration-200 group-hover:brightness-100">
          {project.imagePath ? (
            <img
              alt={`${project.name} screenshot`}
              className="h-full w-full object-cover object-top transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
              src={project.imagePath}
            />
          ) : (
            <div className="flex h-48 w-full items-center justify-center bg-muted">
              <ImageIcon className="h-10 w-10 text-muted-foreground transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none" />
            </div>
          )}
        </div>
        <div>
          <div className="mt-4 flex items-center justify-between">
            <h3 className="text-lg">{project.name}</h3>
            <Badge variant="secondary">{project.year}</Badge>
          </div>
          <p className="mt-2 flex-grow text-muted-foreground text-sm">{project.description}</p>
        </div>
      </div>
    </Link>
  );
}
