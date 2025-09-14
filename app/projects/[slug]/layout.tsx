import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProjectLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div>
			<div className="flex items-center border-t border-dashed px-4 py-4">
				<Button asChild size="sm" variant="ghost">
					<Link href="/projects">
						<ChevronLeft />
						Back to all projects
					</Link>
				</Button>
			</div>
			{children}
		</div>
	);
}
