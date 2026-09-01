"use client";

import { motion } from "framer-motion";
import { sectionReveal, staggerContainer } from "@/lib/animations";

const roles = [
  ["Team President", "Aligns people, funding, and race-season execution."],
  ["Chief Engineer", "Owns vehicle architecture and subsystem integration."],
  ["Aerodynamics Lead", "Turns carbon fiber geometry into measurable downforce."],
  ["Composites Lead", "Builds lightweight, stiff structures from layup to cure."],
  ["Chassis Lead", "Packages safety, stiffness, and serviceability into the frame."],
  ["Controls Lead", "Coordinates vehicle state, safety logic, and torque requests."],
  ["Electric Drives Lead", "Makes four in-wheel motors behave like one sharp tool."],
  ["Software Lead", "Ships launch, telemetry, and driver-facing embedded systems."],
  ["Data Operations Lead", "Transforms sensor channels into race-day decisions."],
  ["High Voltage Lead", "Keeps accumulator, isolation, and tractive systems race-ready."],
  ["Low Voltage Lead", "Designs ECUs, harnesses, dashboards, and board validation."],
  ["Suspension Lead", "Tunes contact patch behavior through geometry and damping."],
  ["Powertrain Lead", "Owns gearboxes, cooling, and driveline reliability."],
  ["Manufacturing Lead", "Turns designs into precise, repeatable parts under deadline."]
];

const words = [
  "Torque Vectoring",
  "LiCoO2",
  "BMS",
  "CAN Bus",
  "Carbon Fiber",
  "FEA",
  "Push-Rod",
  "Accumulator",
  "Inverter",
  "Telemetry",
  "LTC6811",
  "Aero Map",
  "Ethernet",
  "Diffuser",
  "Skidpad",
  "DAQ"
];

export default function TeamSection() {
  return (
    <section id="team" className="relative overflow-hidden bg-background py-24 md:py-32">
      <div className="absolute inset-0 grid-overlay opacity-20" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer}>
          <motion.div variants={sectionReveal} className="font-mono text-[10px] tracking-[0.24em] text-cyan-electric">
            THE ENGINEERS
          </motion.div>
          <motion.h2 variants={sectionReveal} className="mt-4 font-display text-5xl font-black text-ink md:text-7xl">
            300+ ENGINEERS. ONE CAR.
          </motion.h2>
          <motion.p variants={sectionReveal} className="mt-5 max-w-2xl text-lg text-muted">
            Students across every discipline — from ECE and ME to CS and Industrial Design.
          </motion.p>
        </motion.div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {roles.map(([role, focus], index) => (
            <motion.article
              key={role}
              variants={sectionReveal}
              className="group rounded-md border border-white/[0.06] bg-surface/80 p-5 transition hover:-translate-y-1 hover:border-volt/50 hover:shadow-volt"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-volt/60 bg-black font-display text-lg font-black text-volt">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-electric">{role}</div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{focus}</p>
            </motion.article>
          ))}
        </motion.div>
        <div className="relative mt-12 h-56 overflow-hidden rounded-md border border-white/[0.06] bg-black/35">
          {words.map((word, index) => (
            <motion.span
              key={word}
              className="absolute font-mono text-xs uppercase tracking-[0.18em] text-white"
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 0.18 + (index % 5) * 0.12, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07 }}
              style={{
                left: `${(index * 23) % 88}%`,
                top: `${12 + ((index * 37) % 70)}%`
              }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
