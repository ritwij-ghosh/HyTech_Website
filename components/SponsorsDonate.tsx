"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MouseEvent, useState } from "react";
import { Button } from "@/components/ui/button";

const sponsors = [
  "Georgia Tech",
  "AMK",
  "Analog Devices",
  "Altium",
  "SolidWorks",
  "Tesla",
  "Siemens",
  "MathWorks",
  "Hexcel",
  "Molex",
  "AWS",
  "Keysight"
];

export default function SponsorsDonate() {
  const [ripple, setRipple] = useState({ x: 0, y: 0, show: false });

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setRipple({ x: event.clientX - rect.left, y: event.clientY - rect.top, show: true });
    window.setTimeout(() => setRipple((state) => ({ ...state, show: false })), 520);
  };

  return (
    <section id="sponsors" className="relative overflow-hidden bg-background py-24 md:py-32">
      <div className="absolute inset-0 grid-overlay opacity-20" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[1.2fr_.8fr] lg:items-start lg:px-8">
        <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div className="font-mono text-[10px] tracking-[0.24em] text-cyan-electric">JOIN THE PIT CREW</div>
          <h2 className="mt-4 font-display text-5xl font-black text-ink md:text-7xl">POWERED BY PARTNERSHIP</h2>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {sponsors.map((sponsor) => (
              <div
                key={sponsor}
                className="group relative flex h-24 items-center justify-center overflow-hidden rounded-md border border-white/[0.06] bg-surface/80 px-4 grayscale transition hover:border-volt/50 hover:grayscale-0"
              >
                <span className="absolute inset-y-0 left-0 hidden w-1/3 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:block group-hover:animate-shimmer" />
                <span className="text-center font-display text-sm font-black tracking-[0.12em] text-muted transition group-hover:text-ink">
                  {sponsor}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.aside
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="rounded-md border border-white/[0.06] bg-surface/85 p-7 md:p-9"
        >
          <div className="font-mono text-[10px] tracking-[0.24em] text-cyan-electric">DONATE</div>
          <h3 className="mt-4 font-display text-4xl font-black text-volt md:text-5xl">FUEL THE NEXT GENERATION</h3>
          <p className="mt-6 leading-relaxed text-muted">
            Funding supports accumulator materials, custom PCBs, carbon fiber, machining, testing days, competition travel, and the practical education that turns students into race engineers.
          </p>
          <Button onClick={onClick} className="relative mt-8 w-full overflow-hidden font-display tracking-[0.08em]">
            {ripple.show && (
              <span
                className="absolute h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/45 animate-ping"
                style={{ left: ripple.x, top: ripple.y }}
              />
            )}
            SUPPORT HYTECH RACING <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.aside>
      </div>
    </section>
  );
}
