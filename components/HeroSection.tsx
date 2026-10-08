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
      anchors.nose = carPoint(1184, 388, matrix, box.left, box.top);
      anchors.frontWing = carPoint(1070, 476, matrix, box.left, box.top);
      anchors.cockpit = carPoint(530, 216, matrix, box.left, box.top);
      anchors.rearWing = carPoint(160, 140, matrix, box.left, box.top);
      anchors.rearWheel = carPoint(230, 436, matrix, box.left, box.top);
    };

    const applyDeflection = (particle: Particle) => {
      const { nose, frontWing, cockpit, rearWing, rearWheel } = anchors;
      const intensity = state.intensity;

      if (particle.x > nose.x + 10 && particle.x < nose.x + 150 && particle.y > frontWing.y - 40 && particle.y < frontWing.y + 36) {
        particle.vy += 0.09 * intensity;
        particle.vx *= 0.996;
      }
      if (particle.x > nose.x - 36 && particle.x < nose.x + 24 && particle.y > nose.y - 48 && particle.y < nose.y + 36) {
        particle.vy += (particle.y < nose.y ? -0.18 : 0.18) * intensity;
        particle.vx *= 1.01;
      }
      if (particle.x > cockpit.x - 80 && particle.x < cockpit.x + 40 && particle.y > cockpit.y - 16 && particle.y < cockpit.y + 80) {
        particle.vy += Math.sin(frame / 8 + particle.x * 0.012) * 0.12 * intensity;
        if (Math.random() < 1 / 48) particle.vy += (Math.random() - 0.5) * 5 * intensity;
      }
      if (particle.x > rearWheel.x - 20 && particle.x < rearWheel.x + 90 && particle.y > rearWheel.y - 24 && particle.y < rearWheel.y + 36) {
        particle.vy -= 0.22 * intensity;
        particle.vx *= 1.008;
      }
      if (particle.x < rearWing.x - 6 && particle.x > rearWing.x - 240 && particle.y > rearWing.y - 70 && particle.y < rearWing.y + 110) {
        particle.vy += Math.sin(frame / 8) * 0.16 * intensity;
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
              viewBox="20 16 1180 530"
              fill="none"
              role="img"
              aria-label="HyTech HT09"
            >
              <g strokeLinecap="round" strokeLinejoin="round">
                <path className="car-stroke car-body" stroke="rgba(244,241,234,0.14)" strokeWidth="1" vectorEffect="non-scaling-stroke" d="M40 528 H1180" />
                <path className="car-stroke car-body" stroke="#F4F1EA" strokeWidth="1.4" vectorEffect="non-scaling-stroke" d="M390 308 C520 286, 640 258, 740 246 C830 236, 940 280, 1040 332 C1100 358, 1140 372, 1162 376" />
                <path className="car-stroke car-body" stroke="#F4F1EA" strokeWidth="1.25" vectorEffect="non-scaling-stroke" d="M1162 376 C1176 376, 1186 384, 1184 394 C1182 404, 1162 406, 1142 400 C1122 394, 1108 384, 1102 376" />
                <path className="car-stroke car-body" stroke="#F4F1EA" strokeWidth="1.35" vectorEffect="non-scaling-stroke" d="M390 308 C376 370, 360 430, 388 472 C420 506, 520 520, 630 514 C730 508, 810 492, 852 476" />
                <path className="car-stroke car-body" stroke="#F4F1EA" strokeWidth="1.05" vectorEffect="non-scaling-stroke" d="M430 412 C540 436, 650 436, 746 416" />

                <path className="car-stroke car-cockpit" stroke="#F4F1EA" strokeWidth="1.2" vectorEffect="non-scaling-stroke" d="M432 300 C460 238, 530 208, 568 216 C582 222, 586 246, 584 266" />
                <path className="car-stroke car-cockpit" stroke="#F4F1EA" strokeWidth="1.05" vectorEffect="non-scaling-stroke" d="M478 292 C522 258, 560 252, 578 264" />

                <path className="car-stroke car-wing" stroke="#F4F1EA" strokeWidth="1.3" vectorEffect="non-scaling-stroke" d="M62 230 C54 180, 56 108, 72 60 C84 38, 128 26, 184 28 C228 30, 256 42, 266 66 C274 104, 270 168, 256 212 C246 238, 206 252, 156 250 C108 248, 74 246, 62 230 Z" />
                <path className="car-stroke car-wing" stroke="#F4F1EA" strokeWidth="1.15" vectorEffect="non-scaling-stroke" d="M108 86 C158 72, 198 70, 230 82" />
                <path className="car-stroke car-wing" stroke="#F4F1EA" strokeWidth="1.15" vectorEffect="non-scaling-stroke" d="M102 122 C158 106, 202 104, 234 116" />
                <path className="car-stroke car-wing" stroke="#F4F1EA" strokeWidth="1.15" vectorEffect="non-scaling-stroke" d="M98 158 C154 144, 196 142, 224 154" />
                <path className="car-stroke car-wing" stroke="#F4F1EA" strokeWidth="1.2" vectorEffect="non-scaling-stroke" d="M990 472 Q1070 454 1148 466" />
                <path className="car-stroke car-wing" stroke="#F4F1EA" strokeWidth="1.2" vectorEffect="non-scaling-stroke" d="M998 492 Q1078 476 1152 486" />
                <path className="car-stroke car-wing" stroke="#F4F1EA" strokeWidth="1.2" vectorEffect="non-scaling-stroke" d="M1166 442 C1186 438, 1198 454, 1196 478 C1194 502, 1178 516, 1158 510 C1142 504, 1136 486, 1146 464 C1154 446, 1158 442, 1166 442 Z" />
                <path className="car-stroke car-wing" stroke="rgba(244,241,234,0.62)" strokeWidth="1" vectorEffect="non-scaling-stroke" d="M1056 338 C1064 382, 1066 426, 1070 462" />
                <path className="car-stroke car-wing" stroke="rgba(244,241,234,0.62)" strokeWidth="1" vectorEffect="non-scaling-stroke" d="M1102 376 C1106 406, 1108 436, 1110 462" />

                <circle className="car-stroke car-wheel" cx="230" cy="436" r="92" stroke="#F4F1EA" strokeWidth="1.3" vectorEffect="non-scaling-stroke" />
                <circle className="car-stroke car-wheel" cx="230" cy="436" r="58" stroke="#F4F1EA" strokeWidth="0.95" vectorEffect="non-scaling-stroke" />
                <circle className="car-stroke car-wheel" cx="848" cy="440" r="88" stroke="#F4F1EA" strokeWidth="1.3" vectorEffect="non-scaling-stroke" />
                <circle className="car-stroke car-wheel" cx="848" cy="440" r="56" stroke="#F4F1EA" strokeWidth="0.95" vectorEffect="non-scaling-stroke" />

                <path className="car-stroke car-susp" stroke="rgba(244,241,234,0.42)" strokeWidth="0.95" vectorEffect="non-scaling-stroke" d="M252 228 C310 256, 358 286, 390 308" />
                <path className="car-stroke car-susp" stroke="rgba(244,241,234,0.42)" strokeWidth="0.95" vectorEffect="non-scaling-stroke" d="M268 248 C302 288, 334 326, 360 360" />
                <path className="car-stroke car-susp" stroke="rgba(244,241,234,0.42)" strokeWidth="0.95" vectorEffect="non-scaling-stroke" d="M360 352 C346 360, 334 366, 324 372" />
                <path className="car-stroke car-susp" stroke="rgba(244,241,234,0.42)" strokeWidth="0.95" vectorEffect="non-scaling-stroke" d="M368 452 C350 456, 336 454, 322 450" />
                <path className="car-stroke car-susp" stroke="rgba(244,241,234,0.42)" strokeWidth="0.95" vectorEffect="non-scaling-stroke" d="M700 348 C722 356, 744 368, 762 382" />
                <path className="car-stroke car-susp" stroke="rgba(244,241,234,0.42)" strokeWidth="0.95" vectorEffect="non-scaling-stroke" d="M690 456 C718 460, 742 456, 762 450" />

                <path className="car-stroke car-accent" stroke="#E8FF00" strokeWidth="1.4" vectorEffect="non-scaling-stroke" d="M440 358 C540 380, 640 398, 736 406" />
              </g>
              <text className="car-num" x="100" y="210" fill="#F4F1EA" opacity="0" fontSize="40" fontWeight="500" letterSpacing="3" fontFamily="var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif">
                210
              </text>
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
