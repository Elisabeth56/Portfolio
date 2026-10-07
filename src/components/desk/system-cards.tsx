import type { Project } from "@/content/projects";
import { buildSteps } from "@/components/trace/steps";
import { cn } from "@/lib/utils";
import { Glyph, type GlyphId } from "./glyphs";
import { WindowLink } from "./project-window";

/**
 * The four systems after the lead, as large cards. On a large screen a card
 * opens the project window; anywhere else it is a link to the case page.
 */
export function SystemCards({ projects }: { projects: Project[] }) {
  return (
    <section
      id="systems"
      aria-labelledby="systems-title"
      className="mx-auto flex max-w-xl scroll-mt-6 flex-col gap-5 px-5 pt-24 pb-32 lg:max-w-[79rem] lg:gap-10 lg:px-8 lg:pt-40 lg:pb-48"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <h2
          id="systems-title"
          className="text-[2.25rem] leading-[1.04] font-medium tracking-[-0.035em] lg:text-[3.5rem] lg:leading-[1.02]"
        >
          Five systems, one argument
        </h2>
        <p className="mb-1 text-base leading-normal text-pretty text-ink-2 lg:mb-0 lg:w-[28.75rem] lg:shrink-0">
          Each one is a different answer to the same question: what has to be true for a language
          model to be trusted inside a system that has to be correct?
        </p>
      </div>

      <ul className="flex flex-col gap-5 lg:grid lg:grid-cols-2 lg:gap-6">
        {projects.map((project) => (
          <li key={project.slug}>
            <SystemCard project={project} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function SystemCard({ project }: { project: Project }) {
  return (
    <WindowLink
      slug={project.slug}
      className="group flex h-full flex-col gap-3 rounded-3xl bg-surface p-5 text-ink transition-[background-color,transform] duration-200 ease-ui hover:bg-[color-mix(in_srgb,var(--color-ink)_3%,var(--color-surface))] active:scale-[0.99] lg:min-h-80 lg:gap-4 lg:rounded-[28px] lg:p-7"
    >
      <div className="flex items-center gap-3 lg:gap-3.5">
        <span className="grid size-12 shrink-0 place-items-center rounded-[15px] bg-well text-accent lg:size-[52px] lg:rounded-2xl">
          <Glyph id={project.slug as GlyphId} className="size-6" />
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="text-xl font-medium tracking-[-0.015em] transition-colors duration-200 ease-ui group-hover:text-accent lg:text-2xl lg:tracking-[-0.02em]">
            {project.name}
          </span>
          <span className="text-[0.8125rem] text-ink-2 lg:text-sm">
            {project.kind}
            <span className="hidden lg:inline"> · {project.period}</span> · {project.status}
          </span>
        </div>
      </div>
      <p className="text-base leading-[1.45] text-pretty text-ink-2 lg:text-lg lg:leading-[1.4]">
        {project.tagline}
      </p>
      <Glimpse project={project} />
    </WindowLink>
  );
}

/* Four steps of the trace around the one that carries the argument. */
function Glimpse({ project }: { project: Project }) {
  const steps = buildSteps(project.trace);
  const focus = Math.max(
    0,
    steps.findIndex((step) => step.nodes.some((node) => node.id === project.trace.focus)),
  );
  const start = Math.max(0, Math.min(focus - 2, steps.length - 4));
  const shown = steps.slice(start, start + 4);

  return (
    <ol
      aria-hidden
      className="mt-auto hidden flex-wrap gap-2 pt-2 text-sm font-medium lg:flex"
    >
      {shown.map((step, i) => {
        const index = start + i;
        const node = step.nodes[0];
        const isGate = project.trace.mode === "gated" && node.kind === "gate";
        return (
          <li
            key={step.id}
            className={cn(
              "flex h-11 items-center rounded-[14px] px-3.5",
              index < focus && "bg-paper",
              index === focus && (isGate ? "bg-accent-tint text-accent-ink" : "bg-accent text-on-accent"),
              index > focus && "bg-paper text-ink-3",
            )}
          >
            {isGate && node.action ? node.action : step.label}
          </li>
        );
      })}
    </ol>
  );
}
