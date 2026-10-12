import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import RemoteImage from "@/components/RemoteImage";

export const metadata: Metadata = {
  title: "Donate",
  description: "How to donate to HyTech Racing through the Georgia Tech Foundation or Square, plus sponsorship tiers."
};

const photos = [
  ["https://hytechracing.gatech.edu/images/donate/revamp/progress3.jpg", "HyTech Racing car under construction"],
  ["https://hytechracing.gatech.edu/images/donate/revamp/car2.jpg", "HyTech Racing electric car"],
  ["https://hytechracing.gatech.edu/images/donate/revamp/car1.jpg", "HyTech Racing car in the shop"],
  ["https://hytechracing.gatech.edu/images/donate/meeting_small.jpg", "HyTech Racing team meeting"],
  ["https://hytechracing.gatech.edu/images/donate/revamp/progress1.jpg", "Students working on the HyTech Racing car"],
  ["https://hytechracing.gatech.edu/images/donate/revamp/testing2.jpg", "HyTech Racing car testing"]
];

export default function DonatePage() {
  return (
    <main className="pb-24">
      <PageHeader eyebrow="SUPPORT" title="DONATE TO HYTECH!" />
      <div className="mx-auto mt-8 max-w-7xl space-y-16 px-4 md:px-8">
        <section className="max-w-3xl">
          <p className="text-lg leading-relaxed text-muted">
            <strong className="text-ink">Donations are critical to the success of our team.</strong> We appreciate donations of all sizes and could not be
            competing at this level without your generous support, and we attribute a large portion of our success to our donors. Donations to HyTech Racing
            shows <strong className="text-ink">commitment to training the next generation of engineers.</strong>
          </p>
        </section>

        <div className="grid gap-4 sm:grid-cols-2">
          {photos.slice(0, 2).map(([src, alt]) => (
            <div key={src} className="relative aspect-[16/10] overflow-hidden rounded-md border border-white/10 bg-black">
              <RemoteImage src={src} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 560px" />
            </div>
          ))}
        </div>

        <section className="max-w-3xl">
          <h2 className="font-display text-4xl font-black text-ink">Would your company like to support us?</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            We are always looking for support from companies! Please reach out to us at{" "}
            <a href="mailto:gthytech@gmail.com" className="text-volt underline-offset-4 hover:underline">
              gthytech@gmail.com
            </a>{" "}
            so we can discuss our needs and{" "}
            <Link href="/sponsors" className="text-volt underline-offset-4 hover:underline">
              sponsorship opportunities
            </Link>{" "}
            with you.
          </p>
        </section>

        <div className="grid gap-4 sm:grid-cols-2">
          {photos.slice(2, 4).map(([src, alt]) => (
            <div key={src} className="relative aspect-[16/10] overflow-hidden rounded-md border border-white/10 bg-black">
              <RemoteImage src={src} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 560px" />
            </div>
          ))}
        </div>

        <section className="rounded-md border border-white/[0.06] bg-surface/80 p-7 md:p-10">
          <h2 className="text-center font-display text-4xl font-black text-ink">How to Donate</h2>
          <p className="mx-auto mt-6 max-w-3xl text-center leading-relaxed text-muted">
            Please check with your employer to see if they offer a matching gift program prior to donating. Many companies will match your donation at a 1:1 to
            3:1 ratio.
          </p>
          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <div>
              <h3 className="font-display text-3xl font-black text-volt">Option 1</h3>
              <p className="mt-4 leading-relaxed text-ink">
                Donate a tax-deductible gift through the{" "}
                <a
                  href="https://www.givecampus.com/campaigns/46972/donations/new"
                  className="text-volt underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Georgia Tech Foundation.
                </a>
              </p>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted">
                <li>Visit Georgia Tech Foundation Donation page</li>
                <li>
                  Select <strong className="text-ink">&quot;Make a Special Gift to Georgia Tech (write in your preference)&quot;</strong> in Designation field
                </li>
                <li>
                  Then, enter <strong className="text-ink">&quot;HyTech Racing&quot;</strong> in the Designation Field
                </li>
                <li>Fill in the rest of form and submit the payment</li>
              </ol>
            </div>
            <div>
              <h3 className="font-display text-3xl font-black text-volt">Option 2</h3>
              <p className="mt-4 leading-relaxed text-ink">
                Donate through our{" "}
                <a href="https://hytech-racing.square.site/" className="text-volt underline-offset-4 hover:underline" target="_blank" rel="noopener noreferrer">
                  Square site
                </a>{" "}
                with your credit or debit card (this is not tax-deductible).
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-center font-display text-4xl font-black text-ink">Sponsor Tiers</h2>
          <div className="relative mx-auto mt-8 aspect-[16/9] max-w-5xl overflow-hidden rounded-md border border-white/10 bg-[#f3f0e8]">
            <RemoteImage
              src="https://hytechracing.gatech.edu/images/sponsors/2027/tiers.png"
              alt="HyTech Racing sponsorship tier benefits"
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 960px"
            />
          </div>
          <p className="mx-auto mt-4 max-w-3xl text-center text-sm italic text-muted">
            *Software license sponsorships cannot qualify for Title Sponsor. Must be Monetary or In-Kind sponsorship. Vehicle Naming Ex: [COMPANY NAME] - HT11
          </p>
        </section>

        <div className="grid gap-4 sm:grid-cols-2">
          {photos.slice(4).map(([src, alt]) => (
            <div key={src} className="relative aspect-[16/10] overflow-hidden rounded-md border border-white/10 bg-black">
              <RemoteImage src={src} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 560px" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
