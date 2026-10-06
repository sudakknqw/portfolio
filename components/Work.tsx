"use client";

import { motion } from "framer-motion";
import { easeExpo } from "@/lib/motion";
import { projects } from "@/lib/projects";
import ProjectBlock from "./ProjectBlock";
import SplitText from "./SplitText";

const WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];

export default function Work() {
  const count = WORDS[projects.length] ?? String(projects.length);

  return (
    // Solid background + z-index: this section slides up over the pinned hero
    <section id="work" className="relative z-10 rounded-t-[2rem] border-t border-line bg-ink md:rounded-t-[3rem]">
      <div className="shell grid grid-cols-12 gap-y-10 pb-16 pt-24 md:gap-x-8 md:pb-24 md:pt-36">
        <div className="col-span-12 md:col-span-8">
          <p className="label mb-6">[ 01 ] Work</p>
          <SplitText text={"Selected\n{work}"} lineClassNames={["", "md:pl-[8vw]"]} className="font-display text-display-xl font-medium" />
        </div>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 1.4, ease: easeExpo, delay: 0.3 }}
          className="caps col-span-12 max-w-[26rem] self-end md:col-span-4"
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
