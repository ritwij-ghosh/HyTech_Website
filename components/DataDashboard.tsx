"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis
} from "recharts";
import { scaleIn, staggerContainer } from "@/lib/animations";

const chartTheme = {
  grid: "rgba(255,255,255,0.08)",
  text: "#888899",
  cyan: "#7EB6C8",
  volt: "#D6B45C",
  green: "#57ff8a",
  orange: "#ff9f1c",
  red: "#ff4d6d"
};

const motorTemp = Array.from({ length: 18 }, (_, i) => ({
  t: i * 8,
  fl: 42 + i * 1.8 + Math.sin(i) * 2,
  fr: 44 + i * 1.7 + Math.cos(i) * 2,
  rl: 43 + i * 2.0 + Math.sin(i * 0.7) * 2,
  rr: 45 + i * 1.9 + Math.cos(i * 0.8) * 2
}));

const soc = Array.from({ length: 22 }, (_, i) => ({
  t: i * 2,
  soc: 98 - i * 1.7 - Math.sin(i * 0.5) * 1.2
}));

const gg = Array.from({ length: 52 }, (_, i) => ({
  x: Number((Math.sin(i * 0.52) * (1.2 + (i % 7) * 0.08)).toFixed(2)),
  y: Number((Math.cos(i * 0.41) * (0.8 + (i % 9) * 0.08)).toFixed(2))
}));

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div variants={scaleIn} className="scanline relative h-[320px] rounded-md border border-white/[0.06] bg-surface/85 p-4">
      <div className="mb-3 font-mono text-[10px] tracking-[0.18em] text-cyan-electric">{title}</div>
      {children}
    </motion.div>
  );
}

export default function DataDashboard() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((value) => value + 1), 850);
    return () => window.clearInterval(id);
  }, []);

  const torque = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        time: `${i + 1}`,
        FL: 140 + Math.sin((tick + i) * 0.8) * 36,
        FR: 136 + Math.cos((tick + i) * 0.75) * 35,
        RL: 156 + Math.sin((tick + i) * 0.55) * 42,
        RR: 150 + Math.cos((tick + i) * 0.6) * 40
      })),
    [tick]
  );

  return (
    <section id="data" className="relative overflow-hidden bg-[#07090a] py-24 md:py-32">
      <div className="absolute inset-0 grid-overlay opacity-25" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-8 font-mono text-sm tracking-[0.12em] text-volt">
          RACE DATA — HT09 ENDURANCE RUN — FSAE MICHIGAN 2025<span className="animate-pulse">_</span>
        </div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-5 lg:grid-cols-2"
        >
          <Panel title="MOTOR TEMPERATURE OVER LAP">
            <ResponsiveContainer width="100%" height="88%">
              <LineChart data={motorTemp}>
                <CartesianGrid stroke={chartTheme.grid} />
                <XAxis dataKey="t" stroke={chartTheme.text} tick={{ fontSize: 10 }} />
                <YAxis stroke={chartTheme.text} tick={{ fontSize: 10 }} domain={[35, 90]} />
                <Tooltip contentStyle={{ background: "#111118", border: "1px solid rgba(255,255,255,.1)" }} />
                <ReferenceLine y={82} stroke={chartTheme.green} strokeDasharray="4 4" label="NOMINAL" />
                <Line dataKey="fl" dot={false} stroke={chartTheme.cyan} strokeWidth={2} />
                <Line dataKey="fr" dot={false} stroke={chartTheme.volt} strokeWidth={2} />
                <Line dataKey="rl" dot={false} stroke={chartTheme.orange} strokeWidth={2} />
                <Line dataKey="rr" dot={false} stroke={chartTheme.red} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Panel>
          <Panel title="BATTERY STATE OF CHARGE">
            <ResponsiveContainer width="100%" height="88%">
              <AreaChart data={soc}>
                <CartesianGrid stroke={chartTheme.grid} />
                <XAxis dataKey="t" stroke={chartTheme.text} tick={{ fontSize: 10 }} />
                <YAxis stroke={chartTheme.text} tick={{ fontSize: 10 }} domain={[55, 100]} />
                <Tooltip contentStyle={{ background: "#111118", border: "1px solid rgba(255,255,255,.1)" }} />
                <ReferenceLine x={8} stroke={chartTheme.cyan} label="FAST LAP" />
                <ReferenceLine x={24} stroke={chartTheme.text} label="PIT" />
                <ReferenceLine x={32} stroke={chartTheme.volt} label="ENDURANCE START" />
                <Area dataKey="soc" stroke={chartTheme.volt} fill={chartTheme.volt} fillOpacity={0.22} />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>
          <Panel title="TORQUE DISTRIBUTION">
            <ResponsiveContainer width="100%" height="88%">
              <BarChart data={torque}>
                <CartesianGrid stroke={chartTheme.grid} />
                <XAxis dataKey="time" stroke={chartTheme.text} tick={{ fontSize: 10 }} />
                <YAxis stroke={chartTheme.text} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#111118", border: "1px solid rgba(255,255,255,.1)" }} />
                <Legend />
                <Bar dataKey="FL" fill={chartTheme.cyan} />
                <Bar dataKey="FR" fill={chartTheme.volt} />
                <Bar dataKey="RL" fill={chartTheme.cyan} opacity={0.7} />
                <Bar dataKey="RR" fill={chartTheme.volt} opacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          </Panel>
          <Panel title="G-G DIAGRAM / PERFORMANCE ENVELOPE">
            <ResponsiveContainer width="100%" height="88%">
              <ScatterChart>
                <CartesianGrid stroke={chartTheme.grid} />
                <XAxis dataKey="x" type="number" domain={[-2, 2]} stroke={chartTheme.text} tick={{ fontSize: 10 }} name="Lat" />
                <YAxis dataKey="y" type="number" domain={[-2, 2]} stroke={chartTheme.text} tick={{ fontSize: 10 }} name="Long" />
                <ZAxis range={[24]} />
                <Tooltip contentStyle={{ background: "#111118", border: "1px solid rgba(255,255,255,.1)" }} />
                <Scatter data={gg} line={{ stroke: chartTheme.volt, strokeWidth: 2 }} fill={chartTheme.cyan}>
                  {gg.map((_, index) => (
                    <Cell key={index} fill={index > gg.length - 12 ? chartTheme.volt : chartTheme.cyan} fillOpacity={index / gg.length} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </Panel>
        </motion.div>
        <p className="mt-6 text-center font-mono text-xs italic text-muted">
          Live telemetry enabled teams to make real-time setup decisions during the event.
        </p>
      </div>
    </section>
  );
}
