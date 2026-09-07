import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Photo } from "@/lib/photography/types";

export function PhotoImage({
  photo,
  full = false,
  cover = false,
}: {
  photo: Photo;
  full?: boolean;
  cover?: boolean;
}) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  return (
    <div className={cn("photo-image", cover && "photo-image-cover")}>
      {status === "loading" && (
        <span className="photo-image-message text-muted-foreground" role="status">
          Loading photo…
        </span>
      )}
      {status === "error" ? (
        <span className="photo-image-message" role="status">
          This photograph could not load.
        </span>
      ) : (
        <img
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          className={status === "loaded" ? "opacity-100" : "opacity-0"}
          loading={full ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          src={full ? photo.fullSize : photo.thumbnail}
        />
      )}
    </div>
  );
}

const PHOTO_GUTTER = 16;

// Fill rows near 260px high; cap the last row instead of stretching a lone photo.
// Extreme ratios get a reserved frame, with the entire image contained inside it.
function photoRows(photos: Photo[], width: number) {
  const rows: { photo: Photo; width: number; height: number }[][] = [];
  let pending: Photo[] = [];
  let sum = 0;
  const ratio = (photo: Photo) =>
    Math.min(4, Math.max(1 / 3, photo.width && photo.height ? photo.width / photo.height : 4 / 3));
  const flush = (last: boolean) => {
    const height = Math.min(last ? 260 : 360, (width - (pending.length - 1) * PHOTO_GUTTER) / sum);
    rows.push(pending.map((photo) => ({ photo, width: ratio(photo) * height, height })));
    pending = [];
    sum = 0;
  };
  for (const photo of photos) {
    const nextHeight = (width - pending.length * PHOTO_GUTTER) / (sum + ratio(photo));
    const previousHeight = (width - (pending.length - 1) * PHOTO_GUTTER) / sum;
    if (
      pending.length &&
      nextHeight < 260 &&
      Math.abs(previousHeight - 260) < Math.abs(nextHeight - 260)
    )
      flush(false);
    pending.push(photo);
    sum += ratio(photo);
    if (sum * 260 + (pending.length - 1) * PHOTO_GUTTER >= width) flush(false);
  }
  if (pending.length) flush(true);
  return rows;
}

export function PhotoGallery({ photos, name }: { photos: Photo[]; name: string }) {
  const [activeName, setActiveName] = useState<string | null>(null);
  const container = useRef<HTMLDivElement>(null);
  const triggers = useRef(new Map<string, HTMLButtonElement>());
  const origin = useRef<string | null>(null);
  const restoreFocus = useCallback(() => {
    if (origin.current) triggers.current.get(origin.current)?.focus({ preventScroll: true });
  }, []);
  const [width, setWidth] = useState(0);
  const activeIndex = photos.findIndex((photo) => photo.name === activeName);
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const rows =
    width >= 600
      ? photoRows(photos, width)
      : photos.map((photo) => [{ photo, width: 0, height: 0 }]);
  return (
    <>
      <div ref={container} className="photo-rows" style={{ gap: PHOTO_GUTTER }}>
        {photos.length === 0 && (
          <p className="py-12 text-muted-foreground">No photographs here yet.</p>
        )}
        {rows.map((row) => (
          <div className="photo-row" style={{ gap: PHOTO_GUTTER }} key={row[0].photo.name}>
            {row.map(({ photo, width: imageWidth, height }) => (
              <button
                key={photo.name}
                type="button"
                className="photo-trigger"
                ref={(element) => {
                  if (element) triggers.current.set(photo.name, element);
                  return () => {
                    triggers.current.delete(photo.name);
                  };
                }}
                style={{
                  width: imageWidth || "100%",
                  aspectRatio: height
                    ? `${imageWidth} / ${height}`
                    : `${photo.width || 4} / ${photo.height || 3}`,
                }}
                onClick={() => {
                  origin.current = photo.name;
                  setActiveName(photo.name);
                }}
                aria-label={`Open ${photo.alt} in ${name}`}
              >
                <PhotoImage photo={photo} />
              </button>
            ))}
          </div>
        ))}
      </div>
      {activeIndex >= 0 && (
        <PhotoViewer
          restoreFocus={restoreFocus}
          photos={photos}
          name={name}
          activeIndex={activeIndex}
          onClose={() => setActiveName(null)}
          onMove={(direction) =>
            setActiveName(photos[(activeIndex + direction + photos.length) % photos.length].name)
          }
        />
      )}
    </>
  );
}

function PhotoViewer({
  photos,
  name,
  activeIndex,
  onClose,
  onMove,
  restoreFocus,
}: {
  photos: Photo[];
  name: string;
  activeIndex: number;
  onClose: () => void;
  restoreFocus: () => void;
  onMove: (direction: number) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const scroll = { x: window.scrollX, y: window.scrollY };
    const previous = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = previous;
      restoreFocus();
      window.scrollTo({ left: scroll.x, top: scroll.y, behavior: "instant" });
    };
  }, [restoreFocus]);
  const active = photos[activeIndex];
  return (
    <dialog
      ref={dialog}
      className="photo-viewer"
      aria-label={`${name} photo viewer`}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "Tab") {
          const controls = event.currentTarget.querySelectorAll<HTMLButtonElement>("button");
          const first = controls.item(0);
          const last = controls.item(controls.length - 1);
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          if (photos.length > 1) onMove(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}
    >
      <header className="flex items-center justify-between gap-4">
        <p className="page-heading text-2xl truncate">{name}</p>
        <button
          type="button"
          className="viewer-control"
          onClick={onClose}
          aria-label="Close photo viewer"
          autoFocus
        >
          <X size={20} />
          <span>Close</span>
        </button>
      </header>
      <div
        className="photo-viewer-image"
        onTouchStart={(event) => {
          touch.current =
            event.touches.length === 1
              ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
              : null;
        }}
        onTouchCancel={() => {
          touch.current = null;
        }}
        onTouchEnd={(event) => {
          const start = touch.current;
          touch.current = null;
          if (!start || photos.length < 2 || event.touches.length) return;
          const end = event.changedTouches.item(0);
          if (!end) return;
          const dx = end.clientX - start.x;
          const dy = end.clientY - start.y;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) onMove(dx < 0 ? 1 : -1);
        }}
      >
        <PhotoImage photo={active} full key={active.name} />
      </div>
      <footer className="flex items-center justify-between gap-3">
        {photos.length > 1 && (
          <button
            className="viewer-control"
            type="button"
            onClick={() => onMove(-1)}
            aria-label="Previous photo"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <div className="min-w-0 flex-1 text-center text-sm" aria-live="polite" aria-atomic="true">
          <p>
            {name} · {activeIndex + 1} / {photos.length}
          </p>
          <p className="mt-1 break-words text-white/60">Camera: {active.camera}</p>
        </div>
        {photos.length > 1 && (
          <button
            className="viewer-control"
            type="button"
            onClick={() => onMove(1)}
            aria-label="Next photo"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </footer>
    </dialog>
  );
}
