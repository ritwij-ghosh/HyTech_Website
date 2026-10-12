import type { Metadata } from "next";
import CinematicPreview from "@/components/CinematicPreview";
import SponsorsDonate from "@/components/SponsorsDonate";
import ResultsSection from "@/components/ResultsSection";

export const metadata: Metadata = {
  title: "Cinematic visual study",
  robots: { index: false, follow: false },
};

export default function CinematicPreviewPage() {
  return (
    <main>
      <CinematicPreview />
      <SponsorsDonate />
      <ResultsSection />
    </main>
  );
}
