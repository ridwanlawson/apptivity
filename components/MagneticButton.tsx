"use client";

import { type ReactNode, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/anim";

// Magnetic hover only on fine pointers; static otherwise. Respects reduced motion.
// Plain span + CSS transition: identical feel at ±3px, without the motion runtime.
export default function MagneticButton({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [reduce] = useState(() => prefersReducedMotion());

  return (
    <span
      ref={ref}
      className={`inline-block ${className}`}
      style={{
        transform: `translate(${reduce ? 0 : pos.x}px, ${reduce ? 0 : pos.y}px)`,
        transition: "transform 0.18s ease-out",
      }}
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
    </span>
  );
}
