"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { easeExpo, INTRO } from "@/lib/motion";

// Letters of the nick; `true` = set in the italic serif
const NAME: [string, boolean][] = [
  ["s", false],
  ["u", false],
  ["d", true],
  ["a", false],
  ["k", false],
  ["k", true],
  ["n", false],
  ["q", true],
  ["w", false],
];

/**
 * Covers the page on load while the nick assembles letter by letter, then lifts away.
 * Rendered on the server too, so nothing flashes underneath before hydration.
 */
export default function Preloader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = window.setTimeout(() => setShow(false), (INTRO - 0.5) * 1000);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          aria-hidden
          exit={{ y: "-100%", transition: { duration: 0.9, ease: easeExpo } }}
          // CSS fallback hides it if JavaScript never runs
          className="preloader fixed inset-0 z-[200] flex items-center justify-center bg-ink text-fg"
        >
          <motion.p
            exit={{ y: "-40%", opacity: 0, transition: { duration: 0.6, ease: easeExpo } }}
            className="flex overflow-hidden pb-[0.12em] font-display text-[clamp(3.5rem,14vw,12rem)] font-medium leading-none tracking-[-0.055em]"
          >
            {NAME.map(([ch, serif], i) => (
              <motion.span
                key={i}
                initial={{ y: "110%", rotate: 8 }}
                animate={{ y: "0%", rotate: 0 }}
                transition={{ duration: 0.8, ease: easeExpo, delay: 0.1 + i * 0.06 }}
                className={`inline-block ${serif ? "font-serif font-normal tracking-[-0.02em]" : ""}`}
              >
                {ch}
              </motion.span>
            ))}
          </motion.p>
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: INTRO - 0.6, ease: [0.65, 0, 0.35, 1] }}
            className="absolute bottom-0 left-0 h-[3px] w-full origin-left bg-accent"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
