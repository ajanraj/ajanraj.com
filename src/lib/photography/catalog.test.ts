import { mkdtemp, readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import sharp from "sharp";
import { expect, it } from "vitest";
import { getPhotoResponse } from "./api";

it("catalogs oriented images, refreshes changed files, and preserves editorial metadata", async () => {
  const root = await mkdtemp(join(tmpdir(), "photo-catalog-"));
  try {
    const source = join(root, "images");
    await mkdir(source);
    const editorial = {
      trips: [],
      photos: { "portrait.jpg": { camera: "Camera", alt: "Portrait", order: 2 } },
    };
    const metadata = join(root, "metadata.json");
    const output = join(root, "dimensions.json");
    await writeFile(metadata, JSON.stringify(editorial));
    await sharp({ create: { width: 80, height: 40, channels: 3, background: "red" } })
      .withMetadata({ orientation: 6 })
      .jpeg()
      .toFile(join(source, "portrait.jpg"));
    const refresh = () =>
      execFileSync(
        "bun",
        ["scripts/catalog-photography.ts", source, "--output", output, "--metadata", metadata],
        { encoding: "utf8" },
      );
    refresh();
    const first = JSON.parse(await readFile(output, "utf8"));
    expect(first["portrait.jpg"]).toMatchObject({ width: 40, height: 80 });
    refresh();
    expect(JSON.parse(await readFile(output, "utf8"))).toEqual(first);
    await sharp({ create: { width: 120, height: 30, channels: 3, background: "blue" } })
      .jpeg()
      .toFile(join(source, "portrait.jpg"));
    refresh();
    const updated = JSON.parse(await readFile(output, "utf8"));
    expect(updated["portrait.jpg"]).toMatchObject({ width: 120, height: 30 });
    expect(updated["portrait.jpg"].sha256).not.toBe(first["portrait.jpg"].sha256);
    expect(JSON.parse(await readFile(metadata, "utf8"))).toEqual(editorial);
    const response = await getPhotoResponse(
      {
        kind: "r2",
        bucket: {
          list: async () => ({
            truncated: false,
            objects: [
              { key: "portrait.jpg", size: updated["portrait.jpg"].size },
              { key: "new.jpg", size: 1 },
            ],
          }),
        },
      },
      editorial,
      updated,
    );
    expect((await response.json()).photos).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "portrait.jpg",
          width: 120,
          height: 30,
          camera: "Camera",
          alt: "Portrait",
          order: 2,
        }),
        expect.objectContaining({ name: "new.jpg", camera: "Not specified" }),
      ]),
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

it("reports unreadable and missing local objects without deleting catalog or editorial entries", async () => {
  const root = await mkdtemp(join(tmpdir(), "photo-catalog-"));
  try {
    const source = join(root, "images");
    await mkdir(source);
    const metadata = join(root, "metadata.json");
    const output = join(root, "dimensions.json");
    const editorial = { trips: [], photos: { "missing.jpg": { camera: "Old camera" } } };
    const previous = {
      "broken.jpg": { width: 40, height: 80, size: 10, sha256: "a".repeat(64) },
      "missing.jpg": { width: 80, height: 40, size: 20, sha256: "b".repeat(64) },
    };
    await writeFile(metadata, JSON.stringify(editorial));
    await writeFile(output, JSON.stringify(previous));
    await writeFile(join(source, "broken.jpg"), "not an image");
    expect(() =>
      execFileSync(
        "bun",
        ["scripts/catalog-photography.ts", source, "--output", output, "--metadata", metadata],
        { stdio: "pipe" },
      ),
    ).toThrow(/Unreadable image broken.jpg[\s\S]*Missing local object missing.jpg/);
    expect(JSON.parse(await readFile(output, "utf8"))).toEqual(previous);
    expect(JSON.parse(await readFile(metadata, "utf8"))).toEqual(editorial);
    await writeFile(
      output,
      JSON.stringify({ "invalid.jpg": { ...previous["broken.jpg"], width: 0 } }),
    );
    expect(() =>
      execFileSync(
        "bun",
        ["scripts/catalog-photography.ts", source, "--output", output, "--metadata", metadata],
        { stdio: "pipe" },
      ),
    ).toThrow(/width/);
    expect(JSON.parse(await readFile(output, "utf8"))["invalid.jpg"].width).toBe(0);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
