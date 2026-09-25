"use client";

import { useState } from "react";

// Accessible accordion: button + region, arrow-key friendly by default.
export default function FaqList({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mt-8 divide-y divide-ink/10 rounded-3xl bg-white px-6 ring-1 ring-ink/5 sm:px-8">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q} data-reveal>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                id={`faq-button-${i}`}
                className="group flex w-full items-center justify-between gap-4 py-5 text-left font-bold text-ink hover:text-brand"
              >
                {it.q}
                <span
                  aria-hidden="true"
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                    isOpen
                      ? "rotate-45 bg-gold"
                      : "bg-navy-950 group-hover:bg-brand"
                  }`}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke={isOpen ? "#061029" : "#ffffff"}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    className="transition-colors duration-300"
                  >
                    <path d="M7 1v12M1 7h12" />
                  </svg>
                </span>
              </button>
            </h3>
            {/* Grid-rows trick animates height without a runtime; all answers
                stay in the DOM (SEO bonus). visibility:hidden removes closed
                panels from keyboard/AT order. */}
            <div
              id={`faq-panel-${i}`}
              role="region"
              aria-labelledby={`faq-button-${i}`}
              inert={!isOpen}
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "invisible grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="pb-6 leading-relaxed text-muted">{it.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
