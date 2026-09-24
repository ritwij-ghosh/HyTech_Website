import CarShowcase from "@/components/CarShowcase";
import CarTimeline from "@/components/CarTimeline";
import DataDashboard from "@/components/DataDashboard";
import ElectronicsCloseup from "@/components/ElectronicsCloseup";
import FooterSection from "@/components/FooterSection";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import ResultsSection from "@/components/ResultsSection";
import SponsorsDonate from "@/components/SponsorsDonate";
import StatsBar from "@/components/StatsBar";
import SubteamBreakdown from "@/components/SubteamBreakdown";
import TeamSection from "@/components/TeamSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsBar />
        <CarShowcase />
        <SubteamBreakdown />
        <ElectronicsCloseup />
        <DataDashboard />
        <CarTimeline />
        <TeamSection />
        <ResultsSection />
        <SponsorsDonate />
      </main>
      <FooterSection />
    </>
  );
}
