"use client";

import { useEffect, useRef, useState } from "react";

const SEEN_KEY = "apptivity:promo-seen";
const PROMO_CODE = "APPTIVITY30";
export const OPEN_PROMO_EVENT = "apptivity:open-promo";

// ponytail: single source of truth for the slideshow — same files as /public/products
const SLIDES = [
  { src: "/products/sekolapp.jpg", name: "Sekolapp" },
  { src: "/products/camptivapp.jpg", name: "Camptivapp" },
  { src: "/products/akadapp.jpg", name: "Akadapp" },
  { src: "/products/akredapp.jpg", name: "Akredapp" },
  { src: "/products/risetapp.jpg", name: "Risetapp" },
  { src: "/products/pes.jpg", name: "PES" },
];

// Premium two-column promo modal (21st.dev-style): dark glass panel +
// product preview, countdown urgency, spring entrance. Once per session.
export default function PromoBanner({
  headline,
  sub,
  ctaLabel,
  href,
  closeLabel,
  codeLabel,
  copyLabel,
  copiedLabel,
}: {
  headline: string;
  sub: string;
  ctaLabel: string;
  href: string;
  closeLabel: string;
  codeLabel: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [left, setLeft] = useState("--:--:--");
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [copied, setCopied] = useState(false);
  // Manual navigation snoozes autoplay 10s — no hover on touch screens,
  // so a tap is the only "I'm looking at this" signal we get.
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(
    () => () => {
      if (resumeRef.current) clearTimeout(resumeRef.current);
    },
    [],
  );

  const markSeen = () => {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* private mode */
    }
  };

  const close = () => {
    markSeen();
    setLeaving(true);
    setTimeout(() => setShow(false), 180);
  };

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN_KEY) === "1") return;
    } catch {
      /* private mode: keep showing */
    }
    const t = setTimeout(() => setShow(true), 1200);
    return () => clearTimeout(t);
  }, []);

  // External reopen (e.g. header "Ambil Promo" button).
  useEffect(() => {
    const open = () => {
      setLeaving(false);
      setCopied(false);
      setShow(true);
    };
    window.addEventListener(OPEN_PROMO_EVENT, open);
    return () => window.removeEventListener(OPEN_PROMO_EVENT, open);
  }, []);

  // Countdown to local midnight — "hari ini saja" urgency.
  useEffect(() => {
    if (!show) return;
    const tick = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      const s = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
      const h = String(Math.floor(s / 3600)).padStart(2, "0");
      const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
      const sec = String(s % 60).padStart(2, "0");
      setLeft(`${h}:${m}:${sec}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [show]);

  // Auto-slideshow across all products. Pauses on hover/focus.
  useEffect(() => {
    if (!show || paused) return;
    const id = setInterval(() => {
      setSlide((s) => (s + 1) % SLIDES.length);
    }, 3000);
    return () => clearInterval(id);
  }, [show, paused]);

  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    // Move focus into the dialog (keyboard/screen-reader users), without
    // jumping the page behind it.
    closeRef.current?.focus({ preventScroll: true });
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  if (!show) return null;

  const [hh, mm, ss] = left.split(":");
  const active = SLIDES[slide] ?? SLIDES[0]!;
  const snooze = () => {
    setPaused(true);
    if (resumeRef.current) clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(() => setPaused(false), 10000);
  };
  const prev = () => {
    snooze();
    setSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length);
  };
  const next = () => {
    snooze();
    setSlide((s) => (s + 1) % SLIDES.length);
  };
  const goSlide = (i: number) => {
    snooze();
    setSlide(i);
  };

  const copyCode = async () => {
    try {
      if (navigator.clipboard) await navigator.clipboard.writeText(PROMO_CODE);
    } catch {
      /* clipboard unavailable — code stays visible to type manually */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={headline}
      onClick={close}
      className={`promo-backdrop fixed inset-0 z-[95] flex items-center justify-center overflow-hidden bg-navy-950/70 p-3 backdrop-blur-md transition-opacity duration-200 sm:p-6 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
    >
      <style>{`
        @keyframes promo-pop { from { opacity: 0; transform: translateY(28px) scale(.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes promo-shine { from { transform: translateX(-120%) skewX(-18deg); } to { transform: translateX(240%) skewX(-18deg); } }
        @keyframes promo-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes promo-pulse-dot { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: .45; transform: scale(.8); } }
        @keyframes promo-gold-spin { to { --ga: 360deg; } }
        @keyframes promo-halo { 0%,100% { opacity: .5; transform: scale(1); } 50% { opacity: .9; transform: scale(1.04); } }
        @keyframes promo-rise { 0% { transform: translateY(0) scale(1); opacity: 0; } 15% { opacity: .9; } 100% { transform: translateY(-110px) scale(.4); opacity: 0; } }
        @property --ga { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
        .promo-pop { animation: promo-pop .55s cubic-bezier(.16,1,.3,1) both; }
        .promo-pop-leave { transform: translateY(12px) scale(.97); opacity: 0; transition: all .18s ease; }
        .promo-cta { position: relative; overflow: hidden; isolation: isolate; }
        .promo-cta::after { content: ""; position: absolute; top: 0; bottom: 0; width: 45%; background: linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent); animation: promo-shine 2.8s ease-in-out infinite; z-index: 1; }
        /* Treasure-chest gold light racing around the frame */
        .promo-gold-frame { position: relative; }
        .promo-gold-frame::before { content: ""; position: absolute; inset: -2px; border-radius: 1.9rem; padding: 2px; background: conic-gradient(from var(--ga), transparent 0%, #f0bf4c 8%, #fff7dd 12%, #f0bf4c 16%, transparent 28%, transparent 52%, #f0bf4c 60%, #fff7dd 64%, #f0bf4c 68%, transparent 80%); -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; animation: promo-gold-spin 5s linear infinite; pointer-events: none; z-index: 30; }
        .promo-halo { animation: promo-halo 3.2s ease-in-out infinite; }
        .promo-float-badge { animation: promo-float 4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .promo-gold-frame::before, .promo-halo, .promo-cta::after { animation: none; }
        }
      `}</style>

      {/* stage: houses the glow — abs decor must never expand the
          overlay's scroll area (that spawns the edge scrollbar, and the
          halo's breathing scale made it jitter on its own) */}
      <div className="m-auto w-full max-w-4xl overflow-hidden overflow-clip px-3 py-4 sm:px-6 sm:py-10">
      {/* halo + gold frame wrapper */}
      <div className={`promo-gold-frame w-full ${leaving ? "promo-pop-leave" : ""}`}>
        <div
          aria-hidden="true"
          className="promo-halo pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(ellipse_at_center,rgba(240,191,76,0.35),rgba(240,191,76,0.08)_55%,transparent_85%)]"
        />
        {/* light leak from the top seam, like a chest cracking open */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 left-1/2 z-0 h-24 w-2/3 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,235,170,0.55),rgba(240,191,76,0.15)_60%,transparent_90%)]"
        />

      <div
        onClick={(e) => e.stopPropagation()}
        className={`promo-pop relative grid max-h-[92vh] max-h-[92dvh] w-full overflow-y-auto overflow-x-clip rounded-[1.75rem] bg-navy-950 shadow-[0_0_80px_-12px_rgba(240,191,76,0.55),0_40px_120px_-20px_rgba(0,0,0,0.8)] ring-1 ring-gold/50 ${
          leaving ? "promo-pop-leave" : ""
        } md:grid-cols-[1.05fr_1fr]`}
      >
        {/* rising gold dust (hidden on low-spec devices via CSS) */}
        <div aria-hidden="true" className="promo-dust pointer-events-none absolute inset-0 z-10 overflow-hidden">
          {[8, 22, 38, 55, 70, 84, 93].map((x, i) => (
            <span
              key={x}
              className="absolute bottom-6 h-1 w-1 rounded-full bg-gold-soft"
              style={{
                left: `${x}%`,
                boxShadow: "0 0 8px 2px rgba(240,191,76,.8)",
                animation: `promo-rise ${3 + (i % 3)}s ease-in infinite`,
                animationDelay: `${i * 0.7}s`,
              }}
            />
          ))}
        </div>
        {/* close */}
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label={closeLabel}
          className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/10 text-sm text-white backdrop-blur-md transition before:absolute before:-inset-2 before:content-[''] hover:rotate-90 hover:bg-white/25"
        >
          <span aria-hidden="true">✕</span>
        </button>

        {/* left: copy */}
        <div className="relative flex flex-col justify-center gap-3 overflow-hidden p-4 sm:gap-4 sm:p-7">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="aurora-blob aurora-a opacity-70" />
            <div className="aurora-blob aurora-c opacity-60" />
            <div className="grain" />
          </div>

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-gold">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-gold"
                style={{ animation: "promo-pulse-dot 1.6s ease-in-out infinite" }}
              />
              Promo terbatas
            </span>
          </div>

          <div className="relative">
            <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-sky-hi">
              Produk baru
            </p>
            <h2 className="mt-2 text-2xl font-black leading-[1.05] tracking-tight text-white sm:text-4xl">
              Diskon{" "}
              <span className="bg-gradient-to-r from-gold via-gold-soft to-gold bg-clip-text text-transparent">
                30%
              </span>
              <br />
              {headline}
            </h2>
            <p className="mt-2 line-clamp-2 max-w-sm text-[13px] leading-relaxed text-white/65 sm:mt-3 sm:line-clamp-none sm:text-[15px]">
              {sub}
            </p>
          </div>

          {/* countdown */}
          <div className="relative flex items-center gap-2 sm:gap-2.5">
            {[
              [hh, "jam"],
              [mm, "mnt"],
              [ss, "dtk"],
            ].map(([v, l]) => (
              <div key={l} className="flex flex-col items-center">
                <span className="min-w-[2.6rem] rounded-xl border border-white/10 bg-white/[0.07] px-2 py-1.5 text-center font-mono text-base font-bold tabular-nums text-white backdrop-blur sm:min-w-[3.2rem] sm:text-xl">
                  {v}
                </span>
                <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
                  {l}
                </span>
              </div>
            ))}
            <span className="mb-5 ml-1 hidden text-xs font-semibold text-white/45 sm:block">
              berakhir
              <br />
              tengah malam
            </span>
          </div>

          <div className="relative flex flex-row items-center gap-2 sm:gap-2.5">
            <a
              href={href}
              onClick={markSeen}
              data-track="promo-cta"
              className="promo-cta group inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-gold-soft to-gold px-4 py-3 text-sm font-extrabold text-navy-950 shadow-[0_12px_32px_-8px_rgba(240,191,76,.6)] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] sm:px-6 sm:py-3.5 sm:text-[15px]"
            >
              <span className="relative z-[2]">{ctaLabel}</span>
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="relative z-[2] transition-transform duration-200 group-hover:translate-x-1"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <button
              type="button"
              onClick={close}
              className="shrink-0 whitespace-nowrap rounded-2xl px-3 py-3 text-[13px] font-bold text-white/50 transition hover:bg-white/10 hover:text-white sm:px-5 sm:py-3.5 sm:text-sm"
            >
              Nanti saja
            </button>
          </div>

          {/* promo code */}
          <div className="relative flex items-center justify-between gap-3 rounded-2xl border border-dashed border-gold/50 bg-gold/[0.07] px-3 py-2.5 sm:px-4 sm:py-3">
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-gold/80">
                {codeLabel}
              </p>
              <p className="truncate font-mono text-base font-black tracking-[0.18em] text-white sm:text-lg">
                {PROMO_CODE}
              </p>
            </div>
            <button
              type="button"
              onClick={copyCode}
              data-track="promo-copy"
              className={`inline-flex min-h-[44px] shrink-0 items-center rounded-xl px-4 py-2 text-xs font-extrabold transition active:scale-95 ${
                copied
                  ? "bg-emerald-400 text-navy-950"
                  : "bg-gold text-navy-950 hover:brightness-105"
              }`}
            >
              {copied ? copiedLabel : copyLabel}
            </button>
          </div>

          <p className="relative hidden items-center gap-1.5 text-xs font-medium text-white/40 sm:flex">
            <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f0bf4c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            Siap pakai · Garansi revisi
          </p>
        </div>

        {/* right: auto-slideshow visual */}
        <div
          className="relative flex flex-col items-center justify-center gap-2 overflow-hidden bg-navy-800 px-3 pb-3 pt-6 sm:gap-2.5 sm:px-5 sm:pb-5 sm:pt-6 md:min-h-full"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <a
            href={`${href}?item=${encodeURIComponent(active.src)}`}
            onClick={close}
            aria-label={active.name}
            data-track="promo-slide"
            data-track-label={active.name}
            className="group/slide block transition-transform duration-200 hover:scale-[1.01] focus-visible:outline-none"
          >
            {/* fixed-ratio photo box (2:3 = real flyer ratio): every slide
                is absolute-filled, so the box never changes size and the
                hover overlay always matches the photo exactly */}
            <span className="relative mx-auto block aspect-[2/3] h-[34vh] h-[34dvh] max-w-full sm:h-68 md:h-[60vh] md:h-[60dvh]">
              {SLIDES.map((s, i) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={s.src}
                  src={s.src}
                  alt={i === slide ? s.name : ""}
                  aria-hidden={i === slide ? undefined : true}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={i === 0 ? "high" : undefined}
                  className={`absolute inset-0 h-full w-full rounded-b-2xl object-contain shadow-2xl ring-1 transition-opacity duration-700 ${
                    i === slide
                      ? "opacity-100 ring-gold/60 group-hover/slide:ring-gold"
                      : "pointer-events-none opacity-0 ring-white/20"
                  }`}
                />
              ))}
              <span className="absolute inset-0 grid place-items-center rounded-b-2xl bg-navy-950/0 opacity-0 transition-all duration-200 group-hover/slide:bg-navy-950/25 group-hover/slide:opacity-100">
                <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-extrabold text-white backdrop-blur-md">
                  Lihat {active.name} →
                </span>
              </span>
              {/* -30% badge pinned to the photo box corner, always touching it */}
              <span
                aria-hidden="true"
                className="promo-float-badge absolute -right-3 -top-3 grid h-14 w-14 rotate-12 place-items-center rounded-full bg-gradient-to-b from-gold-soft to-gold text-center shadow-[0_16px_40px_-8px_rgba(240,191,76,.7)] ring-4 ring-navy-950/20 md:-right-4 md:-top-4 md:h-20 md:w-20"
              >
                <span>
                  <span className="block text-base font-black leading-none text-navy-950 md:text-xl">-30%</span>
                  <span className="mt-0.5 block text-[9px] font-extrabold uppercase tracking-widest text-navy-950/70">
                    Hari ini
                  </span>
                </span>
              </span>
            </span>
          </a>
          {/* product title below the image */}
          <p key={active.name} className="text-center text-sm font-extrabold tracking-tight text-white">
            {active.name}
          </p>
          {/* controls: prev / dots / next */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Produk sebelumnya"
              className="relative grid h-7 w-7 place-items-center rounded-full border border-white/15 bg-white/10 text-sm font-bold text-white backdrop-blur transition before:absolute before:-inset-3 before:content-[''] hover:bg-gold hover:text-navy-950"
            >
              <span aria-hidden="true">‹</span>
            </button>
            <div className="flex items-center gap-1.5 px-1">
              {SLIDES.map((s, i) => (
                <button
                  key={s.src}
                  type="button"
                  onClick={() => goSlide(i)}
                  aria-label={`Lihat ${s.name}`}
                  className={`relative h-1.5 rounded-full transition-all duration-300 before:absolute before:-inset-x-2 before:-inset-y-3 before:content-[''] ${
                    i === slide ? "w-6 bg-gold" : "w-1.5 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              aria-label="Produk berikutnya"
              className="relative grid h-7 w-7 place-items-center rounded-full border border-white/15 bg-white/10 text-sm font-bold text-white backdrop-blur transition before:absolute before:-inset-3 before:content-[''] hover:bg-gold hover:text-navy-950"
            >
              <span aria-hidden="true">›</span>
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
    </div>
  );
}
