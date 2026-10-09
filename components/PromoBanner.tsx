"use client";

import { useEffect, useState } from "react";

const SEEN_KEY = "apptivity:promo-seen";

// Slim promo bar for ready-made products, shown on top of every page visit.
// Server renders it (no CLS on first paint); returning visitors in the same
// session hide it in an effect. Dismissal is user-initiated (no CLS penalty).
export default function PromoBanner({
  title,
  names,
  ctaLabel,
  href,
  closeLabel,
}: {
  title: string;
  names: string[];
  ctaLabel: string;
  href: string;
  closeLabel: string;
}) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN_KEY) === "1") setShow(false);
    } catch {
      /* private mode: keep showing */
    }
  }, []);

  if (!show) return null;

  const close = () => {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* private mode */
    }
    setShow(false);
  };

  return (
    <div className="bg-gold text-navy-950">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2 text-sm sm:px-6">
        <p className="min-w-0 flex-1 truncate font-semibold">
          <span className="font-extrabold">{title}</span>
          <span aria-hidden="true"> · </span>
          <span className="font-medium">{names.join(" • ")}</span>
        </p>
        <a
          href={href}
          data-track="promo-cta"
          className="shrink-0 rounded-full bg-navy-950 px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-navy-800"
        >
          {ctaLabel}
        </a>
        <button
          type="button"
          onClick={close}
          aria-label={closeLabel}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full font-bold transition-colors hover:bg-navy-950/10"
        >
          <span aria-hidden="true">✕</span>
        </button>
      </div>
    </div>
  );
}
