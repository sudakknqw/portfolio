"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useFinePointer } from "@/lib/useFinePointer";

const INTERACTIVE = "a, button, [data-cursor='hover']";
const RING = 64; // px at full size; the idle ring is scaled down, never resized
const RING_IDLE = 36 / RING;

/**
 * Replaces the native cursor on desktop:
 * a small accent dot glued to the pointer + a soft ring that trails behind it.
 */
export default function Cursor() {
  const fine = useFinePointer();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 170, damping: 26, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 170, damping: 26, mass: 0.6 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [invert, setInvert] = useState(false); // on an accent background: dot + ring go dark
  const [darkDot, setDarkDot] = useState(false); // on an accent background
  const state = useRef({ hovering: false, visible: false, invert: false, darkDot: false });

  useEffect(() => {
    if (!fine) return;
    document.documentElement.classList.add("has-custom-cursor");

    let target: Element | null = null;
    let frame = 0;

    // Hit-testing reads styles, so it runs at most once per frame —
    // high-polling mice fire pointermove far more often than the screen refreshes
    const inspect = () => {
      frame = 0;
      const s = state.current;
      const over = !!target?.closest?.(INTERACTIVE);
      const inv = !!target?.closest?.("[data-cursor='invert']");
      const dot = inv;
      if (inv !== s.invert) setInvert((s.invert = inv));
      if (dot !== s.darkDot) setDarkDot((s.darkDot = dot));
      if (over !== s.hovering) setHovering((s.hovering = over));
      if (!s.visible) setVisible((s.visible = true));
    };

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      target = e.target as Element | null;
      if (!frame) frame = requestAnimationFrame(inspect);
    };
    const onLeave = () => setVisible((state.current.visible = false));

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [fine, x, y]);

  if (!fine) return null;

  const soft = { type: "spring", stiffness: 220, damping: 28 } as const;

  return (
    <>
      {/* Trailing ring — grows via transform only, so hovering never triggers layout */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] will-change-transform"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className="rounded-full border-[1.75px]"
          style={{ width: RING, height: RING, x: "-50%", y: "-50%" }}
          initial={false}
          animate={{
            scale: hovering ? 1 : RING_IDLE,
            borderColor: invert
              ? "rgba(10,10,10,0.75)"
              : hovering
                ? "rgba(255,90,31,0.9)"
                : "rgba(255,90,31,0.4)",
            backgroundColor: invert
              ? "rgba(10,10,10,0)"
              : hovering
                ? "rgba(255,90,31,0.08)"
                : "rgba(255,90,31,0)",
            opacity: visible ? 1 : 0,
          }}
          transition={soft}
        />
      </motion.div>

      {/* Dot — exact pointer position */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[101] will-change-transform"
        style={{ x, y }}
      >
        <motion.div
          className="h-2 w-2 rounded-full"
          style={{ x: "-50%", y: "-50%" }}
          initial={false}
          animate={{
            scale: hovering ? 0.6 : 1,
            opacity: visible ? 1 : 0,
            backgroundColor: darkDot ? "rgb(10,10,10)" : "rgb(255,90,31)",
          }}
          transition={soft}
        />
      </motion.div>
    </>
  );
}
