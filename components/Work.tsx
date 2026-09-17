"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { easeExpo, scrollSpring } from "@/lib/motion";
import { useEffect, useRef } from "react";
import { projects } from "@/lib/projects";
import ProjectBlock from "./ProjectBlock";

/** "3 projects shipped" — counts up once, the first time it scrolls into view */
function ShippedCounter({ total }: { total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const value = useMotionValue(0);
  const shown = useTransform(value, (v) => Math.round(v));

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      value.set(total);
      return;
    }
    const controls = animate(value, total, { duration: 0.8, ease: easeExpo });
    return () => controls.stop();
  }, [inView, total, value]);

  return (
    <div ref={ref} className="flex shrink-0 items-center gap-[0.9rem]">
      {/* Fixed width so the label doesn't twitch as narrow and wide digits swap */}
      <motion.span className="inline-block min-w-[0.62em] font-display text-[clamp(3rem,5.2vw,5rem)] font-light leading-[0.8] tracking-[-0.05em] text-accent tabular-nums">
        {shown}
      </motion.span>
      <span className="label leading-[1.5]">
        Projects
        <br />
        shipped
      </span>
    </div>
  );
}

/** Section transition: two giant words slide past each other as you scroll in. */
function WorkIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, scrollSpring);
  const leftX = useTransform(smooth, [0, 1], ["-12%", "10%"]);
  const rightX = useTransform(smooth, [0, 1], ["14%", "-14%"]);
  const rule = useTransform(smooth, [0.15, 0.55], [0, 1]);

  return (
    <div ref={ref} className="relative overflow-hidden pb-14 pt-[7.5rem] md:pb-[6.5rem] md:pt-[13rem]">
      <h2 className="font-display text-[clamp(4.5rem,17vw,17rem)] leading-[0.85] tracking-[-0.055em]">
        <motion.span style={{ x: leftX }} className="block whitespace-nowrap font-extralight">
          Selected
        </motion.span>
        <motion.span style={{ x: rightX }} className="block whitespace-nowrap pl-[28vw] font-bold">
          work<span className="text-accent">.</span>
        </motion.span>
      </h2>

      <div className="shell mt-10 flex items-center gap-6 md:mt-[4.5rem] md:gap-8">
        <ShippedCounter total={projects.length} />
        <motion.span style={{ scaleX: rule }} className="block h-px flex-1 origin-left bg-accent" />
        <span className="label hidden shrink-0 md:block">What each one proves</span>
      </div>
    </div>
  );
}

export default function Work() {
  return (
    <section id="work" className="relative">
      <WorkIntro />
      {projects.map((p, i) => (
        <ProjectBlock key={p.slug} project={p} index={i} total={projects.length} />
      ))}
    </section>
  );
}
