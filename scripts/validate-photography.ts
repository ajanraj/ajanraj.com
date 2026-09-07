import metadata from "../src/data/photography.json";
import { photographySchema } from "../src/lib/photography/metadata";

const result = photographySchema.safeParse(metadata);
if (!result.success) {
  for (const issue of result.error.issues)
    console.error(`${issue.path.join(".")}: ${issue.message}`);
  console.error("Correct these photography entries before release.");
  process.exitCode = 1;
} else {
  console.log(
    `Photography metadata valid: ${result.data.trips.length} trips, ${Object.keys(result.data.photos).length} photo entries.`,
  );
}

const { dimensionsSchema } = await import("../src/lib/photography/dimensions");
const { default: dimensions } = await import("../src/data/photo-dimensions.json");
const catalog = dimensionsSchema.safeParse(dimensions);
if (!catalog.success) {
  for (const issue of catalog.error.issues)
    console.error(`Dimensions ${issue.path.join(".")}: ${issue.message}`);
  process.exitCode = 1;
}
