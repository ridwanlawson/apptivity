"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function markJs(): void {
  document.documentElement.classList.add("js");
}

// Generic scroll reveal: animates [data-reveal] children with stagger on enter.
export function useReveal(
  ref: RefObject<HTMLElement | null>,
  deps: unknown[] = [],
): void {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const items = el.querySelectorAll("[data-reveal]");
      if (!items.length) return;
      gsap.set(items, { y: 24, opacity: 0 });
      ScrollTrigger.batch(items, {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
            overwrite: true,
          }),
      });
    }, el);
    return () => ctx.revert();
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
