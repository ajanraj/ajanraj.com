"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetcher } from "@/lib/utils";

type ImageStatus = "idle" | "loading" | "loaded" | "error";

type Photo = {
	name: string;
	thumbnail: string;
	fullSize: string;
	original: string;
	lastModified: string;
	size: number;
};

export default function PhotosPage() {
	const { data, error, isLoading } = useSWR("/api/photos", fetcher);
	const photos: Photo[] = data?.photos || [];

	const [carouselOpen, setCarouselOpen] = useState(false);
	const [carouselIndex, setCarouselIndex] = useState(0);
	const [imageStatuses, setImageStatuses] = useState<Map<string, ImageStatus>>(
		new Map()
	);
	const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const navigatePrevious = useCallback(() => {
		if (navigationTimeoutRef.current) {
			clearTimeout(navigationTimeoutRef.current);
		}
		navigationTimeoutRef.current = setTimeout(() => {
			setCarouselIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
		}, 50);
	}, [photos.length]);

	const navigateNext = useCallback(() => {
		if (navigationTimeoutRef.current) {
			clearTimeout(navigationTimeoutRef.current);
		}
		navigationTimeoutRef.current = setTimeout(() => {
			setCarouselIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
		}, 50);
	}, [photos.length]);

	useHotkeys("esc", () => setCarouselOpen(false), { enabled: carouselOpen });
	useHotkeys("left", navigatePrevious, { enabled: carouselOpen });
	useHotkeys("right", navigateNext, { enabled: carouselOpen });

	// Disable scroll when carousel is open
	useEffect(() => {
		if (carouselOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}

		return () => {
			document.body.style.overflow = "unset";
			if (navigationTimeoutRef.current) {
				clearTimeout(navigationTimeoutRef.current);
			}
		};
	}, [carouselOpen]);

	// SWR handles loading, error states, and caching automatically

	const startLoadingImage = useCallback(
		(index: number, imageType: "thumbnail" | "fullSize" = "thumbnail") => {
			if (!photos[index]) {
				return;
			}

			const statusKey = imageType === "fullSize" ? `${index}-full` : `${index}`;
			const currentStatus = imageStatuses.get(statusKey) || "idle";
			if (currentStatus !== "idle") {
				return;
			}

			setImageStatuses((prev) => new Map(prev).set(statusKey, "loading"));

			const img = new window.Image();
			img.onload = () => {
				setImageStatuses((prev) => new Map(prev).set(statusKey, "loaded"));
			};
			img.onerror = () => {
				setImageStatuses((prev) => new Map(prev).set(statusKey, "error"));
			};
			img.src =
				imageType === "fullSize"
					? photos[index].fullSize
					: photos[index].thumbnail;
		},
		[photos, imageStatuses]
	);

	// Simplified intersection observer - cache makes loading fast
	useEffect(() => {
		if (photos.length === 0) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						const index = Number.parseInt(
							entry.target.getAttribute("data-index") || "0",
							10
						);
						startLoadingImage(index, "thumbnail");
					}
				}
			},
			{
				rootMargin: "100px",
				threshold: 0.1,
			}
		);

		const timer = setTimeout(() => {
			const photoElements = document.querySelectorAll("[data-index]");
			for (const element of photoElements) {
				observer.observe(element);
			}
		}, 100);

		return () => {
			clearTimeout(timer);
			observer.disconnect();
		};
	}, [photos.length, startLoadingImage]);

	return (
		<main className="border-t border-dashed px-8 pt-8">
			<div className="mb-8">
				<h1 className="font-medium text-4xl tracking-tight">Photos</h1>
				<p className="mt-2 text-muted-foreground">
					A collection of photos I've taken over the years. I'm not a
					professional photographer, but I enjoy capturing moments.
				</p>
			</div>
			<p className="mb-8 text-sm opacity-80">
				My photos are taken with a Panasonic Lumix G85 with a Panasonic Lumix G
				25mm F1.7. lens but I've also recently upgraded to a Panasonic Lumix G
				Vario 12-60mm f/3.5-5.6.
			</p>

			{/* Photo Grid */}
			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
				{isLoading || error
					? Array.from({ length: 10 }, (_, i) => `skeleton-${i}`).map((key) => (
							<div
								className="aspect-square w-full overflow-hidden rounded-xl bg-muted"
								key={key}
							>
								<Skeleton className="h-full w-full animate-pulse bg-muted" />
							</div>
						))
					: photos.map((photo, i) => {
							const status = imageStatuses.get(i) || "idle";

							return (
								<motion.div
									animate={{
										filter: status === "loaded" ? "blur(0px)" : "blur(10px)",
										opacity: status === "loaded" ? 1 : 0,
									}}
									className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted hover:cursor-pointer"
									data-index={i}
									initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
									key={photo.name}
									onClick={() => {
										setCarouselOpen(true);
										setCarouselIndex(i);
									}}
									transition={{
										duration: 0.5,
										filter: { duration: 0.5, ease: "easeOut" },
										delay: (i * 0.1) / 4, // Stagger each photo individually
									}}
								>
									{status !== "loaded" && (
										<div className="absolute inset-0 flex animate-pulse items-center justify-center bg-muted">
											{status === "loading" && (
												<div className="h-7 w-7 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-muted-foreground/60" />
											)}
										</div>
									)}
									{/* biome-ignore lint/performance/noImgElement: Required for lazy loading functionality */}
									{/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: Click handled by parent motion.div */}
									<img
										alt={`Gallery item ${i + 1}`}
										className="h-full w-full object-cover"
										height={400}
										onError={() => {
											setImageStatuses((prev) => new Map(prev).set(i, "error"));
										}}
										onLoad={() => {
											setImageStatuses((prev) =>
												new Map(prev).set(i, "loaded")
											);
										}}
										src={photo.thumbnail}
										width={400}
									/>
								</motion.div>
							);
						})}
			</div>
			<AnimatePresence mode="popLayout">
				{carouselOpen && (
					<motion.div
						animate={{ opacity: 1 }}
						className="fixed inset-0 z-50"
						exit={{ opacity: 0 }}
						initial={{ opacity: 0 }}
						transition={{ duration: 0.05 }}
					>
						{/* Background overlay */}
						<motion.div
							animate={{ opacity: 1 }}
							className="absolute inset-0 bg-black/75 backdrop-blur-md"
							exit={{ opacity: 0 }}
							initial={{ opacity: 0 }}
							onClick={() => setCarouselOpen(false)}
						/>

						{/* Top controls */}
						<div className="fixed top-4 right-4 z-[60] flex gap-2">
							<Button
								aria-label="Close carousel"
								className="flex h-6 justify-between gap-1 rounded-full border p-2"
								onClick={() => setCarouselOpen(false)}
								variant="ghost"
							>
								<X />
								Close
							</Button>
						</div>

						{/* Previous button */}
						<button
							aria-label="Previous photo"
							className="-translate-y-1/2 fixed top-1/2 left-4 z-[60] cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
							onClick={navigatePrevious}
							type="button"
						>
							<ChevronLeft size={24} />
						</button>

						{/* Next button */}
						<button
							aria-label="Next photo"
							className="-translate-y-1/2 fixed top-1/2 right-4 z-[60] cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
							onClick={navigateNext}
							type="button"
						>
							<ChevronRight size={24} />
						</button>

						{/* Image container */}
						<div className="pointer-events-none absolute inset-0 z-[55] flex items-center justify-center">
							{photos
								.slice(
									Math.max(0, carouselIndex - 1),
									Math.min(photos.length, carouselIndex + 2)
								)
								.map((photo, relativeIndex) => {
									const actualIndex =
										Math.max(0, carouselIndex - 1) + relativeIndex;
									const isActive = actualIndex === carouselIndex;
									const statusKey = `${actualIndex}-full`;
									const status = imageStatuses.get(statusKey) || "idle";

									// Preload fullSize image when it becomes active
									if (isActive && status === "idle") {
										startLoadingImage(actualIndex, "fullSize");
									}

									return (
										<motion.div
											animate={{
												opacity: isActive ? 1 : 0,
												scale: isActive ? 1 : 0.95,
											}}
											className={`absolute ${isActive ? "z-10" : "z-0"}`}
											initial={{ opacity: 0, scale: 0.95 }}
											key={`${photo.fullSize}-${actualIndex}`}
											transition={{ duration: 0.3, ease: "easeOut" }}
										>
											{isActive && status !== "loaded" && (
												<motion.div
													animate={{ opacity: 1 }}
													className="flex h-[80vh] w-[90vw] items-center justify-center rounded-lg bg-black/50"
													exit={{ opacity: 0 }}
													initial={{ opacity: 0 }}
												>
													{status === "loading" && (
														<div className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
													)}
												</motion.div>
											)}
											{/* biome-ignore lint/performance/noImgElement: Required for carousel animations */}
											<motion.img
												alt={`Item ${actualIndex + 1} of ${photos.length}`}
												animate={{
													filter:
														status === "loaded" ? "blur(0px)" : "blur(15px)",
													opacity: status === "loaded" ? 1 : 0,
												}}
												className="pointer-events-auto h-auto max-h-[80vh] w-auto max-w-[90vw] rounded-lg object-contain"
												height={1080}
												initial={{ filter: "blur(15px)", opacity: 0 }}
												onError={() => {
													setImageStatuses((prev) =>
														new Map(prev).set(statusKey, "error")
													);
												}}
												onLoad={() => {
													setImageStatuses((prev) =>
														new Map(prev).set(statusKey, "loaded")
													);
												}}
												src={photo.fullSize}
												transition={{
													filter: { duration: 0.3, ease: "easeOut" },
													opacity: { duration: 0.1 },
												}}
												width={1920}
											/>
										</motion.div>
									);
								})}
						</div>

						{/* Photo counter */}
						<div className="-translate-x-1/2 fixed bottom-4 left-1/2 z-[60] rounded-full border border-white/20 bg-black/75 px-3 py-1 text-sm text-white backdrop-blur-md">
							{carouselIndex + 1} / {photos.length}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</main>
	);
}
