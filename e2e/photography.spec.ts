import { expect, test, type Page } from "@playwright/test";
import { getPhotoResponse } from "../src/lib/photography/api";
import type { PhotoInventory } from "../src/lib/photography/types";

async function fixture(page: Page, options: { fail?: boolean; empty?: boolean } = {}) {
  const sizes = [
    [800, 1200],
    [1200, 800],
    [2400, 600],
    [800, 1000],
    [1200, 800],
    [800, 1200],
    [6000, 300],
    [100, 1600],
    [1000, 800],
    [900, 600],
  ];
  const names = sizes.map((_, index) => `${index}.jpg`);
  const response = await getPhotoResponse(
    {
      kind: "r2",
      bucket: {
        list: async () => ({
          truncated: false,
          objects: options.empty ? [] : names.map((key) => ({ key, size: 10 })),
        }),
      },
    },
    {
      trips: [
        { id: "journey", name: "A quiet journey", startDate: "2026-01-01", endDate: "2026-01-08" },
        { id: "one", name: "One afternoon", startDate: "2025-01-01", endDate: "2025-01-01" },
        { id: "empty", name: "An empty trip", startDate: "2024-01-01", endDate: "2024-01-01" },
      ],
      photos: Object.fromEntries(
        names.map((name, index) => [
          name,
          {
            trip: index < 8 ? "journey" : index === 8 ? "one" : undefined,
            order: index,
            alt: `Composition ${index + 1}`,
            camera: index === 0 ? "iPhone 12 Pro Max" : index === 1 ? "Fujifilm X100VI" : undefined,
          },
        ]),
      ),
    },
    Object.fromEntries(
      names
        .slice(0, 7)
        .map((name, index) => [
          name,
          { width: sizes[index][0], height: sizes[index][1], size: 10, sha256: "a".repeat(64) },
        ]),
    ),
  );
  const inventory: PhotoInventory = await response.json();
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname === "/api/photos") {
      if (options.fail) {
        options.fail = false;
        return route.fulfill({ status: 503, json: { error: "offline" } });
      }
      return route.fulfill({ json: inventory });
    }
    if (url.hostname === "photos.ajanraj.com") {
      const index = Number(url.pathname.split("/").at(-1)?.replace(".jpg", ""));
      if (index === 4) return route.fulfill({ status: 404, body: "missing" });
      const [width, height] = sizes[index];
      return route.fulfill({
        contentType: "image/svg+xml",
        body: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 800 600" preserveAspectRatio="none"><rect width="800" height="600" fill="#879ea6"/><circle cx="600" cy="140" r="65" fill="#eadbc0"/><path d="M0 460L270 180 480 480 620 270 800 440V600H0" fill="#3d5b5c"/><path d="M0 520L300 400 580 550 800 460V600H0" fill="#233f40"/><rect x="6" y="6" width="788" height="588" fill="none" stroke="#e7d8bc" stroke-width="12"/></svg>`,
      });
    }
    if (url.hostname !== "127.0.0.1" && url.hostname !== "localhost") return route.abort();
    return route.continue();
  });
}

test("keyboard journey loops, updates cameras, traps focus and restores the originating photo", async ({
  page,
}) => {
  await fixture(page);
  await page.goto("/photos");
  await page.getByRole("link", { name: /A quiet journey/ }).click();
  const trigger = page.getByRole("button", { name: "Open Composition 1 in A quiet journey" });
  await trigger.focus();
  const scroll = await page.evaluate(() => scrollY);
  await page.keyboard.press("Enter");
  const viewer = page.getByRole("dialog");
  await expect(viewer).toBeVisible();
  await expect(page.getByRole("button", { name: "Close photo viewer" })).toBeFocused();
  await expect(viewer).toContainText("Camera: iPhone 12 Pro Max");
  await page.keyboard.press("ArrowRight");
  await expect(viewer).toContainText("2 / 8");
  await expect(viewer).toContainText("Camera: Fujifilm X100VI");
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  await expect(viewer).toContainText("8 / 8");
  await expect(viewer).toContainText("Camera: Not specified");
  for (let count = 0; count < 5; count++) {
    await page.keyboard.press("Tab");
    expect(await viewer.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(viewer).not.toBeVisible();
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => scrollY)).toBe(scroll);
  await page.getByRole("link", { name: "← All photographs" }).click();
  await expect(page.getByRole("link", { name: /One afternoon/ })).toBeVisible();
});

for (const width of [375, 768, 1440]) {
  test(`uncropped gallery reserves space without overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await fixture(page);
    await page.goto("/photos/trips/journey");
    const triggers = page.getByRole("button", { name: /^Open Composition/ });
    await expect(triggers).toHaveCount(8);
    const boxes = await triggers.evaluateAll((elements) =>
      elements.map((element) => {
        const rect = element.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      }),
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect(boxes.every((box) => box.width > 40 && box.height > 40)).toBe(true);
    if (width === 375) {
      expect(boxes[0].width).toBeCloseTo(343, 0);
      expect(boxes[0].width / boxes[0].height).toBeCloseTo(2 / 3, 2);
      expect(boxes[2].width / boxes[2].height).toBeCloseTo(4, 2);
      expect(boxes[1].y).toBeGreaterThan(boxes[0].y);
    } else {
      expect(boxes[0].y).toBe(boxes[1].y);
      expect(boxes[0].height).toBeCloseTo(boxes[1].height, 1);
      expect(boxes.at(-1)!.height).toBeLessThanOrEqual(360);
    }
    await expect(triggers.nth(4)).toContainText("This photograph could not load.");
    await page.screenshot({ path: `test-results/gallery-${width}.png`, fullPage: true });
  });
}

test("touch swipe, single photos, empty trips, retry and reduced motion", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await fixture(page, { fail: true });
  await page.goto("http://127.0.0.1:3029/photos");
  await expect(page.getByRole("alert")).toContainText("Photographs could not be loaded.");
  await page.getByRole("button", { name: "Retry" }).click();
  await page.getByRole("link", { name: /A quiet journey/ }).click();
  await page.getByRole("button", { name: "Open Composition 1 in A quiet journey" }).tap();
  const viewer = page.getByRole("dialog");
  expect(await viewer.evaluate((element) => getComputedStyle(element).animationName)).toBe("none");
  const client = await context.newCDPSession(page);
  await client.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 300, y: 350 }],
  });
  await client.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: 200, y: 350 }],
  });
  await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect(viewer).toContainText("2 / 8");
  await expect(viewer).toContainText("Fujifilm X100VI");
  await page.getByRole("button", { name: "Close photo viewer" }).tap();
  await page.goto("http://127.0.0.1:3029/photos/trips/one");
  await page.getByRole("button", { name: /^Open Composition/ }).tap();
  await expect(viewer).toContainText("1 / 1");
  await expect(page.getByRole("button", { name: "Next photo" })).toHaveCount(0);
  await page.getByRole("button", { name: "Close photo viewer" }).tap();
  await page.goto("http://127.0.0.1:3029/photos/trips/empty");
  await expect(page.getByText("No photographs here yet.")).toBeVisible();
  await page.goto("http://127.0.0.1:3029/photos/other");
  await page.getByRole("button", { name: /^Open Composition/ }).tap();
  await expect(viewer).toContainText("Other photographs · 1 / 1");
  await expect(viewer).toContainText("Camera: Not specified");
  await context.close();
});

test("rotation restores focus to the same photo after rows regroup", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await fixture(page);
  await page.goto("/photos/trips/journey");
  const trigger = page.getByRole("button", { name: "Open Composition 2 in A quiet journey" });
  await trigger.click();
  await page.setViewportSize({ width: 768, height: 812 });
  await page.getByRole("button", { name: "Close photo viewer" }).click();
  await expect(trigger).toBeFocused();
});

test("trip covers keep their labels below two desktop columns and one mobile column", async ({
  page,
}) => {
  await fixture(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/photos");
  const first = page.getByRole("link", { name: /A quiet journey/ });
  const second = page.getByRole("link", { name: /One afternoon/ });
  await expect(first).toBeVisible();
  await expect(second).toBeVisible();
  expect((await first.boundingBox())!.y).toBe((await second.boundingBox())!.y);
  const image = await first.getByRole("img").boundingBox();
  const label = await first.getByRole("heading").boundingBox();
  expect(label!.y).toBeGreaterThanOrEqual(image!.y + image!.height);
  await page.screenshot({ path: "test-results/trip-index-desktop.png", fullPage: true });
  await page.setViewportSize({ width: 375, height: 812 });
  expect((await second.boundingBox())!.y).toBeGreaterThan((await first.boundingBox())!.y);
  await page.screenshot({ path: "test-results/trip-index-mobile.png", fullPage: true });
  await first.click();
  await page.getByRole("button", { name: "Open Composition 1 in A quiet journey" }).click();
  await expect(page.getByRole("dialog").getByRole("img")).toBeVisible();
  await page.screenshot({ path: "test-results/viewer-mobile.png" });
});
