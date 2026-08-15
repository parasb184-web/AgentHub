"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 2400, suffix: "+", label: "Agents Listed" },
  { value: 50, suffix: "K+", label: "API Calls" },
  { value: 98, suffix: "%", label: "Uptime" },
  { value: 12, suffix: "ms", label: "Avg Latency" },
];

function useCountUp(target: number, active: boolean, duration = 1600) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      setCount(current);
      if (progress < 1) {
        start = requestAnimationFrame(tick);
      }
    };

    start = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(start);
  }, [active, target, duration]);

  return count;
}

function StatItem({ value, suffix, label, active, delay }: {
  value: number;
  suffix: string;
  label: string;
  active: boolean;
  delay: number;
}) {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [active, delay]);

  const count = useCountUp(value, started);

  return (
    <div className="flex flex-col items-center gap-1 py-2">
      <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#1a1a2e]">
        {started ? count : 0}
        <span className="text-[#e74c3c]">{suffix}</span>
      </span>
      <span className="text-xs md:text-sm font-mono uppercase tracking-[0.2em] text-[#64748b]">
        {label}
      </span>
    </div>
  );
}

export function StatsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="w-full px-6 md:px-12 lg:px-20 pb-2 pt-6 md:pt-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {stats.map((stat, i) => (
          <StatItem
            key={stat.label}
            value={stat.value}
            suffix={stat.suffix}
            label={stat.label}
            active={visible}
            delay={i * 150}
          />
        ))}
      </div>
    </section>
  );
}
