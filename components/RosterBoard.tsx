"use client";

import { useState } from "react";
import RemoteImage from "@/components/RemoteImage";
import rostersFile from "@/data/rosters.json";

type Person = {
  name: string;
  role: string;
  image: string | null;
};

function displayPerson(person: Person): Person {
  if (person.role) return person;
  const match = person.name.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (!match) return person;
  return { ...person, name: match[1], role: match[2] };
}

function People({ title, people }: { title: string; people: Person[] }) {
  if (!people.length) return null;
  const shown = people.map(displayPerson);
  const portraits = shown.some((person) => person.image);

  return (
    <section className="mt-12">
      <h3 className="font-display text-3xl font-black text-ink">{title}</h3>
      {portraits ? (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {shown.map((person, index) => (
            <article key={`${person.name}-${person.role}-${index}`} className="overflow-hidden rounded-md border border-white/[0.06] bg-surface/80">
              <div className="relative aspect-square bg-black">
                {person.image ? (
                  <RemoteImage src={person.image} alt="" fill className="object-cover" sizes="180px" />
                ) : (
                  <div className="grid h-full place-items-center font-display text-3xl font-black text-volt">
                    {person.name
                      .split(" ")
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")}
                  </div>
                )}
              </div>
              <div className="p-3">
                <h4 className="font-display text-sm font-bold text-ink">{person.name}</h4>
                {person.role ? <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-cyan-electric">{person.role}</p> : null}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((person, index) => (
            <li key={`${person.name}-${person.role}-${index}`} className="rounded-md border border-white/[0.06] bg-surface/80 px-4 py-3">
              <div className="font-display font-bold text-ink">{person.name}</div>
              {person.role ? <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-cyan-electric">{person.role}</div> : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function RosterBoard() {
  const rosters = rostersFile.rosters;
  const [active, setActive] = useState(rosters[0]?.id ?? "");
  const roster = rosters.find((item) => item.id === active) ?? rosters[0];

  return (
    <section id="roster" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <p className="font-mono text-[10px] tracking-[0.24em] text-cyan-electric">ROSTER</p>
        <h2 className="mt-4 font-display text-5xl font-black text-ink md:text-6xl">CURRENT AND ARCHIVED</h2>
        <div
          role="tablist"
          aria-label="Roster years"
          className="sticky top-20 z-30 -mx-4 mt-10 flex gap-1 overflow-x-auto border-b border-white/10 bg-background/95 px-4 backdrop-blur-xl md:mx-0 md:px-0"
          onKeyDown={(event) => {
            const index = rosters.findIndex((item) => item.id === roster.id);
            if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
            event.preventDefault();
            const next = event.key === "ArrowRight" ? (index + 1) % rosters.length : (index - 1 + rosters.length) % rosters.length;
            setActive(rosters[next].id);
          }}
        >
          {rosters.map((item) => {
            const selected = item.id === roster.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`roster-tab-${item.id}`}
                aria-selected={selected}
                aria-controls={`roster-panel-${item.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(item.id)}
                className={`shrink-0 border-b-2 px-3 py-3 font-mono text-[10px] tracking-[0.14em] ${
                  selected ? "border-volt text-volt" : "border-transparent text-muted hover:text-ink"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <div role="tabpanel" id={`roster-panel-${roster.id}`} aria-labelledby={`roster-tab-${roster.id}`} className="pt-4">
          <p className="font-mono text-xs tracking-[0.16em] text-muted">{roster.members.length} TEAM MEMBERS</p>
          <People title="Team Leadership" people={roster.leadership} />
          <People title="Subteam Leads" people={roster.leads} />
          <People title={roster.advisors.length > 1 ? "Faculty Advisors" : "Faculty Advisor"} people={roster.advisors} />
          {roster.members.length ? (
            <section className="mt-12">
              <h3 className="font-display text-3xl font-black text-ink">Team Members</h3>
              <ul className="mt-6 columns-1 gap-x-8 sm:columns-2 lg:columns-3">
                {roster.members.map((name, index) => (
                  <li key={`${name}-${index}`} className="break-inside-avoid border-b border-white/[0.06] py-2 text-sm text-ink">
                    {name}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>
    </section>
  );
}
