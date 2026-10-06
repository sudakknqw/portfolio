"use client";

import { motion } from "framer-motion";
import { easeExpo } from "@/lib/motion";
import { projects } from "@/lib/projects";
import ProjectBlock from "./ProjectBlock";

const WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];

export default function Work() {
  const count = WORDS[projects.length] ?? String(projects.length);

  return (
    // The "Selected {work}" heading lives at the end of the terminal, decoded from its output.
    // Pulled up (no background) so this intro rises under the heading while it is still pinned
    <section id="work" className="relative z-10 -mt-[40svh]">
      <div className="shell grid grid-cols-12 items-end gap-y-6 pb-14 pt-6 md:gap-x-8 md:pb-20">
        <p className="label col-span-12 md:col-span-8">[ 01 ] Work</p>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 1.4, ease: easeExpo, delay: 0.3 }}
          className="caps col-span-12 max-w-[26rem] md:col-span-4"
        >
          {count} shipped projects. Each one is here because it proves something specific, listed right under the
          title.
        </motion.p>
      </div>

      <div className="shell pb-16 md:pb-24">
        {projects.map((p, i) => (
          <ProjectBlock key={p.slug} project={p} index={i} total={projects.length} />
        ))}
      </div>
    </section>
  );
}
