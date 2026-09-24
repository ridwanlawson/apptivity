"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { routing, localeNames, type Locale } from "@/lib/i18n";

const SHORT: Record<Locale, string> = { id: "ID", en: "EN", ja: "日", zh: "中" };

// Animated language dropdown. Preserves the current path while switching.
export default function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const rest = pathname.replace(/^\/(id|en|ja|zh)(?=\/|$)/, "") || "/";

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open ]);

  const pick = (next: Locale) => {
    setOpen(false);
    if (next === locale) return;
    // Functional cookie for locale persistence (no consent needed).
    // eslint-disable-next-line react-hooks/immutability
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000`;
    router.replace(`/${next}${rest}`);
  };

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Language / Bahasa"
        className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-bold transition-colors ${
          open
            ? "border-gold bg-gold/10 text-gold"
            : "border-white/20 bg-white/5 text-white hover:border-gold/60 hover:text-gold"
        }`}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        {SHORT[locale]}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          aria-hidden="true"
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M1 3l4 4 4-4" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="Language / Bahasa"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 z-[85] mt-2 w-44 overflow-hidden rounded-2xl border border-white/10 bg-navy-950/95 p-1.5 shadow-2xl shadow-black/40 backdrop-blur"
          >
            {(routing.locales as readonly Locale[]).map((l) => (
              <li key={l} role="option" aria-selected={l === locale}>
                <button
                  type="button"
                  onClick={() => pick(l)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                    l === locale
                      ? "bg-gold/15 text-gold"
                      : "text-white/75 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span>
                    <span className="mr-2 inline-block w-7 font-extrabold">{SHORT[l]}</span>
                    {localeNames[l]}
                  </span>
                  {l === locale && <span aria-hidden="true">✓</span>}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
