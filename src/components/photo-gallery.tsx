import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Photo } from "@/lib/photography/types";

export function PhotoImage({ photo, full = false }: { photo: Photo; full?: boolean }) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  return (
    <div
      className={
        full
          ? "pointer-events-none relative flex min-h-0 flex-1 w-full items-center justify-center"
          : "relative aspect-square w-full overflow-hidden rounded-xl bg-muted"
      }
    >
      {status === "loading" && (
        <span
          className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground"
          role="status"
        >
          Loading photo…
        </span>
      )}
      {status === "error" ? (
        <span className="flex h-full items-center justify-center p-4 text-sm" role="status">
          This photograph could not load.
        </span>
      ) : (
        <img
          alt={photo.alt}
          className={`${full ? "pointer-events-auto max-h-full max-w-full object-contain" : "h-full w-full object-cover"} ${status === "loaded" ? "opacity-100" : "opacity-0"}`}
          loading={full ? "eager" : "lazy"}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          src={full ? photo.fullSize : photo.thumbnail}
        />
      )}
    </div>
  );
}

export function PhotoGallery({ photos, name }: { photos: Photo[]; name: string }) {
  const [activeName, setActiveName] = useState<string | null>(null);
  const activeIndex = photos.findIndex((photo) => photo.name === activeName);
  const active = photos[activeIndex];
  const reducedMotion = useReducedMotion();
  const move = (direction: number) => {
    if (photos.length)
      setActiveName(photos[(activeIndex + direction + photos.length) % photos.length].name);
  };
  useHotkeys("esc", () => setActiveName(null), { enabled: !!active });
  useHotkeys("left", () => move(-1), { enabled: !!active });
  useHotkeys("right", () => move(1), { enabled: !!active });
  const open = !!active;
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      {photos.length === 0 ? (
        <p className="py-12 text-muted-foreground">No photographs here yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {photos.map((photo) => (
            <button
              className="rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4"
              key={photo.name}
              onClick={() => setActiveName(photo.name)}
              type="button"
              aria-label={`Open ${photo.alt}`}
            >
              <PhotoImage photo={photo} />
            </button>
          ))}
        </div>
      )}
      <LazyMotion features={domAnimation}>
        <AnimatePresence>
          {active && (
            <m.div
              className="fixed inset-0 z-50 flex flex-col bg-black/95 px-12 py-16 text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.15 }}
              role="dialog"
              aria-modal="true"
              aria-label={`${name} photo viewer`}
            >
              <button
                className="absolute inset-0"
                type="button"
                tabIndex={-1}
                aria-label="Dismiss photo viewer backdrop"
                onClick={() => setActiveName(null)}
              />
              <button
                className="absolute right-4 top-4 flex items-center gap-2"
                type="button"
                onClick={() => setActiveName(null)}
                aria-label="Close photo viewer"
              >
                <X size={20} /> Close
              </button>
              {photos.length > 1 && (
                <>
                  <button
                    className="absolute left-3 top-1/2"
                    type="button"
                    onClick={() => move(-1)}
                    aria-label="Previous photo"
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    className="absolute right-3 top-1/2"
                    type="button"
                    onClick={() => move(1)}
                    aria-label="Next photo"
                  >
                    <ChevronRight />
                  </button>
                </>
              )}
              <PhotoImage photo={active} full key={active.name} />
              <div
                className="relative mt-4 shrink-0 break-words text-center text-sm"
                aria-live="polite"
              >
                <p>
                  {name} · {activeIndex + 1} / {photos.length}
                </p>
                <p className="mt-1 text-white/70">Camera: {active.camera}</p>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </LazyMotion>
    </>
  );
}
