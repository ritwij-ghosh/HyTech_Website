"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import SponsorMark from "@/components/SponsorMark";
import sponsors from "@/data/sponsors.json";

const preview = sponsors.find((tier) => tier.tier === "Champion")?.sponsors ?? [];

export default function SponsorsDonate() {
  return (
    <section id="sponsors" className="relative scroll-mt-20 overflow-hidden bg-background pb-24 pt-16 md:pb-32 md:pt-24">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .7 }} className="grid gap-10 border-t border-white/15 pt-10 md:grid-cols-[1.4fr_1fr] md:gap-24">
          <div>
            <p className="font-mono text-[9px] tracking-[.22em] text-volt">BEHIND EVERY LAP</p>
            <h2 className="mt-6 font-display text-[clamp(40px,5.5vw,78px)] font-medium leading-[1.03] tracking-[-.055em] text-ink">The names<br />behind the speed.</h2>
          </div>
          <div className="max-w-md md:pt-10">
            <p className="text-sm leading-7 text-muted">From the first design to the final lap, our partners help Georgia Tech students turn ambition into a race car.</p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-5">
              <Link href="/sponsors" className="inline-flex items-center gap-5 border-b border-volt/40 pb-3 text-xs text-ink transition hover:text-volt">Meet our partners <ArrowUpRight size={15} /></Link>
              <Link href="/contact" className="inline-flex items-center gap-5 border-b border-white/20 pb-3 text-xs text-muted transition hover:text-volt">Become a partner <ArrowUpRight size={15} /></Link>
            </div>
          </div>
        </motion.div>
        <div className="mt-14 grid grid-cols-2 gap-3 md:mt-20 md:grid-cols-4 lg:grid-cols-5">
          {preview.map(sponsor => <SponsorMark key={sponsor.name} name={sponsor.name} logo={sponsor.logo} href={sponsor.href} />)}
        </div>
      </div>
    </section>
  );
}
