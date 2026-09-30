"use client";

import { useRef } from "react";
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
  waTemplate: string;
  items: ProductItem[];
};

export default function Products({ dict }: { dict: ProductsDict }) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

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
          {dict.items.map((p, i) => (
            <article
              key={p.name}
              data-reveal
              className={`flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1.5 ${
                i === 0 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="relative h-64 overflow-hidden bg-paper sm:h-72">
                <ProductImage src={p.image} alt={p.name} />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="inline-flex w-fit items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">
                  {p.badge}
                </p>
                <h3 className="mt-2 text-xl font-extrabold text-ink">{p.name}</h3>
                <p className="mt-0.5 text-sm font-bold text-muted">{p.tagline}</p>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted">
                  {p.description}
                </p>
                <a
                  href={waLink(dict.waTemplate.replace("_PRODUCT_", p.name))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-block w-fit rounded-full bg-navy-950 px-6 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-navy-800"
                >
                  {dict.demo}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
