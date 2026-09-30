"use client";

import { useState } from "react";
import Image from "next/image";

// Product visual with graceful fallback: shows the flyer image when the
// file exists, otherwise an elegant branded placeholder (gradient +
// product initial). Once the real files land in public/products, the
// photos appear automatically — no code change needed.
export default function ProductImage({ src, alt }: { src: string; alt: string }) {
  const [err, setErr] = useState(false);

  if (err) {
    return (
      <div
        aria-hidden="true"
        className="relative flex h-full w-full items-center justify-center overflow-hidden bg-navy-950"
        style={{
          backgroundImage:
            "linear-gradient(135deg, #0d2758 0%, #1d5fad 55%, #5aa8e8 130%)",
        }}
      >
        <div className="grain" />
        <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
        <div className="absolute -bottom-12 -left-6 h-36 w-36 rounded-full bg-gold/25 blur-2xl" />
        <span className="relative text-7xl font-extrabold tracking-tight text-white/90">
          {alt.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className="object-cover object-top"
      loading="lazy"
      onError={() => setErr(true)}
    />
  );
}
