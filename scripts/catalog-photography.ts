import { createHash } from "node:crypto";
import { readFile, readdir, writeFile, rename } from "node:fs/promises";
import { resolve, relative, sep } from "node:path";
import { parseArgs } from "node:util";
import sharp from "sharp";
import { dimensionsSchema, type DimensionCatalog } from "../src/lib/photography/dimensions";
import { photographySchema } from "../src/lib/photography/metadata";

// Read only a local mirror. This command never connects to storage or writes image files.
async function main() {
  const { positionals, values } = parseArgs({
    allowPositionals: true,
    options: {
      output: { type: "string", default: "src/data/photo-dimensions.json" },
      metadata: { type: "string", default: "src/data/photography.json" },
    },
  });
  if (positionals.length !== 1)
    throw new Error(
      "Usage: bun run photos:catalog <local-image-directory> [--output catalog.json] [--metadata photography.json]",
    );
  const source = resolve(positionals[0]);
  const output = resolve(values.output);
  const metadataPath = resolve(values.metadata);
  if (output === metadataPath || output === source || output.startsWith(`${source}${sep}`))
    throw new Error(
      "Catalog output must be outside the image directory and separate from editorial metadata.",
    );
  const editorial = photographySchema.parse(JSON.parse(await readFile(metadataPath, "utf8")));
  let catalog: DimensionCatalog = {};
  try {
    catalog = dimensionsSchema.parse(JSON.parse(await readFile(output, "utf8")));
  } catch (error) {
    if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) throw error;
  }
  const names = new Set<string>();
  let refreshed = 0;
  async function walk(directory: string) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) {
        await walk(path);
        continue;
      }
      if (!entry.isFile() || !/\.(jpg|jpeg|png|gif|webp)$/i.test(entry.name)) continue;
      const name = relative(source, path).split(sep).join("/");
      names.add(name);
      try {
        const bytes = await readFile(path);
        const sha256 = createHash("sha256").update(bytes).digest("hex");
        if (catalog[name]?.sha256 === sha256) continue;
        const info = await sharp(bytes).metadata();
        const swapped = info.orientation !== undefined && info.orientation >= 5;
        const width = swapped ? info.height : info.width;
        const height = swapped ? info.width : info.height;
        const validated = dimensionsSchema.parse({
          [name]: { width, height, size: bytes.length, sha256 },
        });
        catalog[name] = validated[name];
        refreshed++;
      } catch {
        console.error(
          `Unreadable image ${name}. Restore a readable original and refresh again; any previous dimensions have been retained.`,
        );
        process.exitCode = 1;
      }
    }
  }
  await walk(source);
  for (const name of new Set([...Object.keys(editorial.photos), ...Object.keys(catalog)])) {
    if (!names.has(name)) {
      console.error(
        `Missing local object ${name}. Check the mirror is complete or correct the stale reference; metadata and dimensions have been retained.`,
      );
      process.exitCode = 1;
    }
  }
  const temporary = `${output}.${process.pid}.tmp`;
  await writeFile(
    temporary,
    `${JSON.stringify(Object.fromEntries(Object.entries(catalog).sort(([a], [b]) => a.localeCompare(b))), null, 2)}\n`,
  );
  await rename(temporary, output);
  console.log(
    `Refreshed ${refreshed} images; retained ${Object.keys(catalog).length} catalog entries. Editorial metadata unchanged.`,
  );
}
main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
