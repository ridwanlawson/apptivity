"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Backdrop from "../Backdrop";
import Orb from "../Orb";
import MagneticButton from "../MagneticButton";
import { markJs, whenReady } from "@/lib/anim";
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
};

function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i} className="reveal-mask" aria-hidden={false}>
          <span className="reveal-word">{w}</span>
          {i < text.split(" ").length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}

export default function Hero({ dict, locale }: { dict: HeroDict; locale: Locale }) {
  const ref = useRef<HTMLElement>(null);
  const cjk = locale === "ja" || locale === "zh";

  useEffect(() => {
    markJs();
    const el = ref.current;
    if (!el) return;
    // Non-JS / reduced-motion safe: CSS keeps words visible without .js choreography.
    const off = whenReady(() => {
      if (cjk) {
        gsap.fromTo(
          el.querySelectorAll("[data-hero-fade]"),
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: "power3.out" },
        );
        return;
      }
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.to(el.querySelectorAll(".reveal-word"), {
        y: 0,
        duration: 0.9,
        stagger: 0.06,
      }).fromTo(
        el.querySelectorAll("[data-hero-fade]"),
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" },
        "-=0.5",
      );
      // Brand-mark draw
      tl.fromTo(
        el.querySelectorAll("[data-hero-logo]"),
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1, ease: "power3.out" },
        0,
      );
    });
    return off;
  }, [cjk]);

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
              {cjk ? dict.titleB : <Words text={dict.titleB} />}
            </span>
          </h1>
          <p
            data-hero-fade
            className="mt-3 text-lg font-semibold tracking-wide text-sky-hi"
          >
            {dict.tagline}
          </p>
          <p data-hero-fade className="mt-4 max-w-xl text-lg text-white/75">
            {dict.sub}
          </p>
          <div data-hero-fade className="mt-8 flex flex-wrap gap-3">
            <MagneticButton>
              <a
                href={waLink(dict.waText)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full bg-gold px-7 py-3.5 font-bold text-navy-950 shadow-lg shadow-gold/20 transition-shadow hover:shadow-gold/40"
              >
                {dict.ctaPrimary}
              </a>
            </MagneticButton>
            <a
              href={`/${locale}#skema`}
              className="inline-block rounded-full border border-white/25 px-7 py-3.5 font-bold text-white hover:border-gold hover:text-gold"
            >
              {dict.ctaSecondary}
            </a>
          </div>
        </div>

        <div
          data-hero-logo
          className="relative mx-auto aspect-square w-full max-w-sm lg:max-w-md"
          aria-hidden="false"
        >
          <div className="absolute inset-0 rounded-full bg-sky-hi/10 blur-[80px]" aria-hidden="true" />
          <Orb className="relative h-full w-full" />
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <div
          data-hero-fade
          className="flex items-center gap-3 text-sm font-semibold text-white/50"
          aria-hidden="true"
        >
          <span className="h-px w-10 bg-white/25" />
          Scroll
          <span aria-hidden="true">↓</span>
        </div>
      </div>
    </section>
  );
}
