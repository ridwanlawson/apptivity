"use client";

import { useEffect, useState } from "react";
import LogoMark from "./LogoMark";
import LocaleSwitcher from "./LocaleSwitcher";
import { SITE_DOMAIN, waLink } from "@/lib/site";
import type { Locale } from "@/lib/i18n";

type NavDict = {
  about: string;
  scheme: string;
  ownership: string;
  mechanism: string;
  legal: string;
  brief: string;
  contact: string;
};

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links: { href: string; label: string }[] = [
    { href: `/${locale}#tentang`, label: nav.about },
    { href: `/${locale}#skema`, label: nav.scheme },
    { href: `/${locale}#kepemilikan`, label: nav.ownership },
    { href: `/${locale}#mekanisme`, label: nav.mechanism },
    { href: `/${locale}#legalitas`, label: nav.legal },
    { href: `/${locale}#mulai`, label: nav.brief },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[80] transition-all ${
        scrolled
          ? "bg-navy-950/90 shadow-lg shadow-black/20 backdrop-blur"
          : "bg-transparent"
      }`}
    >
      <a href="#konten" className="skip-link">
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a
          href={`/${locale}`}
          className="flex items-center gap-2"
          aria-label={`${SITE_DOMAIN} home`}
        >
          <LogoMark className="h-8 w-8" />
          <span className="text-lg font-extrabold tracking-tight text-white">
            {SITE_DOMAIN}
          </span>
        </a>

        <nav
          className="hidden items-center gap-5 text-sm font-semibold text-white/80 lg:flex"
          aria-label="Primary"
        >
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-gold">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LocaleSwitcher locale={locale} />
          <a
            href={waLink(waText)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-gold px-4 py-2 text-sm font-bold text-navy-950 transition-transform hover:-translate-y-0.5"
          >
            {nav.contact}
          </a>
        </div>

        <button
          className="rounded-lg p-2 text-white lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" className="text-2xl">
            {open ? "✕" : "☰"}
          </span>
        </button>
      </div>

      {open && (
        <nav
          className="border-t border-white/10 bg-navy-950/95 px-4 pb-6 pt-2 backdrop-blur lg:hidden"
          aria-label="Mobile"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-2 py-3 font-semibold text-white hover:bg-white/5 hover:text-gold"
            >
              {l.label}
            </a>
          ))}
          <div className="mt-2 flex items-center justify-between gap-3">
            <LocaleSwitcher locale={locale} />
            <a
              href={waLink(waText)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-gold px-4 py-2 text-sm font-bold text-navy-950"
            >
              {nav.contact}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
