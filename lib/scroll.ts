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

// Scrolls so the section TITLE lands just below the fixed header bar.
// Every section has a `#<id>-title` heading wrapper; targeting it (instead
// of the section roof, which still carries big py-20/py-28 padding) puts
// the title flush under the bar with no dead gap and no cut-off titles.
export function scrollToHash(hash: string): void {
  const section = document.querySelector(hash) as HTMLElement | null;
  if (!section) return;
  const el =
    (document.querySelector(`${hash}-title`) as HTMLElement | null) ?? section;
  const reduce = prefersReduced();
  // Measure after paint: the mobile dropdown may still be open in this
  // frame (React hasn't committed the close yet) and would inflate the
  // measured height by hundreds of px, landing the section way too low.
  // The bar itself never changes height, so it is measured — not <header>.
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      const bar = document.querySelector("[data-header-bar]");
      const headerH = bar?.getBoundingClientRect().height ?? 72;
      const y = el.getBoundingClientRect().top + window.scrollY - headerH - 4;
      const active = lenis();
      if (active && !reduce) {
        active.scrollTo(y, { duration: 1.4 });
      } else {
        window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
      }
      window.history.replaceState(null, "", hash);
    }),
  );
}

export function storeLenis(instance: Lenis | undefined): void {
  (window as unknown as LenisWindow).__lenis = instance;
}
