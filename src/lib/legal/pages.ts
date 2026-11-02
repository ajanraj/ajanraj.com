// Hidden legal pages for the hermes-atlas Google OAuth app.
// Served by standalone Nitro handlers (see nitro.config.ts) so the slug never
// enters the client bundle, the router, the nav, the footer or any index.
// Keep these pages unlinked from the rest of the site.

export const LEGAL_SLUG = "lqcmxene";

const CONTACT = "support@ajanraj.com";
const LAST_UPDATED = "2 November 2026";
const ROBOTS = "noindex, nofollow";

export interface LegalPage {
  title: string;
  heading: string;
  body: string;
}

export const privacyPage: LegalPage = {
  title: "Privacy policy",
  heading: "Privacy policy",
  body: `
<p>This application is for personal use and accesses only its owner's Google accounts.</p>

<h2>Data access and use</h2>
<p>It can read, send and modify Gmail email; view and manage Google Calendar events; read Google Contacts; and access and edit Google Drive, Google Docs and Google Sheets content. Data is used only to carry out the owner's personal assistant requests.</p>

<h2>Processing and sharing</h2>
<p>Data is processed on the owner's own machine. Relevant content is sent to OpenAI and Anthropic only to answer the owner's requests. Data is not sold, is not used for advertising and is not shared with third parties except for this AI processing.</p>

<h2>Access control</h2>
<p>OAuth tokens are stored locally. Access can be revoked at <a href="https://myaccount.google.com/permissions" rel="nofollow noreferrer">myaccount.google.com/permissions</a>.</p>

<h2>Google API data</h2>
<p>Use and transfer of information received from Google APIs will adhere to the Google API Services User Data Policy, including the Limited Use requirements.</p>

<p>Contact: <a href="mailto:${CONTACT}">${CONTACT}</a></p>
`,
};

export const termsPage: LegalPage = {
  title: "Terms",
  heading: "Terms",
  body: `
<p>This application is a personal, non-commercial tool for its owner's use only.</p>
<p>It is provided "as is", without warranty of any kind.</p>
<p>Contact: <a href="mailto:${CONTACT}">${CONTACT}</a></p>
`,
};

function renderPage(page: LegalPage): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="${ROBOTS}">
<meta name="referrer" content="no-referrer">
<title>${page.title}</title>
<style>
  body { max-width: 42rem; margin: 0 auto; padding: 2rem 1.25rem 4rem; font: 16px/1.6 system-ui, sans-serif; color: #1a1a1a; background: #fff; }
  h1 { font-size: 1.6rem; line-height: 1.25; margin: 0 0 0.25rem; }
  h2 { font-size: 1.1rem; margin: 2rem 0 0.5rem; }
  ul { padding-left: 1.25rem; }
  a { color: #1a4fd6; overflow-wrap: anywhere; }
  .updated { color: #555; font-size: 0.9rem; margin: 0 0 1.5rem; }
</style>
</head>
<body>
<main>
<h1>${page.heading}</h1>
<p class="updated">Last updated: ${LAST_UPDATED}</p>
${page.body.trim()}
</main>
</body>
</html>
`;
}

export function legalResponse(page: LegalPage): Response {
  return new Response(renderPage(page), {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-robots-tag": ROBOTS,
      "referrer-policy": "no-referrer",
      "cache-control": "public, max-age=300",
    },
  });
}
