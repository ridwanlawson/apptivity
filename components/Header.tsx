"use client";

import { useEffect, useRef, useState } from "react";
import LogoMark from "./LogoMark";
import LocaleSwitcher from "./LocaleSwitcher";
import { SITE_DOMAIN, waLink } from "@/lib/site";
import { scrollToHash } from "@/lib/scroll";
import type { Locale } from "@/lib/i18n";

type NavDict = {
  about: string;
  how: string;
  scheme: string;
  ownership: string;
  mechanism: string;
  pricing: string;
  portfolio: string;
  products: string;
  company: string;
  proof: string;
  join: string;
  legal: string;
  brief: string;
  contact: string;
  skip: string;
  faq: string;
};

type Item = { href: string; hash: string; label: string };
type Menu = { label: string; links: Item[] };

const SECTION_IDS = [
  "tentang",
  "skema",
  "kepemilikan",
  "mekanisme",
  "harga",
  "portofolio",
  "produk",
  "bukti",
  "gabung",
  "legalitas",
  "mulai",
  "faq",
];

export default function Header({
  locale,
  nav,
  waText,
}: {
  locale: Locale;
  nav: NavDict;
  waText: string;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const item = (hash: string, label: string): Item => ({
    href: `/${locale}${hash}`,
    hash,
    label,
  });

  const singles: Item[] = [
    item("#tentang", nav.about),
    item("#harga", nav.pricing),
    item("#portofolio", nav.portfolio),
    item("#produk", nav.products),
    item("#faq", nav.faq),
  ];
  const menus: Menu[] = [
    {
      label: nav.how,
      links: [
        item("#skema", nav.scheme),
        item("#kepemilikan", nav.ownership),
        item("#mekanisme", nav.mechanism),
      ],
    },
    {
      label: nav.company,
      links: [
        item("#bukti", nav.proof),
        item("#gabung", nav.join),
        item("#legalitas", nav.legal),
      ],
    },
  ];
  const brief = item("#mulai", nav.brief);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scrollspy: highlight the nav link of the section in view.
  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setActive(`#${en.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Close menus on Escape / outside click.
  useEffect(() => {
    if (!open && !openMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setOpenMenu(null);
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open, openMenu]);

  const go = (e: { preventDefault: () => void }, href: string) => {
    const i = href.indexOf("#");
    if (i === -1) return;
    e.preventDefault();
    setOpen(false);
    setOpenMenu(null);
    scrollToHash(href.slice(i));
  };

  const isActive = (l: Item) => active === l.hash;
  const linkCls = (l: Item) =>
    `rounded-full px-3 py-2 transition-colors duration-200 hover:bg-white/10 hover:text-white ${
      isActive(l) ? "bg-white/10 text-gold" : ""
    }`;

  const menuActive = (m: Menu) => m.links.some(isActive);

  const renderMenu = (m: Menu) => (
    <div
      key={m.label}
      className="relative"
      onMouseEnter={() => setOpenMenu(m.label)}
      onMouseLeave={() => setOpenMenu((v) => (v === m.label ? null : v))}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={openMenu === m.label}
        onClick={() => setOpenMenu((v) => (v === m.label ? null : m.label))}
        className={`flex items-center gap-1 rounded-full px-3 py-2 transition-colors duration-200 hover:bg-white/10 hover:text-white ${
          menuActive(m) || openMenu === m.label ? "bg-white/10 text-gold" : ""
        }`}
      >
        {m.label}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          aria-hidden="true"
          className={`transition-transform duration-200 ${openMenu === m.label ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M1 3l4 4 4-4" />
        </svg>
      </button>
      <ul
        aria-label={m.label}
        className={`absolute left-1/2 top-full z-[85] w-56 -translate-x-1/2 pt-2 transition-all duration-200 ${
          openMenu === m.label
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1.5 opacity-0"
        }`}
      >
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-navy-950/95 p-1.5 shadow-2xl shadow-black/40 backdrop-blur-xl">
          {m.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={(e) => go(e, l.href)}
                aria-current={isActive(l) ? "true" : undefined}
                tabIndex={openMenu === m.label ? undefined : -1}
                className={`block rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-white/5 hover:text-gold ${
                  isActive(l) ? "bg-white/5 text-gold" : "text-white/80"
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </div>
      </ul>
    </div>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-[80] px-2 pt-2 xl:px-5 xl:pt-4">
      <a href="#konten" className="skip-link">
        {nav.skip}
      </a>
      <div
        className={`mx-auto max-w-6xl rounded-2xl border transition-all duration-300 ${
          scrolled || open
            ? "border-white/10 bg-navy-950/80 shadow-xl shadow-black/25 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="flex h-16 items-center justify-between gap-6 px-4 xl:h-18 xl:px-6">
          <a
            href={`/${locale}`}
            className="flex shrink-0 items-center gap-2.5"
            aria-label={`${SITE_DOMAIN} home`}
          >
            <LogoMark className="h-9 w-9" />
            <span className="text-lg font-extrabold tracking-tight text-white">
              {SITE_DOMAIN}
            </span>
          </a>

          <nav
            ref={navRef}
            className="hidden items-center gap-1 text-[13px] font-semibold text-white/75 xl:flex"
            aria-label="Primary"
          >
            <a
              href={singles[0]?.href}
              onClick={(e) => singles[0] && go(e, singles[0].href)}
              aria-current={singles[0] && isActive(singles[0]) ? "true" : undefined}
              className={singles[0] ? linkCls(singles[0]) : undefined}
            >
              {nav.about}
            </a>
            {menus[0] && renderMenu(menus[0])}
            <a
              href={singles[1]?.href}
              onClick={(e) => singles[1] && go(e, singles[1].href)}
              aria-current={singles[1] && isActive(singles[1]) ? "true" : undefined}
              className={singles[1] ? linkCls(singles[1]) : undefined}
            >
              {nav.pricing}
            </a>
            <a
              href={singles[2]?.href}
              onClick={(e) => singles[2] && go(e, singles[2].href)}
              aria-current={singles[2] && isActive(singles[2]) ? "true" : undefined}
              className={singles[2] ? linkCls(singles[2]) : undefined}
            >
              {nav.portfolio}
            </a>
            <a
              href={singles[3]?.href}
              onClick={(e) => singles[3] && go(e, singles[3].href)}
              aria-current={singles[3] && isActive(singles[3]) ? "true" : undefined}
              className={singles[3] ? linkCls(singles[3]) : undefined}
            >
              {nav.products}
            </a>
            {menus[1] && renderMenu(menus[1])}
            <a
              href={singles[4]?.href}
              onClick={(e) => singles[4] && go(e, singles[4].href)}
              aria-current={singles[4] && isActive(singles[4]) ? "true" : undefined}
              className={singles[4] ? linkCls(singles[4]) : undefined}
            >
              {nav.faq}
            </a>
          </nav>

          <div className="hidden shrink-0 items-center gap-3 xl:flex">
            <LocaleSwitcher locale={locale} />
            <a
              href={waLink(waText)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-gradient-to-r from-gold to-gold-soft px-5 py-2.5 text-sm font-bold text-navy-950 shadow-lg shadow-gold/25 transition-all hover:-translate-y-0.5 hover:shadow-gold/40"
            >
              {nav.contact}
            </a>
          </div>

          <button
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/10 xl:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true" className="text-xl leading-none">
              {open ? "✕" : "☰"}
            </span>
          </button>
        </div>

        {open && (
          <nav
            className="max-h-[70vh] overflow-y-auto border-t border-white/10 px-4 pb-5 pt-3 xl:hidden"
            aria-label="Mobile"
            data-lenis-prevent
          >
            <a
              href={singles[0]?.href}
              onClick={(e) => singles[0] && go(e, singles[0].href)}
              className={`block rounded-xl px-3 py-3 font-semibold transition-colors hover:bg-white/5 hover:text-gold ${
                singles[0] && isActive(singles[0]) ? "bg-white/5 text-gold" : "text-white"
              }`}
            >
              {nav.about}
            </a>
            {menus.map((m) => (
              <div key={m.label}>
                <button
                  type="button"
                  aria-expanded={openGroup === m.label}
                  onClick={() => setOpenGroup((v) => (v === m.label ? null : m.label))}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-3 font-semibold transition-colors hover:bg-white/5 hover:text-gold ${
                    menuActive(m) ? "text-gold" : "text-white"
                  }`}
                >
                  {m.label}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 10 10"
                    aria-hidden="true"
                    className={`transition-transform duration-200 ${openGroup === m.label ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 3l4 4 4-4" />
                  </svg>
                </button>
                {openGroup === m.label && (
                  <div className="mb-1 ml-3 border-l border-white/10 pl-2">
                    {m.links.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        onClick={(e) => go(e, l.href)}
                        className={`block rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors hover:bg-white/5 hover:text-gold ${
                          isActive(l) ? "text-gold" : "text-white/80"
                        }`}
                      >
                        {l.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {[singles[1], singles[2], singles[3], singles[4], brief].map(
              (l) =>
                l && (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={(e) => go(e, l.href)}
                    className={`block rounded-xl px-3 py-3 font-semibold transition-colors hover:bg-white/5 hover:text-gold ${
                      isActive(l) ? "bg-white/5 text-gold" : "text-white"
                    }`}
                  >
                    {l.label}
                  </a>
                ),
            )}
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
              <LocaleSwitcher locale={locale} />
              <a
                href={waLink(waText)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gradient-to-r from-gold to-gold-soft px-5 py-2.5 text-sm font-bold text-navy-950 shadow-lg shadow-gold/25"
              >
                {nav.contact}
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
