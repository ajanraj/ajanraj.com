import { Link } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { parseMarkdownMarkup } from "../components/Markdown";
import { renderMarkdown } from "./markdown";

describe("renderMarkdown", () => {
  it("extracts heading IDs, text, and levels", async () => {
    const result = await renderMarkdown("# Hello *world*\n\n### API & SDK");

    expect(result.headings).toEqual([
      { id: "hello-world", text: "Hello world", level: 1 },
      { id: "api--sdk", text: "API & SDK", level: 3 },
    ]);
  });

  it("wraps headings with autolink anchors", async () => {
    const result = await renderMarkdown("## Linked heading");

    expect(result.markup).toBe(
      '<h2 id="linked-heading"><a class="anchor" href="#linked-heading">Linked heading</a></h2>',
    );
  });

  it("renders GFM tables and preserves raw HTML", async () => {
    const result = await renderMarkdown(`| Name | Value |
| --- | --- |
| A | B |

<section data-kind="raw"><strong>Raw</strong></section>`);

    expect(result.markup).toContain(
      "<table><thead><tr><th>Name</th><th>Value</th></tr></thead><tbody><tr><td>A</td><td>B</td></tr></tbody></table>",
    );
    expect(result.markup).toContain('<section data-kind="raw"><strong>Raw</strong></section>');
  });
});

describe("parseMarkdownMarkup", () => {
  it("converts internal anchors to router links", () => {
    const result = parseMarkdownMarkup('<a href="/writing/">Internal</a>');

    expect(result).toMatchObject({
      type: Link,
      props: {
        to: "/writing/",
        children: "Internal",
      },
    });
  });
});
