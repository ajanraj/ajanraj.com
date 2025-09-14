import Link from "next/link";

export default function NotFound() {
	return (
		<div className="fixed top-0 left-0 flex h-screen w-screen flex-col items-center justify-center bg-background px-4 text-center">
			<span className="text-3xl">404</span>
			<h1 className="mb-2 text-5xl tracking-tight">You found a dead link</h1>
			<p className="text-muted-foreground">
				I haven&apos;t built this page yet, but you could always go back{" "}
				<Link className="underline underline-offset-4" href="/">
					home
				</Link>
			</p>
		</div>
	);
}
