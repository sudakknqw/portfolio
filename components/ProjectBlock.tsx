"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import type { Project } from "@/lib/projects";
import { easeExpo, scrollSpring } from "@/lib/motion";
import ArrowLink from "./ArrowLink";
import DeviceFrame from "./DeviceFrame";

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "0px 0px -15% 0px" },
};

export default function ProjectBlock({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const flip = index % 2 === 1;
  const num = String(index + 1).padStart(2, "0");

  // Media and numeral travel at different speeds → depth without cursor tricks
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, scrollSpring);
  const mediaY = useTransform(smooth, [0, 1], [50, -50]);
  const numY = useTransform(smooth, [0, 1], [50, -50]);

  return (
    <article
      ref={ref}
      className="group/project relative flex min-h-[100svh] items-center border-t border-line pb-24 pt-[4.5rem] md:pb-[9rem] md:pt-[5.5rem]"
    >
      <div className="shell grid grid-cols-12 items-center gap-y-12 md:gap-x-8">
        {/* Screenshot */}
        <motion.div
          {...reveal}
          transition={{ duration: 1.6, ease: easeExpo }}
          className={`col-span-12 md:col-span-7 md:row-start-1 md:self-end md:mb-[3.25rem] ${flip ? "md:col-start-6" : "md:col-start-1"}`}
        >
          <motion.div style={{ y: mediaY }}>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${project.title} live`}
              className="block"
            >
              <DeviceFrame project={project} />
            </a>
          </motion.div>
        </motion.div>

        {/* Copy */}
        <div
          className={`relative col-span-12 md:col-span-5 md:row-start-1 ${
            flip ? "md:col-start-1" : "md:col-start-8 md:pl-6"
          }`}
        >
          <motion.span
            aria-hidden
            style={{ y: numY }}
            className="numeral-outline pointer-events-none relative -ml-[0.05em] block select-none font-display text-[clamp(6rem,13vw,13rem)] font-extrabold leading-[0.8] tracking-[-0.06em]"
          >
            {num}
            {/* Accent copy fades in on top: an opacity change is composited, a stroke-colour change repaints huge glyphs */}
            <span className="absolute inset-0 opacity-0 transition-opacity duration-700 ease-expo [-webkit-text-stroke-color:#FF4F1A] group-hover/project:opacity-100">
              {num}
            </span>
          </motion.span>

          <motion.div {...reveal} transition={{ duration: 1.4, ease: easeExpo, delay: 0.12 }} className="relative mt-[1.35rem]">
            <p className="label mb-[1.1rem] flex items-center gap-3">
              <span className="text-accent">
                {num}/{String(total).padStart(2, "0")}
              </span>
              {project.year && (
                <>
                  <span className="h-px w-6 bg-line" />
                  {project.year}
                </>
              )}
            </p>

            <h3 className="font-display text-display-m">
              <span className="font-bold">{project.title}</span>
              <span className="font-extralight text-bone/60"> — {project.type}</span>
            </h3>
          </motion.div>

          <motion.ul
            {...reveal}
            transition={{ duration: 1.4, ease: easeExpo, delay: 0.24 }}
            className="relative mt-[2.75rem] space-y-[1.15rem]"
          >
            {project.points.map((point, i) => (
              <li key={i} className="grid grid-cols-[2rem_1fr] items-baseline text-lead text-bone/75">
                <span className="font-mono text-mono-xs text-accent">{String.fromCharCode(97 + i)}.</span>
                <span>{point}</span>
              </li>
            ))}
          </motion.ul>

          <motion.div {...reveal} transition={{ duration: 1.4, ease: easeExpo, delay: 0.36 }} className="relative">
            <p className="mt-[3.25rem] border-t border-line pt-[1.1rem] font-mono text-[12px] leading-relaxed text-muted">
              {project.stack.join("  /  ")}
            </p>

            {project.liveUrl && (
              <div className="mt-[1.75rem]">
                <ArrowLink href={project.liveUrl}>View live</ArrowLink>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </article>
  );
}
