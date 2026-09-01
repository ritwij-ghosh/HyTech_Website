import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#08090B",
        volt: "#D6B45C",
        "cyan-electric": "#7EB6C8",
        "gt-gold": "#B3A369",
        surface: "#111115",
        ink: "#F4F1EA",
        muted: "#96948B"
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "Orbitron", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "IBM Plex Mono", "monospace"]
      },
      boxShadow: {
        volt: "0 0 24px rgba(214, 180, 92, 0.24)",
        cyan: "0 0 24px rgba(126, 182, 200, 0.18)"
      },
      backgroundImage: {
        grid:
          "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
        carbon:
          "repeating-linear-gradient(45deg, rgba(255,255,255,0.035) 0 2px, transparent 2px 8px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 8px)"
      },
      animation: {
        "pulse-glow": "pulseGlow 2.4s ease-in-out infinite",
        scan: "scan 6s linear infinite",
        shimmer: "shimmer 1.5s ease-in-out",
        "float-slow": "floatSlow 7s ease-in-out infinite",
        "trace-dot": "traceDot 4.5s linear infinite",
        "meter-fill": "meterFill 5s ease-in-out infinite",
        "grid-drift": "gridDrift 18s linear infinite"
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.5", filter: "drop-shadow(0 0 4px rgba(214,180,92,.22))" },
          "50%": { opacity: "1", filter: "drop-shadow(0 0 18px rgba(214,180,92,.42))" }
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" }
        },
        shimmer: {
          "0%": { transform: "translateX(-120%) skewX(-18deg)" },
          "100%": { transform: "translateX(180%) skewX(-18deg)" }
        },
        floatSlow: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-14px,0)" }
        },
        traceDot: {
          "0%": { offsetDistance: "0%" },
          "100%": { offsetDistance: "100%" }
        },
        meterFill: {
          "0%, 100%": { height: "28%" },
          "50%": { height: "88%" }
        },
        gridDrift: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "80px 80px" }
        }
      }
    }
  },
  plugins: []
};

export default config;
