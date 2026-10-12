import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import RemoteImage from "@/components/RemoteImage";
import RosterBoard from "@/components/RosterBoard";
import SubteamBreakdown from "@/components/SubteamBreakdown";
import TeamSection from "@/components/TeamSection";
import team from "@/data/rosters.json";

export const metadata: Metadata = {
  title: "Team",
  description: "HyTech Racing leadership, subteam leads, faculty advisor, members, and archived rosters."
};

export default function TeamPage() {
  return (
    <main>
      <PageHeader
        eyebrow="GEORGIA TECH FORMULA SAE"
        title="TEAM"
        lede="Leadership, subteams, and every roster from the current season back to 2012."
      />
      <figure className="mx-auto mt-10 max-w-7xl px-4 md:px-8">
        <div className="relative aspect-[16/8] overflow-hidden rounded-md border border-white/10 bg-black">
          <RemoteImage src={team.photo} alt={team.caption} fill priority className="object-cover" sizes="(max-width: 1280px) 100vw, 1120px" />
        </div>
        <figcaption className="mt-4 text-center text-muted">{team.caption}</figcaption>
      </figure>
      <SubteamBreakdown />
      <TeamSection />
      <RosterBoard />
    </main>
  );
}
