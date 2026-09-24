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

const BODY_PATH =
  "M72 270 C104 260 132 250 162 244 C190 238 218 238 246 242 C274 246 300 252 326 248 C354 244 374 226 398 212 C424 196 456 192 486 196 C514 200 538 190 562 176 C586 162 618 158 648 166 C684 176 718 188 754 196 C794 206 834 210 876 212 C908 214 934 202 960 186 C986 170 1020 170 1046 188 C1072 206 1078 236 1060 256 C1044 274 1014 280 984 276 C946 272 914 256 876 252 C822 246 768 254 714 254 C656 254 602 250 546 256 C494 262 444 278 392 286 C332 296 268 298 208 294 C154 290 110 282 72 270 C58 266 58 274 72 270";

const DIMENSION_LINES = [
  "M230 300 C410 300 584 300 760 300 C816 300 872 300 930 300",
  "M38 252 C228 252 418 252 608 252 C798 252 988 252 1062 252",
  "M0 318 C240 318 420 318 600 318 C780 318 960 318 1100 318",
  "M584 52 C584 122 584 192 584 318"
];

const SUSPENSION_PATHS = [
  "M230 252 C262 246 294 240 326 238 C300 252 268 260 230 262 M230 286 C262 280 292 274 322 270 C296 286 266 294 230 296 M258 286 C286 266 304 246 326 226 M230 228 C230 248 230 274 230 304",
  "M930 252 C900 246 870 240 842 238 C866 252 898 260 930 262 M930 286 C900 280 872 274 844 270 C868 286 900 294 930 296 M902 286 C876 266 860 246 842 226 M930 228 C930 248 930 274 930 304"
];

const HV_PATHS = [
  "M504 236 C560 214 626 214 684 236 C742 258 818 264 898 252",
  "M508 236 C454 226 386 232 310 252 C270 262 250 268 232 270"
];

const LV_PATHS = [
  "M608 206 C532 194 466 204 388 230 C316 254 250 260 168 250",
  "M608 206 C700 202 780 212 862 240 C920 260 980 254 1038 224",
  "M608 206 C596 226 586 246 584 282"
];

const WING_DETAIL_PATHS = [
  "M92 254 C130 246 168 240 206 240 M104 266 C142 258 180 254 218 254 M132 248 C158 252 184 254 210 252",
  "M948 202 C982 190 1018 190 1042 208 M950 218 C986 206 1020 208 1046 224 M1000 192 C1012 206 1022 220 1030 238"
];

const ELECTRICAL_BOXES = [
  { x: 470, y: 218, w: 120, h: 42, label: "ACC" },
  { x: 602, y: 214, w: 58, h: 34, label: "PDU" },
  { x: 334, y: 242, w: 50, h: 26, label: "INV-F" },
  { x: 812, y: 238, w: 50, h: 26, label: "INV-R" }
];

const ANNOTATIONS = [
  { x: 148, y: 244, label: "FW" },
  { x: 94, y: 262, label: "AERO REF" },
  { x: 624, y: 156, label: "RH-01" },
  { x: 1018, y: 196, label: "RW" },
  { x: 866, y: 252, label: "DIFF" },
  { x: 326, y: 226, label: "" },
  { x: 322, y: 270, label: "" },
  { x: 842, y: 226, label: "" },
  { x: 844, y: 270, label: "" }
];

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

const CAR_VIEW_START = "-110 -20 1480 440";
const CAR_VIEW_FIT = "-40 20 1280 376";

function CrossMarker({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g className="annotation-marker">
      <path d={`M${x - 2.5} ${y} C${x - 1} ${y} ${x + 1} ${y} ${x + 2.5} ${y} M${x} ${y - 2.5} C${x} ${y - 1} ${x} ${y + 1} ${x} ${y + 2.5}`} />
      {label ? (
        <text x={x + 7} y={y - 4}>
          {label}
        </text>
      ) : null}
    </g>
  );
}

function Wheel({ cx, cy }: { cx: number; cy: number }) {
  const spokes = Array.from({ length: 5 }, (_, index) => index * 72 - 90);
  return (
    <g className="wheel-detail" style={{ transformOrigin: `${cx}px ${cy}px` }}>
      <circle className="tire-primary" cx={cx} cy={cy} r="48" />
      <circle className="hero-hub-ring" cx={cx} cy={cy} r="34.6" />
      <circle className="hero-hub-ring" cx={cx} cy={cy} r="27.8" strokeDasharray="4 3" />
      <circle className="hero-hub-ring motor-ring" cx={cx} cy={cy} r="19.2" />
      <circle className="hero-hub-ring" cx={cx} cy={cy} r="7.2" />
      {spokes.map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = cx + Math.cos(rad) * 27.8;
        const y1 = cy + Math.sin(rad) * 27.8;
        const x2 = cx + Math.cos(rad) * 34.6;
        const y2 = cy + Math.sin(rad) * 34.6;
        return <path className="hero-hub-ring" key={angle} d={`M${x1} ${y1} C${x1 + 1} ${y1} ${x2 - 1} ${y2} ${x2} ${y2}`} />;
      })}
    </g>
  );
}

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
  particle.x = -particle.length - Math.random() * 200;
  particle.y = Math.random() * height;
  particle.lane = particle.y;
  particle.vx = 3.5 + Math.random() * 5.5;
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
  const bodyPathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const wrapper = wrapperRef.current;
    const sticky = stickyRef.current;
    const canvas = canvasRef.current;
    const svg = svgRef.current;
    const bodyPath = bodyPathRef.current;
    if (!wrapper || !sticky || !canvas || !svg || !bodyPath) return;

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

    const applyDeflection = (particle: Particle) => {
      const nose = { x: width * 0.17, y: height * 0.55 };
      const cockpit = { x: width * 0.55, y: height * 0.36 };
      const rear = { x: width * 0.86, y: height * 0.52 };
      const bottom = height * 0.76;
      const intensity = state.intensity;

      if (particle.x > nose.x - 120 && particle.x < nose.x - 20 && particle.y > nose.y + 24 && particle.y < nose.y + 72) {
        particle.vy += 0.09 * intensity;
        particle.vx *= 0.996;
      }
      if (particle.x > nose.x - 10 && particle.x < nose.x + 24 && particle.y > nose.y - 18 && particle.y < nose.y + 18) {
        particle.vy += (particle.y < nose.y ? -0.18 : 0.18) * intensity;
        particle.vx *= 1.01;
      }
      if (particle.x > cockpit.x - 30 && particle.x < cockpit.x + 90 && particle.y > cockpit.y - 36 && particle.y < cockpit.y + 36) {
        particle.vy += Math.sin(frame / 8 + particle.x * 0.012) * 0.12 * intensity;
        if (Math.random() < 1 / 48) particle.vy += (Math.random() - 0.5) * 5 * intensity;
      }
      if (particle.x > rear.x - 70 && particle.x < rear.x + 24 && particle.y > bottom - 70 && particle.y < bottom) {
        particle.vy -= 0.24 * intensity;
        particle.vx *= 1.008;
      }
      if (particle.x > rear.x + 12 && particle.x < rear.x + 220 && particle.y > rear.y - 55 && particle.y < rear.y + 60) {
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
          ctx.moveTo(particle.x - particle.length * length, particle.y);
          ctx.lineTo(particle.x, particle.y);
          ctx.stroke();

          if (particle.x > width + 80 || particle.y < -80 || particle.y > height + 80) resetParticle(particle, width, height);
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);

    const pathLength = bodyPath.getTotalLength();
    gsap.set(bodyPath, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
      opacity: 0,
      stroke: "rgba(0,212,255,0.7)"
    });
    gsap.set(".tagline-inner", { yPercent: 110 });
    gsap.set(".hero-layer", { opacity: 0 });
    gsap.set(".wheel-detail", { opacity: 0, scale: 0.3, transformBox: "fill-box", transformOrigin: "center" });
    gsap.set(".hero-hub-ring", { opacity: 0, scale: 0.4, transformBox: "fill-box", transformOrigin: "center" });
    gsap.set(".annotation-marker", { opacity: 0 });
    gsap.set(".hero-callout", { opacity: 0, x: 12 });
    gsap.set("#band-bottom", { opacity: 0 });

    if (reduced) {
      wrapper.style.height = "auto";
      sticky.style.position = "relative";
      sticky.style.height = "100vh";
      svg.setAttribute("viewBox", CAR_VIEW_FIT);
      gsap.set(bodyPath, { strokeDashoffset: 0, opacity: 1, stroke: "#E8FF00" });
      gsap.set(".hero-clip-inner", { yPercent: 0 });
      gsap.set(".hero-layer,.wheel-detail,.hero-hub-ring,.annotation-marker,#band-bottom", { opacity: 1, scale: 1 });
      gsap.set(".hero-callout", { opacity: 1, x: 0 });
      return () => window.removeEventListener("resize", resize);
    }

    raf = requestAnimationFrame(render);

    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: wrapper,
        start: "top top",
        // Finish the sequence one viewport before the pin releases so the
        // completed frame stays on screen, then the next section can enter.
        end: "bottom bottom-=100vh",
        scrub: 1.8,
        invalidateOnRefresh: true
      }
    });

    timeline
      .to(sticky, { backgroundColor: "#09090F", duration: 0.04 }, 0)
      .to(".layer-reference", { opacity: 1, duration: 0.08 }, 0)
      .to(bodyPath, { opacity: 1, duration: 0.025 }, 0.04)
      .to(bodyPath, { strokeDashoffset: 0, stroke: "#E8FF00", duration: 0.12 }, 0.04)
      .to(".front-wheel", { opacity: 1, scale: 1, duration: 0.055, ease: "power2.out" }, 0.06)
      .to(".rear-wheel", { opacity: 1, scale: 1, duration: 0.055, ease: "power2.out" }, 0.1)
      .to(".layer-suspension.front-suspension", { opacity: 1, duration: 0.05 }, 0.1)
      .to(".layer-suspension.rear-suspension", { opacity: 1, duration: 0.05 }, 0.14)
      .to(".layer-wing", { opacity: 0.9, duration: 0.06 }, 0.13)
      .to(".hero-hub-ring", { opacity: 1, scale: 1, stagger: { each: 0.006, from: "end" }, duration: 0.04, ease: "power2.out" }, 0.13)
      .to(".layer-annotations", { opacity: 1, duration: 0.02 }, 0.14)
      .to(".annotation-marker", { opacity: 1, stagger: 0.006, duration: 0.04 }, 0.14)
      .to(".layer-electrical", { opacity: 0.6, duration: 0.06 }, 0.16)
      .to(".layer-cooling", { opacity: 1, duration: 0.05 }, 0.17)
      .to(".isobar-layer", { opacity: 1, duration: 0.06 }, 0.2)
      .to("#scroll-indicator", { opacity: 0, y: 10, duration: 0.08 }, 0.02)
      .to("#band-bottom", { opacity: 1, duration: 0.08 }, 0.2)
      .to(state, { intensity: 1, duration: 0.35 }, 0.2)
      .to(state, { speed: 1.35, duration: 0.18 }, 0.43)
      .to(svg, { attr: { viewBox: CAR_VIEW_FIT }, duration: narrow ? 0 : 0.26, ease: "power2.inOut" }, 0.55)
      .to(bodyPath, { stroke: "rgba(255,255,255,0.96)", opacity: 0.72, duration: 0.2 }, 0.56)
      .to(".tire-primary", { stroke: "rgba(255,255,255,0.76)", duration: 0.2 }, 0.56)
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
              id="car-svg"
              ref={svgRef}
              className="block h-full w-full origin-center scale-[1.4]"
              viewBox={CAR_VIEW_START}
              preserveAspectRatio="xMidYMid meet"
              aria-hidden
            >
            <defs>
              <style>
                {`
                  #hero-wrapper .isobar-flow {
                    animation: isobar-flow 6s linear infinite;
                  }
                  #hero-wrapper .isobar-under {
                    animation-duration: 4s;
                  }
                  #hero-wrapper .isobar-wake {
                    animation-duration: 8s;
                    animation-direction: reverse;
                  }
                  @keyframes isobar-flow {
                    from { stroke-dashoffset: 0; }
                    to { stroke-dashoffset: -96; }
                  }
                `}
              </style>
              <marker id="hero-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M1 1 C2.5 1.8 4 2.5 5 3 C4 3.5 2.5 4.2 1 5" fill="none" stroke="rgba(255,255,255,0.24)" strokeWidth="0.8" />
              </marker>
            </defs>

            <g className="hero-layer layer-reference" fill="none" stroke="rgba(0,212,255,0.12)" strokeWidth="0.5">
              {DIMENSION_LINES.map((path, index) => (
                <path key={path} d={path} strokeDasharray={index === 2 ? undefined : index === 1 ? "8 4" : "4 4"} stroke={index === 2 ? "rgba(255,255,255,0.06)" : undefined} strokeWidth={index === 2 ? "0.8" : undefined} />
              ))}
              <path d="M230 284 C230 294 230 306 230 318 M930 284 C930 294 930 306 930 318" />
              <path d="M242 338 C390 338 500 338 580 338 C690 338 800 338 918 338" markerEnd="url(#hero-arrow)" markerStart="url(#hero-arrow)" />
              <text x="558" y="353" fill="rgba(0,212,255,0.5)" fontSize="8" fontFamily="monospace">
                1535mm
              </text>
              <path d="M194 300 C204 300 214 300 224 300 M236 300 C246 300 256 300 266 300" markerEnd="url(#hero-arrow)" markerStart="url(#hero-arrow)" />
              <text x="170" y="292" fill="rgba(0,212,255,0.45)" fontSize="7" fontFamily="monospace">
                305mm TIRES
              </text>
              <path d="M576 252 C580 252 588 252 592 252 M584 244 C584 248 584 256 584 260" stroke="rgba(232,255,0,0.5)" />
              <circle cx="584" cy="252" r="6" stroke="rgba(232,255,0,0.5)" />
              <text x="596" y="249" fill="rgba(0,212,255,0.65)" fontSize="8" fontFamily="monospace">
                CoM
              </text>
            </g>

            <g className="hero-layer layer-suspension front-suspension" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6">
              <path d={SUSPENSION_PATHS[0]} />
            </g>
            <g className="hero-layer layer-suspension rear-suspension" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6">
              <path d={SUSPENSION_PATHS[1]} />
            </g>

            <g className="hero-layer layer-electrical" fill="none" strokeLinecap="round">
              {HV_PATHS.map((path) => (
                <path key={path} d={path} stroke="rgba(232,255,0,0.12)" strokeWidth="1.5" />
              ))}
              {LV_PATHS.map((path) => (
                <path key={path} d={path} stroke="rgba(0,212,255,0.08)" strokeWidth="0.8" />
              ))}
              {ELECTRICAL_BOXES.map((box) => (
                <g key={box.label}>
                  <rect x={box.x} y={box.y} width={box.w} height={box.h} rx="3" fill="rgba(0,212,255,0.025)" stroke="rgba(0,212,255,0.18)" strokeWidth="0.6" />
                  <text x={box.x + 6} y={box.y + 14} fill="rgba(0,212,255,0.28)" fontSize="7" fontFamily="monospace">
                    {box.label}
                  </text>
                </g>
              ))}
            </g>

            <g className="hero-layer isobar-layer" fill="none">
              <path className="isobar-flow" d="M350 166 C450 120 574 126 674 154 C790 186 896 178 1038 132" stroke="rgba(232,255,0,0.07)" strokeWidth="1" strokeDasharray="10 6" />
              <path className="isobar-flow isobar-under" d="M96 324 C258 346 430 334 594 318 C750 302 892 304 1040 338" stroke="rgba(0,212,255,0.09)" strokeWidth="1" strokeDasharray="6 4" />
              <path className="isobar-flow isobar-wake" d="M900 150 C1032 106 1130 156 1150 238 C1172 328 1062 368 918 330" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" strokeDasharray="8 5" />
            </g>

            <path
              id="car-body-path"
              ref={bodyPathRef}
              d={BODY_PATH}
              fill="rgba(9,9,15,0.18)"
              stroke="#E8FF00"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <g fill="none" strokeLinecap="round">
              <g className="front-wheel">
                <Wheel cx={230} cy={270} />
              </g>
              <g className="rear-wheel">
                <Wheel cx={930} cy={270} />
              </g>
            </g>

            <g className="hero-layer layer-wing" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.6" strokeLinecap="round">
              {WING_DETAIL_PATHS.map((path) => (
                <path key={path} d={path} />
              ))}
              <path d="M126 256 C158 250 188 248 218 250" strokeDasharray="3 2" />
              <path d="M964 214 C994 204 1020 206 1042 220" strokeDasharray="3 2" />
              <circle cx="212" cy="250" r="3" />
              <path d="M1018 198 C1028 204 1036 212 1042 222 M1022 214 C1032 220 1040 226 1046 234 M1024 230 C1034 234 1042 238 1050 242" />
            </g>

            <g className="hero-layer layer-annotations" fill="none" stroke="rgba(0,212,255,0.28)" strokeWidth="0.6" fontFamily="monospace">
              {ANNOTATIONS.map((annotation) => (
                <CrossMarker key={`${annotation.x}-${annotation.y}`} x={annotation.x} y={annotation.y} label={annotation.label} />
              ))}
              <path d="M866 252 C878 262 888 274 894 288" stroke="rgba(0,212,255,0.35)" />
              <text x="898" y="286" fill="rgba(0,212,255,0.35)" fontSize="7">
                28°
              </text>
            </g>

            <g className="hero-layer layer-cooling" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6" markerEnd="url(#hero-arrow)">
              <path d="M176 244 C196 240 210 248 222 260" />
              <path d="M430 236 C456 236 476 236 500 236" />
              <path d="M258 270 C276 270 292 268 308 264" />
              <path d="M958 270 C980 270 998 266 1014 260" />
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
