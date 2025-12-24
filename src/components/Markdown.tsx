import { useEffect, useState } from "react";
import parse, { type HTMLReactParserOptions, Element, domToReact } from "html-react-parser";
import { Link } from "@tanstack/react-router";
import { renderMarkdown, type MarkdownResult } from "@/utils/markdown";

type MarkdownProps = {
  content: string;
  className?: string;
};

export function Markdown({ content, className }: MarkdownProps) {
  const [result, setResult] = useState<MarkdownResult | null>(null);

  useEffect(() => {
    void renderMarkdown(content).then(setResult);
  }, [content]);

  if (!result) {
    return <div className={className}>Loading...</div>;
  }

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element) {
        if (domNode.name === "a") {
          const href = domNode.attribs.href;
          if (href?.startsWith("/")) {
            return <Link to={href}>{domToReact(domNode.children as any, options)}</Link>;
          }
        }

        if (domNode.name === "img") {
          return <img {...domNode.attribs} loading="lazy" className="rounded-lg shadow-md" />;
        }
      }
    },
  };

  return <div className={className}>{parse(result.markup, options)}</div>;
}
