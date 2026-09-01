"use client";

import { motion, useInView } from "framer-motion";
import { Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const podium = [
  { place: 1, suffix: "st", color: "#B3A369", years: "Formula Hybrid 2018, 2019" },
  { place: 2, suffix: "nd", color: "#c9ced6", years: "FSAE Nevada 2021" },
  { place: 3, suffix: "rd", color: "#b36b42", years: "FSAE Michigan 2022, 2025" }
];

function PlaceNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const run = () => {
      frame += 1;
      setDisplay(Math.min(value, Math.ceil((frame / 28) * value)));
      if (frame < 28) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  }, [inView, value]);

  return (
    <div ref={ref} className="font-display text-[6rem] font-black leading-none text-ink md:text-[9rem]">
      {display}
      <span className="text-3xl text-volt md:text-5xl">{suffix}</span>
    </div>
  );
}

export default function ResultsSection() {
  return (
    <section id="results" className="relative overflow-hidden bg-background py-24 md:py-32">
      <div className="absolute inset-0 bg-carbon opacity-35" />
      <div className="relative mx-auto max-w-7xl px-4 text-center md:px-8">
        <div className="font-mono text-[10px] tracking-[0.24em] text-cyan-electric">COMPETITION RESULTS</div>
        <h2 className="mt-4 font-display text-5xl font-black text-ink md:text-7xl">PODIUM ENERGY</h2>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {podium.map((item) => (
            <motion.article
              key={item.suffix}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-md border border-white/[0.06] bg-surface/80 p-7"
            >
              <motion.div
                className="absolute inset-0"
                style={{ backgroundColor: item.color }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: [0, 0.18, 0] }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              />
              <PlaceNumber value={item.place} suffix={item.suffix} />
              <div className="mt-4 font-mono text-sm text-muted">{item.years}</div>
            </motion.article>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 flex flex-col items-center justify-center gap-4 font-display text-3xl font-black italic text-volt md:flex-row md:text-5xl"
        >
          <Zap className="h-10 w-10 fill-volt" />
          North American Acceleration Record — FSAE Michigan 2023
        </motion.div>
      </div>
    </section>
  );
}
