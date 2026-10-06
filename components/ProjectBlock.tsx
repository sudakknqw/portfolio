"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { Project } from "@/lib/projects";
import { easeExpo } from "@/lib/motion";
import BracketButton from "./BracketButton";
import DeviceFrame from "./DeviceFrame";

/**
 * One project as a rounded card. On desktop the cards pin and stack:
 * each new one slides over the last, which shrinks and darkens underneath.
 */
export default function ProjectBlock({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const last = index === total - 1;
  const num = String(index + 1).padStart(2, "0");

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, last ? 1 : 0.9]);
  const shade = useTransform(scrollYProgress, [0, 1], [0, last ? 0 : 0.65]);

  return (
    <div ref={ref} className={`mb-5 md:mb-0 ${last ? "" : "md:h-[100svh]"}`}>
      <motion.article
        // Opacity only: a transform here would shift the pinned position
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 1.4, ease: easeExpo }}
        style={{ top: `calc(6.25rem + ${index * 1.1}rem)` }}
        className="md:sticky"
      >
        <motion.div
          style={{ scale }}
          className="panel group/project relative origin-top overflow-hidden p-5 md:h-[calc(100svh-9rem)] md:max-h-[44rem] md:p-9"
        >
          <div className="grid h-full grid-cols-12 gap-y-8 md:gap-x-10">
            {/* Copy */}
            <div className="col-span-12 flex flex-col md:col-span-5">
              <div className="label flex items-center gap-3">
                <span className="text-fg">
                  [ {num} / {String(total).padStart(2, "0")} ]
                </span>
                {project.year && <span>{project.year}</span>}
              </div>

              <h3 className="mt-6 font-display text-display-l font-medium md:mt-10">{project.title}</h3>
              <p className="mt-2 font-serif text-display-s text-fg/70">{project.type}</p>

              <ul className="mt-8 space-y-3 md:mt-10">
                {project.points.map((point, i) => (
                  <li key={i} className="grid grid-cols-[2.25rem_1fr] items-baseline text-[0.9375rem] leading-relaxed text-fg/80">
                    <span className="font-serif text-lg">{`{${String.fromCharCode(97 + i)}}`}</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5 md:mt-auto">
                <span className="caps text-fg/60">{project.stack.join(" · ")}</span>
                {project.liveUrl && (
                  <BracketButton href={project.liveUrl} className="text-sm">
                    View live
                  </BracketButton>
                )}
              </div>
            </div>

            {/* Screenshot */}
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${project.title} live`}
              className="col-span-12 block self-center md:col-span-7"
            >
              <DeviceFrame project={project} />
            </a>
          </div>

          {/* Darkens as the next card covers this one */}
          <motion.div aria-hidden style={{ opacity: shade }} className="pointer-events-none absolute inset-0 bg-ink" />
        </motion.div>
      </motion.article>
    </div>
  );
}
