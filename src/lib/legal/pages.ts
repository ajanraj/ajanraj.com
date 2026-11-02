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
  title: "Hermes Atlas Privacy Policy",
  heading: "Hermes Atlas Privacy Policy",
  body: `
<p>Hermes Atlas (Google Cloud project hermes-jarvis-513423) is a personal AI assistant that Ajan Raj runs on his own computer. It connects only to Ajan's own Google accounts. It is not offered to anyone else, and no one else can sign up for it or use it.</p>

<h2>What the app can access</h2>
<p>With Ajan's permission, given through Google sign-in, the app can access the following in his own Google accounts:</p>
<ul>
  <li><strong>Gmail:</strong> read email, send email on his behalf, and modify email (for example, change labels, mark messages as read, or move them to the trash).</li>
  <li><strong>Google Calendar:</strong> view calendars and events, and create, update or delete events.</li>
  <li><strong>Google Contacts:</strong> read contacts. The app cannot change them.</li>
  <li><strong>Google Drive, Google Docs and Google Sheets:</strong> view, create and edit files and their content.</li>
</ul>

<h2>How the data is used</h2>
<p>This data is used only to run Ajan's personal assistant, which means carrying out the requests he makes, such as summarising his inbox, drafting or sending a reply, scheduling an event, or finding and editing a document.</p>
<p>The data is not sold and is not used for advertising. It is not shared with or transferred to third parties for their own purposes. The only exception is the AI model processing described in the next section.</p>

<h2>Where the data is processed</h2>
<p>The app runs on Ajan's own machine. To answer a request, the app sends the relevant content, such as the text of an email, calendar event, contact or document, to the AI model providers Ajan uses, OpenAI and Anthropic. Content is sent to them only to answer his requests. Their handling of that content is also covered by their own terms and policies.</p>

<h2>Sign-in tokens</h2>
<p>The OAuth tokens that let the app reach Ajan's Google accounts are stored locally on his machine. Access can be revoked at any time at <a href="https://myaccount.google.com/permissions" rel="nofollow noreferrer">https://myaccount.google.com/permissions</a>.</p>

<h2>Google API Services User Data Policy</h2>
<p>Use and transfer of information received from Google APIs will adhere to the Google API Services User Data Policy, including the Limited Use requirements.</p>
<p>The policy is published at <a href="https://developers.google.com/terms/api-services-user-data-policy" rel="nofollow noreferrer">https://developers.google.com/terms/api-services-user-data-policy</a>.</p>

<h2>Contact</h2>
<p>Questions about this policy: <a href="mailto:${CONTACT}">${CONTACT}</a></p>
`,
};

export const termsPage: LegalPage = {
  title: "Hermes Atlas Terms of Service",
  heading: "Hermes Atlas Terms of Service",
  body: `
<p>Hermes Atlas is a personal, non-commercial tool that Ajan Raj built for his own use. It runs on his own computer and connects only to his own Google accounts.</p>

<h2>No service to others</h2>
<p>Hermes Atlas is not offered, sold or provided to anyone else. There is no public sign-up, and no one is invited to use it.</p>

<h2>No warranty</h2>
<p>The tool is provided "as is", without warranty of any kind.</p>

<h2>Contact</h2>
<p>Questions about these terms: <a href="mailto:${CONTACT}">${CONTACT}</a></p>
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
