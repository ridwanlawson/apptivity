"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/anim";

type P = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  gold: boolean;
};

const SKY = "90,168,232";
const GOLD = "240,191,76";
const LINK_DIST = 130;
const MOUSE_DIST = 160;

// Living + interactive backdrop: drifting aurora blobs (parallax to pointer)
// under a canvas particle net that reacts to the cursor.
// Static + canvas-free when reduced motion, touch, or offscreen.
export default function Backdrop({ variant = "hero" }: { variant?: "hero" | "cta" }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const shiftRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const shift = shiftRef.current;
    const canvas = canvasRef.current;
    if (!root || !shift || !canvas) return;
    const reduce = prefersReducedMotion();

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let parts: P[] = [];
    const mouse = { x: -9999, y: -9999, inside: false };
    let visible = true;
    let raf = 0;

    const seed = () => {
      const n = Math.max(28, Math.min(90, Math.floor((w * h) / 22000)));
      parts = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1 + Math.random() * 1.8,
        gold: Math.random() < 0.15,
      }));
    };

    const resize = () => {
      const rect = root.getBoundingClientRect();
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = root.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.inside =
        mouse.x >= 0 && mouse.y >= 0 && mouse.x <= w && mouse.y <= h;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const io = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
      if (visible) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(root);

    const paint = () => {
      ctx.clearRect(0, 0, w, h);

      // Links.
      for (let i = 0; i < parts.length; i++) {
        const a = parts[i];
        if (!a) continue;
        for (let j = i + 1; j < parts.length; j++) {
          const b = parts[j];
          if (!b) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK_DIST) {
            ctx.strokeStyle = `rgba(${SKY},${((1 - d / LINK_DIST) * 0.28).toFixed(2)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        // Gold thread to cursor.
        if (mouse.inside) {
          const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
          if (dm < MOUSE_DIST) {
            ctx.strokeStyle = `rgba(${GOLD},${((1 - dm / MOUSE_DIST) * 0.5).toFixed(2)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      // Dots.
      for (const p of parts) {
        ctx.fillStyle = p.gold ? `rgba(${GOLD},0.9)` : `rgba(${SKY},0.7)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = () => {
      if (!visible || document.hidden) {
        raf = requestAnimationFrame(tick);
        return;
      }
      // Blob parallax toward cursor (max ±18px).
      const nx = mouse.inside ? (mouse.x / w - 0.5) * 2 : 0;
      const ny = mouse.inside ? (mouse.y / h - 0.5) * 2 : 0;
      shift.style.transform = `translate(${(nx * 18).toFixed(1)}px, ${(ny * 18).toFixed(1)}px)`;

      for (const p of parts) {
        // Gentle mouse repulsion.
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (mouse.inside && d2 < MOUSE_DIST * MOUSE_DIST && d2 > 1) {
          const d = Math.sqrt(d2);
          const f = ((MOUSE_DIST - d) / MOUSE_DIST) * 0.6;
          p.vx += (dx / d) * f * 0.06;
          p.vy += (dy / d) * f * 0.06;
        }
        // Damping back to drift speed.
        p.vx *= 0.985;
        p.vy *= 0.985;
        if (Math.abs(p.vx) < 0.08) p.vx += (Math.random() - 0.5) * 0.02;
        if (Math.abs(p.vy) < 0.08) p.vy += (Math.random() - 0.5) * 0.02;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
      }

      paint();
      raf = requestAnimationFrame(tick);
    };

    if (reduce) {
      // Reduced motion: draw the same field once (and on resize), no loop.
      paint();
      const onResize = () => {
        resize();
        paint();
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div ref={shiftRef} className="absolute inset-0 will-change-transform">
        <div className="aurora-blob aurora-a" />
        <div className="aurora-blob aurora-b" />
        {variant === "hero" && <div className="aurora-blob aurora-c" />}
      </div>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="grain" />
    </div>
  );
}
