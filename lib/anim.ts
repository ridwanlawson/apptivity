"use client";

import { useEffect, type RefObject } from "react";

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

let lowPowerCache: boolean | null = null;

// Heuristic weak-device detection: few CPU cores, little RAM, or the user
// asked to save data. Memoized; also stamps <html class="low-power"> so CSS
// can kill expensive paint (giant blurs) without running any JS loop.
export function isLowPower(): boolean {
  if (lowPowerCache !== null) return lowPowerCache;
  let low = false;
  if (typeof window !== "undefined" && typeof navigator !== "undefined") {
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    const cores = nav.hardwareConcurrency ?? 8;
    const ram = nav.deviceMemory ?? 8;
    low =
      cores <= 4 || ram <= 4 || nav.connection?.saveData === true;
    if (low) document.documentElement.classList.add("low-power");
  }
  lowPowerCache = low;
  return low;
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
