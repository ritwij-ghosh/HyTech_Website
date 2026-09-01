"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const cars = [
  {
    car: "HT03B",
    year: "2018",
    result: "1st Formula Hybrid",
    innovation: "Custom BMS and high-voltage controls matured into a winning package.",
    image: "https://hytechracing.gatech.edu/images/2018/2018_FH_small.jpg"
  },
  {
    car: "HT04",
    year: "2019",
    result: "1st Formula Hybrid",
    innovation: "Major mass reduction and serviceability upgrades across the drivetrain.",
    image: "https://hytechracing.gatech.edu/images/2019/2019_fh_endurance_small.jpg"
  },
  {
    car: "HT05",
    year: "2021",
    result: "2nd FSAE Nevada",
    innovation: "First aero package plus AWS-backed live telemetry.",
    image: "https://hytechracing.gatech.edu/images/2021/2021_endurance_1_small.jpg"
  },
  {
    car: "HT06",
    year: "2022",
    result: "3rd FSAE Michigan",
    innovation: "Lightweight, reliable vehicle architecture with battery pack cooling breakthroughs.",
    image: "https://hytechracing.gatech.edu/images/2022/2022_HT06_corners_small.jpeg"
  },
  {
    car: "HT07",
    year: "2023",
    result: "North American Acceleration Record",
    innovation: "All-wheel-drive architecture and sophisticated torque vectoring.",
    image: "https://hytechracing.gatech.edu/images/2023/2023_HT07_Rear_Motor.png"
  },
  {
    car: "HT08",
    year: "2024",
    result: "4th Overall",
    innovation: "Live data acquisition and lower-mass chassis development.",
    image: "https://hytechracing.gatech.edu/images/2023/2023_HT07_Gearbox.png"
  },
  {
    car: "HT09",
    year: "2025",
    result: "3rd Overall",
    innovation: "In-wheel motors, full undertray, diffuser, and simplified two-board electrical system.",
    image: "https://hytechracing.gatech.edu/images/2023/2023_HT07_Front_Aero.png"
  }
];

export default function CarTimeline() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const sparkY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="history" ref={ref} className="relative overflow-hidden bg-background py-24 md:py-32">
      <div className="absolute inset-0 grid-overlay opacity-30" />
      <div className="relative mx-auto max-w-6xl px-4 md:px-8">
        <div className="text-center">
          <div className="font-mono text-[10px] tracking-[0.24em] text-cyan-electric">CAR HISTORY</div>
          <h2 className="mt-4 font-display text-5xl font-black text-ink md:text-7xl">EVOLUTION LINE</h2>
        </div>
        <div className="relative mt-16">
          <div className="absolute left-4 top-0 h-full w-px bg-white/10 md:left-1/2" />
          <motion.div className="absolute left-4 top-0 h-full w-0.5 origin-top bg-volt shadow-volt md:left-1/2" style={{ scaleY }} />
          <motion.div className="absolute left-[10px] h-3 w-3 rounded-full bg-volt shadow-volt md:left-[calc(50%-5px)]" style={{ top: sparkY }} />
          <div className="grid gap-12">
            {cars.map((car, index) => {
              const left = index % 2 === 0;
              return (
                <motion.article
                  key={car.car}
                  initial={{ opacity: 0, x: left ? -48 : 48 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`relative ml-11 md:ml-0 md:w-[45%] ${left ? "md:mr-auto" : "md:ml-auto"}`}
                >
                  <span className="absolute -left-[34px] top-8 h-4 w-4 rounded-full border border-volt bg-background shadow-volt animate-pulse md:hidden" />
                  <span
                    className="absolute top-8 hidden h-4 w-4 rounded-full border border-volt bg-background shadow-volt animate-pulse md:block"
                    style={left ? { right: "calc(-11.111% - 8px)" } : { left: "calc(-11.111% - 8px)" }}
                  />
                  <div className="overflow-hidden rounded-md border border-white/[0.06] bg-surface/80">
                    <div className="relative h-44">
                      <Image src={car.image} alt={`${car.car} HyTech Racing car`} fill sizes="(max-width: 768px) 90vw, 45vw" className="object-cover" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-display text-3xl font-black text-volt">{car.car}</h3>
                        <span className="font-mono text-sm text-cyan-electric">{car.year}</span>
                      </div>
                      <div className="mt-3 font-display text-lg font-bold text-ink">{car.result}</div>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{car.innovation}</p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
