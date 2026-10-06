"use client";

import { motion, useScroll, useSpring, useTransform, type Variants } from "framer-motion";
import { useRef } from "react";
import { easeExpo, scrollSpring } from "@/lib/motion";
import { site } from "@/lib/site";
import Bloom from "./Bloom";
import BracketButton from "./BracketButton";
import SplitText from "./SplitText";
import StatusBadge from "./StatusBadge";

const fade: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (delay: number) => ({ opacity: 1, y: 0, transition: { duration: 1.4, ease: easeExpo, delay } }),
};

/**
 * Pinned first screen. While it's pinned, scrolling opens the bloom
 * and pulls the headline lines apart; then the work section slides over it.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, scrollSpring);

  const bloomScale = useTransform(p, [0, 1], [1, 1.7]);
  const bloomOpacity = useTransform(p, [0, 0.15], [0.85, 1]);
  const pullLeft = useTransform(p, [0, 1], ["0%", "-10%"]);
  const pullRight = useTransform(p, [0, 1], ["0%", "12%"]);
  const fadeOut = useTransform(p, [0, 0.6], [1, 0]);

  return (
    <section id="top" ref={ref} className="relative h-[130svh] md:h-[180svh]">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pt-24 md:pt-32">
        {/* The living object */}
        <div className="pointer-events-none absolute left-1/2 top-[52%] h-[min(110vw,52rem)] w-[min(110vw,52rem)] -translate-x-1/2 -translate-y-1/2 md:left-[64%]">
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2.4, ease: easeExpo, delay: 0.3 }}
            className="h-full w-full"
          >
            <motion.div style={{ scale: bloomScale, opacity: bloomOpacity }} className="h-full w-full">
              <Bloom progress={p} className="h-full w-full" />
            </motion.div>
          </motion.div>
        </div>

        <div className="shell relative flex flex-1 flex-col">
          <motion.div initial="hidden" animate="show" className="flex items-start justify-between">
            <motion.p variants={fade} custom={0.2} className="label flex items-center gap-3">
              <span className="h-px w-8 bg-accent" />
              {site.role}
            </motion.p>
            <motion.p variants={fade} custom={0.35} className="label hidden text-right md:block">
              Bangkok · 13.75° N
              <br />
              Web products &amp; automation
            </motion.p>
          </motion.div>

          <div className="mt-8 md:mt-10">
            <motion.div style={{ x: pullLeft }}>
              <SplitText
                as="h1"
                trigger="mount"
                delay={0.35}
                text={"Good so_f_tware\nstarts {below}"}
                lineClassNames={["", "md:pl-[10vw]"]}
                className="font-display text-display-xxl font-medium"
              />
            </motion.div>
            <motion.div style={{ x: pullRight }}>
              <SplitText
                as="p"
                trigger="mount"
                delay={0.85}
                text={"~the~ surfa_c_e."}
                lineClassNames={["md:pl-[22vw]"]}
                className="font-display text-display-xxl font-medium"
              />
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            animate="show"
            style={{ opacity: fadeOut }}
            className="mt-auto grid grid-cols-12 items-end gap-y-8 pb-6 md:gap-x-8 md:pb-9"
          >
            <motion.div variants={fade} custom={1.2} className="col-span-12 md:col-span-5">
              <p className="caps max-w-[30rem]">
                Schema, access rules and edge cases come first. I work out the data model before the interface. Right
                now that&apos;s mostly web products and automation: landing pages, booking systems, integrations
                between the tools a business already runs on.
              </p>
              <div className="mt-6">
                <StatusBadge />
              </div>
            </motion.div>

            <motion.div
              variants={fade}
              custom={1.35}
              className="col-span-12 flex items-end justify-between gap-6 md:col-span-4 md:col-start-9 md:justify-end"
            >
              <BracketButton href="#work" className="text-sm">
                See the work
              </BracketButton>
              <span className="label md:hidden">Scroll ↓</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
