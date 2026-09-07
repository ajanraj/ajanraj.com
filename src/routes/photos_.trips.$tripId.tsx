import { createFileRoute } from "@tanstack/react-router";
import { PhotographyPage } from "@/components/photography-page";

export const Route = createFileRoute("/photos_/trips/$tripId")({
  head: () => ({ meta: [{ title: "Trip photographs | Ajan Raj" }] }),
  component: TripPage,
});
function TripPage() {
  const { tripId } = Route.useParams();
  return <PhotographyPage tripId={tripId} />;
}
