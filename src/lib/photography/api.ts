import { ZodError } from "zod";
import { ListObjectsV2Command, type ListObjectsV2CommandOutput } from "@aws-sdk/client-s3";

import { photographySchema, type PhotographyMetadata } from "./metadata";
import type { Photo, PhotoInventory } from "./types";

export interface InventoryObject {
  key: string;
  uploaded?: Date;
  size: number;
}
export interface R2Bucket {
  list: (options?: { cursor?: string }) => Promise<{
    objects: InventoryObject[];
    truncated: boolean;
    cursor?: string;
  }>;
}
export type PhotoStorage =
  | { kind: "r2"; bucket: R2Bucket }
  | {
      kind: "s3";
      client: { send: (command: ListObjectsV2Command) => Promise<ListObjectsV2CommandOutput> };
    };

async function listInventory(storage: PhotoStorage): Promise<InventoryObject[]> {
  const objects: InventoryObject[] = [];
  let cursor: string | undefined;
  const seen = new Set<string>();
  do {
    let truncated: boolean;
    if (storage.kind === "r2") {
      const page = await storage.bucket.list({ cursor });
      objects.push(...page.objects);
      truncated = page.truncated;
      cursor = page.cursor;
    } else {
      const page = await storage.client.send(
        new ListObjectsV2Command({ Bucket: "photos", ContinuationToken: cursor }),
      );
      objects.push(
        ...(page.Contents ?? []).flatMap((object) =>
          object.Key
            ? [{ key: object.Key, uploaded: object.LastModified, size: object.Size ?? 0 }]
            : [],
        ),
      );
      truncated = page.IsTruncated ?? false;
      cursor = page.NextContinuationToken;
    }
    if (!truncated) break;
    if (!cursor || seen.has(cursor))
      throw new Error("Storage listing did not advance. Retry the request.");
    seen.add(cursor);
  } while (cursor);
  return objects;
}

export async function getPhotoResponse(
  storage: PhotoStorage,
  metadata: PhotographyMetadata,
): Promise<Response> {
  try {
    const editorial = photographySchema.parse(metadata);
    const inventory = await listInventory(storage);
    const photos: Photo[] = inventory
      .filter((object) => /\.(jpg|jpeg|png|gif|webp)$/i.test(object.key))
      .sort(
        (a, b) =>
          (b.uploaded?.getTime() ?? 0) - (a.uploaded?.getTime() ?? 0) ||
          (a.key < b.key ? -1 : a.key > b.key ? 1 : 0),
      )
      .map((object) => {
        const path = object.key.split("/").map(encodeURIComponent).join("/");
        return {
          name: object.key,
          original: `https://photos.ajanraj.com/${path}`,
          thumbnail: `https://photos.ajanraj.com/cdn-cgi/image/width=800,quality=90,format=auto/${path}`,
          fullSize: `https://photos.ajanraj.com/cdn-cgi/image/width=1600,quality=95,format=auto/${path}`,
          lastModified: object.uploaded?.toISOString(),
          size: object.size,
          trip: editorial.photos[object.key]?.trip,
          order: editorial.photos[object.key]?.order,
          alt: editorial.photos[object.key]?.alt?.trim() || "Photograph",
          camera: editorial.photos[object.key]?.camera || "Not specified",
        };
      });
    const names = new Set(photos.map((photo) => photo.name));
    const trips = [...editorial.trips]
      .sort((a, b) => compare(b.startDate, a.startDate) || compare(a.id, b.id))
      .map((trip) => {
        const members = photos
          .filter((photo) => photo.trip === trip.id)
          .sort((a, b) => {
            if (a.order !== undefined && b.order === undefined) return -1;
            if (a.order === undefined && b.order !== undefined) return 1;
            return (a.order ?? 0) - (b.order ?? 0);
          });
        return {
          ...trip,
          cover: members.some((photo) => photo.name === trip.cover) ? trip.cover : members[0]?.name,
          count: members.length,
          photoNames: members.map((photo) => photo.name),
        };
      });
    const result: PhotoInventory = {
      photos,
      trips,
      unorganized: photos.flatMap((photo) => (photo.trip ? [] : [photo.name])),
      warnings: Object.keys(editorial.photos).flatMap((name) =>
        names.has(name)
          ? []
          : [
              `Missing storage object ${name}. Restore the object or update its metadata; metadata has been retained.`,
            ],
      ),
    };
    return Response.json(result);
  } catch (error) {
    if (error instanceof ZodError)
      return Response.json(
        {
          error: `Invalid photography metadata. Correct these entries before release: ${error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ")}`,
        },
        { status: 500 },
      );
    return Response.json({ error: "Unable to load photographs. Please retry." }, { status: 500 });
  }
}

function compare(a: string, b: string) {
  return a < b ? -1 : a > b ? 1 : 0;
}
