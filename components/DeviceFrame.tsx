import Image from "next/image";
import type { Project } from "@/lib/projects";

/** Stand-in until a real screenshot is dropped into /public/projects */
function Placeholder({ slug }: { slug: string }) {
  return (
    <div className="absolute inset-0 flex flex-col gap-4 bg-ink-2 p-[6%]">
      <div className="flex items-center justify-between">
        <span className="h-2.5 w-16 rounded-full bg-bone/10" />
        <span className="flex gap-2">
          <span className="h-2.5 w-8 rounded-full bg-bone/10" />
          <span className="h-2.5 w-8 rounded-full bg-bone/10" />
        </span>
      </div>
      <span className="mt-[6%] h-[9%] w-2/3 rounded bg-bone/10" />
      <span className="h-[9%] w-1/2 rounded bg-bone/10" />
      <div className="mt-auto grid grid-cols-4 gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className={`aspect-[2/1] rounded ${i === 5 ? "bg-accent/80" : "bg-bone/[0.06]"}`} />
        ))}
      </div>
      <span className="label absolute bottom-3 right-4 normal-case tracking-normal text-bone/30">
        /public/projects/{slug}.jpg
      </span>
    </div>
  );
}

function Screen({ project, sizes }: { project: Project; sizes: string }) {
  return project.image ? (
    <Image
      src={project.image}
      alt={`${project.title} — ${project.type}`}
      fill
      sizes={sizes}
      className="object-cover object-top transition-transform duration-[1.2s] ease-expo group-hover/media:scale-[1.03]"
    />
  ) : (
    <Placeholder slug={project.slug} />
  );
}

export default function DeviceFrame({ project }: { project: Project }) {
  if (project.device === "phone") {
    return (
      <div className="group/media mx-auto w-[min(72%,340px)] rounded-[2.6rem] border border-bone/15 bg-ink-2 p-2.5 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]">
        <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2.1rem] bg-ink">
          <Screen project={project} sizes="340px" />
          <span className="absolute left-1/2 top-2.5 h-5 w-20 -translate-x-1/2 rounded-full bg-ink" />
        </div>
      </div>
    );
  }

  return (
    <div className="group/media overflow-hidden rounded-lg border border-bone/15 bg-ink-2 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]">
      <div className="flex h-9 items-center gap-4 border-b border-line px-4">
        <span className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-bone/20" />
          <span className="h-2 w-2 rounded-full bg-bone/20" />
          <span className="h-2 w-2 rounded-full bg-bone/20" />
        </span>
        <span className="flex-1 truncate text-center font-mono text-[11px] text-bone/40">{project.domain}</span>
        <span className="w-[42px]" />
      </div>
      <div className="relative aspect-[16/10] overflow-hidden">
        <Screen project={project} sizes="(min-width: 768px) 58vw, 100vw" />
      </div>
    </div>
  );
}
