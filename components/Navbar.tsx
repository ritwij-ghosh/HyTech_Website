"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const nav = [
  ["SPONSORS", "/sponsors"],
  ["TEAM", "/team"],
  ["CARS", "/cars"],
  ["DONATE", "/donate"],
  ["CONTACT", "/contact"]
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [pastHero, setPastHero] = useState(pathname !== "/");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (pathname !== "/") {
      setPastHero(true);
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const hero = document.getElementById("hero");
      // Change state only when the pinned film has completely cleared the nav.
      setPastHero(!hero || hero.getBoundingClientRect().bottom <= 96);
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [pathname]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className="pointer-events-none fixed left-0 right-0 top-0 z-50 px-4 pt-4 md:px-6 md:pt-6"
    >
      <nav
        className={`pointer-events-auto relative mx-auto flex h-16 max-w-7xl items-center justify-between rounded-lg border px-4 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-out md:px-6 ${
          pastHero
            ? "border-white/[0.11] bg-black/30 shadow-[0_18px_60px_rgba(0,0,0,.32),inset_0_1px_0_rgba(255,255,255,.08)] backdrop-blur-[30px] backdrop-saturate-[1.35]"
            : "border-transparent bg-transparent shadow-none backdrop-blur-none"
        }`}
        aria-label="Primary"
      >
        <Link href="/" aria-label="HyTech Racing" className="group flex items-center">
          <Image
            src="/hytech-logo-wordmark.png"
            alt="HyTech Racing"
            width={2765}
            height={772}
            priority
            className="h-[1.95rem] w-auto transition group-hover:drop-shadow-[0_0_12px_rgba(214,180,92,.55)]"
            style={{ height: "1.95rem", width: "auto" }}
          />
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          {nav.map(([label, href]) => {
            const active = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`group relative font-mono text-[10px] tracking-[0.18em] transition ${
                  active ? "text-volt" : "text-muted hover:text-ink"
                }`}
              >
                {label}
                <span className="absolute -bottom-2 left-1/2 h-px w-full origin-center -translate-x-1/2 scale-x-0 bg-volt transition-transform group-hover:scale-x-100" />
              </Link>
            );
          })}
        </div>
        <button className="md:hidden" aria-label="Open navigation" onClick={() => setOpen(true)}>
          <Menu className="h-6 w-6 text-volt" />
        </button>
      </nav>
      <div
        className={`fixed bottom-0 right-0 top-0 z-50 w-72 border-l border-white/10 bg-black/45 p-6 shadow-[-24px_0_80px_rgba(0,0,0,.35)] backdrop-blur-[30px] backdrop-saturate-[1.35] transition-transform md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button className="ml-auto block" aria-label="Close navigation" onClick={() => setOpen(false)}>
          <X className="h-6 w-6 text-volt" />
        </button>
        <div className="mt-12 grid gap-6">
          {nav.map(([label, href]) => (
            <Link key={label} href={href} onClick={() => setOpen(false)} className="font-display text-xl text-ink" aria-current={pathname === href ? "page" : undefined}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
