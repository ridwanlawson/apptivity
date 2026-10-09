"use client";

import { useEffect, type RefObject } from "react";

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function markJs(): void {
  document.documentElement.classList.add("js");
}

// Generic scroll reveal: [data-reveal] items fade up once on enter.
// Hiding happens via JS only (no-JS stays visible). IntersectionObserver +
// CSS replaces gsap/ScrollTrigger here: same effect, zero runtime on load.
// (The 0.08s stagger of the old batch reveal is intentionally dropped.)
export function useReveal<T extends HTMLElement>(
  ref: RefObject<T | null>,
  deps: unknown[] = [],
): void {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const items = el.querySelectorAll("[data-reveal]");
    if (!items.length) return;
    items.forEach((it) => it.classList.add("reveal-hidden"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-visible");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    items.forEach((it) => io.observe(it));
    return () => io.disconnect();
    // deps are caller-owned static keys (section dicts never change identity per mount).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// One-shot load choreography gate: resolves when preloader is done
// (or immediately when skipped / reduced motion).
export function whenReady(cb: () => void): () => void {
  if (
    typeof window === "undefined" ||
    (window as unknown as { __apptivityReady?: boolean }).__apptivityReady ||
    prefersReducedMotion()
  ) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener("apptivity:ready", handler, { once: true });
  return () => window.removeEventListener("apptivity:ready", handler);
}
