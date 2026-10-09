"use client";

import { useEffect, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/anim";
import { storeLenis } from "@/lib/scroll";

export default function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Weak devices keep native scrolling: no rAF loop, no smoothing cost.
    if (prefersReducedMotion()) return;
    // Smooth scroll is an enhancement, not load-critical: start it after
    // the browser is idle so it never contends with hydration/LCP.
    // Until then scrollToHash() falls back to native smooth scrolling.
    let raf = 0;
    let idle = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let stopped = false;
    const start = async () => {
      if (stopped) return;
      const { default: Lenis } = await import("lenis");
      if (stopped) return;
      const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      storeLenis(lenis);
      const loop = (time: number) => {
        lenis.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };
    if (typeof window.requestIdleCallback === "function") {
      idle = window.requestIdleCallback(() => void start(), { timeout: 2500 });
    } else {
      timer = setTimeout(() => void start(), 1200);
    }
    return () => {
      stopped = true;
      if (typeof window.cancelIdleCallback === "function" && idle) {
        window.cancelIdleCallback(idle);
      }
      if (timer) clearTimeout(timer);
      cancelAnimationFrame(raf);
      storeLenis(undefined);
    };
  }, []);
  return <>{children}</>;
}
