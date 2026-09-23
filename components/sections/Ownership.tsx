"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import SectionHeading from "../SectionHeading";
import { prefersReducedMotion, useReveal } from "@/lib/anim";

gsap.registerPlugin(Flip);

export type OwnershipDict = {
  eyebrow: string;
  title: string;
  intro: string;
  tabBuy: string;
  tabRent: string;
  pros: string;
  cons: string;
  buy: { pros: string[]; cons: string[] };
  rent: { pros: string[]; cons: string[] };
};

type Mode = "buy" | "rent";

// Interactive Beli vs Sewa toggle with GSAP Flip layout animation.
export default function Ownership({ dict }: { dict: OwnershipDict }) {
  const ref = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<Mode>("buy");
  const flipState = useRef<Flip.FlipState | null>(null);
  useReveal(ref);

  const switchMode = (m: Mode) => {
    if (m === mode) return;
    if (!prefersReducedMotion()) {
      flipState.current = Flip.getState("[data-flip]");
    }
    setMode(m);
  };

  useLayoutEffect(() => {
    if (flipState.current && !prefersReducedMotion()) {
      Flip.from(flipState.current, {
        duration: 0.6,
        ease: "power3.inOut",
        stagger: 0.02,
      });
      flipState.current = null;
    }
  }, [mode]);

  const data = mode === "buy" ? dict.buy : dict.rent;

  return (
    <section
      ref={ref}
      id="kepemilikan"
      aria-labelledby="kepemilikan-title"
      className="scroll-mt-20 bg-paper"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div id="kepemilikan-title">
          <SectionHeading eyebrow={dict.eyebrow} title={dict.title} />
        </div>
        <p data-reveal className="mt-4 max-w-3xl text-lg text-muted">
          {dict.intro}
        </p>

        <div data-reveal className="mt-8 flex justify-center">
          <div
            role="tablist"
            aria-label={dict.title}
            className="inline-flex rounded-full bg-white p-1.5 shadow-sm ring-1 ring-ink/10"
          >
            {(["buy", "rent"] as Mode[]).map((m) => (
              <button
                key={m}
                role="tab"
                aria-selected={mode === m}
                onClick={() => switchMode(m)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") switchMode("rent");
                  if (e.key === "ArrowLeft") switchMode("buy");
                }}
                className={`rounded-full px-6 py-2.5 text-sm font-bold transition-colors sm:text-base ${
                  mode === m
                    ? "bg-navy-950 text-white"
                    : "text-muted hover:text-ink"
                }`}
              >
                {m === "buy" ? dict.tabBuy : dict.tabRent}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2" role="tabpanel">
          <div
            data-flip
            className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-ink/5"
          >
            <h3 className="flex items-center gap-2 text-lg font-extrabold text-ink">
              <span aria-hidden="true" className="text-emerald-600">✓</span>
              {dict.pros}
            </h3>
            <ul className="mt-4 space-y-3">
              {data.pros.map((p) => (
                <li key={p} className="flex gap-3 leading-relaxed text-muted">
                  <span aria-hidden="true" className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div
            data-flip
            className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-ink/5"
          >
            <h3 className="flex items-center gap-2 text-lg font-extrabold text-ink">
              <span aria-hidden="true" className="text-amber-600">!</span>
              {dict.cons}
            </h3>
            <ul className="mt-4 space-y-3">
              {data.cons.map((c) => (
                <li key={c} className="flex gap-3 leading-relaxed text-muted">
                  <span aria-hidden="true" className="mt-1 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
