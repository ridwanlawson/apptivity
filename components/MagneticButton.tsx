"use client";

import { type ReactNode, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/anim";

// Magnetic hover only on fine pointers; static otherwise. Respects reduced motion.
// Plain span + CSS transition: identical feel at ±3px, without the motion runtime.
// Transform is written straight to the DOM (no setState per mousemove —
// a React re-render on every pointer move janks weak CPUs sharing the
// thread with the hero canvases).
export default function MagneticButton({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [reduce] = useState(() => prefersReducedMotion());

  const move = (x: number, y: number) => {
    const el = ref.current;
    if (el) el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
  };

  return (
    <span
      ref={ref}
      className={`inline-block ${className}`}
      style={{ transition: "transform 0.18s ease-out" }}
      onMouseMove={(e) => {
        if (reduce) return;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        move(
          Math.max(-8, Math.min(8, e.clientX - (r.left + r.width / 2))) * 0.4,
          Math.max(-8, Math.min(8, e.clientY - (r.top + r.height / 2))) * 0.4,
        );
      }}
      onMouseLeave={() => move(0, 0)}
    >
      {children}
    </span>
  );
}
