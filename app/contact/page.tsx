import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact HyTech Racing, visit the shop at 575 14th St NW, or ask for a ride to a meeting."
};

const mapSrc =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1394.2016671644603!2d-84.40709957615414!3d33.78678004105704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f504f20314d3f7%3A0x10189491e24694f8!2sHyTech+Racing!5e0!3m2!1sen!2sus!4v1461698856882";

export default function ContactPage() {
  return (
    <main className="pb-24">
      <PageHeader eyebrow="SHOP" title="CONTACT" />
      <div className="mx-auto mt-10 grid max-w-7xl gap-10 px-4 lg:grid-cols-2 md:px-8">
        <div className="space-y-10">
          <section>
            <h2 className="font-display text-3xl font-black text-ink">HyTech Racing</h2>
            <address className="mt-4 not-italic leading-relaxed text-muted">
              575 14th St NW
              <br />
              Atlanta, GA 30318
              <br />
              <a href="tel:+18508883232" className="text-ink hover:text-volt">
                (850) 888-3232
              </a>
              <br />
              <a href="mailto:gthytech@gmail.com" className="text-volt underline-offset-4 hover:underline">
                gthytech@gmail.com
              </a>
            </address>
          </section>
          <section>
            <h2 className="font-display text-3xl font-black text-ink">Meetings</h2>
            <p className="mt-4 leading-relaxed text-muted">
              Email us at{" "}
              <a href="mailto:gthytech@gmail.com" className="text-volt underline-offset-4 hover:underline">
                gthytech@gmail.com
              </a>{" "}
              if you would like to get involved with our meetings.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              Interested in joining?{" "}
              <a href="https://linktr.ee/HyTechRacing" className="text-volt underline-offset-4 hover:underline" target="_blank" rel="noopener noreferrer">
                Check out our Linktree
              </a>
              .
            </p>
          </section>
          <section>
            <h2 className="font-display text-3xl font-black text-ink">Shop access</h2>
            <p className="mt-4 leading-relaxed text-muted">
              Our shop is accessible by foot, car, public transport (MARTA), and the GT Stinger (Green Route). If you&apos;d like a ride to any of our meetings,
              just let us know!
            </p>
          </section>
        </div>
        <div className="min-h-[420px] overflow-hidden rounded-md border border-white/10">
          <iframe title="Map of the HyTech Racing shop at 575 14th St NW, Atlanta" src={mapSrc} className="h-full min-h-[420px] w-full" loading="lazy" />
        </div>
      </div>
    </main>
  );
}
