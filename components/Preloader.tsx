"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import LogoMark from "./LogoMark";
import { TAGLINE, SITE_DOMAIN, COMPANY } from "@/lib/site";

function signalReady(): void {
  (window as unknown as { __apptivityReady?: boolean }).__apptivityReady = true;
  window.dispatchEvent(new Event("apptivity:ready"));
}

// First-visit-per-session preloader: logo + name + tagline + gold progress bar.
// Skipped on repeat views, reduced motion, or after hard timeout.
export default function Preloader() {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      try {
        sessionStorage.setItem("apptivity:seen", "1");
      } catch {
        /* private mode — show again next time */
      }
      setShow(false);
      // Let exit animation breathe before hero choreography starts.
      window.setTimeout(signalReady, 350);
    };

    let seen = false;
    try {
      seen = sessionStorage.getItem("apptivity:seen") === "1";
    } catch {
      seen = false;
    }
    if (seen || reduce) {
      signalReady();
      return;
    }
    // Mount-gate: sessionStorage only exists client-side, so show flag
    // must flip here after hydration to avoid a first-paint flash.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShow(true);

    const t0 = performance.now();
    const MIN = 600;
    const MAX = 1800;
    let raf = 0;
    const tick = (t: number) => {
      const elapsed = t - t0;
      setProgress(Math.min(1, elapsed / MAX));
      if (elapsed >= MAX) {
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    let fontsDone = false;
    let loaded = document.readyState === "complete";
    const maybeFinish = () => {
      if (fontsDone && loaded && performance.now() - t0 >= MIN) finish();
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
    const hard = window.setTimeout(finish, MAX + 400);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
      window.clearTimeout(hard);
    };
  }, [reduce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-4 bg-navy-950"
          role="status"
          aria-label={`${SITE_DOMAIN} loading`}
          exit={{ opacity: 0, y: -40, transition: { duration: 0.45 } }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <LogoMark className="h-20 w-20" />
          </motion.div>
          <motion.p
            className="text-2xl font-extrabold tracking-tight text-white"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {SITE_DOMAIN}
          </motion.p>
          <motion.p
            className="text-sm font-medium tracking-wide text-sky-hi"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {TAGLINE}
          </motion.p>
          <div
            className="mt-2 h-[3px] w-44 overflow-hidden rounded-full bg-white/15"
            aria-hidden="true"
          >
            <div
              className="h-full rounded-full bg-gold transition-[width]"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <p className="sr-only">{COMPANY}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
