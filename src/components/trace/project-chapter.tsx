"use client";

import { type CSSProperties, useMemo, useRef } from "react";
import { ButtonLink } from "@/components/ui/button-link";
import type { Project } from "@/content/projects";
import { cn } from "@/lib/utils";
import { buildSteps, stepIndexByNode } from "./steps";
import { TraceMap } from "./trace-map";
import { useScrollStep } from "./use-scroll-step";

type Props = {
  project: Project;
  /** A handwritten aside for the step that carries the project's argument. */
  aside?: string;
};

/**
 * A project told through its architecture. On a large screen the panel pins
 * and scrolling walks the trace one step at a time (the `pin:` variant, see
 * globals.css). Anywhere else the same steps are a list that marks itself as
 * it scrolls past.
 */
export function ProjectChapter({ project, aside }: Props) {
  const ref = useRef<HTMLElement>(null);
  const steps = useMemo(() => buildSteps(project.trace), [project.trace]);
  const stepOf = useMemo(() => stepIndexByNode(steps), [steps]);
  const { step: active, goTo } = useScrollStep(ref, steps.length);

  return (
    <section
      ref={ref}
      id={project.slug}
      aria-label={project.name}
      style={{ "--steps": steps.length } as CSSProperties}
      className="scroll-mt-6 px-5 pin:h-[calc(100dvh+var(--steps)*38dvh)] lg:px-8"
    >
      <div className="pin:sticky pin:top-0 pin:flex pin:h-dvh pin:items-center pin:pt-6 pin:pb-32">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-10 rounded-[28px] bg-surface px-5 py-7 pin:max-h-[52rem] pin:max-w-[86rem] pin:flex-row pin:gap-12 pin:rounded-[32px] pin:p-12 pin:h-full">
          <div className="flex flex-col gap-4 pin:w-[21rem] pin:shrink-0 pin:gap-5">
            <p className="text-sm text-ink-2">
              {project.kind} · {project.period} · {project.status}
            </p>
            <h2 className="text-[2.75rem] leading-none font-medium tracking-[-0.035em] pin:text-[4rem]">
              {project.name}
            </h2>
            <p className="text-xl leading-[1.3] tracking-[-0.015em] pin:text-2xl">
              {project.tagline}
            </p>

            {/* Pinned: a rail of steps you can also click. */}
            <div className="mt-5 hidden min-h-0 gap-5 pin:flex">
              <Rail active={active} count={steps.length} />
              <ol className="flex flex-col gap-3">
                {steps.map((step, i) => (
                  <li key={step.id}>
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={i === active ? "step" : undefined}
                      className={cn(
                        "text-left transition-colors duration-200 ease-ui",
                        i === active
                          ? "text-lg font-semibold tracking-[-0.01em] text-ink"
                          : "text-base text-ink-3 hover:text-ink",
                      )}
                    >
                      {step.label}
                    </button>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-auto hidden pin:block">
              <ButtonLink href={`/work/${project.slug}`} variant="text">
                Read the case study
              </ButtonLink>
            </div>
          </div>

          <div className="hidden min-w-0 flex-1 flex-col gap-4 pin:flex">
            <p className="text-[0.8125rem] text-ink-2 tabular-nums">
              Step {active + 1} of {steps.length}
            </p>
            <div className="min-h-0 flex-1">
              <TraceMap
                trace={project.trace}
                stepOf={stepOf}
                active={active}
                aside={steps[active].nodes.length > 1 ? aside : undefined}
              />
            </div>
            {/* Fixed height so the map does not jump as notes change length. */}
            <p
              aria-live="polite"
              className="h-[4.5rem] max-w-[46rem] text-[0.9375rem] leading-normal text-pretty text-ink-2"
            >
              {steps[active].note}
            </p>
          </div>

          {/* Flowing: the same steps as a list. */}
          <div className="flex gap-3.5 pin:hidden">
            <Rail active={active} count={steps.length} />
            <ol className="flex min-w-0 flex-1 flex-col gap-2.5 text-[0.9375rem]">
              {steps.map((step, i) => (
                <li
                  key={step.id}
                  data-step
                  aria-current={i === active ? "step" : undefined}
                  className={cn(
                    "flex flex-col gap-2.5 rounded-2xl px-3.5 py-3.5 transition-colors duration-500 ease-reveal",
                    i === active ? "bg-accent text-on-accent" : "bg-paper",
                    i > active && "text-ink-3",
                  )}
                >
                  {i === active && aside && step.nodes.length > 1 && (
                    <span className="font-hand text-xl">{aside}</span>
                  )}
                  {step.nodes.map((node) => (
                    <div key={node.id} className="flex items-baseline justify-between gap-3">
                      <span className="font-medium">{node.label}</span>
                      <span className="text-right text-[0.8125rem]">{node.sub}</span>
                    </div>
                  ))}
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col pin:hidden">
            <ButtonLink href={`/work/${project.slug}`}>Read the case study</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

/* The vertical line that fills as the steps advance. */
function Rail({ active, count }: { active: number; count: number }) {
  return (
    <div aria-hidden className="relative w-1 shrink-0 rounded-full bg-well">
      <div
        style={{ height: `${((active + 1) / count) * 100}%` }}
        className="absolute inset-x-0 top-0 rounded-full bg-accent transition-[height] duration-500 ease-reveal"
      />
    </div>
  );
}
