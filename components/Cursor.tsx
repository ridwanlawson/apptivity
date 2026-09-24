"use client";

import { useEffect, useRef, useState } from "react";

// Gold dot + trailing ring. Fine pointers only; never on touch or reduced motion.
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  // Decided at mount (SSR-safe): fine pointer + no reduced motion.
  const [enabled] = useState(
    () =>
      typeof window !== "undefined" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches,
  );

  useEffect(() => {
    if (!enabled) return;
    document.body.classList.add("has-cursor");

    const pos = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    let raf = 0;
    let down = false;

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const t = (e.target as HTMLElement).closest(
        "a, button, [role='button'], [role='tab'], [role='option'], input, textarea, select",
      );
      ringRef.current?.classList.toggle("cursor-hot", !!t);
      const visible = (e.target as HTMLElement).closest("input, textarea, select");
      document.body.classList.toggle("cursor-text", !!visible);
    };
    const onDown = () => {
      down = true;
      ringRef.current?.classList.add("cursor-down");
    };
    const onUp = () => {
      down = false;
      ringRef.current?.classList.remove("cursor-down");
    };
    const onLeave = () => {
      dotRef.current?.classList.add("cursor-hidden");
      ringRef.current?.classList.add("cursor-hidden");
    };
    const onEnter = () => {
      dotRef.current?.classList.remove("cursor-hidden");
      ringRef.current?.classList.remove("cursor-hidden");
    };

    const loop = () => {
      ring.x += (pos.x - ring.x) * 0.16;
      ring.y += (pos.y - ring.y) * 0.16;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      }
      if (ringRef.current) {
        const s = down ? 0.8 : 1;
        ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px) scale(${s})`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    return () => {
      cancelAnimationFrame(raf);
      document.body.classList.remove("has-cursor", "cursor-text");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div ref={dotRef} aria-hidden="true" className="cursor-dot" />
      <div ref={ringRef} aria-hidden="true" className="cursor-ring" />
    </>
  );
}
