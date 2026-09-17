"use client";

import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { useRef } from "react";
import { easeExpo, scrollSpring } from "@/lib/motion";
import { site } from "@/lib/site";
import { useFinePointer } from "@/lib/useFinePointer";
import StatusBadge from "./StatusBadge";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.4 } },
};

const line: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 1.5, ease: easeExpo } },
};

const fade: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 1.6, ease: easeExpo } },
};

/** Masked line: text slides up from behind its own baseline. */
function Line({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`-mb-[0.12em] block overflow-hidden pb-[0.12em] ${className}`}>
      <motion.span variants={line} className="block will-change-transform">
        {children}
      </motion.span>
    </span>
  );
}

/** A decorative element that drifts with the cursor. `depth` = max offset in px. */
function Drift({
  mx,
  my,
  depth,
  className,
  children,
}: {
  mx: MotionValue<number>;
  my: MotionValue<number>;
  depth: number;
  className: string;
  children: React.ReactNode;
}) {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth);
  return (
    <motion.div aria-hidden style={{ x, y }} className={`pointer-events-none absolute ${className}`}>
      {children}
    </motion.div>
  );
}

function Coordinates({ mx, my }: { mx: MotionValue<number>; my: MotionValue<number> }) {
  const tx = useTransform(mx, (v) => `x ${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(2)}`);
  const ty = useTransform(my, (v) => `y ${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(2)}`);
  return (
    // Text changes every frame while drifting — contain it so the rest of the page isn't re-laid out
    <div className="label flex w-[5.5rem] flex-col gap-1 tabular-nums [contain:layout_paint]">
      <motion.span>{tx}</motion.span>
      <motion.span>{ty}</motion.span>
    </div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const fine = useFinePointer();

  // Cursor position normalised to -1…1, smoothed
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 35, damping: 20, mass: 1 });
  const my = useSpring(rawY, { stiffness: 35, damping: 20, mass: 1 });

  // Normalised against the viewport: no layout reads on pointermove, which fires up to 1000×/s
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!fine) return;
    rawX.set((e.clientX / window.innerWidth) * 2 - 1);
    rawY.set((e.clientY / window.innerHeight) * 2 - 1);
  };

  // Scroll-out: headline lifts and dims as the work section takes over
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const smoothProgress = useSpring(scrollYProgress, scrollSpring);
  const headY = useTransform(smoothProgress, [0, 1], ["0%", "-18%"]);
  const headOpacity = useTransform(smoothProgress, [0, 0.8], [1, 0.15]);

  return (
    <section
      id="top"
      ref={ref}
      onPointerMove={onMove}
      className="relative flex min-h-[100svh] flex-col overflow-hidden pt-28 md:pt-32"
    >
      {/* Decorative layer — desktop with a mouse only */}
      {fine && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 1.2 }}
          className="absolute inset-0"
        >
          {/* Crop marks, like on a print proof */}
          <Drift mx={mx} my={my} depth={-28} className="right-[9%] top-[19%]">
            <span className="relative block h-[4.5rem] w-[4.5rem]">
              <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-bone/30" />
              <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-bone/30" />
              <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-bone/30" />
              <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-accent" />
            </span>
          </Drift>
          <Drift mx={mx} my={my} depth={18} className="right-[24%] top-[50%]">
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <span key={i} className={`h-1 w-1 rounded-full ${i === 4 ? "bg-accent" : "bg-bone/25"}`} />
              ))}
            </div>
          </Drift>
          <Drift mx={mx} my={my} depth={40} className="right-[6%] top-[52%]">
            <span className="block h-40 w-px bg-gradient-to-b from-transparent via-accent to-transparent" />
          </Drift>
          {/* Ruler ticks: uneven on purpose */}
          <Drift mx={mx} my={my} depth={-14} className="left-[43%] top-[14%]">
            <span className="flex items-end gap-[7px]">
              {[14, 6, 6, 6, 10, 6, 6, 6, 14].map((h, i) => (
                <span key={i} style={{ height: h }} className="block w-px bg-bone/25" />
              ))}
            </span>
          </Drift>
          <Drift mx={mx} my={my} depth={24} className="left-[8%] top-[72%]">
            <span className="font-mono text-2xl font-light text-accent">+</span>
          </Drift>
          <Drift mx={mx} my={my} depth={8} className="right-10 top-28">
            <Coordinates mx={mx} my={my} />
          </Drift>
        </motion.div>
      )}

      <motion.div variants={container} initial="hidden" animate="show" className="shell relative flex flex-1 flex-col">
        <motion.p variants={fade} className="label mb-10 flex items-center gap-3 md:mb-[4.25rem]">
          <span className="h-px w-8 bg-accent" />
          {site.role}
        </motion.p>

        <motion.h1 style={{ y: headY, opacity: headOpacity }} className="font-display text-display-xl">
          <Line className="font-extralight">Good software</Line>
          <Line className="md:pl-[12vw]">
            <span className="font-extralight">starts </span>
            <span className="font-bold text-accent">below</span>
          </Line>
          <Line className="font-bold md:pl-[24vw]">the surface.</Line>

          <span className="mt-[1.1rem] flex items-center gap-4 md:mt-[2.6rem] md:pl-[12vw]">
            <motion.span
              variants={{
                hidden: { scaleX: 0 },
                show: { scaleX: 1, transition: { duration: 1.8, ease: easeExpo } },
              }}
              className="hidden h-px w-[8vw] origin-left bg-accent md:block"
            />
            <Line className="text-display-m font-extralight text-bone/75">
              Schema, access rules and edge cases <span className="font-normal text-bone">come first.</span>
            </Line>
          </span>
        </motion.h1>

        <div className="mt-auto grid grid-cols-12 items-end gap-y-10 pb-7 pt-[4.5rem] md:gap-x-8 md:pb-[2.35rem]">
          <motion.p
            variants={fade}
            className="col-span-12 max-w-[27rem] text-lead text-bone/65 md:col-span-5 md:col-start-8"
          >
            Developer who works out the data model, access rules and edge cases before writing the interface. Right
            now that&apos;s mostly web products and automation: landing pages, booking systems, integrations between
            the tools a business already runs on.
          </motion.p>

          <motion.div
            variants={fade}
            // Closing line of the first screen: availability on the left, page index on the right (desktop)
            className="col-span-12 grid grid-cols-12 items-center border-t border-line pt-[1.15rem] md:gap-x-8"
          >
            <div className="col-span-12 md:col-span-7">
              <StatusBadge />
            </div>
            {/* Page index instead of a generic scroll hint */}
            <nav className="label hidden justify-between md:col-span-5 md:col-start-8 md:flex">
              {[
                ["01", "Work", "#work"],
                ["02", "Process", "#process"],
                ["03", "Contact", "#contact"],
              ].map(([n, name, href]) => (
                <a key={href} href={href} className="group/idx transition-colors duration-500 hover:text-bone">
                  <span className="mr-2 text-bone/30 transition-colors duration-500 group-hover/idx:text-accent">
                    {n}
                  </span>
                  {name}
                </a>
              ))}
            </nav>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
