import { createFileRoute } from "@tanstack/react-router";
import { PhotographyPage } from "@/components/photography-page";

export const Route = createFileRoute("/photos")({
  head: () => ({
    meta: [
      { title: "Photos | Ajan Raj" },
      {
        name: "description",
        content: "Travel and everyday photographs by Ajan Raj, organized by trip.",
      },
      { property: "og:title", content: "Photos | Ajan Raj" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://ajanraj.com/photos" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://ajanraj.com/photos" }],
  }),
  component: PhotographyPage,
});
