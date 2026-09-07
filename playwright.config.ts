import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  use: { baseURL: "http://127.0.0.1:3029", browserName: "chromium" },
  webServer: {
    command: "bunx vite dev --host 127.0.0.1 --port 3029 --strictPort",
    url: "http://127.0.0.1:3029",
    reuseExistingServer: false,
    env: {
      CLOUDFLARE_ACCOUNT_ID: "",
      CLOUDFLARE_R2_ACCESS_KEY_ID: "",
      CLOUDFLARE_R2_SECRET_ACCESS_KEY: "",
    },
  },
});
