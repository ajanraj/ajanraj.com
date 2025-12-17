import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type ImageStatus = "idle" | "loading" | "loaded" | "error";

type Photo = {
  name: string;
  thumbnail: string;
  fullSize: string;
  original: string;
  lastModified: string;
  size: number;
};

export const Route = createFileRoute("/photos")({
  component: PhotosPage,
});

function PhotosPage() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["photos"],
    queryFn: async () => {
      const res = await fetch("/api/photos");
      return res.json();
    },
  });
  const photos: Photo[] = useMemo(() => data?.photos || [], [data?.photos]);

  const [carouselOpen, setCarouselOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [imageStatuses, setImageStatuses] = useState<Map<string, ImageStatus>>(new Map());
  const navigationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const startLoadingImage = useCallback(
    (index: number, imageType: "thumbnail" | "fullSize" = "thumbnail") => {
      const photo = photos[index];
      if (!photo) {
        return;
      }

      const statusKey = imageType === "fullSize" ? `${index}-full` : `${index}`;

      setImageStatuses((prev) => {
        const currentStatus = prev.get(statusKey) || "idle";
        if (currentStatus !== "idle") {
          return prev;
        }

        const next = new Map(prev).set(statusKey, "loading");

        const img = new window.Image();
        img.onload = () => {
          setImageStatuses((p) => new Map(p).set(statusKey, "loaded"));
        };
        img.onerror = () => {
          setImageStatuses((p) => new Map(p).set(statusKey, "error"));
        };
        img.src = imageType === "fullSize" ? photo.fullSize : photo.thumbnail;

        return next;
      });
    },
    [photos],
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
            const index = Number.parseInt(entry.target.getAttribute("data-index") || "0", 10);
            startLoadingImage(index, "thumbnail");
          }
        }
      },
      {
        rootMargin: "100px",
        threshold: 0.1,
      },
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
          A collection of photos I've taken over the years. I'm not a professional photographer, but
          I enjoy capturing moments.
        </p>
      </div>
      <p className="mb-8 text-sm opacity-80">
        My photos are taken with an iPhone 12 Pro Max (Wide: 26mm f/1.6, Ultra Wide: 13mm f/2.4,
        Telephoto: 65mm f/2.2).
      </p>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
        {isLoading || error
          ? Array.from({ length: 10 }, (_, i) => `skeleton-${i}`).map((key) => (
              <div className="aspect-square w-full overflow-hidden rounded-xl bg-muted" key={key}>
                <Skeleton className="h-full w-full animate-pulse bg-muted" />
              </div>
            ))
          : photos.map((photo, i) => {
              const status = imageStatuses.get(`${i}`) || "idle";

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
                  <img
                    alt={`Gallery item ${i + 1}`}
                    className="h-full w-full object-cover pointer-events-none select-none"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    height={400}
                    onError={() => {
                      setImageStatuses((prev) => new Map(prev).set(`${i}`, "error"));
                    }}
                    onLoad={() => {
                      setImageStatuses((prev) => new Map(prev).set(`${i}`, "loaded"));
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
                .slice(Math.max(0, carouselIndex - 1), Math.min(photos.length, carouselIndex + 2))
                .map((photo, relativeIndex) => {
                  const actualIndex = Math.max(0, carouselIndex - 1) + relativeIndex;
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
                      <motion.img
                        alt={`Item ${actualIndex + 1} of ${photos.length}`}
                        animate={{
                          filter: status === "loaded" ? "blur(0px)" : "blur(15px)",
                          opacity: status === "loaded" ? 1 : 0,
                        }}
                        className="pointer-events-none h-auto max-h-[80vh] w-auto max-w-[90vw] rounded-lg object-contain select-none"
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                        height={1080}
                        initial={{ filter: "blur(15px)", opacity: 0 }}
                        onError={() => {
                          setImageStatuses((prev) => new Map(prev).set(statusKey, "error"));
                        }}
                        onLoad={() => {
                          setImageStatuses((prev) => new Map(prev).set(statusKey, "loaded"));
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
