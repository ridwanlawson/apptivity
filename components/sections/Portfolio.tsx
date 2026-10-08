"use client";

import { useEffect, useRef, useState } from "react";
import SectionHeading from "../SectionHeading";
import ProductImage from "../ProductImage";
import { prefersReducedMotion, useReveal } from "@/lib/anim";
import { waLink } from "@/lib/site";

export type PortfolioItem = {
  title: string;
  tagline: string;
  description: string;
  tech: string[];
  result: string;
  year: string;
  image?: string;
};

export type PortfolioDict = {
  eyebrow: string;
  title: string;
  intro: string;
  all: string;
  categories: string[];
  close: string;
  ctaSimilar: string;
  waTemplate: string;
  hint: string;
  note: string;
  items: (PortfolioItem & { category: number })[] | PortfolioItem[];
};

type Item = PortfolioItem & { category: number };

// CSS-only covers — no image assets needed for the dummy set.
const COVERS = [
  "linear-gradient(135deg, #0d2758 0%, #1d5fad 55%, #5aa8e8 100%)",
  "linear-gradient(135deg, #061029 0%, #153f39 60%, #2fbf8f 130%)",
  "linear-gradient(135deg, #1d5fad 0%, #7c5ae8 60%, #f0bf4c 130%)",
  "linear-gradient(135deg, #061029 0%, #4a2b8f 55%, #5aa8e8 120%)",
  "linear-gradient(135deg, #153f39 0%, #0d2758 60%, #f0bf4c 140%)",
  "linear-gradient(135deg, #123063 0%, #1d5fad 50%, #f7d47e 130%)",
];

function catName(dict: PortfolioDict, c: number): string {
  return dict.categories[c] ?? "";
}

export default function Portfolio({ dict }: { dict: PortfolioDict }) {
  const ref = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const [filter, setFilter] = useState(0); // 0 = all, else category idx + 1
  const [selected, setSelected] = useState<number | null>(null);
  useReveal(ref);

  const items: Item[] = dict.items.map((it, i) => ({
    ...it,
    category:
      typeof (it as Item).category === "number"
        ? (it as Item).category
        : i % dict.categories.length,
  }));

  const visible = items.filter((it) => filter === 0 || it.category === filter - 1);
  const active = selected !== null ? items[selected] ?? null : null;

  // Modal: ESC close + scroll lock + focus management.
  useEffect(() => {
    if (!active) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      lastFocus.current?.focus?.();
    };
  }, [active !== null]); // eslint-disable-line react-hooks/exhaustive-deps

  const openItem = (globalIdx: number) => {
    if (prefersReducedMotion()) {
      setSelected(globalIdx);
      return;
    }
    setSelected(globalIdx);
  };

  const waFor = (it: Item) =>
    waLink(
      dict.waTemplate
        .replace("_TITLE_", it.title)
        .replace("_CAT_", catName(dict, it.category)),
    );

  return (
    <section
      ref={ref}
      id="portofolio"
      aria-labelledby="portofolio-title"
      className="scroll-mt-20 bg-paper"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div id="portofolio-title">
          <SectionHeading eyebrow={dict.eyebrow} title={dict.title} />
        </div>
        <p data-reveal className="mt-4 max-w-3xl text-lg text-muted">
          {dict.intro}
        </p>

        {/* Filter pills */}
        <div
          data-reveal
          role="group"
          aria-label={dict.eyebrow}
          className="mt-8 flex flex-wrap gap-2"
        >
          {[dict.all, ...dict.categories].map((label, i) => {
            const isActive = filter === i;
            return (
              <button
                key={label}
                type="button"
                aria-pressed={isActive}
                onClick={() => setFilter(i)}
                className={`rounded-full px-5 py-2 text-sm font-bold transition-all ${
                  isActive
                    ? "bg-navy-950 text-white shadow-lg shadow-navy-950/20"
                    : "bg-white text-muted ring-1 ring-ink/10 hover:text-ink hover:ring-brand/40"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Bento grid */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((it) => {
            const globalIdx = items.indexOf(it);
            const featured = globalIdx === 0 && filter === 0;
            return (
              <button
                key={it.title}
                type="button"
                data-reveal
                onClick={() => openItem(globalIdx)}
                aria-haspopup="dialog"
                className={`group overflow-hidden rounded-3xl bg-white text-left ring-1 ring-ink/5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-navy-950/15 focus-visible:outline-none ${
                  featured ? "sm:col-span-2" : ""
                }`}
              >
                {/* Cover: real screenshot when available, gradient art otherwise */}
                <div
                  className="relative h-44 overflow-hidden bg-paper sm:h-48"
                  style={
                    it.image
                      ? undefined
                      : { background: COVERS[globalIdx % COVERS.length] }
                  }
                  aria-hidden="true"
                >
                  {it.image ? (
                    <ProductImage src={it.image} alt="" />
                  ) : (
                    <>
                      <div className="grain" />
                      <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-white/15 blur-2xl transition-transform duration-500 group-hover:scale-125" />
                      <div className="absolute -bottom-12 -left-6 h-36 w-36 rounded-full bg-gold/25 blur-2xl transition-transform duration-500 group-hover:scale-125" />
                    </>
                  )}
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
                    <span className="rounded-full bg-navy-950/70 px-3 py-1 text-xs font-bold text-gold backdrop-blur">
                      {catName(dict, it.category)}
                    </span>
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                      {it.year}
                    </span>
                  </div>
                  <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-lg text-white opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100">
                    ↗
                  </span>
                </div>
                {/* Body */}
                <div className="p-5">
                  <h3 className="text-lg font-extrabold text-ink group-hover:text-brand">
                    {it.title}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-muted">{it.tagline}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {it.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-paper px-2.5 py-0.5 text-xs font-bold text-navy-800 ring-1 ring-ink/5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    <span aria-hidden="true">✓</span> {it.result}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <p data-reveal className="mt-6 text-center text-sm font-semibold text-muted">
          {dict.hint}
        </p>
        <p data-reveal className="mt-2 text-center text-xs text-muted/70">
          {dict.note}
        </p>
      </div>

      {/* Detail modal */}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          className="fixed inset-0 z-[90] flex items-end justify-center bg-navy-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-6 sm:rounded-3xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
          >
            {active.image ? (
              <div
                className="relative h-[60vh] overflow-hidden rounded-2xl bg-navy-950 sm:h-[65vh]"
                aria-hidden="true"
              >
                <ProductImage src={active.image} alt="" fit="contain" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
                  <span className="rounded-full bg-navy-950/70 px-3 py-1 text-xs font-bold text-gold backdrop-blur">
                    {catName(dict, active.category)}
                  </span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                    {active.year}
                  </span>
                </div>
              </div>
            ) : (
              <div
                className="relative h-40 overflow-hidden rounded-2xl bg-paper sm:h-52"
                aria-hidden="true"
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      COVERS[items.indexOf(active) % COVERS.length],
                  }}
                >
                  <div className="grain" />
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
                  <span className="rounded-full bg-navy-950/70 px-3 py-1 text-xs font-bold text-gold backdrop-blur">
                    {catName(dict, active.category)}
                  </span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                    {active.year}
                  </span>
                </div>
              </div>
            )}

            <h3 className="mt-5 text-2xl font-extrabold text-ink">{active.title}</h3>
            <p className="mt-1 font-semibold text-brand">{active.tagline}</p>
            <p className="mt-3 leading-relaxed text-muted">{active.description}</p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {active.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-paper px-3 py-1 text-xs font-bold text-navy-800 ring-1 ring-ink/5"
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-700">
              <span aria-hidden="true">✓</span> {active.result}
            </p>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <a
                href={waFor(active)}
                target="_blank"
                rel="noopener noreferrer"
                data-track="portfolio-cta"
                data-track-label={active.title}
                className="flex-1 rounded-full bg-gold px-6 py-3 text-center font-bold text-navy-950 hover:brightness-105"
              >
                {dict.ctaSimilar}
              </a>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-full border border-ink/15 px-6 py-3 font-bold text-muted hover:text-ink"
              >
                {dict.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
