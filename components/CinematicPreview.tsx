"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import styles from "./CinematicPreview.module.css";

const SHOTS = [
  { file: "01-dark-reveal", name: "The ambition", alt: "Generated photographic study of HyTech's number 204 car under dramatic garage lighting" },
  { file: "02-wind-tunnel", name: "The engineering", alt: "The same black, white and gold car in a dark wind tunnel with fine smoke trails" },
  { file: "03-track-pursuit", name: "The pursuit", alt: "Low external tracking shot concept of the number 204 car on a circuit at sunset" },
  { file: "04-pit-exit", name: "The people", alt: "The car entering a shadowed pit passage, rim-lit by the evening sun" },
];

/** Keyframe previsualization only. The production film needs generated moving footage. */
export default function CinematicPreview() {
  const root = useRef<HTMLElement>(null);
  const [chapter, setChapter] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      if (!root.current) return;
      const shots = root.current.querySelectorAll<HTMLElement>("[data-shot]");
      const intro = root.current.querySelector("[data-intro]");
      const engineering = root.current.querySelector("[data-engineering]");
      const outro = root.current.querySelector("[data-outro]");
      const rail = root.current.querySelector("[data-rail]");
      const timeline = gsap.timeline({ scrollTrigger: {
        trigger: root.current, start: "top top", end: "bottom bottom", scrub: .35,
        onUpdate: self => {
          const next = self.progress < .25 ? 0 : self.progress < .51 ? 1 : self.progress < .78 ? 2 : 3;
          setChapter(previous => previous === next ? previous : next);
          if (root.current) root.current.dataset.progress = self.progress.toFixed(3);
        },
      } });
      timeline.to(rail, { scaleX: 1, ease: "none", duration: 1 }, 0);
      shots.forEach((shot, index) => {
        const start = [0, .22, .48, .75][index];
        if (index) timeline.to(shot, { opacity: 1, duration: .065, ease: "power1.inOut" }, start);
        // Small framing changes are for pacing review, not a substitute for filmed camera motion.
        timeline.fromTo(shot.querySelector("img"), { scale: 1, xPercent: 0 },
          { scale: 1.035, xPercent: index === 2 ? -.6 : .4, duration: .3, ease: "none" }, start);
      });
      timeline.to(intro, { autoAlpha: 0, y: -18, duration: .06 }, .13)
        .to(engineering, { autoAlpha: 1, duration: .045 }, .29)
        .to(engineering, { autoAlpha: 0, duration: .04 }, .4)
        .to(outro, { autoAlpha: 1, y: 0, duration: .08 }, .82);
      return () => { timeline.scrollTrigger?.kill(); timeline.kill(); };
    }, root);
    return () => media.revert();
  }, []);

  function jumpToShot(index: number) {
    const section = root.current;
    if (!section) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      section.querySelectorAll("[data-shot]")[index]?.scrollIntoView({ behavior: "instant", block: "center" });
    } else {
      const start = section.getBoundingClientRect().top + window.scrollY;
      const travel = section.offsetHeight - window.innerHeight;
      window.scrollTo({ top: start + travel * [0, .32, .6, .9][index], behavior: "smooth" });
    }
  }

  return (
    <section ref={root} id="cinematic-study" className={styles.sequence} aria-label="Photographic keyframe scroll preview">
      <noscript><style>{"#cinematic-study { height:auto } #cinematic-study [data-stage] { position:relative;height:auto;min-height:100svh;padding-top:250px } #cinematic-study [data-shot] { position:relative;opacity:1;aspect-ratio:16/9 } #cinematic-study [data-controls], #cinematic-study [data-outro], #cinematic-study [data-engineering] { display:none }"}</style></noscript>
      <div className={styles.stage} data-stage>
        {SHOTS.map((shot, index) => (
          <figure className={styles.shot} key={shot.file} data-shot>
            {/* Native images keep the visual-study fallback usable without JavaScript. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/cinematic-v2/${shot.file}.webp`} alt={shot.alt} width={1672} height={941} fetchPriority={index === 0 ? "high" : "low"} />
            <figcaption>{String(index + 1).padStart(2, "0")} / {shot.name}</figcaption>
          </figure>
        ))}
        <div className={styles.shade} aria-hidden="true" />
        <div className={styles.intro} data-intro>
          <p className={styles.eyebrow}>GEORGIA TECH · FORMULA SAE ELECTRIC</p>
          <h1>To race is <em>not enough.</em></h1>
          <p className={styles.subline}>Engineered by students. Defined on track.</p>
        </div>
        <div className={styles.engineering} data-engineering aria-hidden="true">
          <p className={styles.eyebrow}>PRECISION, BEFORE PACE.</p>
          <p>Every detail.<br /><em>Everything to prove.</em></p>
        </div>
        <div className={styles.outro} data-outro>
          <p className={styles.eyebrow}>THE DRIVE IS OURS. THE JOURNEY IS SHARED.</p>
          <h2>Built together.<br /><em>Driven further.</em></h2>
          <a href="#sponsors">The names behind the car <ArrowDown size={15} /></a>
        </div>
        <div className={styles.controls} data-controls>
          <span className={styles.studyLabel}>VISUAL STUDY <span>STILL KEYFRAMES · V02</span></span>
          <div className={styles.chapters} role="group" aria-label="Preview scenes">
            {SHOTS.map((shot, index) => (
              <button key={shot.file} onClick={() => jumpToShot(index)} aria-label={`View ${shot.name}`} aria-pressed={chapter === index}>
                <span>0{index + 1}</span><b>{shot.name}</b>
              </button>
            ))}
          </div>
          <a href="#sponsors" className={styles.skip}>OUR PARTNERS <ArrowUpRight size={13} /></a>
        </div>
        <div className={styles.rail} aria-hidden="true"><span data-rail /></div>
      </div>
    </section>
  );
}
