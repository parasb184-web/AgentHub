"use client";

import { useEffect, useRef, useState } from "react";

export function ScrollGlassReveal({
  children,
  className = "",
  delayMs = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const revealImmediately = () => {
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const rect = node.getBoundingClientRect();
      return rect.top <= viewportHeight * 0.94;
    };

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      revealImmediately()
    ) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );

    const frame = window.requestAnimationFrame(() => {
      if (revealImmediately()) {
        setIsVisible(true);
        observer.disconnect();
        return;
      }

      observer.observe(node);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`scroll-glass-reveal ${isVisible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}
