import { createFileRoute } from "@tanstack/react-router";
import { PhotographyPage } from "@/components/photography-page";

export const Route = createFileRoute("/photos_/other")({
  head: () => ({ meta: [{ title: "Other photographs | Ajan Raj" }] }),
  component: () => <PhotographyPage other />,
});
