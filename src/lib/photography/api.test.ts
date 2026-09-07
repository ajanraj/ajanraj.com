import { describe, expect, it } from "vitest";
import { getPhotoResponse } from "./api";

describe("photo API", () => {
  it("includes every storage page with stable, encoded image identities", async () => {
    const response = await getPhotoResponse(
      {
        kind: "r2",
        bucket: {
          list: async ({ cursor } = {}) =>
            cursor
              ? {
                  objects: [{ key: "folder/a #?.jpg", uploaded: new Date("2026-09-02"), size: 12 }],
                  truncated: false,
                }
              : {
                  objects: [
                    { key: "old.jpg", uploaded: new Date("2026-09-01"), size: 8 },
                    { key: "notes.txt", uploaded: new Date(), size: 1 },
                  ],
                  truncated: true,
                  cursor: "page2",
                },
        },
      },
      { trips: [], photos: {} },
    );
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.photos.map((photo: { name: string }) => photo.name)).toEqual([
      "folder/a #?.jpg",
      "old.jpg",
    ]);
    expect(body.photos[0].original).toBe("https://photos.ajanraj.com/folder/a%20%23%3F.jpg");
    expect(body.photos[0].camera).toBe("Not specified");
  });
});

it("assembles trips, curated order, covers, counts and independent cameras", async () => {
  const response = await getPhotoResponse(
    {
      kind: "r2",
      bucket: {
        list: async () => ({
          truncated: false,
          objects: ["b.jpg", "a.jpg", "new.jpg", "other.jpg"].map((key) => ({
            key,
            size: 1,
            uploaded: new Date("2026-09-08"),
          })),
        }),
      },
    },
    {
      trips: [
        { id: "old", name: "First visit", startDate: "2025-01-01", endDate: "2025-01-02" },
        {
          id: "new",
          name: "Return visit",
          startDate: "2026-01-01",
          endDate: "2026-01-02",
          cover: "missing.jpg",
        },
        { id: "empty", name: "Empty", startDate: "2024-01-01", endDate: "2024-01-01" },
      ],
      photos: {
        "a.jpg": { trip: "new", camera: " iPhone 12 Pro Max ", alt: "Mountains" },
        "b.jpg": { trip: "new", order: 1, camera: "Fujifilm X100VI" },
        "new.jpg": { trip: "old", camera: "  " },
        "other.jpg": { order: -100, camera: "iPhone Air" },
        "missing.jpg": { trip: "new", order: 0 },
      },
    },
  );
  const body = await response.json();
  expect(body.trips.map((trip: { id: string }) => trip.id)).toEqual(["new", "old", "empty"]);
  expect(body.trips[0]).toMatchObject({ photoNames: ["b.jpg", "a.jpg"], count: 2, cover: "b.jpg" });
  expect(body.trips[2]).toMatchObject({ photoNames: [], count: 0 });
  expect(body.unorganized).toEqual(["other.jpg"]);
  expect(body.photos.map((photo: { camera: string }) => photo.camera)).toEqual([
    "iPhone 12 Pro Max",
    "Fujifilm X100VI",
    "Not specified",
    "iPhone Air",
  ]);
  expect(body.warnings).toEqual([expect.stringContaining("missing.jpg")]);
});

it("reports invalid editorial entries with a recovery action", async () => {
  const response = await getPhotoResponse(
    { kind: "r2", bucket: { list: async () => ({ objects: [], truncated: false }) } },
    {
      trips: [],
      photos: { "lost.jpg": { trip: "deleted" } },
    },
  );
  expect(response.status).toBe(500);
  expect(await response.json()).toMatchObject({ error: expect.stringContaining("lost.jpg") });
});

it("returns equivalent metadata through paginated S3 and R2 inventories", async () => {
  const first = { key: "z.jpg", uploaded: new Date("2026-01-02"), size: 2 };
  const last = { key: "a.jpg", uploaded: new Date("2026-01-01"), size: 1 };
  const metadata = { trips: [], photos: { "a.jpg": { camera: " Camera ", order: -1 } } };
  const r2 = await getPhotoResponse(
    {
      kind: "r2",
      bucket: {
        list: async ({ cursor } = {}) => ({
          objects: [cursor ? last : first],
          truncated: !cursor,
          cursor: cursor ? undefined : "next",
        }),
      },
    },
    metadata,
  );
  const s3 = await getPhotoResponse(
    {
      kind: "s3",
      client: {
        send: async (command) => {
          const object = command.input.ContinuationToken ? last : first;
          return {
            $metadata: {},
            Contents: [{ Key: object.key, LastModified: object.uploaded, Size: object.size }],
            IsTruncated: !command.input.ContinuationToken,
            NextContinuationToken: command.input.ContinuationToken ? undefined : "next",
          };
        },
      },
    },
    metadata,
  );
  expect(await s3.json()).toEqual(await r2.json());
});

it.each([
  [
    {
      trips: [{ id: "Bad ID", name: "Trip", startDate: "2026-01-01", endDate: "2026-01-02" }],
      photos: {},
    },
    "id",
  ],
  [
    {
      trips: [{ id: "trip", name: "Trip", startDate: "2026-02-30", endDate: "2026-03-01" }],
      photos: {},
    },
    "startDate",
  ],
  [
    {
      trips: [{ id: "trip", name: "Trip", startDate: "2026-02-02", endDate: "2026-01-01" }],
      photos: {},
    },
    "date range",
  ],
  [
    {
      trips: [
        {
          id: "trip",
          name: "Trip",
          startDate: "2026-01-01",
          endDate: "2026-01-02",
          cover: "wrong.jpg",
        },
      ],
      photos: { "wrong.jpg": {} },
    },
    "Assign",
  ],
  [{ trips: [], photos: { "bad.jpg": { order: Infinity } } }, "bad.jpg"],
  [{ trips: [], photos: { "bad.jpg": { order: NaN } } }, "bad.jpg"],
  [{ trips: [], photos: { "bad.jpg": { trip: "" } } }, "bad.jpg"],
])("rejects invalid metadata before storage access: %j", async (metadata, message) => {
  const response = await getPhotoResponse(
    {
      kind: "r2",
      bucket: {
        list: async () => {
          throw new Error("No storage access expected");
        },
      },
    },
    metadata,
  );
  expect(response.status).toBe(500);
  expect((await response.json()).error).toContain(message);
});

it("distinguishes an empty inventory from failed or incomplete storage listings", async () => {
  const metadata = { trips: [], photos: {} };
  const empty = await getPhotoResponse(
    { kind: "r2", bucket: { list: async () => ({ objects: [], truncated: false }) } },
    metadata,
  );
  expect(await empty.json()).toMatchObject({ photos: [], trips: [], unorganized: [] });
  for (const list of [
    async () => {
      throw new Error("offline");
    },
    async () => ({ objects: [], truncated: true }),
  ]) {
    const failed = await getPhotoResponse({ kind: "r2", bucket: { list } }, metadata);
    expect(failed.status).toBe(500);
    expect(await failed.json()).toEqual({ error: "Unable to load photographs. Please retry." });
  }
});

it("uses deterministic date and name fallbacks and preserves cameras when reassigned or unassigned", async () => {
  const storage = {
    kind: "r2" as const,
    bucket: {
      list: async () => ({
        truncated: false,
        objects: [
          { key: "z.jpg", uploaded: new Date("2026-09-03"), size: 1 },
          { key: "b.jpg", uploaded: new Date("2026-09-02"), size: 1 },
          { key: "a.jpg", uploaded: new Date("2026-09-02"), size: 1 },
          { key: "ordered.jpg", uploaded: new Date("2026-09-01"), size: 1 },
        ],
      }),
    },
  };
  const trips = ["beta", "alpha"].map((id) => ({
    id,
    name: id,
    startDate: "2026-01-01",
    endDate: "2026-01-02",
  }));
  const photos = {
    "z.jpg": { trip: "alpha" },
    "a.jpg": { trip: "alpha", order: 2 },
    "b.jpg": { trip: "alpha", order: 2 },
    "ordered.jpg": { trip: "alpha", order: 1, camera: "iPhone Air" },
  };
  const initial = await (await getPhotoResponse(storage, { trips, photos })).json();
  expect(initial.trips.map((trip: { id: string }) => trip.id)).toEqual(["alpha", "beta"]);
  expect(initial.trips[0].photoNames).toEqual(["ordered.jpg", "a.jpg", "b.jpg", "z.jpg"]);
  expect(initial.trips[0].cover).toBe("ordered.jpg");
  photos["ordered.jpg"].trip = "beta";
  const moved = await (await getPhotoResponse(storage, { trips, photos })).json();
  expect(moved.trips[1].photoNames).toEqual(["ordered.jpg"]);
  const unassigned = await (
    await getPhotoResponse(storage, {
      trips,
      photos: { "ordered.jpg": { order: -100, camera: "iPhone Air" } },
    })
  ).json();
  expect(unassigned.unorganized).toEqual(["z.jpg", "a.jpg", "b.jpg", "ordered.jpg"]);
  expect(unassigned.photos[3].camera).toBe("iPhone Air");
});

it("keeps photos usable when dimensions are absent, invalid, or stale", async () => {
  const response = await getPhotoResponse(
    {
      kind: "r2",
      bucket: {
        list: async () => ({
          truncated: false,
          objects: ["valid.jpg", "invalid.jpg", "stale.jpg", "new.jpg"].map((key) => ({
            key,
            size: 100,
          })),
        }),
      },
    },
    { trips: [], photos: {} },
    {
      "valid.jpg": { width: 400, height: 300, size: 100, sha256: "a".repeat(64) },
      "invalid.jpg": { width: -1, height: 300, size: 100, sha256: "a".repeat(64) },
      "stale.jpg": { width: 400, height: 300, size: 50, sha256: "a".repeat(64) },
    },
  );
  const body = await response.json();
  expect(response.status).toBe(200);
  expect(body.photos).toHaveLength(4);
  expect(body.photos.find((photo: { name: string }) => photo.name === "valid.jpg")).toMatchObject({
    width: 400,
    height: 300,
  });
  for (const name of ["invalid.jpg", "stale.jpg", "new.jpg"]) {
    expect(body.photos.find((photo: { name: string }) => photo.name === name)).not.toHaveProperty(
      "width",
    );
  }
  expect(body.warnings).toEqual([
    expect.stringContaining("invalid.jpg"),
    expect.stringContaining("stale.jpg"),
  ]);
});
