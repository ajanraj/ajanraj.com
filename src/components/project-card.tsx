"use client";

import { Image as ImageIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Badge } from "./ui/badge";

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

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      className="group cursor-pointer overflow-hidden rounded-xl border shadow-sm transition-all duration-200 ease-in-out hover:bg-muted/50"
      to="/projects/$slug"
      params={{ slug: project.slug }}
    >
      <div className="p-4">
        <div className="h-48 w-full overflow-hidden rounded-lg brightness-65 transition-all duration-200 ease-in-out group-hover:brightness-100">
          {project.imagePath ? (
            <img
              alt={`${project.name} screenshot`}
              className="h-full w-full object-cover object-top"
              src={project.imagePath}
            />
          ) : (
            <div className="flex h-48 w-full items-center justify-center bg-muted">
              <ImageIcon className="h-10 w-10 text-muted-foreground" />
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
