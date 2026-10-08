"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "./BrandIcons";

// Sticky mobile WhatsApp CTA. Hidden above the hero (the hero already has
// CTAs), slides in after scrolling past ~75% of the viewport. transform +
// opacity only: no layout shift, safe-area aware.
export default function FloatingCta({ href, label }: { href: string; label: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      setShow(window.scrollY > window.innerHeight * 0.75);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-track="floating-wa"
      aria-label={label}
      aria-hidden={!show}
      tabIndex={show ? undefined : -1}
      className={`fixed right-5 z-[70] grid h-14 w-14 place-items-center rounded-full bg-gold text-navy-950 shadow-2xl shadow-gold/30 transition-all duration-300 active:scale-95 sm:hidden ${
        show
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-24 opacity-0"
      }`}
      style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
    >
      <WhatsAppIcon size={26} />
    </a>
  );
}
