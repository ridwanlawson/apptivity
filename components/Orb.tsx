"use client";

import { useEffect, useRef } from "react";
import { ORB_POINTS } from "@/lib/orb-points";
import { prefersReducedMotion } from "@/lib/anim";

const ZSCALE = 0.62;

// Rotating 3D point-cloud orb traced from the logo silhouette.
// Ported 1:1 from "Apptivity Orb.html"; plus pause when offscreen/hidden.
export default function Orb({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Reduced motion gets one static frame: no per-frame 3D loop.
    const reduce = prefersReducedMotion();
    // Adaptive quality: identical spin, fewer backing pixels when the
    // frame rate sags on weak iGPUs. One-way ratchet, never oscillates.
    // Declared before resize(): resize() runs immediately below.
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let frames = 0;
    let fpsT = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Symmetric "lens": front bulge + mirrored back bulge.
    const pts = ORB_POINTS.flatMap(([x, y, d, r, g, b]) => [
      { x, y, z: d * ZSCALE, r, g, b },
      { x, y, z: -d * ZSCALE, r, g, b },
    ]);
    // Reused projection slots + prebuilt color strings: zero allocation
    // per frame (no .map objects, no rgba() strings → no GC pauses).
    // Each slot keeps its source point so degraded draws can skip slots.
    const proj = pts.map((p) => ({
      sx: 0,
      sy: 0,
      z: 0,
      scale: 1,
      css: `rgb(${p.r | 0},${p.g | 0},${p.b | 0})`,
      s: p,
    }));
    const byZ = (a: { z: number }, b: { z: number }) => a.z - b.z;
    // Live draw set: full density on capable hardware, subsampled when
    // the frame rate sags (same shape, fewer dots/arcs — the expensive
    // part on weak CPUs). Rebuilt only on degrade, never per frame.
    let step = 1;
    let live = proj;
    const applyStep = () => {
      live = step === 1 ? proj : proj.filter((_, i) => i % step === 0);
    };

    let angleY = 0.15;
    const speed = 0.0018;
    const tiltBase = 0.18;
    let visible = true;
    let raf = 0;

    const draw = (aY: number, aX: number) => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const cosY = Math.cos(aY);
      const sinY = Math.sin(aY);
      const cosX = Math.cos(aX);
      const sinX = Math.sin(aX);
      for (let k = 0; k < live.length; k++) {
        const o = live[k]!;
        const p = o.s;
        const x = p.x * cosY - p.z * sinY;
        const z = p.x * sinY + p.z * cosY;
        const y2 = p.y * cosX - z * sinX;
        const z2 = p.y * sinX + z * cosX;
        const scale = 2.7 / (2.7 - z2 * 0.9);
        o.sx = w / 2 + x * (w * 0.4) * scale;
        o.sy = h / 2 - y2 * (h * 0.4) * scale;
        o.z = z2;
        o.scale = scale;
      }
      live.sort(byZ);
      const k = w / 1000;
      for (const pt of live) {
        const depth = (pt.z + 1) / 2;
        const alpha = 0.22 + depth * 0.72;
        const size = (1.0 + depth * 1.9) * k * pt.scale;
        ctx.fillStyle = pt.css;
        // ponytail: no shadowBlur — per-point canvas shadows stall weak
        // GPUs; depth already reads through alpha + size. Front points get
        // a cheap halo dot instead.
        if (depth > 0.75) {
          ctx.globalAlpha = 0.12;
          ctx.beginPath();
          ctx.arc(pt.sx, pt.sy, size * 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(pt.sx, pt.sy, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    if (reduce) {
      // Static frame, but keep it painted: any resize clears the canvas,
      // so redraw after resize instead of leaving a blank orb behind.
      const paintStatic = () => {
        resize();
        draw(angleY, tiltBase);
      };
      paintStatic();
      const ro2 = new ResizeObserver(paintStatic);
      ro2.observe(canvas);
      return () => {
        ro.disconnect();
        ro2.disconnect();
      };
    }

    const tick = () => {
      if (visible && !document.hidden) {
        angleY += speed;
        draw(angleY, tiltBase + Math.sin(angleY * 0.6) * 0.05);
        // Rolling fps meter, two adaptive stages (one-way, no oscillation):
        // 1. fewer backing pixels, 2. fewer dots/arcs (the CPU hog).
        // Same spin, same shape — never turned off.
        frames++;
        const now = performance.now();
        if (now - fpsT >= 2000) {
          const fps = (frames * 1000) / (now - fpsT);
          frames = 0;
          fpsT = now;
          if (fps < 45) {
            if (dpr > 1) {
              dpr = Math.max(1, dpr - 0.25);
              resize();
            } else if (step < 3) {
              step += 1;
              applyStep();
            }
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
    });
    io.observe(canvas);
    // Decorative loop: start only after full load so it never contends
    // with hydration / LCP on the main thread.
    let started = false;
    const kick = () => {
      if (started) return;
      started = true;
      raf = requestAnimationFrame(tick);
    };
    if (document.readyState === "complete") {
      kick();
    } else {
      window.addEventListener("load", kick, { once: true });
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", kick);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role="img"
      aria-label="Orb apptivity.id — jasa pembuatan aplikasi"
    />
  );
}
