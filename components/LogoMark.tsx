"use client";

import { useId } from "react";

// Rebuilt vector of the Apptivity "A" mark (original PNG had baked bg).
// Rounded inverted-V ribbon with navy fold shadow on the left foot.
export default function LogoMark({ className = "" }: { className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const body = `grad-body-${uid}`;
  const foot = `grad-foot-${uid}`;
  return (
    <svg
      viewBox="0 0 200 168"
      className={className}
      role="img"
      aria-label="Apptivity logo"
    >
      <defs>
        <linearGradient id={body} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5aa8e8" />
          <stop offset="55%" stopColor="#1d5fad" />
          <stop offset="100%" stopColor="#1d9fd4" />
        </linearGradient>
        <linearGradient id={foot} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0d2758" />
          <stop offset="100%" stopColor="#1d5fad" />
        </linearGradient>
      </defs>
      <path
        d="M38 138 L92 22 L164 138"
        fill="none"
        stroke={`url(#${body})`}
        strokeWidth="42"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse
        cx="48"
        cy="118"
        rx="27"
        ry="34"
        fill={`url(#${foot})`}
        transform="rotate(-24 48 118)"
      />
    </svg>
  );
}
