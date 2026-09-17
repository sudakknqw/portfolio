"use client";

import { MotionConfig } from "framer-motion";
import Lenis from "lenis";
import { useEffect } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // lerp instead of fixed duration: every wheel tick blends into the previous one
    const lenis = new Lenis({
      lerp: 0.07,
      wheelMultiplier: 0.9,
      smoothWheel: true,
      autoRaf: true,
      anchors: { offset: -80 },
    });
    return () => lenis.destroy();
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
