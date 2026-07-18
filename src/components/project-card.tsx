"use client";

import { Image as ImageIcon } from "lucide-react";
import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

type Project = {
  name: string;
  slug: string;
  description: string;
  stack: string[];
  imagePath?: string;
  cropImage?: boolean;
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
  const reduceMotion = useReducedMotion() ?? false;
  const hoverTransition: Transition = {
    duration: reduceMotion ? 0 : 0.2,
    ease: [0.25, 0.1, 0.25, 1],
  };
  const imageTransition: Transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.3, ease: "easeOut" };
  return (
    <Link
      className={cn("group block h-full cursor-pointer", className)}
      to="/projects/$slug"
      params={{ slug: project.slug }}
      style={style}
    >
      <motion.div
        animate="rest"
        className="h-full rounded-xl border bg-card p-4 shadow-sm transition-colors hover:bg-muted/50"
        initial="rest"
        transition={hoverTransition}
        variants={{
          rest: { boxShadow: "0 1px 2px rgba(0,0,0,0.04)" },
          hover: { boxShadow: "0 8px 20px rgba(0,0,0,0.08)" },
        }}
        whileHover="hover"
      >
        <motion.div
          className="aspect-[40/21] w-full overflow-hidden rounded-lg"
          transition={hoverTransition}
          variants={{
            rest: { filter: "brightness(0.65)" },
            hover: { filter: "brightness(1)" },
          }}
        >
          {project.imagePath ? (
            <motion.img
              alt={`${project.name} screenshot`}
              className={cn(
                "h-full w-full",
                project.cropImage ? "object-cover object-top" : "object-contain",
              )}
              src={project.imagePath}
              transition={imageTransition}
              variants={{
                rest: { scale: 1 },
                hover: { scale: 1.03 },
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <motion.div
                transition={hoverTransition}
                variants={{ rest: { scale: 1 }, hover: { scale: 1.05 } }}
              >
                <ImageIcon className="h-10 w-10 text-muted-foreground" />
              </motion.div>
            </div>
          )}
        </motion.div>
        <div>
          <div className="mt-4 flex items-center justify-between">
            <h3 className="text-lg">{project.name}</h3>
            <Badge variant="secondary">{project.year}</Badge>
          </div>
          <p className="mt-2 flex-grow text-muted-foreground text-sm">{project.description}</p>
        </div>
      </motion.div>
    </Link>
  );
}
