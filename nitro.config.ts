import { defineNitroConfig } from "nitro/config";

export default defineNitroConfig({
  compatibilityDate: "2025-12-16",
  preset: "cloudflare_module",
  // Hidden legal pages for the hermes-atlas OAuth app (src/lib/legal/pages.ts).
  // Standalone handlers keep the slug out of the router and client bundle.
  handlers: [
    { route: "/p/lqcmxene/privacy", handler: "./server/legal/privacy.ts" },
    { route: "/p/lqcmxene/terms", handler: "./server/legal/terms.ts" },
  ],
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
