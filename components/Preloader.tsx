"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import LogoMark from "./LogoMark";
import { TAGLINE, SITE_DOMAIN, COMPANY } from "@/lib/site";

const SEEN_KEY = "apptivity:seen";

function signalReady(): void {
  (window as unknown as { __apptivityReady?: boolean }).__apptivityReady = true;
  window.dispatchEvent(new Event("apptivity:ready"));
}

// Preloader is server-rendered (first paint is the logo, never the page
// flashing first). Shown only while the page is still loading, and only
// on the first visit of a session — sessionStorage is marked by a blocking
// inline script in <head>, so returning visitors never see it at all.
export default function Preloader() {
  const [show, setShow] = useState(true);
  const barRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
        document.documentElement.removeAttribute("data-preload");
      } catch {
        /* private mode */
      }
      setShow(false);
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShow(false);
      signalReady();
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
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    let fontsDone = false;
    let loaded = false;
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
          className="preloader fixed inset-0 z-[90] flex flex-col items-center justify-center gap-4 bg-navy-950"
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
            <div ref={barRef} className="h-full w-0 rounded-full bg-gold" />
          </div>
          <p className="sr-only">{COMPANY}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
