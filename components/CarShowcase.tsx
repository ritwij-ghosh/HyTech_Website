"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const phaseOne = [
  ["MOTOR", "4x AMK In-Wheel | 20,000 RPM", "left-[12%] top-[58%]"],
  ["ACCUMULATOR", "530V | 6.3 kWh | Custom LCO Pouch Cells", "right-[10%] top-[50%]"],
  ["AERO", "Full Undertray + Diffuser | Carbon Fiber", "left-[18%] top-[28%]"],
  ["SUSPENSION", "Quad Push-Rod Double Wishbone", "right-[16%] top-[28%]"]
];

const phaseTwo = [
  ["GEARBOX", "11.83:1 Reduction", "left-[13%] top-[55%]"],
  ["BMS", "126 Cell Voltages | 72 Temps", "right-[12%] top-[47%]"],
  ["SENSORS", "30 Analog + 7 SPI + 28 Inverter Signals", "left-[14%] top-[26%]"],
  ["ETHERNET", "Ethernet-Capable Sensor Suite", "right-[17%] top-[26%]"]
];

const montage = [
  "https://hytechracing.gatech.edu/images/2019/2019_mechanical_2.jpg",
  "https://hytechracing.gatech.edu/images/2021/2021_HT05_BMS_small.jpg",
  "https://hytechracing.gatech.edu/images/2023/2023_HT07_Front_Aero.png"
];

function SpecLabel({ item, index }: { item: string[]; index: number }) {
  return (
    <motion.div
      className={`absolute hidden max-w-[230px] border border-white/10 bg-black/55 p-3 backdrop-blur-md md:block ${item[2]}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ delay: index * 0.15 }}
    >
      <div className="font-mono text-[9px] tracking-[0.18em] text-cyan-electric">{item[0]}</div>
      <div className="mt-1 font-mono text-xs text-ink">{item[1]}</div>
      <div className="mt-3 h-px w-24 bg-volt/70" />
    </motion.div>
  );
}

export default function CarShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !sectionRef.current || !pinRef.current) return;
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=300%",
      pin: pinRef.current,
      scrub: 1,
      onUpdate: (self) => setPhase(self.progress < 0.33 ? 0 : self.progress < 0.66 ? 1 : 2)
    });
    return () => trigger.kill();
  }, []);

  const labels = phase === 0 ? phaseOne : phaseTwo;

  return (
    <section id="machine" ref={sectionRef} className="relative h-[300vh] bg-background">
      <div ref={pinRef} className="relative flex min-h-screen items-center overflow-hidden py-24">
        <div className={`absolute inset-0 transition-opacity duration-700 ${phase === 2 ? "opacity-100" : "opacity-40"}`}>
          <div className="absolute inset-0 grid-overlay" />
          <div className="absolute inset-x-0 top-0 h-12 carbon-divider" />
        </div>
        <div className="relative mx-auto h-full w-full max-w-7xl px-4 md:px-8">
          <AnimatePresence mode="wait">
            {phase < 2 ? (
              <motion.div
                key={`phase-${phase}`}
                className="absolute left-4 top-24 z-20 md:left-8"
                initial={{ opacity: 0, x: -36 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -36 }}
              >
                <div className="font-mono text-[10px] tracking-[0.2em] text-cyan-electric">THE MACHINE</div>
                <h2 className="mt-3 font-display text-5xl font-black text-ink md:text-7xl">HT09 — 2025</h2>
                <p className="mt-3 font-mono text-sm text-muted">Joint-Best Finish. 3rd Overall.</p>
              </motion.div>
            ) : (
              <motion.div
                key="explode"
                className="absolute left-4 top-24 z-20 md:left-8"
                initial={{ opacity: 0, x: -36 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -36 }}
              >
                <div className="font-mono text-[10px] tracking-[0.2em] text-cyan-electric">CLEAN-SHEET ENGINEERING</div>
                <h2 className="mt-3 max-w-3xl font-display text-5xl font-black text-volt md:text-7xl">
                  BUILT FROM SCRATCH — EVERY SEASON
                </h2>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className="thermal-scan absolute left-1/2 top-1/2 w-[92vw] max-w-5xl -translate-x-1/2 -translate-y-1/2"
            animate={{
              x: phase === 1 ? 60 : 0,
              rotate: phase === 1 ? -2 : 0,
              scale: phase === 2 ? 1.08 : 1,
              opacity: phase === 2 ? 0.36 : 1
            }}
            transition={{ duration: 0.75, ease: "easeOut" }}
          >
            <Image
              src="https://hytechracing.gatech.edu/images/2023/2023_HT07_Front_Aero.png"
              alt="HyTech Racing formula electric car carbon aero close-up"
              width={960}
              height={640}
              priority
              className="mx-auto w-full rounded-md border border-white/10 object-cover shadow-[0_0_90px_rgba(126,182,200,.12)]"
            />
            <div className="absolute inset-0 rounded-md bg-gradient-to-r from-background/40 via-transparent to-background/35" />
          </motion.div>

          <AnimatePresence>
            {phase < 2 &&
              labels.map((item, index) => <SpecLabel key={item[0]} item={item} index={index} />)}
          </AnimatePresence>

          {phase === 2 && (
            <motion.div
              className="absolute bottom-12 left-1/2 grid w-[92vw] max-w-4xl -translate-x-1/2 grid-cols-3 gap-3 md:bottom-16 md:gap-5"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.12 } }, hidden: {} }}
            >
              {montage.map((src, index) => (
                <motion.div
                  key={src}
                  variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } }}
                  className="relative aspect-[4/3] overflow-hidden rounded-md border border-white/10 bg-surface"
                >
                  <Image src={src} alt={`HyTech engineering montage ${index + 1}`} fill sizes="30vw" className="object-cover" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
