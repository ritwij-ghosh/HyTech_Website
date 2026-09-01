"use client";

import { motion } from "framer-motion";
import { sectionReveal, staggerContainer } from "@/lib/animations";

const bullets = [
  "Custom BMS with LTC6811 cell monitoring",
  "CAN Bus network across all vehicle systems",
  "Ethernet-capable data acquisition backbone"
];

function PcbIllustration() {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-white/10 bg-[#092418] shadow-cyan">
      <svg viewBox="0 0 800 600" className="absolute inset-0 h-full w-full">
        <defs>
          <pattern id="vias" width="44" height="44" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="3" fill="#d6b85c" opacity="0.55" />
            <circle cx="34" cy="30" r="2.5" fill="#00d4ff" opacity="0.32" />
          </pattern>
        </defs>
        <rect width="800" height="600" fill="url(#vias)" opacity="0.65" />
        {Array.from({ length: 13 }, (_, index) => (
          <path
            key={index}
            d={`M ${60 + index * 48} 40 V ${180 + (index % 4) * 42} H ${260 + index * 22} V ${510 - (index % 3) * 38}`}
            fill="none"
            stroke="#B3A369"
            strokeWidth="3"
            opacity="0.55"
          />
        ))}
        {Array.from({ length: 18 }, (_, index) => (
          <rect
            key={index}
            x={80 + (index % 6) * 110}
            y={95 + Math.floor(index / 6) * 135}
            width={62}
            height={30}
            rx={3}
            fill="#121216"
            stroke="#b3a369"
            strokeOpacity="0.5"
          />
        ))}
        <path
          d="M 20 180 C 100 80, 190 230, 280 100 S 460 80, 540 190 S 700 260, 780 80"
          fill="none"
          stroke="#7EB6C8"
          strokeWidth="4"
          strokeDasharray="18 16"
          opacity="0.9"
        />
      </svg>
      <span className="pcb-signal absolute h-4 w-4 rounded-full bg-cyan-electric shadow-cyan animate-trace-dot" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/40" />
    </div>
  );
}

export default function ElectronicsCloseup() {
  return (
    <section id="electronics" className="relative overflow-hidden bg-background py-24 md:py-32">
      <div className="absolute inset-0 grid-overlay opacity-30" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 md:grid-cols-2 md:items-center md:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.35 }}
        >
          <PcbIllustration />
        </motion.div>
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }}>
          <motion.div variants={sectionReveal} className="font-mono text-[10px] tracking-[0.24em] text-cyan-electric">
            ELECTRONICS CLOSE-UP
          </motion.div>
          <motion.h2 variants={sectionReveal} className="mt-4 font-display text-5xl font-black text-ink md:text-7xl">
            DESIGNED. FABRICATED. TESTED.
          </motion.h2>
          <motion.p variants={sectionReveal} className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Every circuit board on the car is student-engineered from schematic to soldering station.
          </motion.p>
          <div className="mt-9 grid gap-4">
            {bullets.map((bullet) => (
              <motion.div
                key={bullet}
                variants={sectionReveal}
                className="flex items-start gap-3 border-l border-volt/60 bg-white/[0.03] p-4 font-mono text-sm text-ink"
              >
                <span className="text-volt">✦</span>
                {bullet}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
