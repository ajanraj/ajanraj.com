import { createFileRoute } from "@tanstack/react-router";

const IMAGE_EXTENSIONS_REGEX = /\.(jpg|jpeg|png|gif|webp)$/i;

// Type for R2 bucket binding
interface R2Object {
  key: string;
  size: number;
  uploaded: Date;
}

interface R2ListResult {
  objects: R2Object[];
  truncated: boolean;
  cursor?: string;
}

interface R2Bucket {
  list: (options?: { limit?: number; prefix?: string }) => Promise<R2ListResult>;
}

export const Route = createFileRoute("/api/photos")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        // Access the R2 bucket binding from the Cloudflare environment
        // @ts-expect-error - Cloudflare binding available at runtime
        const env = request.cf?.env || globalThis.__env__ || {};
        const bucket: R2Bucket | undefined = env.PHOTOS_BUCKET;

        if (!bucket) {
          // Fallback for local development - use S3 SDK
          const { ListObjectsV2Command, S3Client } = await import("@aws-sdk/client-s3");

          const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
          const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
          const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

          if (!(accountId && accessKeyId && secretAccessKey)) {
            return Response.json({ error: "Missing R2 credentials or binding" }, { status: 500 });
          }

          const s3Client = new S3Client({
            region: "auto",
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            credentials: {
              accessKeyId,
              secretAccessKey,
            },
          });

          const command = new ListObjectsV2Command({
            Bucket: "photos",
          });

          try {
            const response = await s3Client.send(command);

            if (!response.Contents) {
              return Response.json({ photos: [] });
            }

            const photos = response.Contents.filter(
              (obj) => obj.Key && IMAGE_EXTENSIONS_REGEX.test(obj.Key),
            )
              .sort((a, b) => {
                const aDate = a.LastModified ? new Date(a.LastModified).getTime() : 0;
                const bDate = b.LastModified ? new Date(b.LastModified).getTime() : 0;
                return bDate - aDate;
              })
              .map((obj) => ({
                name: obj.Key || "",
                thumbnail: `https://photos.ajanraj.com/cdn-cgi/image/width=800,quality=90,format=auto/${obj.Key}`,
                fullSize: `https://photos.ajanraj.com/cdn-cgi/image/width=1600,quality=95,format=auto/${obj.Key}`,
                original: `https://photos.ajanraj.com/${obj.Key}`,
                lastModified: obj.LastModified?.toISOString(),
                size: obj.Size || 0,
              }));

            return Response.json({ photos });
          } catch (_error) {
            return Response.json({ error: "Failed to fetch photos" }, { status: 500 });
          }
        }

        // Use R2 binding (production on Cloudflare Workers)
        try {
          const listResult = await bucket.list();

          const photos = listResult.objects
            .filter((obj) => IMAGE_EXTENSIONS_REGEX.test(obj.key))
            .sort((a, b) => new Date(b.uploaded).getTime() - new Date(a.uploaded).getTime())
            .map((obj) => ({
              name: obj.key,
              thumbnail: `https://photos.ajanraj.com/cdn-cgi/image/width=800,quality=90,format=auto/${obj.key}`,
              fullSize: `https://photos.ajanraj.com/cdn-cgi/image/width=1600,quality=95,format=auto/${obj.key}`,
              original: `https://photos.ajanraj.com/${obj.key}`,
              lastModified: obj.uploaded.toISOString(),
              size: obj.size,
            }));

          return Response.json({ photos });
        } catch (_error) {
          return Response.json({ error: "Failed to fetch photos from R2" }, { status: 500 });
        }
      },
    },
  },
});
