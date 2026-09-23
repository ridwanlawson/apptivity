"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "../SectionHeading";
import { prefersReducedMotion, useReveal } from "@/lib/anim";

gsap.registerPlugin(ScrollTrigger);

export type SchemeDict = {
  eyebrow: string;
  title: string;
  intro: string;
  pillars: { name: string; tag: string; body: string }[];
};

const ACTIVE_STYLES = [
  { dot: "bg-gold", ring: "ring-gold", text: "text-gold", card: "border-gold" },
  { dot: "bg-sky-hi", ring: "ring-sky-hi", text: "text-sky-hi", card: "border-sky-hi" },
  { dot: "bg-emerald-300", ring: "ring-emerald-300", text: "text-emerald-300", card: "border-emerald-300" },
];

// Scrollytelling: sticky triangle visual (CSS position:sticky — no JS pin,
// mobile-safe) + active pillar highlight driven by ScrollTrigger.
export default function Scheme({ dict }: { dict: SchemeDict }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useReveal(ref);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      el.querySelectorAll("[data-pillar]").forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 60%",
          end: "bottom 40%",
          onToggle: (self) => {
            if (self.isActive) setActive(i);
          },
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const pillars = dict.pillars;

  return (
    <section
      ref={ref}
      id="skema"
      aria-labelledby="skema-title"
      className="scroll-mt-20 bg-navy-950"
      style={{
        backgroundImage:
          "linear-gradient(160deg, #061029 0%, #0d2758 80%)",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div id="skema-title">
          <SectionHeading eyebrow={dict.eyebrow} title={dict.title} dark />
        </div>
        <p data-reveal className="mt-6 max-w-3xl text-lg leading-relaxed text-white/70">
          {dict.intro}
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Sticky visual */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div
              className="relative mx-auto max-w-sm rounded-3xl border border-white/10 bg-white/5 p-8"
              aria-hidden="true"
            >
              <svg viewBox="0 0 300 250" className="w-full">
                <polygon
                  points="150,30 40,210 260,210"
                  fill="none"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="2"
                />
                {/* Sahabat — peak */}
                <circle
                  cx="150"
                  cy="30"
                  r={active === 0 ? 16 : 11}
                  className={active === 0 ? "fill-[#f0bf4c]" : "fill-white/30"}
                  style={{ transition: "all .4s" }}
                />
                {/* Affiliator — base left */}
                <circle
                  cx="40"
                  cy="210"
                  r={active === 1 ? 16 : 11}
                  className={active === 1 ? "fill-[#5aa8e8]" : "fill-white/30"}
                  style={{ transition: "all .4s" }}
                />
                {/* Developer — base right */}
                <circle
                  cx="260"
                  cy="210"
                  r={active === 2 ? 16 : 11}
                  className={active === 2 ? "fill-[#6ee7b7]" : "fill-white/30"}
                  style={{ transition: "all .4s" }}
                />
              </svg>
              <ul className="mt-4 space-y-2 text-center text-sm font-bold">
                {pillars.map((p, i) => (
                  <li
                    key={p.name}
                    className={
                      i === active
                        ? ACTIVE_STYLES[i % ACTIVE_STYLES.length]?.text
                        : "text-white/40"
                    }
                    style={{ transition: "color .4s" }}
                  >
                    {i === 0 ? "▲ " : i === 1 ? "◀ " : "▶ "}
                    {p.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Steps */}
          <ol className="space-y-6">
            {pillars.map((p, i) => {
              const st = ACTIVE_STYLES[i % ACTIVE_STYLES.length];
              const isActive = i === active;
              return (
                <li
                  key={p.name}
                  data-pillar
                  data-reveal
                  aria-current={isActive ? "step" : undefined}
                  className={`rounded-3xl border-2 bg-white/5 p-7 backdrop-blur transition-colors duration-500 ${
                    isActive ? st?.card : "border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full font-extrabold text-navy-950 ${
                        isActive ? st?.dot : "bg-white/20 text-white"
                      }`}
                      style={{ transition: "all .4s" }}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-xl font-extrabold text-white">{p.name}</h3>
                      <p className={`text-sm font-bold ${isActive ? st?.text : "text-white/50"}`}>
                        {p.tag}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 leading-relaxed text-white/75">{p.body}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
