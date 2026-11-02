import { expect, test } from "@playwright/test";
import { LEGAL_SLUG } from "../src/lib/legal/pages";

const pages = [
  { path: `/p/${LEGAL_SLUG}/privacy`, title: "Hermes Atlas Privacy Policy" },
  { path: `/p/${LEGAL_SLUG}/terms`, title: "Hermes Atlas Terms of Service" },
];

for (const legal of pages) {
  test(`${legal.path} is public, noindex and standalone`, async ({ page }) => {
    const response = await page.goto(legal.path);
    expect(response?.status()).toBe(200);
    expect(response?.url()).toMatch(new RegExp(`${legal.path}$`));
    expect(response?.headers()["x-robots-tag"]).toBe("noindex, nofollow");
    expect(response?.headers()["set-cookie"]).toBeUndefined();
    await expect(page).toHaveTitle(legal.title);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(legal.title);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );
    await expect(page.getByRole("link", { name: "support@ajanraj.com" })).toHaveAttribute(
      "href",
      "mailto:support@ajanraj.com",
    );
    await expect(page.locator("input, form, nav, footer, script")).toHaveCount(0);
  });
}

test("privacy page shows the Limited Use sentence as visible text", async ({ page }) => {
  await page.goto(pages[0].path);
  await expect(
    page.getByText(
      "Use and transfer of information received from Google APIs will adhere to the Google API Services User Data Policy, including the Limited Use requirements.",
      { exact: true },
    ),
  ).toBeVisible();
});

// Raw SSR HTML is what crawlers read; client bundles are checked in the build output.
test("public site never reveals the hidden legal pages", async ({ request }) => {
  for (const path of ["/", "/writing", "/projects", "/photos", "/gear"]) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(response.headers()["x-robots-tag"]).toBeUndefined();
    const html = await response.text();
    expect(html).not.toContain(LEGAL_SLUG);
    expect(html).not.toContain('href="/p/');
  }

  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  const robotsText = await robots.text();
  expect(robotsText).not.toContain(LEGAL_SLUG);
  expect(robotsText).not.toContain("/p/");

  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).not.toContain(LEGAL_SLUG);
});
