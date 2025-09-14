import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MdxLayout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<div className="flex items-center border-t border-dashed px-4 py-4">
				<Button asChild size="sm" variant="ghost">
					<Link href="/writing">
						<ChevronLeft />
						Back to all posts
					</Link>
				</Button>
			</div>
			<div className="prose prose-headings:!font-normal prose-pre:m-0 prose-p:my-3.5 prose-h1:mt-0 prose-headings:mt-8 prose-h1:mb-0 max-w-none prose-code:rounded prose-pre:border prose-thead:border-border prose-pre:bg-transparent prose-pre:p-0 prose-a:font-normal prose-strong:font-medium prose-th:font-medium prose-a:text-muted-foreground prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-headings:text-foreground prose-li:text-foreground/80 prose-p:text-foreground/80 prose-span:text-muted-foreground prose-strong:text-foreground prose-td:text-foreground prose-th:text-muted-foreground prose-p:leading-relaxed prose-a:underline prose-a:underline-offset-4 prose-pre:shadow prose-li:marker:text-foreground prose-a:hover:text-foreground">
				{children}
			</div>
		</div>
	);
}
