"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "./HeroSection.module.css";

const FRAME_COUNT = 180;
const SEQUENCE_VERSION = "v3";
const CHAPTERS = ["Launch", "Commitment", "Rotation", "Flat out"];
const CHAPTER_CUTS = [.22, .48, .72];
const MAX_COAST_FRAMES = 5;
const COAST_DURATION = .34;

/** A small decoded-frame cache: the browser never holds the whole film in RAM. */
function createSequence(canvas: HTMLCanvasElement, mobile: boolean, onReady: () => void, onFallback: () => void) {
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) return null;
  const cache = new Map<number, ImageBitmap>();
  const pending = new Map<number, AbortController>();
  const failed = new Set<number>();
  const limit = mobile ? 10 : 12;
  const sourceWidth = mobile ? 540 : 1280;
  const sourceHeight = mobile ? 960 : 720;
  let target = 0;
  let direction = 1;
  let disposed = false;
  let started = false;
  let width = 1;
  let height = 1;
  let drawn = -1;
  let inView = true;

  function draw() {
    if (disposed || !inView || !cache.size || !context) return;
    let closest = target;
    if (!cache.has(closest)) {
      closest = [...cache.keys()].reduce((a, b) => Math.abs(a - target) < Math.abs(b - target) ? a : b);
    }
    if (drawn === closest) return;
    const bitmap = cache.get(closest)!;
    const scale = Math.max(width / bitmap.width, height / bitmap.height);
    const w = bitmap.width * scale;
    const h = bitmap.height * scale;
    context.drawImage(bitmap, (width - w) / 2, (height - h) / 2, w, h);
    drawn = closest;
    canvas.dataset.frame = String(closest);
    if (!started) { started = true; onReady(); }
  }

  function trim() {
    const wanted = new Set(wantedFrames());
    while (cache.size > limit) {
      const candidates = [...cache.keys()].filter(frame => !wanted.has(frame));
      const pool = candidates.length ? candidates : [...cache.keys()];
      const farthest = pool.sort((a, b) => Math.abs(b - target) - Math.abs(a - target))[0];
      cache.get(farthest)?.close();
      cache.delete(farthest);
    }
  }

  function wantedFrames() {
    const wanted = [target];
    const ahead = Math.ceil((limit - 1) * .75);
    const behind = limit - 1 - ahead;
    for (let i = 1; i <= ahead; i++) wanted.push(target + i * direction);
    for (let i = 1; i <= behind; i++) wanted.push(target - i * direction);
    return wanted.filter(frame => frame >= 0 && frame < FRAME_COUNT);
  }

  function pump() {
    if (disposed || !inView) return;
    for (const frame of wantedFrames()) {
      if (pending.size >= 4) break;
      if (cache.has(frame) || pending.has(frame) || failed.has(frame)) continue;
      const controller = new AbortController();
      pending.set(frame, controller);
      const folder = mobile ? "mobile" : "desktop";
      fetch(`/cinematic-veo/frames/${folder}/${String(frame).padStart(4, "0")}.webp?v=${SEQUENCE_VERSION}`, { signal: controller.signal })
        .then(response => { if (!response.ok) throw new Error("Frame unavailable"); return response.blob(); })
        .then(blob => createImageBitmap(blob))
        .then(bitmap => {
          if (disposed) { bitmap.close(); return; }
          cache.set(frame, bitmap);
          trim();
          draw();
        })
        .catch(error => {
          if (error.name !== "AbortError") {
            failed.add(frame);
            if (frame === 0 && !started && !disposed) onFallback();
          }
        })
        .finally(() => { pending.delete(frame); pump(); });
    }
  }

  const resize = () => {
    const ratio = Math.min(1, sourceWidth / canvas.clientWidth, sourceHeight / canvas.clientHeight);
    width = Math.round(canvas.clientWidth * ratio);
    height = Math.round(canvas.clientHeight * ratio);
    canvas.width = width;
    canvas.height = height;
    drawn = -1;
    draw();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();
  pump();
  return {
    seek(progress: number) {
      const nextTarget = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(progress * (FRAME_COUNT - 1))));
      if (nextTarget !== target) direction = Math.sign(nextTarget - target);
      target = nextTarget;
      // Prioritize a fast scroll jump instead of completing obsolete requests.
      pending.forEach((controller, frame) => {
        if (Math.abs(frame - target) > limit) controller.abort();
      });
      draw();
      pump();
    },
    visible(value: boolean) {
      inView = value;
      if (value) { draw(); pump(); }
      else pending.forEach(controller => controller.abort());
    },
    destroy() {
      disposed = true;
      observer.disconnect();
      pending.forEach(controller => controller.abort());
      cache.forEach(bitmap => bitmap.close());
      cache.clear();
    }
  };
}

export default function HeroSection() {
  const wrapper = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const opening = useRef<HTMLDivElement>(null);
  const engineering = useRef<HTMLDivElement>(null);
  const closing = useRef<HTMLDivElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const progressBar = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);
  const [chapter, setChapter] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [staticFallback, setStaticFallback] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({ mobile: "(max-width: 767px)", desktop: "(min-width: 768px)", reduced: "(prefers-reduced-motion: reduce)" }, context => {
      if (!canvas.current || !wrapper.current) return;
      const isReduced = Boolean(context.conditions?.reduced) || staticFallback || typeof createImageBitmap === "undefined";
      setReduced(isReduced);
      setReady(false);
      if (isReduced) return;
      const sequence = createSequence(canvas.current, Boolean(context.conditions?.mobile), () => setReady(true), () => setStaticFallback(true));
      if (!sequence) return;
      const state = { progress: 0 };
      const playhead = { progress: 0 };
      let coast: gsap.core.Tween | null = null;
      let playheadReady = false;
      let activeChapter = 0;
      const driveSequence = (progress: number) => {
        const next = Math.min(1, Math.max(0, progress));
        if (!playheadReady) {
          playheadReady = true;
          playhead.progress = next;
          sequence.seek(next);
          return;
        }

        const crossesChapter = CHAPTER_CUTS.some(cut =>
          (playhead.progress < cut && next >= cut) || (playhead.progress > cut && next <= cut)
        );
        if (crossesChapter || next === 0 || next === 1) {
          coast?.kill();
          playhead.progress = next;
          sequence.seek(next);
          return;
        }

        // Keep the film close to the user's hand, then let the final few frames
        // ease into place after wheel or trackpad input stops.
        const maxLag = MAX_COAST_FRAMES / (FRAME_COUNT - 1);
        const gap = next - playhead.progress;
        if (Math.abs(gap) > maxLag) {
          playhead.progress = next - Math.sign(gap) * maxLag;
          sequence.seek(playhead.progress);
        }
        coast?.kill();
        coast = gsap.to(playhead, {
          progress: next,
          duration: COAST_DURATION,
          ease: "power3.out",
          overwrite: true,
          onUpdate: () => sequence.seek(playhead.progress),
        });
      };
      const update = () => {
        const p = state.progress;
        const chapterIndex = p < .22 ? 0 : p < .48 ? 1 : p < .72 ? 2 : 3;
        if (chapterIndex !== activeChapter) { activeChapter = chapterIndex; setChapter(chapterIndex); }
        if (progressBar.current) progressBar.current.style.transform = `scaleX(${p})`;
      };
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper.current,
          start: "top top",
          end: "bottom bottom",
          scrub: .3,
          invalidateOnRefresh: true,
          onUpdate: self => driveSequence(self.progress),
        },
      });
      timeline.to(state, { progress: 1, duration: 1, ease: "none", onUpdate: update }, 0)
        .to(opening.current, { autoAlpha: 0, y: -30, duration: .075, ease: "power1.in" }, .11)
        .fromTo(engineering.current, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: .055 }, .38)
        .to(engineering.current, { autoAlpha: 0, y: -12, duration: .05 }, .49)
        .to(veil.current, { opacity: .78, duration: .12, ease: "power1.inOut" }, .84)
        .fromTo(closing.current, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: .075 }, .87)
        .to(veil.current, { opacity: 1, duration: .055, ease: "power1.in" }, .945);
      const visibility = new IntersectionObserver(([entry]) => sequence.visible(entry.isIntersecting));
      visibility.observe(wrapper.current);
      return () => { visibility.disconnect(); coast?.kill(); timeline.scrollTrigger?.kill(); timeline.kill(); sequence.destroy(); };
    });
    return () => media.revert();
  }, [staticFallback]);

  return (
    <section ref={wrapper} id="hero" className={`${styles.sequence} ${reduced ? styles.reduced : ""}`} aria-label="HyTech Racing number 204 in a cinematic track pursuit">
      <noscript><style>{"#hero { height: 100svh; }"}</style></noscript>
      <div className={styles.stage}>
        <picture className={styles.poster}>
          <source media="(max-width: 767px)" srcSet={`/cinematic-veo/poster-mobile.webp?v=${SEQUENCE_VERSION}`} />
          {/* Native picture provides a zero-JavaScript, reduced-motion and load-failure fallback. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/cinematic-veo/poster.webp?v=${SEQUENCE_VERSION}`} alt="HyTech's black, white and gold number 204 electric race car moving at speed on a circuit" fetchPriority="high" />
        </picture>
        <canvas ref={canvas} className={`${styles.canvas} ${ready && !reduced ? styles.ready : ""}`} aria-hidden="true" />
        <div className={styles.shade} aria-hidden="true" />
        <div ref={veil} className={styles.exitVeil} aria-hidden="true" />

        <div ref={opening} className={styles.opening}>
          <p className={styles.eyebrow}><span /> GEORGIA TECH · FORMULA SAE ELECTRIC</p>
          <h1>To race is<br /><em>not enough.</em></h1>
          <p className={styles.intro}>Engineered by students.<br />Defined on track.</p>
        </div>
        <div ref={engineering} className={styles.engineering} aria-hidden="true">
          <p className={styles.eyebrow}>CONTROL, AT SPEED.</p>
          <p>Every millisecond.<br /><em>Earned.</em></p>
        </div>
        <div ref={closing} className={styles.closing}>
          <p className={styles.eyebrow}>THE DRIVE IS OURS. THE JOURNEY IS SHARED.</p>
          <h2>Built together.<br /><em>Driven further.</em></h2>
          <a href="#sponsors">Meet the names behind the car <ArrowDown size={16} /></a>
        </div>

        <div className={styles.bottom}>
          <a href="#sponsors" className={styles.skip}>Meet our partners <ArrowUpRight size={13} /></a>
          <div className={styles.chapter} aria-hidden="true"><span>0{chapter + 1}</span> / 04 <b>{CHAPTERS[chapter]}</b></div>
          <span className={styles.scroll}>{reduced ? "HYTECH RACING" : "SCROLL TO DRIVE"}<ArrowDown size={13} /></span>
        </div>
        <div className={styles.rail} aria-hidden="true"><span ref={progressBar} /></div>
      </div>
    </section>
  );
}
