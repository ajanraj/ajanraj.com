import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PhotoGallery, PhotoImage } from "./photo-gallery";
import type { PhotoInventory } from "@/lib/photography/types";

export function PhotographyPage({ tripId, other = false }: { tripId?: string; other?: boolean }) {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["photos"],
    queryFn: async (): Promise<PhotoInventory> => {
      const response = await fetch("/api/photos");
      if (!response.ok) throw new Error("Unable to load photographs");
      return response.json();
    },
    retry: false,
  });
  return (
    <main className="border-t border-dashed px-8 pt-8">
      {(tripId || other) && (
        <Link to="/photos" className="mb-6 inline-block text-sm underline underline-offset-4">
          ← All photographs
        </Link>
      )}
      {isPending || isError ? (
        <>
          <h1 className="page-heading font-medium text-3xl md:text-5xl tracking-tight">Photos</h1>
          {isPending ? (
            <p role="status" className="py-12 text-muted-foreground">
              Loading photographs…
            </p>
          ) : (
            <div className="mt-8" role="alert">
              <p>Photographs could not be loaded.</p>
              <button
                className="mt-4 underline underline-offset-4"
                type="button"
                onClick={() => void refetch()}
              >
                Retry
              </button>
            </div>
          )}
        </>
      ) : (
        <PhotoCollection data={data} tripId={tripId} other={other} />
      )}
      <Link
        to="/gear"
        className="mt-8 inline-block text-xs text-muted-foreground underline underline-offset-4"
      >
        See the gear I use
      </Link>
      <p className="mt-4 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Ajan Raj. All photos are my original work and may not be used,
        reproduced, or distributed without permission.
      </p>
    </main>
  );
}

function PhotoCollection({
  data,
  tripId,
  other,
}: {
  data: PhotoInventory;
  tripId?: string;
  other: boolean;
}) {
  const trip = data.trips.find((item) => item.id === tripId);
  const index = !tripId && !other;
  const title = tripId ? (trip?.name ?? "Trip not found") : other ? "Other photographs" : "Photos";
  const byName = new Map(data.photos.map((photo) => [photo.name, photo]));
  const photos = (trip?.photoNames ?? data.unorganized).flatMap((name) => {
    const photo = byName.get(name);
    return photo ? [photo] : [];
  });
  return (
    <>
      <h1 className="page-heading font-medium text-3xl md:text-5xl tracking-tight">{title}</h1>
      {trip && (
        <p className="mt-2 text-sm text-muted-foreground">
          {trip.startDate} – {trip.endDate} · {trip.count}{" "}
          {trip.count === 1 ? "photograph" : "photographs"}
        </p>
      )}
      {trip?.introduction && (
        <p className="mt-4 whitespace-pre-line text-muted-foreground">{trip.introduction}</p>
      )}
      <div className="mt-8">
        {tripId && !trip ? (
          <p>This trip does not exist. Choose a trip from All photographs.</p>
        ) : index && data.trips.length > 0 ? (
          <TripIndex data={data} />
        ) : (
          <PhotoGallery
            key={tripId ?? "other"}
            photos={photos}
            name={trip?.name ?? "Other photographs"}
          />
        )}
      </div>
    </>
  );
}

function TripIndex({ data }: { data: PhotoInventory }) {
  const byName = new Map(data.photos.map((photo) => [photo.name, photo]));
  return (
    <>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {data.trips.flatMap((item) => {
          if (item.count === 0) return [];
          const cover = item.cover ? byName.get(item.cover) : undefined;
          return (
            <Link
              key={item.id}
              to="/photos/trips/$tripId"
              params={{ tripId: item.id }}
              className="block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              {cover && <PhotoImage photo={cover} key={cover.name} />}
              <h2 className="page-heading mt-3 text-2xl">{item.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {item.startDate} – {item.endDate}
              </p>
              <p className="text-sm text-muted-foreground">
                {item.count} {item.count === 1 ? "photograph" : "photographs"}
              </p>
            </Link>
          );
        })}
      </div>
      {data.unorganized.length > 0 && (
        <Link to="/photos/other" className="mt-10 block underline underline-offset-4">
          Other photographs · {data.unorganized.length}
        </Link>
      )}
      {data.photos.length === 0 && (
        <p className="py-12 text-muted-foreground">No photographs yet.</p>
      )}
    </>
  );
}
