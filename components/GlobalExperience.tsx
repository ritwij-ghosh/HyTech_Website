"use client";

import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState } from "react";

const labels = [
  ["hero", "01 / IGNITION"],
  ["telemetry", "02 / TELEMETRY"],
  ["machine", "03 / MACHINE"],
  ["breakdown", "04 / BREAKDOWN"],
  ["electronics", "05 / ELECTRONICS"],
  ["data", "06 / RACE DATA"],
  ["history", "07 / HISTORY"],
  ["team", "08 / ENGINEERS"],
  ["results", "09 / RESULTS"],
  ["sponsors", "10 / PIT CREW"],
  ["contact", "11 / CONTACT"]
];

export default function GlobalExperience() {
  const [label, setLabel] = useState(labels[0][1]);
  const [boot, setBoot] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) {
      const lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
      });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
      return () => {
        lenis.destroy();
      };
    }
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setBoot((value) => Math.min(100, value + 4));
    }, 55);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const sections = labels
      .map(([id, title]) => [document.getElementById(id), title] as const)
      .filter(([node]) => Boolean(node));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) {
          const next = labels.find(([id]) => id === visible.target.id)?.[1];
          if (next) setLabel(next);
        }
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: 0.01 }
    );
    sections.forEach(([node]) => node && observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const dot = document.getElementById("cursor-dot");
    const ring = document.getElementById("cursor-ring");
    const move = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      if (dot) dot.style.transform = `translate3d(${clientX - 3}px, ${clientY - 3}px, 0)`;
      if (ring) ring.style.transform = `translate3d(${clientX - 18}px, ${clientY - 18}px, 0)`;
    };
    const hover = (event: Event) => {
      const isInteractive = (event.target as HTMLElement).closest("a, button, [role='button']");
      ring?.classList.toggle("scale-150", Boolean(isInteractive));
      dot?.classList.toggle("rounded-none", Boolean(isInteractive));
      dot?.classList.toggle("rotate-45", Boolean(isInteractive));
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", hover);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", hover);
    };
  }, []);

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        style={{ animation: "bootSlide 1.8s cubic-bezier(.78,0,.22,1) forwards" }}
      >
        <div className="font-display text-2xl font-black tracking-[0.22em] text-ink">HYTECH RACING</div>
        <div className="mt-7 h-px w-72 overflow-hidden bg-white/10">
          <div className="h-full bg-volt" style={{ width: `${boot}%` }} />
        </div>
        <div className="mt-3 font-mono text-[10px] tracking-[0.22em] text-cyan-electric">
          SYSTEM BOOT... {String(boot).padStart(2, "0")}%
        </div>
      </div>
      <div className="pointer-events-none fixed left-4 top-24 z-40 font-mono text-[9px] tracking-[0.22em] text-volt/80 md:left-8">
        {label}
      </div>
      <div id="cursor-ring" className="pointer-events-none fixed left-0 top-0 z-[110] hidden h-9 w-9 rounded-full border border-volt/35 transition-transform duration-150 md:block" />
      <div id="cursor-dot" className="pointer-events-none fixed left-0 top-0 z-[111] hidden h-1.5 w-1.5 rounded-full bg-volt transition-all duration-150 md:block" />
      <div className="pointer-events-none fixed bottom-5 right-5 z-40 hidden h-24 w-7 border border-white/10 bg-black/30 p-1 backdrop-blur md:block">
        <div className="relative h-full w-full overflow-hidden bg-white/[0.04]">
          <div className="absolute bottom-0 left-0 right-0 bg-volt shadow-volt animate-meter-fill" />
        </div>
        <span className="absolute -left-10 top-9 rotate-[-90deg] font-mono text-[8px] tracking-[0.18em] text-muted">
          VOLTAGE
        </span>
      </div>
    </>
  );
}
