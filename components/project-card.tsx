"use client";

import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
			href={`/projects/${project.slug}`}
		>
			<div className="p-4">
				<div className="h-48 w-full overflow-hidden rounded-lg brightness-65 transition-all duration-200 ease-in-out group-hover:brightness-100">
					{project.imagePath ? (
						<Image
							alt={`${project.name} screenshot`}
							className="h-full w-full object-cover object-top"
							height={2000}
							quality={100}
							src={project.imagePath}
							width={2000}
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
					<p className="mt-2 flex-grow text-muted-foreground text-sm">
						{project.description}
					</p>
				</div>
			</div>
		</Link>
	);
}

//         <div classname="flex items-center justify-between mt-3">
//           <link
//             href={`/projects/${project.slug}`}
//             classname="text-sm font-medium text-cyan-500 hover:text-cyan-600 transition-colors"
//           >
//             view details
//           </link>
//           <div classname="flex gap-3 items-center">
//             {project.githuburl && (
//               <link
//                 href={project.githuburl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 classname="text-muted-foreground hover:text-primary transition-colors"
//                 legacybehavior={false}
//                 passhref
//               >
//                 <github size={18} />
//               </link>
//             )}
//             {project.liveurl && (
//               <link
//                 href={project.liveurl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 classname="text-muted-foreground hover:text-primary transition-colors"
//                 legacybehavior={false}
//                 passhref
//               >
//                 <externallink size={18} />
//               </link>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
