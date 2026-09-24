"use client";

import { useEffect, useRef } from "react";

// Gold dot + trailing ring. Fine pointers only; never on touch or reduced motion.
// The two layers always render (SSR + client identical → no hydration mismatch);
// a class on <html> turns them on, so a cursor-less device never sees them.
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      return;
    }
    const root = document.documentElement;
    root.classList.add("cursor-on");
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
      document.body.classList.toggle(
        "cursor-text",
        !!(e.target as HTMLElement).closest("input, textarea, select"),
      );
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
        ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px) scale(${down ? 0.8 : 1})`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    root.addEventListener("mouseleave", onLeave);
    root.addEventListener("mouseenter", onEnter);
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("cursor-on");
      document.body.classList.remove("has-cursor", "cursor-text");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      root.removeEventListener("mouseleave", onLeave);
      root.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} aria-hidden="true" className="cursor-dot" />
      <div ref={ringRef} aria-hidden="true" className="cursor-ring" />
    </>
  );
}
