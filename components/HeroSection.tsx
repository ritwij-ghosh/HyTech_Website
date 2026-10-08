"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVy: number;
  opacity: number;
  width: number;
  length: number;
  colorType: number;
  life: number;
  lane: number;
};

const CALLOUTS = [
  { side: "left", title: "AERO", value: "4.22 CIxA DOWNFORCE" },
  { side: "left", title: "ACCUMULATOR", value: "530V · 80KW PEAK" },
  { side: "right", title: "MOTOR", value: "4x IN-WHEEL · 20K RPM" },
  { side: "right", title: "BMS", value: "126 CELLS MONITORED" }
];

const STATS = [
  ["530V", "ACCUMULATOR"],
  ["80KW", "PEAK POWER"],
  ["20000RPM", "MOTOR SPEED"],
  ["1.85G", "LATERAL"],
  ["3RD", "OVERALL"]
];

function Callout({ title, value }: { title: string; value: string }) {
  return (
    <div className="hero-callout w-full rounded border border-[rgba(232,255,0,0.28)] bg-[rgba(14,14,20,0.86)] px-3 py-2 text-left backdrop-blur-md">
      <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#00D4FF]">{title}</div>
      <div className="mt-1 font-mono text-[11px] leading-snug text-[#E8FF00] tabular-nums">{value}</div>
    </div>
  );
}

function resetParticle(particle: Particle, width: number, height: number) {
  particle.length = 6 + Math.random() * 49;
  particle.x = width + particle.length + Math.random() * 200;
  particle.y = Math.random() * height;
  particle.lane = particle.y;
  particle.vx = -(3.5 + Math.random() * 5.5);
  particle.vy = (Math.random() - 0.5) * 0.4;
  particle.baseVy = particle.vy;
  particle.opacity = 0.05 + Math.random() * 0.55;
  particle.width = 0.4 + Math.random() * 1.4;
  particle.colorType = Math.random() < 0.7 ? 0 : Math.random() < 0.67 ? 1 : 2;
  particle.life = 0;
}

function colorForParticle(type: number) {
  if (type === 1) return "rgba(0, 212, 255, 0.25)";
  if (type === 2) return "rgba(232, 255, 0, 0.2)";
  return "rgba(255, 255, 255, 0.15)";
}

export default function HeroSection() {
  const wrapperRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const wrapper = wrapperRef.current;
    const sticky = stickyRef.current;
    const canvas = canvasRef.current;
    const svg = svgRef.current;
    if (!wrapper || !sticky || !canvas || !svg) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 767px)").matches;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const state = {
      intensity: 0,
      speed: 1,
      alpha: 1,
      maxParticles: narrow ? 90 : 400,
      paused: false
    };
    const particles: Particle[] = Array.from({ length: 400 }, () => ({} as Particle));
    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let frame = 0;
    let last = performance.now();

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#09090F";
      ctx.fillRect(0, 0, width, height);
      particles.forEach((particle) => resetParticle(particle, width, height));
    };

    const carPoint = (x: number, y: number, matrix: DOMMatrix, originX: number, originY: number) => {
      const point = svg.createSVGPoint();
      point.x = x;
      point.y = y;
      const mapped = point.matrixTransform(matrix);
      return { x: mapped.x - originX, y: mapped.y - originY };
    };

    const anchors = {
      nose: { x: 0, y: 0 },
      frontWing: { x: 0, y: 0 },
      cockpit: { x: 0, y: 0 },
      rearWing: { x: 0, y: 0 },
      rearWheel: { x: 0, y: 0 }
    };

    const placeAnchors = () => {
      const matrix = svg.getScreenCTM();
      if (!matrix) return;
      const box = canvas.getBoundingClientRect();
      anchors.nose = carPoint(1304, 376, matrix, box.left, box.top);
      anchors.frontWing = carPoint(1230, 468, matrix, box.left, box.top);
      anchors.cockpit = carPoint(660, 250, matrix, box.left, box.top);
      anchors.rearWing = carPoint(170, 150, matrix, box.left, box.top);
      anchors.rearWheel = carPoint(356, 406, matrix, box.left, box.top);
    };

    const applyDeflection = (particle: Particle) => {
      const { nose, frontWing, cockpit, rearWing } = anchors;
      const intensity = state.intensity;

      if (particle.x > nose.x - 20 && particle.x < nose.x + 110 && particle.y > nose.y - 40 && particle.y < nose.y + 48) {
        particle.vy += (particle.y < nose.y ? -0.16 : 0.16) * intensity;
        particle.vx *= 1.008;
      }
      if (particle.x > frontWing.x - 80 && particle.x < frontWing.x + 140 && particle.y > frontWing.y - 24 && particle.y < frontWing.y + 28) {
        particle.vy += 0.1 * intensity;
        particle.vx *= 0.996;
      }
      if (particle.x > cockpit.x - 50 && particle.x < cockpit.x + 150 && particle.y > cockpit.y - 24 && particle.y < cockpit.y + 100) {
        particle.vy += Math.sin(frame / 8 + particle.x * 0.012) * 0.1 * intensity;
      }
      if (particle.x > rearWing.x - 30 && particle.x < rearWing.x + 200 && particle.y > rearWing.y - 20 && particle.y < rearWing.y + 180) {
        particle.vy -= 0.14 * intensity;
        if (Math.random() < 0.04) particle.colorType = 1;
      }

      particle.vy += (particle.lane - particle.y) * 0.0008;
    };

    const render = (now: number) => {
      frame += 1;
      const delta = now - last;
      last = now;
      if (delta > 16 && state.maxParticles > (narrow ? 50 : 160)) state.maxParticles *= 0.9;

      ctx.fillStyle = "rgba(9, 9, 15, 0.14)";
      ctx.fillRect(0, 0, width, height);

      if (!state.paused && state.intensity > 0.01) {
        placeAnchors();
        const active = Math.floor(state.maxParticles * state.intensity);
        const speed = state.speed * (0.55 + state.intensity * 0.75);
        const length = 0.35 + state.intensity * 0.95;
        for (let index = 0; index < active; index += 1) {
          const particle = particles[index];
          applyDeflection(particle);
          particle.x += particle.vx * speed;
          particle.y += particle.vy;
          particle.vy = particle.vy * 0.982 + particle.baseVy * 0.018;
          particle.life = Math.min(1, particle.life + 0.025);

          ctx.globalAlpha = particle.opacity * particle.life * state.intensity * state.alpha;
          ctx.strokeStyle = colorForParticle(particle.colorType);
          ctx.lineWidth = particle.width;
          ctx.beginPath();
          ctx.moveTo(particle.x + particle.length * length, particle.y);
          ctx.lineTo(particle.x, particle.y);
          ctx.stroke();

          if (particle.x < -80 || particle.y < -80 || particle.y > height + 80) resetParticle(particle, width, height);
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);

    gsap.set(".tagline-inner", { yPercent: 110 });
    gsap.set(".hero-callout", { opacity: 0, x: 12 });
    gsap.set("#band-bottom", { opacity: 0 });

    if (reduced) {
      wrapper.style.height = "auto";
      sticky.style.position = "relative";
      sticky.style.height = "100vh";
      gsap.set(".hero-clip-inner", { yPercent: 0 });
      gsap.set("#band-bottom", { opacity: 1 });
      gsap.set(".hero-callout", { opacity: 1, x: 0 });
      gsap.set(svg.querySelectorAll(".car-stroke"), { strokeDashoffset: 0, strokeDasharray: "none" });
      gsap.set(svg.querySelectorAll(".car-num"), { opacity: 0.9 });
      return () => window.removeEventListener("resize", resize);
    }

    svg.querySelectorAll<SVGGeometryElement>(".car-stroke").forEach((el) => {
      const length = el.getTotalLength();
      gsap.set(el, { strokeDasharray: length, strokeDashoffset: length });
    });
    gsap.set(svg.querySelectorAll(".car-num"), { opacity: 0 });

    raf = requestAnimationFrame(render);

    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: wrapper,
        start: "top top",
        // Finish the sequence one viewport before the pin releases so the
        // completed frame stays on screen, then the next section can enter.
        end: "bottom bottom-=100vh",
        scrub: 0.6,
        invalidateOnRefresh: true
      }
    });

    const draw = (name: string) => svg.querySelectorAll(`.${name}`);

    timeline
      .to(sticky, { backgroundColor: "#09090F", duration: 0.04 }, 0)
      .to(draw("car-body"), { strokeDashoffset: 0, duration: 0.34, stagger: 0.012 }, 0.02)
      .to(draw("car-wheel"), { strokeDashoffset: 0, duration: 0.14, stagger: 0 }, 0.2)
      .to(draw("car-wing"), { strokeDashoffset: 0, duration: 0.16, stagger: 0.01 }, 0.26)
      .to(draw("car-cockpit"), { strokeDashoffset: 0, duration: 0.12, stagger: 0.015 }, 0.36)
      .to(draw("car-susp"), { strokeDashoffset: 0, duration: 0.1, stagger: 0.008 }, 0.4)
      .to(draw("car-accent"), { strokeDashoffset: 0, duration: 0.14 }, 0.46)
      .to(svg.querySelectorAll(".car-num"), { opacity: 0.88, duration: 0.1 }, 0.34)
      .to("#scroll-indicator", { opacity: 0, y: 10, duration: 0.08 }, 0.02)
      .to("#band-bottom", { opacity: 1, duration: 0.08 }, 0.2)
      .to(state, { intensity: 1, duration: 0.35 }, 0.2)
      .to(state, { speed: 1.35, duration: 0.18 }, 0.43)
      .to(".hero-callout", { opacity: 1, x: 0, stagger: 0.035, duration: 0.09, ease: "power2.out" }, 0.6)
      .to(".tagline-inner", { yPercent: 0, duration: 0.08, ease: "power3.out" }, 0.68)
      .to(".stat-item", { opacity: 1, y: 0, stagger: 0.018, duration: 0.06, ease: "power2.out" }, 0.72)
      .to(state, { intensity: 0.7, duration: 0.18 }, 0.82);

    sticky.style.opacity = "1";
    state.alpha = 1;

    // Pause the wind field only after the hero has fully left the viewport.
    // Fading it earlier blanks the screen while the section still covers it.
    const offscreen = ScrollTrigger.create({
      trigger: wrapper,
      start: "bottom top",
      onEnter: () => {
        state.paused = true;
      },
      onLeaveBack: () => {
        sticky.style.opacity = "1";
        state.alpha = 1;
        state.paused = false;
      }
    });

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
      timeline.scrollTrigger?.kill();
      timeline.kill();
      offscreen.kill();
    };
  }, []);

  return (
    <section id="hero-wrapper" ref={wrapperRef} className="relative h-[500vh]">
      <span id="hero" className="absolute left-0 top-0" aria-hidden />
      <div
        id="hero-sticky"
        ref={stickyRef}
        className="sticky top-0 flex h-screen w-full flex-col overflow-hidden bg-[#09090F]"
      >
        <div
          id="band-top"
          className="relative z-10 flex shrink-0 flex-col items-center justify-center gap-1.5 px-4 pb-2 pt-24 text-center"
        >
          <div id="text-team-name" className="overflow-hidden font-display text-[clamp(28px,4vw,56px)] font-black uppercase tracking-[0.18em] text-white">
            <span className="hero-clip-inner team-name-inner inline-block">HYTECH RACING</span>
          </div>
          <div id="text-season" className="overflow-hidden font-mono text-[clamp(10px,1.2vw,13px)] uppercase tracking-[0.25em] text-[#00D4FF]">
            <span className="hero-clip-inner season-inner inline-flex items-center justify-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#E8FF00]" />
              2025 SEASON&nbsp; · &nbsp;HT09&nbsp; · &nbsp;FORMULA SAE ELECTRIC
            </span>
          </div>
          <div id="scroll-indicator" className="mt-6 flex flex-col items-center gap-2 text-[#E8FF00]">
            <div className="font-mono text-[12px] font-semibold tracking-[0.34em] drop-shadow-[0_0_12px_rgba(232,255,0,0.85)]">
              SCROLL
            </div>
            <svg width="22" height="32" viewBox="0 0 16 26" fill="none" aria-hidden className="drop-shadow-[0_0_10px_rgba(232,255,0,0.7)]">
              {[3, 9, 15].map((y, index) => (
                <path
                  key={y}
                  d={`M4 ${y} C6 ${y + 2} 8 ${y + 4} 8 ${y + 4} C8 ${y + 4} 10 ${y + 2} 12 ${y}`}
                  stroke="#E8FF00"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  style={{ animation: "pulseGlow 1.2s ease-in-out infinite", animationDelay: `${index * 0.18}s` }}
                />
              ))}
            </svg>
          </div>
        </div>

        <div id="band-mid" className="relative flex min-h-0 flex-1 items-center gap-4 overflow-hidden px-4 md:px-6">
          <canvas id="wind-canvas" ref={canvasRef} className="pointer-events-none absolute inset-0 z-[1] h-full w-full" />
          <div id="callouts-left" className="relative z-[3] hidden w-48 shrink-0 flex-col gap-4 self-start min-[1180px]:flex">
            {CALLOUTS.filter((item) => item.side === "left").map((item) => (
              <Callout key={item.title} title={item.title} value={item.value} />
            ))}
          </div>
          <div className="relative z-[2] h-full min-h-0 min-w-0 flex-1 self-stretch">
            <svg
              ref={svgRef}
              className="hero-car block h-full w-full"
              viewBox="0 0 1360 520"
              fill="none"
              role="img"
              aria-label="HyTech HT09"
            >
              <g strokeLinecap="butt" strokeLinejoin="miter">
                <path className="car-stroke car-body" stroke="rgba(244,241,234,0.14)" strokeWidth="1" vectorEffect="non-scaling-stroke" d="M36 494 H1324" />
                <path className="car-stroke car-body" stroke="#F4F1EA" strokeWidth="1.2" vectorEffect="non-scaling-stroke" d="M452 348 L548 356" />
                <path className="car-stroke car-body" stroke="#F4F1EA" strokeWidth="1.2" vectorEffect="non-scaling-stroke" d="M536 358 L522 412" />
                <path className="car-stroke car-body" stroke="#F4F1EA" strokeWidth="1.2" vectorEffect="non-scaling-stroke" d="M772 342 L786 408" />
                <path className="car-stroke car-body" stroke="#F4F1EA" strokeWidth="1.35" vectorEffect="non-scaling-stroke" d="M772 334 C910 306, 1048 298, 1170 326 C1226 342, 1270 360, 1304 376" />
                <path className="car-stroke car-body" stroke="#F4F1EA" strokeWidth="1.25" vectorEffect="non-scaling-stroke" d="M1304 376 C1278 396, 1226 422, 1162 438" />
                <path className="car-stroke car-body" stroke="#F4F1EA" strokeWidth="1.15" vectorEffect="non-scaling-stroke" d="M786 360 L948 348" />
                <path className="car-stroke car-body" stroke="#F4F1EA" strokeWidth="1.1" vectorEffect="non-scaling-stroke" d="M860 382 L948 374" />
                <path className="car-stroke car-body" stroke="#F4F1EA" strokeWidth="1.15" vectorEffect="non-scaling-stroke" d="M900 326 L886 422" />
                <path className="car-stroke car-body" stroke="#F4F1EA" strokeWidth="1.25" vectorEffect="non-scaling-stroke" d="M946 434 C810 456, 670 450, 534 430" />

                <path className="car-stroke car-cockpit" stroke="#F4F1EA" strokeWidth="1.2" vectorEffect="non-scaling-stroke" d="M492 354 C480 276, 508 198, 552 188 C560 240, 552 308, 544 354" />
                <path className="car-stroke car-cockpit" stroke="#F4F1EA" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" d="M572 310 C564 248, 592 184, 654 174 C710 164, 748 196, 752 250 C756 294, 732 332, 686 344 C640 356, 596 334, 576 312 C568 300, 572 314, 572 310" />
                <path className="car-stroke car-cockpit" stroke="#F4F1EA" strokeWidth="1.15" strokeLinecap="round" vectorEffect="non-scaling-stroke" d="M692 206 C722 220, 730 256, 704 284" />
                <path className="car-stroke car-cockpit" stroke="#F4F1EA" strokeWidth="1.05" strokeLinecap="round" vectorEffect="non-scaling-stroke" d="M678 236 C708 248, 714 270, 692 286" />
                <path className="car-stroke car-cockpit" stroke="#F4F1EA" strokeWidth="1.05" strokeLinecap="round" vectorEffect="non-scaling-stroke" d="M588 324 L570 372" />
                <path className="car-stroke car-cockpit" stroke="#F4F1EA" strokeWidth="1.05" strokeLinecap="round" vectorEffect="non-scaling-stroke" d="M646 346 L660 376" />
                <path className="car-stroke car-cockpit" stroke="#F4F1EA" strokeWidth="1.15" strokeLinecap="round" vectorEffect="non-scaling-stroke" d="M548 380 C612 356, 690 354, 742 374" />
                <path className="car-stroke car-cockpit" stroke="#F4F1EA" strokeWidth="1.1" strokeLinecap="round" vectorEffect="non-scaling-stroke" d="M720 366 C768 352, 810 360, 844 378" />

                <path className="car-stroke car-wing" stroke="#F4F1EA" strokeWidth="1.3" vectorEffect="non-scaling-stroke" d="M332 314 C318 216, 262 94, 176 68 C112 48, 58 74, 48 130 L44 270 C48 320, 108 350, 192 344 C260 338, 312 330, 332 314" />
                <path className="car-stroke car-wing" stroke="#F4F1EA" strokeWidth="1.1" vectorEffect="non-scaling-stroke" d="M286 148 C206 130, 136 140, 92 166" />
                <path className="car-stroke car-wing" stroke="#F4F1EA" strokeWidth="1.1" vectorEffect="non-scaling-stroke" d="M298 196 C214 178, 140 190, 98 216" />
                <path className="car-stroke car-wing" stroke="#F4F1EA" strokeWidth="1.05" vectorEffect="non-scaling-stroke" d="M300 248 L452 262" />
                <path className="car-stroke car-wing" stroke="#F4F1EA" strokeWidth="1.05" vectorEffect="non-scaling-stroke" d="M326 308 L452 338" />
                <path className="car-stroke car-wing" stroke="#F4F1EA" strokeWidth="1.15" vectorEffect="non-scaling-stroke" d="M452 248 L452 352" />
                <path className="car-stroke car-wing" stroke="#F4F1EA" strokeWidth="1.2" vectorEffect="non-scaling-stroke" d="M1164 452 C1228 438, 1288 442, 1332 460" />
                <path className="car-stroke car-wing" stroke="#F4F1EA" strokeWidth="1.2" vectorEffect="non-scaling-stroke" d="M1172 470 C1236 458, 1294 462, 1336 478" />
                <path className="car-stroke car-wing" stroke="#F4F1EA" strokeWidth="1.2" vectorEffect="non-scaling-stroke" d="M1320 434 L1348 430 L1356 496 L1328 500 Z" />
                <path className="car-stroke car-wing" stroke="rgba(244,241,234,0.6)" strokeWidth="1" vectorEffect="non-scaling-stroke" d="M1206 404 L1218 448" />

                <circle className="car-stroke car-wheel" cx="356" cy="406" r="82" stroke="#F4F1EA" strokeWidth="1.3" vectorEffect="non-scaling-stroke" />
                <circle className="car-stroke car-wheel" cx="356" cy="406" r="52" stroke="#F4F1EA" strokeWidth="0.95" vectorEffect="non-scaling-stroke" />
                <path className="car-stroke car-wheel" stroke="#F4F1EA" strokeWidth="0.9" vectorEffect="non-scaling-stroke" d="M356 368 V394 M356 418 V444 M318 406 H342 M370 406 H394" />
                <circle className="car-stroke car-wheel" cx="1042" cy="404" r="80" stroke="#F4F1EA" strokeWidth="1.3" vectorEffect="non-scaling-stroke" />
                <circle className="car-stroke car-wheel" cx="1042" cy="404" r="50" stroke="#F4F1EA" strokeWidth="0.95" vectorEffect="non-scaling-stroke" />
                <path className="car-stroke car-wheel" stroke="#F4F1EA" strokeWidth="0.9" vectorEffect="non-scaling-stroke" d="M1042 368 V392 M1042 416 V440 M1006 404 H1028 M1056 404 H1078" />

                <path className="car-stroke car-susp" stroke="rgba(244,241,234,0.45)" strokeWidth="0.95" vectorEffect="non-scaling-stroke" d="M474 336 L434 364" />
                <path className="car-stroke car-susp" stroke="rgba(244,241,234,0.45)" strokeWidth="0.95" vectorEffect="non-scaling-stroke" d="M508 436 L446 424" />
                <path className="car-stroke car-susp" stroke="rgba(244,241,234,0.45)" strokeWidth="0.95" vectorEffect="non-scaling-stroke" d="M902 322 L966 360" />
                <path className="car-stroke car-susp" stroke="rgba(244,241,234,0.45)" strokeWidth="0.95" vectorEffect="non-scaling-stroke" d="M870 436 L960 426" />

                <path className="car-stroke car-accent" stroke="#E8FF00" strokeWidth="1.2" vectorEffect="non-scaling-stroke" d="M548 410 C700 424, 840 418, 944 400" />
              </g>
            </svg>
          </div>
          <div id="callouts-right" className="relative z-[3] hidden w-48 shrink-0 flex-col gap-4 self-start min-[1180px]:flex">
            {CALLOUTS.filter((item) => item.side === "right").map((item) => (
              <Callout key={item.title} title={item.title} value={item.value} />
            ))}
          </div>
        </div>

        <div
          id="band-bottom"
          className="relative z-10 flex h-[20vh] flex-col items-center justify-start gap-2.5 px-4 pt-4 text-center"
        >
          <div id="text-tagline" className="overflow-hidden font-sans text-[clamp(11px,1.3vw,15px)] font-light italic tracking-[0.08em] text-white/45">
            <span className="hero-clip-inner tagline-inner inline-block">To Race Is Not Enough</span>
          </div>
          <div id="stat-bar" className="flex max-w-full flex-wrap items-center justify-center gap-x-[clamp(20px,3vw,48px)] gap-y-2">
            {STATS.map(([value, label], index) => (
              <div key={value} className="stat-item flex translate-y-2 items-center gap-[clamp(20px,3vw,48px)] opacity-0">
                {index > 0 ? <span className="hidden h-5 w-px bg-white/10 sm:block" /> : null}
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-sm font-bold text-[#E8FF00] tabular-nums">{value}</span>
                  <span className="font-mono text-[9px] tracking-[0.2em] text-white/35">{label}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="hero-callout-mobile mt-1 flex max-w-full gap-2 overflow-hidden min-[1180px]:hidden">
            {CALLOUTS.slice(0, 2).map((item) => (
              <div key={item.title} className="hero-callout rounded border border-[rgba(232,255,0,0.2)] bg-white/[0.03] px-2 py-1">
                <span className="font-mono text-[8px] tracking-[0.12em] text-[#00D4FF]">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
