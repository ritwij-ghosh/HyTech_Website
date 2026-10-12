type PageHeaderProps = {
  eyebrow: string;
  title: string;
  lede?: string;
};

export default function PageHeader({ eyebrow, title, lede }: PageHeaderProps) {
  return (
    <header className="mx-auto max-w-7xl px-4 pt-28 md:px-8 md:pt-32">
      <p className="font-mono text-[10px] tracking-[0.24em] text-cyan-electric">{eyebrow}</p>
      <h1 className="mt-4 font-display text-5xl font-black text-ink md:text-7xl">{title}</h1>
      {lede ? <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted">{lede}</p> : null}
    </header>
  );
}
