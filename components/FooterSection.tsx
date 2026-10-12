import { Facebook, Instagram, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const links = [
  ["Sponsors", "/sponsors"],
  ["Team", "/team"],
  ["Cars", "/cars"],
  ["Donate", "/donate"],
  ["Contact", "/contact"]
] as const;

export default function FooterSection() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#070708] py-16">
      <div className="absolute inset-0 animate-grid-drift opacity-[0.04] grid-overlay" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-3 md:px-8">
        <div>
          <Link href="/" aria-label="HyTech Racing" className="inline-flex">
            <Image src="/hytech-logo-wordmark.png" alt="HyTech Racing" width={2765} height={772} className="h-20 w-auto" />
          </Link>
          <p className="mt-4 text-sm text-muted">Georgia Institute of Technology</p>
          <p className="mt-2 font-mono text-xs text-gt-gold">Formula SAE Electric — Est. 2012</p>
        </div>
        <div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-3 font-mono text-xs tracking-[0.14em] text-muted">
            {links.map(([label, href]) => (
              <Link key={href} href={href} className="hover:text-volt">
                {label.toUpperCase()}
              </Link>
            ))}
          </nav>
          <div className="mt-7 flex gap-3">
            <a
              href="https://www.facebook.com/HyTechRacing/"
              aria-label="Facebook"
              className="rounded-full border border-white/10 p-2 text-muted hover:border-volt hover:text-volt"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href="https://www.instagram.com/hytech.racing/"
              aria-label="Instagram"
              className="rounded-full border border-white/10 p-2 text-muted hover:border-volt hover:text-volt"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a href="mailto:gthytech@gmail.com" aria-label="Email" className="rounded-full border border-white/10 p-2 text-muted hover:border-volt hover:text-volt">
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div className="md:text-right">
          <a href="mailto:gthytech@gmail.com" className="font-mono text-sm text-cyan-electric hover:text-volt">
            gthytech@gmail.com
          </a>
          <div className="mt-4">
            <a href="https://linktr.ee/HyTechRacing" className="font-display text-xl font-black text-ink hover:text-volt" target="_blank" rel="noopener noreferrer">
              Interested in joining?
            </a>
          </div>
          <p className="mt-4 font-mono text-xs text-muted">575 14th St NW, Atlanta, GA 30318</p>
        </div>
      </div>
      <div className="relative mx-auto mt-12 flex max-w-7xl flex-col gap-3 border-t border-white/10 px-4 pt-5 font-mono text-xs text-muted md:flex-row md:justify-between md:px-8">
        <span>© 2026 HyTech Racing</span>
        <span className="italic text-volt">Designed to race. Built to engineer.</span>
      </div>
    </footer>
  );
}
