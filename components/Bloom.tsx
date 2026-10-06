"use client";

import type { MotionValue } from "framer-motion";
import { useEffect, useRef } from "react";

const PETALS = 9;
// Soft edges without ctx.filter (Safari ignores it): each blade is drawn in a few widening, fainter passes
const PASSES = [
  { width: 1, alpha: 0.9 },
  { width: 1.8, alpha: 0.32 },
  { width: 3, alpha: 0.12 },
];

/**
 * The living object behind the hero: orange blades turning around a hot core.
 * Plain 2D canvas, no WebGL. Capped pixel ratio, 30 fps on touch screens,
 * paused while off screen, one still frame for reduced motion.
 * `progress` (0…1, e.g. hero scroll) opens the bloom and spins it further.
 */
export default function Bloom({ progress, className = "" }: { progress?: MotionValue<number>; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const touch = window.matchMedia("(pointer: coarse)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, touch ? 1.25 : 1.75);
    const frameMs = touch ? 1000 / 30 : 0;

    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;
    let visible = true;

    const draw = (t: number) => {
      const p = progress?.get() ?? 0;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.48;

      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < PETALS; i++) {
        const angle = (i / PETALS) * Math.PI * 2 + t * 0.00011 * (1 + (i % 3) * 0.35) + p * 2.2;
        const breathe = 0.5 + 0.5 * Math.sin(t * 0.0008 + i * 1.7);
        const len = R * (0.5 + 0.3 * breathe) * (0.75 + 0.45 * p) * (i % 2 ? 0.72 : 1);
        const wid = len * (0.13 + 0.04 * Math.sin(t * 0.001 + i));

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        for (const pass of PASSES) {
          const g = ctx.createLinearGradient(0, 0, len, 0);
          g.addColorStop(0, `rgba(255, 110, 50, ${pass.alpha})`);
          g.addColorStop(0.5, `rgba(255, 90, 31, ${pass.alpha * 0.55})`);
          g.addColorStop(1, "rgba(255, 90, 31, 0)");
          ctx.fillStyle = g;
          const ww = wid * pass.width;
          // Asymmetric blade: full curve on one side, a shallow one on the other
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(len * 0.42, -ww, len, 0);
          ctx.quadraticCurveTo(len * 0.5, ww * 0.3, 0, 0);
          ctx.fill();
        }
        ctx.restore();
      }

      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.32);
      core.addColorStop(0, "rgba(255, 150, 90, 0.28)");
      core.addColorStop(1, "rgba(255, 90, 31, 0)");
      ctx.fillStyle = core;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
    };

    const loop = (t: number) => {
      raf = 0;
      if (!visible) return;
      if (t - last >= frameMs) {
        last = t;
        draw(t);
      }
      raf = requestAnimationFrame(loop);
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (still) draw(0);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !still && !raf) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);

    // Reduced motion: still frame, redrawn only when the scroll value changes
    const unsub = still && progress ? progress.on("change", () => draw(0)) : undefined;

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      unsub?.();
    };
  }, [progress]);

  return <canvas ref={ref} aria-hidden className={className} />;
}
