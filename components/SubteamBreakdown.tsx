"use client";

import { BatteryCharging, Cable, Cpu, Gauge, RadioTower, Wrench, Zap } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

const IconSet = [Zap, Cable, Cpu, RadioTower, Gauge, Wrench, BatteryCharging];

const panels = [
  {
    name: "HIGH VOLTAGE CONTROLS",
    copy: "The heart of the machine. Our custom HV system manages 530V at 80kW peak, with precharge/discharge controls and a clean-sheet BMS management system.",
    achievement: "Custom LTC6811 | 126 cells monitored"
  },
  {
    name: "ELECTRIC DRIVES",
    copy: "Four AMK motors spinning at 20,000 RPM. This season moved from hub to in-wheel architecture, improving aero and enabling creative cooling solutions.",
    achievement: "4x AMK A2370DD | KW26-S5-FSE-4Q Inverter"
  },
  {
    name: "SOFTWARE & CONTROLS",
    copy: "Torque vectoring algorithms, launch control, and autonomous-ready architecture. Two main circuit boards replaced the previous multi-board complexity.",
    achievement: "Ethernet-capable | CAN Bus Network"
  },
  {
    name: "DATA OPERATIONS",
    copy: "Live telemetry from 65+ sensor channels feeds real-time decisions, from AWS-hosted dashboards to on-pit-wall analysis.",
    achievement: "30 Analog | 7 SPI | 28 Inverter signals"
  },
  {
    name: "AERODYNAMICS",
    copy: "Compound-curvature carbon fiber. HT09's first full undertray and diffuser generate serious downforce without a drag penalty.",
    achievement: "Carbon Fiber | 4.22 CI*A simulated"
  },
  {
    name: "POWERTRAIN",
    copy: "11.83:1 reduction gearbox. Quad AWD. Custom-designed gearboxes manufactured in-house using cutting-edge simulation software.",
    achievement: "77 mph top speed | 1.15g longitudinal"
  },
  {
    name: "PCB & LOW VOLTAGE",
    copy: "Every board is designed and assembled by students, from Teensy-powered ECUs to custom BMS boards and dashboard PCBs.",
    achievement: "Eagle CAD -> In-House Assembly"
  }
];

export default function SubteamBreakdown() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !rootRef.current || !trackRef.current) return;
    const panels = gsap.utils.toArray<HTMLElement>(".subteam-panel");
    const distance = () => (trackRef.current ? trackRef.current.scrollWidth - window.innerWidth : 0);
    const tween = gsap.to(trackRef.current, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: rootRef.current,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        end: () => `+=${distance()}`
      }
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section id="breakdown" ref={rootRef} className="relative min-h-screen overflow-hidden bg-background py-20">
      <div className="absolute inset-0 grid-overlay opacity-50" />
      <div ref={trackRef} className="relative flex h-[86vh] w-max will-change-transform">
        {panels.map((panel, index) => {
          const Icon = IconSet[index];
          return (
            <article key={panel.name} className="subteam-panel flex w-screen shrink-0 items-center px-4 md:px-10">
              <div className="relative mx-auto flex h-[72vh] w-full max-w-5xl flex-col justify-between overflow-hidden rounded-md border border-white/[0.06] bg-surface/88 p-7 scanline md:p-12">
                <div className="absolute left-0 top-0 h-px w-full overflow-hidden bg-white/10">
                  <span className="block h-px w-1/2 animate-[shimmer_2.2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-volt to-transparent" />
                </div>
                <Icon className="h-12 w-12 text-volt drop-shadow-[0_0_14px_rgba(214,180,92,.36)]" />
                <div>
                  <div className="font-mono text-[10px] tracking-[0.24em] text-cyan-electric">0{index + 1} / SUBSYSTEM</div>
                  <h2 className="mt-4 max-w-3xl font-display text-4xl font-black text-ink md:text-7xl">{panel.name}</h2>
                  <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">{panel.copy}</p>
                </div>
                <div className="border-l-2 border-volt pl-4 font-mono text-sm text-volt md:text-base">-&gt; {panel.achievement}</div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
