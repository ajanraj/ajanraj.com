import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "framer-motion";
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

const PHOTO_DESCRIPTION =
  "Travel and everyday photos shot on an iPhone 12 Pro Max, iPhone Air, or Fujifilm X100VI.";

const CAMERA_KIT = [
  {
    name: "iPhone 12 Pro Max",
    details: ["Wide 26mm f/1.6", "Ultra Wide 13mm f/2.4", "Telephoto 65mm f/2.2"],
  },
  {
    name: "iPhone Air",
    details: ["48MP Main 26mm f/1.6", "12MP 2× 52mm f/1.6"],
  },
  {
    name: "Fujifilm X100VI",
    details: ["40.2MP APS-C", "23mm f/2", "35mm equivalent"],
  },
] as const;

export const Route = createFileRoute("/photos")({
  head: () => ({
    meta: [
      { title: "Photos | Ajan Raj" },
      {
        name: "description",
        content: PHOTO_DESCRIPTION,
      },
      { property: "og:title", content: "Photos | Ajan Raj" },
      {
        property: "og:description",
        content: PHOTO_DESCRIPTION,
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://ajanraj.com/photos" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Photos | Ajan Raj" },
      {
        name: "twitter:description",
        content: PHOTO_DESCRIPTION,
      },
    ],
    links: [{ rel: "canonical", href: "https://ajanraj.com/photos" }],
  }),
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
  const reduceMotion = useReducedMotion() ?? false;
  const hoverTransition: Transition = {
    duration: reduceMotion ? 0 : 0.15,
    ease: [0.25, 0.1, 0.25, 1],
  };

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
    <motion.main
      className="border-t border-dashed px-8 pt-8"
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.32, ease: "easeOut" }}
    >
      <motion.div
        className="mb-8"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reduceMotion ? { duration: 0 } : { duration: 0.28, ease: "easeOut", delay: 0.04 }
        }
      >
        <h1 className="page-heading font-medium text-3xl md:text-5xl tracking-tight">Photos</h1>
        <p className="mt-2 text-muted-foreground">
          A collection of photos I've taken over the years. I'm not a professional photographer, but
          I enjoy capturing moments.
        </p>
      </motion.div>
      <motion.section
        aria-labelledby="photo-camera-kit"
        className="mb-8 border-y border-dashed py-4"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reduceMotion ? { duration: 0 } : { duration: 0.28, ease: "easeOut", delay: 0.08 }
        }
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="page-heading text-xl leading-none sm:text-2xl" id="photo-camera-kit">
              Three cameras, one archive.
            </h2>
            <p className="mt-1 max-w-lg text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Most newer photographs come from the iPhone Air and Fujifilm X100VI.
            </p>
          </div>
          <Link
            className="shrink-0 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground underline decoration-dashed underline-offset-4 transition-colors hover:text-foreground sm:text-[10px]"
            to="/gear"
          >
            See the gear I use
          </Link>
        </div>

        <ol className="mt-4 grid border-t border-dashed sm:grid-cols-3">
          {CAMERA_KIT.map((camera, index) => (
            <li
              className="grid grid-cols-[1.5rem_1fr] gap-x-3 border-b border-dashed py-3 last:border-b-0 sm:block sm:border-r sm:border-b-0 sm:px-4 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0"
              key={camera.name}
            >
              <span
                aria-hidden="true"
                className="pt-0.5 font-mono text-[9px] tracking-[0.18em] text-muted-foreground"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="page-heading text-base leading-tight sm:text-lg">{camera.name}</h3>
                <p className="mt-1 font-mono text-[9px] leading-relaxed tracking-[0.03em] text-muted-foreground sm:text-[10px]">
                  {camera.details.join(" · ")}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </motion.section>

      {/* Photo Grid */}
      <motion.div
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reduceMotion ? { duration: 0 } : { duration: 0.28, ease: "easeOut", delay: 0.12 }
        }
      >
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
                    filter: reduceMotion || status === "loaded" ? "blur(0px)" : "blur(8px)",
                    opacity: reduceMotion ? 1 : status === "loaded" ? 1 : 0,
                  }}
                  className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted hover:cursor-pointer"
                  data-index={i}
                  initial={reduceMotion ? false : { opacity: 0, y: 12, filter: "blur(8px)" }}
                  key={photo.name}
                  onClick={() => {
                    setCarouselOpen(true);
                    setCarouselIndex(i);
                  }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.35,
                    ease: "easeOut",
                    filter: { duration: reduceMotion ? 0 : 0.35, ease: "easeOut" },
                    delay: reduceMotion ? 0 : i * 0.04, // Stagger each photo individually
                  }}
                >
                  {status !== "loaded" && (
                    <motion.div
                      animate={reduceMotion ? { opacity: 1 } : { opacity: [0.6, 1, 0.6] }}
                      className="absolute inset-0 flex items-center justify-center bg-muted"
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { duration: 1.2, ease: "easeInOut", repeat: Infinity }
                      }
                    >
                      {status === "loading" && (
                        <motion.div
                          animate={reduceMotion ? { rotate: 0 } : { rotate: 360 }}
                          className="h-7 w-7 rounded-full border-2 border-muted-foreground/20 border-t-muted-foreground/60"
                          transition={
                            reduceMotion
                              ? { duration: 0 }
                              : { duration: 1, ease: "linear", repeat: Infinity }
                          }
                        />
                      )}
                    </motion.div>
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
      </motion.div>

      <p className="mt-8 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Ajan Raj. All photos are my original work and may not be used,
        reproduced, or distributed without permission.
      </p>

      <AnimatePresence mode="popLayout">
        {carouselOpen && (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50"
            exit={{ opacity: 0 }}
            initial={reduceMotion ? false : { opacity: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
          >
            {/* Background overlay */}
            <motion.div
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
              exit={{ opacity: 0 }}
              initial={reduceMotion ? false : { opacity: 0 }}
              onClick={() => setCarouselOpen(false)}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
            />

            {/* Top controls */}
            <div className="fixed top-4 right-4 z-[60] flex gap-2">
              <motion.div
                transition={hoverTransition}
                whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              >
                <Button
                  aria-label="Close carousel"
                  className="flex h-6 justify-between gap-1 rounded-full border p-2"
                  onClick={() => setCarouselOpen(false)}
                  variant="ghost"
                >
                  <X />
                  Close
                </Button>
              </motion.div>
            </div>

            {/* Previous button */}
            <motion.button
              aria-label="Previous photo"
              className="-translate-y-1/2 fixed top-1/2 left-4 z-[60] cursor-pointer text-muted-foreground hover:text-foreground"
              onClick={navigatePrevious}
              type="button"
              transition={hoverTransition}
              whileHover={reduceMotion ? undefined : { scale: 1.06 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            >
              <ChevronLeft size={24} />
            </motion.button>

            {/* Next button */}
            <motion.button
              aria-label="Next photo"
              className="-translate-y-1/2 fixed top-1/2 right-4 z-[60] cursor-pointer text-muted-foreground hover:text-foreground"
              onClick={navigateNext}
              type="button"
              transition={hoverTransition}
              whileHover={reduceMotion ? undefined : { scale: 1.06 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            >
              <ChevronRight size={24} />
            </motion.button>

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
                        scale: isActive ? 1 : 0.98,
                      }}
                      className={`absolute ${isActive ? "z-10" : "z-0"}`}
                      initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
                      key={`${photo.fullSize}-${actualIndex}`}
                      transition={
                        reduceMotion ? { duration: 0 } : { duration: 0.24, ease: "easeOut" }
                      }
                    >
                      {isActive && status !== "loaded" && (
                        <motion.div
                          animate={{ opacity: 1 }}
                          className="flex h-[80vh] w-[90vw] items-center justify-center rounded-lg bg-black/50"
                          exit={{ opacity: 0 }}
                          initial={reduceMotion ? false : { opacity: 0 }}
                        >
                          {status === "loading" && (
                            <motion.div
                              animate={reduceMotion ? { rotate: 0 } : { rotate: 360 }}
                              className="h-12 w-12 rounded-full border-2 border-white/20 border-t-white/60"
                              transition={
                                reduceMotion
                                  ? { duration: 0 }
                                  : { duration: 1, ease: "linear", repeat: Infinity }
                              }
                            />
                          )}
                        </motion.div>
                      )}
                      <motion.img
                        alt={`Item ${actualIndex + 1} of ${photos.length}`}
                        animate={{
                          filter: reduceMotion || status === "loaded" ? "blur(0px)" : "blur(12px)",
                          opacity: reduceMotion ? 1 : status === "loaded" ? 1 : 0,
                        }}
                        className="pointer-events-none h-auto max-h-[80vh] w-auto max-w-[90vw] rounded-lg object-contain select-none"
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                        height={1080}
                        initial={reduceMotion ? false : { filter: "blur(12px)", opacity: 0 }}
                        onError={() => {
                          setImageStatuses((prev) => new Map(prev).set(statusKey, "error"));
                        }}
                        onLoad={() => {
                          setImageStatuses((prev) => new Map(prev).set(statusKey, "loaded"));
                        }}
                        src={photo.fullSize}
                        transition={{
                          filter: { duration: reduceMotion ? 0 : 0.25, ease: "easeOut" },
                          opacity: { duration: reduceMotion ? 0 : 0.15, ease: "easeOut" },
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
    </motion.main>
  );
}
