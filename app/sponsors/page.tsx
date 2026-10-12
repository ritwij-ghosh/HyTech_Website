import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import SponsorTiers from "@/components/SponsorTiers";

export const metadata: Metadata = {
  title: "Sponsors",
  description: "HyTech Racing sponsors by contribution tier, and how to request the sponsor packet."
};

export default function SponsorsPage() {
  return (
    <main>
      <PageHeader
        eyebrow="PARTNERS"
        title="SPONSORS"
        lede="We are extremely grateful for each of our sponsors."
      />
      <section className="mx-auto mt-10 max-w-7xl px-4 md:px-8">
        <div className="max-w-3xl rounded-md border border-white/[0.06] bg-surface/80 p-7 md:p-9">
          <h2 className="font-display text-3xl font-black text-ink">Interested in sponsoring us?</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Email us at{" "}
            <a href="mailto:gthytech@gmail.com" className="text-volt underline-offset-4 hover:underline">
              gthytech@gmail.com
            </a>{" "}
            and we&apos;ll send you a copy of our Sponsor Packet!
          </p>
        </div>
      </section>
      <SponsorTiers />
    </main>
  );
}
