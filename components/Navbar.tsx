"use client";

import { Menu, X, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const nav = [
  ["HOME", "#hero"],
  ["CARS", "#machine"],
  ["TEAM", "#team"],
  ["SPONSORS", "#sponsors"],
  ["DONATE", "#sponsors"]
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("HOME");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = nav
      .map(([label, href]) => [label, document.querySelector(href)] as const)
      .filter(([, node]) => Boolean(node));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) {
          const item = sections.find(([, node]) => node === visible.target);
          if (item) setActive(item[0]);
        }
      },
      { rootMargin: "-38% 0px -56% 0px", threshold: 0.01 }
    );
    sections.forEach(([, node]) => node && observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-white/10 bg-background/90 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link href="#hero" className="group flex items-center gap-2 font-display text-sm font-black tracking-[0.18em]">
          <Zap className="h-4 w-4 text-volt transition group-hover:drop-shadow-[0_0_10px_rgba(214,180,92,.65)]" />
          HYTECH RACING
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          {nav.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className={`group relative font-mono text-[10px] tracking-[0.18em] transition ${
                active === label ? "text-volt" : "text-muted hover:text-ink"
              }`}
            >
              {label}
              <span className="absolute -bottom-2 left-1/2 h-px w-full origin-center -translate-x-1/2 scale-x-0 bg-volt transition-transform group-hover:scale-x-100" />
            </Link>
          ))}
        </div>
        <button className="md:hidden" aria-label="Open navigation" onClick={() => setOpen(true)}>
          <Menu className="h-6 w-6 text-volt" />
        </button>
      </nav>
      <div
        className={`fixed bottom-0 right-0 top-0 z-50 w-72 border-l border-white/10 bg-background/95 p-6 backdrop-blur-xl transition-transform md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button className="ml-auto block" aria-label="Close navigation" onClick={() => setOpen(false)}>
          <X className="h-6 w-6 text-volt" />
        </button>
        <div className="mt-12 grid gap-6">
          {nav.map(([label, href]) => (
            <Link key={label} href={href} onClick={() => setOpen(false)} className="font-display text-xl text-ink">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
