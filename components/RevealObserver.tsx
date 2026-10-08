"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/anim";

// Single document-wide scroll-reveal observer. Lets purely static sections
// stay Server Components (zero hydration JS) instead of each mounting its
// own useReveal hook. Mount once in the locale layout.
export default function RevealObserver() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const items = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!items.length) return;
    items.forEach((it) => it.classList.add("reveal-hidden"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-visible");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    items.forEach((it) => io.observe(it));
    return () => io.disconnect();
  }, []);
  return null;
}
