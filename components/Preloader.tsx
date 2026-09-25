"use client";

import { useEffect, useRef, useState } from "react";
import LogoMark from "./LogoMark";
import { TAGLINE, SITE_DOMAIN, COMPANY } from "@/lib/site";
import { prefersReducedMotion } from "@/lib/anim";

const SEEN_KEY = "apptivity:seen";

function signalReady(): void {
  (window as unknown as { __apptivityReady?: boolean }).__apptivityReady = true;
  window.dispatchEvent(new Event("apptivity:ready"));
}

// Preloader is server-rendered (first paint is the logo, never the page
// flashing first). Shown only while the page is still loading, and only
// on the first visit of a session — sessionStorage is marked by a blocking
// inline script in <head>, so returning visitors never see it at all.
// Entrance + exit are pure CSS (no animation runtime on the critical path).
export default function Preloader() {
  const [show, setShow] = useState(true);
  const [entered, setEntered] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const [reduce] = useState(() => prefersReducedMotion());

  // Entrance: kick transitions on the next frame after mount.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    let done = false;
    let exitTimer = 0;
    const finish = (animated: boolean) => {
      if (done) return;
      done = true;
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
        document.documentElement.removeAttribute("data-preload");
      } catch {
        /* private mode */
      }
      if (animated) {
        setLeaving(true);
        // Match the exit transition below (duration-500).
        exitTimer = window.setTimeout(() => setShow(false), 500);
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setShow(false);
      }
      window.setTimeout(signalReady, 350);
    };

    let seen = false;
    try {
      seen =
        sessionStorage.getItem(SEEN_KEY) === "1" ||
        document.documentElement.hasAttribute("data-preload-hidden");
    } catch {
      seen = false;
    }
    const loadedAlready = document.readyState === "complete";
    if (seen || reduce || loadedAlready) {
      finish(false);
      return;
    }

    const t0 = performance.now();
    const MIN = 400;
    const MAX = 1800;
    let raf = 0;
    // Bar width is written straight to the DOM: identical visuals,
    // no re-render per frame.
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / MAX);
      if (barRef.current) barRef.current.style.width = `${Math.round(p * 100)}%`;
      if (p >= 1) {
        finish(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    let fontsDone = false;
    let loaded = false;
    const maybeFinish = () => {
      if (fontsDone && loaded && performance.now() - t0 >= MIN) finish(true);
    };
    const onLoad = () => {
      loaded = true;
      maybeFinish();
    };
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        fontsDone = true;
        maybeFinish();
      });
    } else {
      fontsDone = true;
    }
    window.addEventListener("load", onLoad);
    const hard = window.setTimeout(() => finish(true), MAX + 400);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
      window.clearTimeout(hard);
      window.clearTimeout(exitTimer);
    };
  }, [reduce]);

  if (!show) return null;

  return (
    <div
      className={`preloader fixed inset-0 z-[90] flex flex-col items-center justify-center gap-4 bg-navy-950 transition-all duration-500 ${
        leaving ? "-translate-y-10 opacity-0" : "translate-y-0 opacity-100"
      }`}
      role="status"
      aria-label={`${SITE_DOMAIN} loading`}
    >
      <div
        className={`transition-all duration-500 ${
          entered && !leaving ? "scale-100 opacity-100" : "scale-[0.92] opacity-0"
        }`}
      >
        <LogoMark className="h-20 w-20" />
      </div>
      <p
        className={`text-2xl font-extrabold tracking-tight text-white transition-all delay-150 duration-500 ${
          entered && !leaving
            ? "translate-y-0 opacity-100"
            : "translate-y-3 opacity-0"
        }`}
      >
        {SITE_DOMAIN}
      </p>
      <p
        className={`text-sm font-medium tracking-wide text-sky-hi transition-opacity delay-300 duration-500 ${
          entered && !leaving ? "opacity-100" : "opacity-0"
        }`}
      >
        {TAGLINE}
      </p>
      <div
        className="mt-2 h-[3px] w-44 overflow-hidden rounded-full bg-white/15"
        aria-hidden="true"
      >
        <div ref={barRef} className="h-full w-0 rounded-full bg-gold" />
      </div>
      <p className="sr-only">{COMPANY}</p>
    </div>
  );
}
