import { z } from "zod";

export const dimensionsSchema = z.record(
  z.string(),
  z.strictObject({
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    size: z.number().int().nonnegative(),
    sha256: z.string().regex(/^[a-f0-9]{64}$/),
  }),
);
export type DimensionCatalog = z.infer<typeof dimensionsSchema>;
