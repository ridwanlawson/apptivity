import type Lenis from "lenis";

type LenisWindow = Window & { __lenis?: Lenis };

function lenis(): Lenis | undefined {
  return (window as unknown as LenisWindow).__lenis;
}

export function prefersReduced(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

// Scrolls so the target lands centered in the viewport.
export function scrollToHash(hash: string): void {
  const el = document.querySelector(hash) as HTMLElement | null;
  if (!el) return;
  const reduce = prefersReduced();
  const vh = window.innerHeight;
  const h = Math.min(el.offsetHeight, vh);
  const offset = -(vh / 2 - h / 2);
  const active = lenis();
  if (active && !reduce) {
    active.scrollTo(el, { offset, duration: 1.4 });
  } else {
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  }
  window.history.replaceState(null, "", hash);
}

export function storeLenis(instance: Lenis | undefined): void {
  (window as unknown as LenisWindow).__lenis = instance;
}
