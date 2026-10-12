import type { Metadata } from "next";
import CarArchive from "@/components/CarArchive";
import CarTimeline from "@/components/CarTimeline";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Cars",
  description: "HyTech Racing electric cars, from HT09 through the archive, with engineering summaries, specifications, and results."
};

export default function CarsPage() {
  return (
    <main>
      <PageHeader
        eyebrow="THE GARAGE"
        title="CARS"
        lede="Engineering summaries, specifications, photographs, and results for every car on the books."
      />
      <CarTimeline />
      <CarArchive />
    </main>
  );
}
