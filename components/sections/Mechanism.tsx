"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "../SectionHeading";
import { prefersReducedMotion, useReveal } from "@/lib/anim";

gsap.registerPlugin(ScrollTrigger);

export type MechanismDict = {
  eyebrow: string;
  title: string;
  badge: string;
  steps: { title: string; body: string }[];
};

// Sequential 4-step timeline with scroll-drawn progress line.
export default function Mechanism({ dict }: { dict: MechanismDict }) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const line = el.querySelector("[data-progress]");
      if (line) {
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el.querySelector("[data-timeline]"),
              start: "top 75%",
              end: "bottom 55%",
              scrub: 0.6,
            },
          },
        );
      }
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="mekanisme"
      aria-labelledby="mekanisme-title"
      className="scroll-mt-20 bg-white"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div id="mekanisme-title">
          <SectionHeading eyebrow={dict.eyebrow} title={dict.title} />
        </div>

        <ol data-timeline className="relative mt-12 space-y-6">
          <div
            aria-hidden="true"
            className="absolute bottom-4 left-[27px] top-4 w-[3px] rounded-full bg-ink/10"
          />
          <div
            data-progress
            aria-hidden="true"
            className="absolute bottom-4 left-[27px] top-4 w-[3px] origin-top rounded-full bg-gradient-to-b from-brand to-sky-hi"
          />
          {dict.steps.map((s, i) => {
            const last = i === dict.steps.length - 1;
            return (
              <li
                key={s.title}
                data-reveal
                className={`relative flex gap-5 rounded-3xl p-6 pl-16 sm:pl-20 ${
                  last ? "bg-navy-950 text-white" : "bg-paper"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute left-4 top-6 flex h-10 w-10 items-center justify-center rounded-full text-lg font-extrabold sm:left-6 ${
                    last ? "bg-gold text-navy-950" : "bg-navy-950 text-white"
                  }`}
                >
                  {i + 1}
                </span>
                <div>
                  <h3
                    className={`text-xl font-extrabold ${last ? "text-white" : "text-ink"}`}
                  >
                    {s.title}
                    {last && (
                      <span className="ml-2 inline-block rounded-full bg-gold px-3 py-0.5 align-middle text-xs font-bold uppercase text-navy-950">
                        {dict.badge}
                      </span>
                    )}
                  </h3>
                  <p
                    className={`mt-2 leading-relaxed ${last ? "text-white/80" : "text-muted"}`}
                  >
                    {s.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
