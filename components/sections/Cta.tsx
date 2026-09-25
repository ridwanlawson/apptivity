"use client";

import { useRef } from "react";
import MagneticButton from "../MagneticButton";
import Backdrop from "../Backdrop";
import { useReveal } from "@/lib/anim";
import { IG_URL, waLink } from "@/lib/site";

export type CtaDict = {
  title: string;
  sub: string;
  waButton: string;
  igButton: string;
  note: string;
};

export default function Cta({ dict, waText }: { dict: CtaDict; waText: string }) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section
      ref={ref}
      aria-labelledby="cta-title"
      className="relative overflow-hidden bg-navy-950"
      style={{
        backgroundImage:
          "linear-gradient(135deg, #0d2758 0%, #061029 75%)",
      }}
    >
      <Backdrop variant="cta" />
      <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:py-28">
        <h2
          data-reveal
          id="cta-title"
          className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl"
        >
          {dict.title}
        </h2>
        <p data-reveal className="mx-auto mt-4 max-w-xl text-lg text-white/70">
          {dict.sub}
        </p>
        <div data-reveal className="mt-8 flex flex-wrap justify-center gap-3">
          <MagneticButton>
            <a
              href={waLink(waText)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-gold px-8 py-4 text-lg font-bold text-navy-950 shadow-xl shadow-gold/20 transition-shadow hover:shadow-gold/40"
            >
              {dict.waButton}
            </a>
          </MagneticButton>
          <a
            href={IG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full border border-white/25 px-8 py-4 text-lg font-bold text-white hover:border-gold hover:text-gold"
          >
            {dict.igButton}
          </a>
        </div>
        <p data-reveal className="mt-6 text-sm text-white/50">
          {dict.note}
        </p>
      </div>

      {/* Sticky mobile CTA */}
      <a
        href={waLink(waText)}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed inset-x-4 z-[70] rounded-full bg-gold py-3.5 text-center font-bold text-navy-950 shadow-2xl sm:hidden"
        style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
        aria-label={dict.waButton}
      >
        {dict.waButton}
      </a>
    </section>
  );
}
