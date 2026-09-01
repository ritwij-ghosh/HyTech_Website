"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { sectionReveal, staggerContainer } from "@/lib/animations";

const stats = [
  { label: "ACCUMULATOR VOLTAGE", value: 530, suffix: "V" },
  { label: "PEAK POWER OUTPUT", value: 80, suffix: "kW" },
  { label: "BEST FSAE FINISH", value: 3, suffix: "rd" },
  { label: "MOTOR SPEED", value: 20000, suffix: "RPM" },
  { label: "BMS CELL VOLTAGES", value: 126, suffix: "" },
  { label: "PEAK LATERAL", value: 1.85, suffix: "g", decimals: 2 }
];

function CountValue({ value, suffix, decimals = 0 }: { value: number; suffix: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplay(value);
      return;
    }
    let frame = 0;
    const frames = 58;
    const animate = () => {
      frame += 1;
      const eased = 1 - Math.pow(1 - frame / frames, 3);
      setDisplay(value * eased);
      if (frame < frames) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, value]);

  const text = decimals ? display.toFixed(decimals) : Math.round(display).toLocaleString();

  return (
    <span ref={ref}>
      {text}
      <span className="ml-1 text-base text-muted md:text-lg">{suffix}</span>
    </span>
  );
}

export default function StatsBar() {
  return (
    <section id="telemetry" className="scanline relative border-y border-volt/50 bg-surface/95 py-7">
      <div className="absolute left-0 right-0 top-0 h-px bg-volt shadow-volt" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-volt shadow-volt" />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 md:grid-cols-3 md:px-8 lg:grid-cols-6"
      >
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={sectionReveal} className="border-l border-white/10 pl-4">
            <div className="font-mono text-[9px] tracking-[0.18em] text-cyan-electric">{stat.label}</div>
            <div className="mt-2 font-display text-3xl font-black text-volt tabular-nums md:text-4xl">
              <CountValue value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
