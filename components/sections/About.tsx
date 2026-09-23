"use client";

import { useRef } from "react";
import SectionHeading from "../SectionHeading";
import { useReveal } from "@/lib/anim";

export type AboutDict = {
  eyebrow: string;
  title: string;
  body1: string;
  eyebrow2: string;
  body2: string;
  audiences: string[];
};

export default function About({
  dict,
  why,
}: {
  dict: AboutDict;
  why: { eyebrow: string; body: string };
}) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section
      ref={ref}
      id="tentang"
      aria-labelledby="tentang-title"
      className="scroll-mt-20 bg-paper"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div id="tentang-title">
          <SectionHeading eyebrow={dict.eyebrow} title={dict.title} />
        </div>
        <p data-reveal className="mt-6 max-w-3xl text-lg leading-relaxed text-muted">
          {dict.body1}
        </p>

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-ink/5" data-reveal>
            <SectionHeading eyebrow={dict.eyebrow2} title="" />
            <p className="mt-4 leading-relaxed text-muted">{dict.body2}</p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Audiens">
              {dict.audiences.map((a) => (
                <li
                  key={a}
                  className="rounded-full bg-navy-950 px-4 py-1.5 text-sm font-bold text-white"
                >
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-navy-950 p-8 text-white" data-reveal>
            <p className="text-sm font-bold uppercase tracking-widest text-gold">
              {why.eyebrow}
            </p>
            <p className="mt-4 leading-relaxed text-white/80">{why.body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
