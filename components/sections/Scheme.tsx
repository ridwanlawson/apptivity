"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
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
  { dot: "bg-gold", text: "text-gold", card: "border-gold", glow: "#f0bf4c" },
  { dot: "bg-sky-hi", text: "text-sky-hi", card: "border-sky-hi", glow: "#5aa8e8" },
  { dot: "bg-emerald-300", text: "text-emerald-300", card: "border-emerald-300", glow: "#6ee7b7" },
];

// Hotspot positions (% of the logo image): peak, left foot, right foot.
const HOTSPOTS = [
  { left: "50%", top: "13%" },
  { left: "28%", top: "76%" },
  { left: "72%", top: "71%" },
];

// Scrollytelling on the real logo: the trilogy "tergambar pada logo kami" —
// peak = Sahabat, left foot = Affiliator, right foot = Developer.
// Sticky visual (CSS, mobile-safe) + ScrollTrigger highlight + click-to-focus.
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

  const focusPillar = (i: number) => {
    setActive(i);
    document
      .getElementById(`pilar-${i}`)
      ?.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "center",
      });
  };

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
          {/* Sticky visual: the logo itself as the diagram */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div
              data-reveal
              className="relative mx-auto max-w-sm rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <div className="relative aspect-square w-full">
                <Image
                  src="/logo.png"
                  alt="Logo Apptivity — puncak adalah Sahabat, kaki kiri Affiliator, kaki kanan Developer"
                  fill
                  sizes="380px"
                  className="object-contain"
                />
                {pillars.map((p, i) => {
                  const st = ACTIVE_STYLES[i % ACTIVE_STYLES.length];
                  const spot = HOTSPOTS[i % HOTSPOTS.length];
                  const isActive = i === active;
                  return (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => focusPillar(i)}
                      aria-label={`Fokus ke ${p.name}`}
                      aria-pressed={isActive}
                      className="group absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-3"
                      style={{ left: spot?.left, top: spot?.top }}
                    >
                      <span
                        aria-hidden="true"
                        className={`relative block h-5 w-5 rounded-full transition-all duration-500 ${
                          isActive ? "" : "opacity-50 group-hover:opacity-100"
                        }`}
                        style={{
                          backgroundColor: isActive ? st?.glow : "rgba(255,255,255,0.5)",
                          boxShadow: isActive
                            ? `0 0 0 6px ${st?.glow}33, 0 0 24px ${st?.glow}`
                            : "none",
                        }}
                      >
                        {isActive && <span className="hotspot-ping" aria-hidden="true" style={{ borderColor: st?.glow }} />}
                      </span>
                      <span className="sr-only">{p.name}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {pillars.map((p, i) => {
                  const st = ACTIVE_STYLES[i % ACTIVE_STYLES.length];
                  const isActive = i === active;
                  return (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => focusPillar(i)}
                      aria-pressed={isActive}
                      className={`rounded-full px-4 py-1.5 text-sm font-bold transition-all duration-300 ${
                        isActive
                          ? "bg-white text-navy-950"
                          : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
                      }`}
                    >
                      <span className={isActive ? "" : st?.text} aria-hidden="true">
                        {i + 1} ·{" "}
                      </span>
                      {p.name}
                    </button>
                  );
                })}
              </div>
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
                  id={`pilar-${i}`}
                  data-pillar
                  data-reveal
                  aria-current={isActive ? "step" : undefined}
                  className={`scroll-mt-32 rounded-3xl border-2 bg-white/5 p-7 backdrop-blur transition-colors duration-500 ${
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
