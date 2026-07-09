import { useEffect, useState, type CSSProperties } from "react";
import parse, {
  type DOMNode,
  type HTMLReactParserOptions,
  Element,
  domToReact,
} from "html-react-parser";
import { Link } from "@tanstack/react-router";
import { renderMarkdown, type MarkdownResult } from "@/utils/markdown";

type MarkdownProps = {
  content: string;
  className?: string;
  style?: CSSProperties;
};

function isDomNode(node: Element["children"][number]): node is DOMNode {
  return (
    node instanceof Element ||
    node.type === "text" ||
    node.type === "comment" ||
    node.type === "directive"
  );
}

function createParserOptions(): HTMLReactParserOptions {
  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (!(domNode instanceof Element)) {
        return;
      }

      if (domNode.name === "a") {
        const href = domNode.attribs.href;
        if (href?.startsWith("/")) {
          return <Link to={href}>{domToReact(domNode.children.filter(isDomNode), options)}</Link>;
        }
      }

      if (domNode.name === "img") {
        return <img {...domNode.attribs} loading="lazy" className="rounded-lg shadow-md" />;
      }
    },
  };

  return options;
}

export function parseMarkdownMarkup(markup: string) {
  return parse(markup, createParserOptions());
}

export function Markdown({ content, className, style }: MarkdownProps) {
  const [result, setResult] = useState<MarkdownResult | null>(null);

  useEffect(() => {
    void renderMarkdown(content).then(setResult);
  }, [content]);

  if (!result) {
    return (
      <div className={className} style={style}>
        Loading...
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      {parseMarkdownMarkup(result.markup)}
    </div>
  );
}
