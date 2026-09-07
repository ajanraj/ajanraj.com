import { z } from "zod";

const date = z.iso.date();
const tripSchema = z.strictObject({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase URL ID with hyphens"),
  name: z.string().trim().min(1),
  startDate: date,
  endDate: date,
  introduction: z.string().optional(),
  cover: z.string().min(1).optional(),
});
const photoMetadataSchema = z.strictObject({
  trip: z.string().min(1).optional(),
  order: z.number().finite().optional(),
  alt: z.string().optional(),
  camera: z.string().trim().optional(),
});
export const photographySchema = z
  .strictObject({
    trips: z.array(tripSchema),
    photos: z.record(z.string(), photoMetadataSchema),
  })
  .superRefine((metadata, context) => {
    const ids = new Set<string>();
    for (const [index, trip] of metadata.trips.entries()) {
      const report = (message: string) =>
        context.addIssue({ code: "custom", path: ["trips", index, trip.id], message });
      if (ids.has(trip.id)) report(`Duplicate trip ${trip.id}. Choose a unique stable ID.`);
      ids.add(trip.id);
      if (trip.startDate > trip.endDate)
        report(`Trip ${trip.id}: end date precedes start date. Correct the date range.`);
      if (trip.cover && metadata.photos[trip.cover]?.trip !== trip.id)
        report(
          `Cover ${trip.cover} must belong to ${trip.id}. Assign the photo to this trip or choose another cover.`,
        );
    }
    for (const [name, photo] of Object.entries(metadata.photos)) {
      if (photo.trip && !ids.has(photo.trip))
        context.addIssue({
          code: "custom",
          path: ["photos", name, "trip"],
          message: `Unknown trip ${photo.trip}. Restore the trip or clear/reassign this photo's trip.`,
        });
    }
  });
export type PhotographyMetadata = z.infer<typeof photographySchema>;
export type Trip = z.infer<typeof tripSchema>;
