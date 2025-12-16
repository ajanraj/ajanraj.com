import { defineNitroConfig } from "nitro/config";

export default defineNitroConfig({
  compatibilityDate: "2025-12-16",
  preset: "cloudflare_module",
  cloudflare: {
    deployConfig: true,
    nodeCompat: true,
    wrangler: {
      routes: [
        {
          pattern: "ajanraj.com",
          zone_name: "ajanraj.com",
          custom_domain: true,
        },
      ],
      r2_buckets: [
        {
          binding: "PHOTOS_BUCKET",
          bucket_name: "photos",
        },
      ],
    },
  },
});
