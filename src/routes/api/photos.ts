import { createFileRoute } from "@tanstack/react-router";
import { getPhotoResponse, type R2Bucket } from "@/lib/photography/api";
import dimensions from "@/data/photo-dimensions.json";
import metadata from "@/data/photography.json";

export const Route = createFileRoute("/api/photos")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        // Nitro exposes Cloudflare bindings at runtime in deployed workers.
        // @ts-expect-error - Cloudflare binding available at runtime
        const env = request.cf?.env || globalThis.__env__ || {};
        const bucket: R2Bucket | undefined = env.PHOTOS_BUCKET;
        if (bucket) return getPhotoResponse({ kind: "r2", bucket }, metadata, dimensions);

        const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
        const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
        const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
        if (!(accountId && accessKeyId && secretAccessKey)) {
          return Response.json(
            { error: "Photo storage is unavailable. Please retry later." },
            { status: 503 },
          );
        }
        const { S3Client } = await import("@aws-sdk/client-s3");
        const client = new S3Client({
          region: "auto",
          endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
          credentials: { accessKeyId, secretAccessKey },
        });
        return getPhotoResponse({ kind: "s3", client }, metadata, dimensions);
      },
    },
  },
});
