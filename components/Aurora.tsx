"use client";

// Living background: slow-drifting aurora blobs + film grain.
// Pure CSS (GPU-composited transforms only); frozen when reduced motion.
export default function Aurora({ variant = "hero" }: { variant?: "hero" | "cta" }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="aurora-blob aurora-a" />
      <div className="aurora-blob aurora-b" />
      {variant === "hero" && <div className="aurora-blob aurora-c" />}
      <div className="grain" />
    </div>
  );
}
