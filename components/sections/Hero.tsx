"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Backdrop from "../Backdrop";
import Orb from "../Orb";
import { scrollToHash } from "@/lib/scroll";
import MagneticButton from "../MagneticButton";
import { markJs, prefersReducedMotion as prefersReduced } from "@/lib/anim";
import { waLink } from "@/lib/site";
import type { Locale } from "@/lib/i18n";

export type HeroDict = {
  eyebrow: string;
  titleA: string;
  titleB: string;
  tagline: string;
  sub: string;
  ctaPrimary: string;
  ctaSecondary: string;
  waText: string;
  scrollHint: string;
};

function Words({ text, base = 0 }: { text: string; base?: number }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <span key={i} className="reveal-mask" aria-hidden={false}>
          <span
            className="reveal-word"
            style={{ "--word-delay": `${(base + i * 0.06).toFixed(2)}s` } as CSSProperties}
          >
            {w}
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}

export default function Hero({ dict, locale }: { dict: HeroDict; locale: Locale }) {
  const ref = useRef<HTMLElement>(null);
  const cjk = locale === "ja" || locale === "zh";
  const titleAWords = dict.titleA.split(" ").length;

  useEffect(() => {
    markJs();
    const el = ref.current;
    if (!el) return;
    // Pure-CSS choreography: .hero-play flips the initial states defined
    // in globals.css (words rise, fades lift, logo scales). No-JS and
    // reduced-motion stay visible without waiting.
    // Start once fonts are in (or quickly time out) — deliberately NOT gated on
    // window load / preloader exit, so LCP isn't held hostage by full page load.
    // The preloader overlay still covers the screen on its own schedule.
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      el.classList.add("hero-play");
    };
    if (prefersReduced()) {
      start();
      return;
    }
    let timer = 0;
    if (document.fonts?.ready) {
      document.fonts.ready.then(start);
      timer = window.setTimeout(start, 900);
    } else {
      start();
    }
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-navy-950"
      style={{
        backgroundImage:
          "linear-gradient(135deg, #061029 0%, #0d2758 70%, #123063 100%)",
      }}
    >
      {/* living + interactive background */}
      <Backdrop variant="hero" />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-20 pt-32 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:pt-40">
        <div>
          <p
            data-hero-fade
            style={{ "--hero-delay": "0.45s" } as CSSProperties}
            className="inline-block rounded-full border border-sky-hi/40 bg-white/5 px-4 py-1.5 text-sm font-bold tracking-wide text-sky-hi"
          >
            {dict.eyebrow}
          </p>
          <h1
            id="hero-title"
            className="mt-5 text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl"
          >
            <span className="block">
              {cjk ? dict.titleA : <Words text={dict.titleA} />}
            </span>
            <span className="block text-gold">
              {cjk ? dict.titleB : <Words text={dict.titleB} base={titleAWords * 0.06} />}
            </span>
          </h1>
          <p
            data-hero-fade
            style={{ "--hero-delay": "0.55s" } as CSSProperties}
            className="mt-3 text-lg font-semibold tracking-wide text-sky-hi"
          >
            {dict.tagline}
          </p>
          <p data-hero-fade style={{ "--hero-delay": "0.65s" } as CSSProperties} className="mt-4 max-w-xl text-lg text-white/75">
            {dict.sub}
          </p>
          <div data-hero-fade style={{ "--hero-delay": "0.75s" } as CSSProperties} className="mt-8 flex flex-wrap gap-3">
            <MagneticButton>
              <a
                href={waLink(dict.waText)}
                target="_blank"
                rel="noopener noreferrer"
                data-track="hero-cta"
                className="inline-block rounded-full bg-gold px-7 py-3.5 font-bold text-navy-950 shadow-lg shadow-gold/20 transition-shadow hover:shadow-gold/40"
              >
                {dict.ctaPrimary}
              </a>
            </MagneticButton>
            <a
              href={`/${locale}#harga`}
              onClick={(e) => {
                e.preventDefault();
                scrollToHash("#harga");
              }}
              className="inline-block rounded-full border border-white/25 px-7 py-3.5 font-bold text-white hover:border-gold hover:text-gold"
            >
              {dict.ctaSecondary}
            </a>
          </div>
        </div>

        <div
          data-hero-logo
          className="relative mx-auto aspect-square min-h-[280px] w-full max-w-sm lg:max-w-md"
          aria-hidden="false"
        >
          <div className="absolute inset-0 rounded-full bg-sky-hi/10 blur-[80px]" aria-hidden="true" />
          <Orb className="relative h-full w-full" />
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <div
          data-hero-fade
          style={{ "--hero-delay": "0.9s" } as CSSProperties}
          className="flex items-center gap-3 text-sm font-semibold text-white/50"
          aria-hidden="true"
        >
          <span className="h-px w-10 bg-white/25" />
          {dict.scrollHint}
          <span aria-hidden="true">↓</span>
        </div>
      </div>
    </section>
  );
}
