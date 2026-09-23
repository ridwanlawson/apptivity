"use client";

import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { type ReactNode, useRef, useState } from "react";

// Magnetic hover only on fine pointers; static otherwise. Respects reduced motion.
export default function MagneticButton({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const reduce = useReducedMotion();

  return (
    <m.span
      ref={ref}
      className={`inline-block ${className}`}
      animate={reduce ? { x: 0, y: 0 } : pos}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onMouseMove={(e) => {
        if (reduce) return;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        setPos({
          x: Math.max(-8, Math.min(8, e.clientX - (r.left + r.width / 2))) * 0.4,
          y: Math.max(-8, Math.min(8, e.clientY - (r.top + r.height / 2))) * 0.4,
        });
      }}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
    >
      {children}
    </m.span>
  );
}
