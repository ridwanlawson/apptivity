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
    const reduce = prefersReducedMotion();

    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * DPR));
      canvas.height = Math.max(1, Math.floor(rect.height * DPR));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Symmetric "lens": front bulge + mirrored back bulge.
    const pts = ORB_POINTS.flatMap(([x, y, d, r, g, b]) => [
      { x, y, z: d * ZSCALE, r, g, b },
      { x, y, z: -d * ZSCALE, r, g, b },
    ]);

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
      const projected = pts.map((p) => {
        const x = p.x * cosY - p.z * sinY;
        const z = p.x * sinY + p.z * cosY;
        const y2 = p.y * cosX - z * sinX;
        const z2 = p.y * sinX + z * cosX;
        const scale = 2.7 / (2.7 - z2 * 0.9);
        return {
          sx: w / 2 + x * (w * 0.4) * scale,
          sy: h / 2 - y2 * (h * 0.4) * scale,
          z: z2,
          scale,
          r: p.r,
          g: p.g,
          b: p.b,
        };
      });
      projected.sort((a, b) => a.z - b.z);
      const k = w / 1000;
      for (const pt of projected) {
        const depth = (pt.z + 1) / 2;
        const alpha = 0.22 + depth * 0.72;
        const size = (1.0 + depth * 1.9) * k * pt.scale;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${pt.r | 0}, ${pt.g | 0}, ${pt.b | 0}, ${alpha.toFixed(2)})`;
        if (depth > 0.6) {
          ctx.shadowColor = `rgba(${pt.r | 0}, ${pt.g | 0}, ${pt.b | 0}, 0.85)`;
          ctx.shadowBlur = 7 * k;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.arc(pt.sx, pt.sy, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    };

    if (reduce) {
      draw(angleY, tiltBase);
      return () => ro.disconnect();
    }

    const tick = () => {
      if (visible && !document.hidden) {
        angleY += speed;
        draw(angleY, tiltBase + Math.sin(angleY * 0.6) * 0.05);
      }
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
    });
    io.observe(canvas);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
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
