import { describe, expect, it } from "vitest";
import { LEGAL_SLUG, legalResponse, privacyPage, termsPage } from "./pages";

const LIMITED_USE =
  "Use and transfer of information received from Google APIs will adhere to the Google API Services User Data Policy, including the Limited Use requirements.";

describe("hidden legal pages", () => {
  it("uses one random 8-character lowercase slug", () => {
    expect(LEGAL_SLUG).toMatch(/^[a-z0-9]{8}$/);
  });

  for (const page of [privacyPage, termsPage]) {
    describe(page.title, () => {
      it("responds as noindex, nofollow HTML", async () => {
        const response = legalResponse(page);
        expect(response.status).toBe(200);
        expect(response.headers.get("content-type")).toBe("text/html; charset=utf-8");
        expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
        const html = await response.text();
        expect(html).toContain('<meta name="robots" content="noindex, nofollow">');
        expect(html).toContain(`<title>${page.title}</title>`);
        expect(html).toContain("support@ajanraj.com");
      });

      it("never links to its sibling page or into the site", async () => {
        const html = await legalResponse(page).text();
        const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
        for (const href of hrefs) {
          expect(href).toMatch(
            /^(mailto:|https:\/\/myaccount\.google\.com\/|https:\/\/developers\.google\.com\/)/,
          );
        }
        expect(html).not.toContain(`/p/${LEGAL_SLUG}`);
      });

      it("avoids em dashes", () => {
        expect(page.body).not.toContain("\u2014");
      });
    });
  }

  it("includes the exact Google Limited Use sentence", () => {
    expect(privacyPage.body).toContain(LIMITED_USE);
  });

  it("discloses the required privacy facts", () => {
    const text = privacyPage.body;
    for (const fact of [
      "Gmail",
      "Google Calendar",
      "Google Contacts",
      "Google Drive",
      "Google Docs",
      "Google Sheets",
      "OpenAI",
      "Anthropic",
      "not sold",
      "not used for advertising",
      "stored locally",
      "https://myaccount.google.com/permissions",
    ]) {
      expect(text).toContain(fact);
    }
  });

  it("omits internal names and infrastructure details from both pages", async () => {
    expect(privacyPage.title).toBe("Privacy policy");
    expect(termsPage.title).toBe("Terms");
    for (const page of [privacyPage, termsPage]) {
      const html = await legalResponse(page).text();
      expect(html).not.toMatch(/hermes|atlas|jarvis|513423|Google Cloud|agent|Ajan Raj/i);
    }
  });

  it("keeps the terms personal, non-commercial and as-is", () => {
    const text = termsPage.body;
    for (const fact of ["personal, non-commercial", "as is", "without warranty"]) {
      expect(text).toContain(fact);
    }
  });
});
