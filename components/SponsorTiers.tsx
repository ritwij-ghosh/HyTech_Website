import SponsorMark from "@/components/SponsorMark";
import sponsors from "@/data/sponsors.json";

export default function SponsorTiers() {
  return (
    <div className="mx-auto mt-16 max-w-7xl space-y-16 px-4 pb-24 md:px-8">
      {sponsors.map((tier) => (
        <section key={tier.tier} aria-labelledby={`tier-${tier.tier}`}>
          <h2 id={`tier-${tier.tier}`} className="font-display text-4xl font-black text-ink md:text-5xl">
            {tier.tier}
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {tier.sponsors.map((sponsor) => (
              <SponsorMark key={`${tier.tier}-${sponsor.name}`} name={sponsor.name} logo={sponsor.logo} href={sponsor.href} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
