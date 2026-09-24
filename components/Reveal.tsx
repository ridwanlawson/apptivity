"use client";

import { useRef, type ReactNode } from "react";
import { useReveal } from "@/lib/anim";

// Thin client boundary so server sections can opt into scroll reveal.
export default function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref);
  return <div ref={ref}>{children}</div>;
}
