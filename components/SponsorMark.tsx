import RemoteImage from "@/components/RemoteImage";

type SponsorMarkProps = {
  name: string;
  logo: string | null;
  href: string | null;
};

export default function SponsorMark({ name, logo, href }: SponsorMarkProps) {
  const onDark = Boolean(logo && /white/i.test(logo));
  const body = logo ? (
    <RemoteImage src={logo} alt={name} fill className="object-contain p-4" sizes="220px" />
  ) : (
    <span className="px-3 text-center font-display text-sm font-black tracking-[0.14em] text-[#1a1a1a]">{name}</span>
  );

  const className = `group relative flex h-28 items-center justify-center overflow-hidden rounded-md border border-white/10 ${
    onDark ? "bg-[#16161a]" : "bg-[#f3f0e8]"
  }`;

  if (!href) {
    return <div className={className}>{body}</div>;
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${className} transition hover:border-volt/70`} aria-label={name}>
      {body}
    </a>
  );
}
