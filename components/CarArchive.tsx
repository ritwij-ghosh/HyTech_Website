"use client";

import { useState } from "react";
import RemoteImage from "@/components/RemoteImage";
import RichParagraph from "@/components/RichParagraph";
import carsData from "@/data/cars.json";

type CarImage = {
  type: "image";
  src: string;
  alt: string;
  caption: string | null;
};

type CarHeading = { type: "heading"; text: string };
type CarParagraph = { type: "paragraph"; text: string; links: { href: string; label: string }[] };
type CarDetails = { type: "details"; title: string; groups: { label: string; items: string[] }[] };
type CarBlock = CarImage | CarHeading | CarParagraph | CarDetails;
type CarYear = { year: string; code: string | null; blocks: CarBlock[] };

const cars = carsData as CarYear[];

function isImage(block: CarBlock): block is CarImage {
  return block.type === "image";
}

function Gallery({ images }: { images: CarImage[] }) {
  if (images.length === 1) {
    const image = images[0];
    return (
      <figure>
        <div className="relative aspect-[16/9] overflow-hidden rounded-md border border-white/10 bg-black">
          <RemoteImage src={image.src} alt={image.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 1100px" />
        </div>
        {image.caption ? <figcaption className="mt-3 text-center text-sm text-muted">{image.caption}</figcaption> : null}
      </figure>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image, index) => (
        <figure key={`${image.src}-${index}`}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-white/10 bg-black">
            <RemoteImage src={image.src} alt={image.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 360px" />
          </div>
          {image.caption ? <figcaption className="mt-3 text-center text-sm text-muted">{image.caption}</figcaption> : null}
        </figure>
      ))}
    </div>
  );
}

function YearArticle({ car }: { car: CarYear }) {
  const groups: Array<{ type: "gallery"; images: CarImage[] } | CarHeading | CarParagraph | CarDetails> = [];
  let images: CarImage[] = [];
  let specTitle = "";

  const flush = () => {
    if (!images.length) return;
    groups.push({ type: "gallery", images });
    images = [];
  };

  car.blocks.forEach((block) => {
    if (isImage(block)) {
      const alt = block.alt === "HyTech Racing vehicle" && specTitle ? `${specTitle} photograph` : block.alt;
      images.push({ ...block, alt });
      return;
    }
    if (block.type === "details") specTitle = block.title;
    flush();
    groups.push(block);
  });
  flush();

  return (
    <article className="border-t border-white/10 py-14 first:border-t-0 first:pt-6">
      <h2 className="font-display text-4xl font-black text-volt md:text-6xl">
        {car.year}
        {car.code ? <span className="text-ink"> / {car.code}</span> : null}
      </h2>
      <div className="mt-8 space-y-8">
        {groups.map((block, index) => {
          if (block.type === "gallery") return <Gallery key={index} images={block.images} />;
          if (block.type === "heading") {
            return (
              <h3 key={index} className="font-display text-3xl font-black text-ink">
                {block.text}
              </h3>
            );
          }
          if (block.type === "paragraph") {
            return <RichParagraph key={index} text={block.text} links={block.links} className="max-w-3xl text-lg leading-relaxed text-muted" />;
          }
          return (
            <div key={index} className="rounded-md border border-white/[0.06] bg-surface/80 p-6 md:p-8">
              <h3 className="font-display text-2xl font-black text-volt">{block.title}</h3>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {block.groups.map((group) => (
                  <div key={group.label || group.items[0]}>
                    {group.label ? <h4 className="font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-electric">{group.label}</h4> : null}
                    <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-ink">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

export default function CarArchive() {
  const [view, setView] = useState<"current" | "past">("current");
  const current = cars[0];
  const past = cars.slice(1);
  const tabs = [
    ["current", current ? `${current.year}${current.code ? ` / ${current.code}` : ""}` : "2025"],
    ["past", "Past Cars"]
  ] as const;

  return (
    <section id="archive" className="bg-background pb-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div role="tablist" aria-label="Car years" className="sticky top-20 z-30 flex border-b border-white/10 bg-background/95 backdrop-blur-xl">
          {tabs.map(([id, label]) => {
            const selected = view === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                id={`cars-tab-${id}`}
                aria-selected={selected}
                aria-controls={`cars-panel-${id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setView(id)}
                className={`border-b-2 px-5 py-4 font-mono text-[10px] tracking-[0.16em] ${
                  selected ? "border-volt text-volt" : "border-transparent text-muted hover:text-ink"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <div role="tabpanel" id="cars-panel-current" aria-labelledby="cars-tab-current" hidden={view !== "current"}>
          {view === "current" && current ? <YearArticle car={current} /> : null}
        </div>
        <div role="tabpanel" id="cars-panel-past" aria-labelledby="cars-tab-past" hidden={view !== "past"}>
          {view === "past"
            ? past.map((car) => <YearArticle key={car.year} car={car} />)
            : null}
        </div>
      </div>
    </section>
  );
}
