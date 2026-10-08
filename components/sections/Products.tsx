"use client";

import { useEffect, useRef, useState } from "react";
import ProductImage from "../ProductImage";
import SectionHeading from "../SectionHeading";
import { useReveal } from "@/lib/anim";
import { waLink } from "@/lib/site";

export type ProductItem = {
  name: string;
  tagline: string;
  description: string;
  badge: string;
  image: string;
};

export type ProductsDict = {
  eyebrow: string;
  title: string;
  intro: string;
  demo: string;
  close: string;
  waTemplate: string;
  items: ProductItem[];
};

export default function Products({ dict }: { dict: ProductsDict }) {
  const ref = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  useReveal(ref);

  const active = selected !== null ? dict.items[selected] ?? null : null;

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
  }, [active]);

  const waFor = (name: string) => waLink(dict.waTemplate.replace("_PRODUCT_", name));

  return (
    <section
      ref={ref}
      id="produk"
      aria-labelledby="produk-title"
      className="scroll-mt-20 bg-navy-950"
      style={{
        backgroundImage: "linear-gradient(160deg, #061029 0%, #0d2758 85%)",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div id="produk-title">
          <SectionHeading eyebrow={dict.eyebrow} title={dict.title} dark />
        </div>
        <p data-reveal className="mt-4 max-w-3xl text-lg leading-relaxed text-white/70">
          {dict.intro}
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {dict.items.map((p) => (
            <button
              key={p.name}
              type="button"
              data-reveal
              onClick={() => setSelected(dict.items.indexOf(p))}
              aria-haspopup="dialog"
              className="group flex flex-col overflow-hidden rounded-3xl bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/30 focus-visible:outline-none"
            >
              <div className="relative h-64 overflow-hidden bg-paper sm:h-72">
                <ProductImage src={p.image} alt={p.name} />
                <span
                  aria-hidden="true"
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-navy-950/60 text-lg text-white opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100"
                >
                  ↗
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="inline-flex w-fit items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">
                  {p.badge}
                </p>
                <h3 className="mt-2 text-xl font-extrabold text-ink group-hover:text-brand">
                  {p.name}
                </h3>
                <p className="mt-0.5 text-sm font-bold text-muted">{p.tagline}</p>
                <p className="mt-3 line-clamp-3 flex-1 text-[15px] leading-relaxed text-muted">
                  {p.description}
                </p>
                <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-navy-950 px-6 py-2.5 text-sm font-bold text-white transition-colors group-hover:bg-brand">
                  {dict.demo} →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail modal */}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.name}
          className="fixed inset-0 z-[90] flex items-end justify-center bg-navy-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-6 sm:rounded-3xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
          >
            <div className="relative h-[60vh] overflow-hidden rounded-2xl bg-navy-950 sm:h-[65vh]">
              <ProductImage src={active.image} alt={active.name} fit="contain" />
            </div>

            <p className="mt-5 inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">
              {active.badge}
            </p>
            <h3 className="mt-2 text-2xl font-extrabold text-ink">{active.name}</h3>
            <p className="mt-1 font-semibold text-brand">{active.tagline}</p>
            <p className="mt-3 leading-relaxed text-muted">{active.description}</p>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <a
                href={waFor(active.name)}
                target="_blank"
                rel="noopener noreferrer"
                data-track="product-demo"
                data-track-label={active.name}
                className="flex-1 rounded-full bg-gold px-6 py-3 text-center font-bold text-navy-950 hover:brightness-105"
              >
                {dict.demo}
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
