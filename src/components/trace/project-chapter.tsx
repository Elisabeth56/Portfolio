"use client";

import { type CSSProperties, type KeyboardEvent, useMemo, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/button-link";
import { Segmented } from "@/components/ui/segmented";
import type { Project } from "@/content/projects";
import { cn } from "@/lib/utils";
import { buildSteps, stepIndexByNode } from "./steps";
import { TraceWell } from "./trace-well";
import { useScrollStep } from "./use-scroll-step";

type Props = {
  project: Project;
  /** A handwritten aside for the step that carries the project's argument. */
  aside?: string;
  /**
   * `lead` introduces the project on the home page. `case` sits on its case
   * page under the header, so it leads with the section title instead, and
   * carries the project's own behaviour: Atlas AI's gates, FinSight's file-type
   * branch and FarmTwin's network switch.
   */
  variant?: "lead" | "case";
};

/**
 * A project told through its architecture. On a large screen the panel pins
 * and scrolling walks the trace one step at a time (the `pin:` variant, see
 * globals.css). Anywhere else the same steps are a list that marks itself as
 * it scrolls past.
 */
export function ProjectChapter({ project, aside, variant = "lead" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { trace } = project;
  const isCase = variant === "case";

  const [choice, setChoice] = useState(trace.branch?.options[0].node);
  const skip = useMemo(
    () =>
      new Set(
        trace.branch?.options.map((option) => option.node).filter((node) => node !== choice),
      ),
    [trace.branch, choice],
  );
  const steps = useMemo(() => buildSteps(trace, skip), [trace, skip]);
  const stepOf = useMemo(() => stepIndexByNode(steps), [steps]);
  const { step: scrolled, goTo } = useScrollStep(ref, steps.length);

  // Atlas AI: the run halts at the first gate nobody has approved, however far
  // the page has scrolled. Approving lets it catch up with the scroll.
  const [approved, setApproved] = useState<ReadonlySet<string>>(() => new Set());
  const blockedAt = steps.findIndex(
    (step) => trace.mode === "gated" && step.nodes[0].kind === "gate" && !approved.has(step.id),
  );
  const active = blockedAt === -1 ? scrolled : Math.min(scrolled, blockedAt);
  const gate = active === blockedAt ? steps[active].nodes[0] : null;
  const approve = () => gate && setApproved((done) => new Set(done).add(steps[active].id));

  // FarmTwin: nothing in the trace needs the network, which is the point.
  const [online, setOnline] = useState(true);
  const isOffline = trace.mode === "offline";

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") goTo(Math.min(steps.length - 1, active + 1));
    else if (event.key === "ArrowLeft") goTo(Math.max(0, active - 1));
    else return;
    event.preventDefault();
  };

  // Pinned, a waiting gate takes the controls' place. In the list it sits in
  // the step itself, which is where the reader is looking.
  const controls = (pinned: boolean) =>
    isCase && (
      <TraceControls
        project={project}
        choice={choice}
        onChoose={setChoice}
        online={online}
        onToggleNetwork={() => setOnline((on) => !on)}
        gate={pinned ? gate : null}
        onApprove={approve}
      />
    );

  return (
    <section
      ref={ref}
      id={isCase ? "how-it-holds-together" : project.slug}
      aria-label={isCase ? "How it holds together" : project.name}
      style={{ "--steps": steps.length } as CSSProperties}
      className={cn(
        "scroll-mt-6 pin:h-[calc(100dvh+var(--steps)*38dvh)]",
        !isCase && "px-5 lg:px-8",
      )}
    >
      {/* Pinned, it clears the dock on the home page; a case page has none. */}
      <div
        className={cn(
          "pin:sticky pin:top-0 pin:flex pin:h-dvh pin:items-center pin:pt-6",
          isCase ? "pin:pb-6" : "pin:pb-32",
        )}
      >
        <div
          onKeyDown={onKeyDown}
          className={cn(
            "mx-auto flex w-full flex-col rounded-[28px] bg-surface px-5 pin:h-full pin:max-h-[52rem] pin:flex-row pin:gap-12 pin:rounded-[32px] pin:p-12",
            isCase ? "gap-6 py-6 pin:max-w-[75rem]" : "max-w-xl gap-10 py-7 pin:max-w-[86rem]",
          )}
        >
          <div className="flex min-h-0 flex-col gap-4 pin:w-[21rem] pin:shrink-0 pin:gap-5">
            {isCase ? (
              <h2 className="text-[1.625rem] leading-[1.12] font-medium tracking-[-0.025em] pin:text-[2rem]">
                How it holds together
              </h2>
            ) : (
              <>
                <p className="text-sm text-ink-2">
                  {project.kind} · {project.period} · {project.status}
                </p>
                <h2 className="text-[2.75rem] leading-none font-medium tracking-[-0.035em] pin:text-[4rem]">
                  {project.name}
                </h2>
                <p className="text-xl leading-[1.3] tracking-[-0.015em] pin:text-2xl">
                  {project.tagline}
                </p>
              </>
            )}

            {/* Pinned: a rail of steps you can also click. */}
            <div className="mt-5 hidden min-h-0 gap-5 pin:flex">
              <Rail active={active} count={steps.length} />
              <ol className="flex min-h-0 flex-col gap-3 overflow-y-auto">
                {steps.map((step, i) => (
                  <li key={step.id} className="flex flex-col gap-1.5">
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
                    {isCase && i === active && !gate && step.note && (
                      <p className="text-sm leading-normal text-pretty text-ink-2">{step.note}</p>
                    )}
                  </li>
                ))}
              </ol>
            </div>

            {isCase ? (
              <div className="mt-auto hidden flex-col gap-4 pin:flex">
                {controls(true)}
                <p className="text-[0.8125rem] text-ink-2">Scroll, or use the arrow keys</p>
              </div>
            ) : (
              <div className="mt-auto hidden pin:block">
                <ButtonLink href={`/work/${project.slug}`} variant="text">
                  Read the case study
                </ButtonLink>
              </div>
            )}
          </div>

          <div className="hidden min-w-0 flex-1 flex-col gap-4 pin:flex">
            <div className="flex items-baseline justify-between gap-4 text-[0.8125rem] text-ink-2 tabular-nums">
              <p>
                Step {active + 1} of {steps.length}
                {gate && " · paused"}
              </p>
              {isCase && isOffline && <NetworkStatus online={online} />}
            </div>
            <div className="min-h-0 flex-1">
              <TraceWell
                trace={trace}
                stepOf={stepOf}
                active={active}
                aside={steps[active].nodes.length > 1 ? aside : undefined}
                boundary={isCase && isOffline ? "On this laptop" : undefined}
                minNodePx={96}
              />
            </div>
            {/* Fixed height so the map does not jump as notes change length. */}
            {!isCase && (
              <p
                aria-live="polite"
                className="h-[4.5rem] max-w-[46rem] text-[0.9375rem] leading-normal text-pretty text-ink-2"
              >
                {steps[active].note}
              </p>
            )}
          </div>

          {/* Flowing: the same steps as a list. */}
          {isCase && <div className="flex flex-col gap-4 empty:hidden pin:hidden">{controls(false)}</div>}
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
                  {gate && i === active && (
                    <button
                      type="button"
                      onClick={approve}
                      className="h-11 self-start rounded-full bg-on-accent px-5 text-[0.9375rem] font-medium text-accent transition-transform duration-200 ease-ui active:scale-[0.98]"
                    >
                      {gate.action ?? "Approve"}
                    </button>
                  )}
                </li>
              ))}
            </ol>
          </div>

          {isCase ? (
            <p
              aria-live="polite"
              className="text-[0.9375rem] leading-normal text-pretty text-ink-2 pin:sr-only"
            >
              {steps[active].note ?? trace.caption}
            </p>
          ) : (
            <div className="flex flex-col pin:hidden">
              <ButtonLink href={`/work/${project.slug}`}>Read the case study</ButtonLink>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

type ControlsProps = {
  project: Project;
  choice?: string;
  onChoose: (node: string) => void;
  online: boolean;
  onToggleNetwork: () => void;
  gate: Project["trace"]["nodes"][number] | null;
  onApprove: () => void;
};

/* The one thing each trace lets you do besides scrolling, if it has one. */
function TraceControls({
  project,
  choice,
  onChoose,
  online,
  onToggleNetwork,
  gate,
  onApprove,
}: ControlsProps) {
  const { branch, mode } = project.trace;

  if (gate) {
    return (
      <div className="flex flex-col gap-3 rounded-[20px] bg-accent-tint p-5 text-accent-ink">
        <span className="text-[0.8125rem]">Waiting for you</span>
        <p className="text-base leading-[1.4] font-medium">{gate.note}</p>
        <button
          type="button"
          onClick={onApprove}
          className="h-12 self-start rounded-full bg-accent px-[22px] text-base font-medium text-on-accent transition-transform duration-200 ease-ui active:scale-[0.98]"
        >
          {gate.action ?? "Approve"}
        </button>
      </div>
    );
  }

  if (branch && choice) {
    return (
      <div className="flex flex-col gap-2">
        <span className="text-[0.8125rem] text-ink-2">{branch.label}</span>
        <Segmented
          label={branch.label}
          idBase={`${project.slug}-branch`}
          options={branch.options.map((option) => ({ id: option.node, label: option.label }))}
          value={choice}
          onChange={onChoose}
          className="self-start"
        />
      </div>
    );
  }

  if (mode === "offline") {
    return (
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={onToggleNetwork}
          aria-pressed={!online}
          className="h-12 self-start rounded-full bg-accent-tint px-[22px] text-base font-medium text-accent-ink transition-[background-color,transform] duration-200 ease-ui hover:bg-[color-mix(in_srgb,var(--color-accent)_10%,var(--color-accent-tint))] active:scale-[0.98]"
        >
          {online ? "Cut the network" : "Turn the network back on"}
        </button>
        <span className="pin:hidden">
          <NetworkStatus online={online} />
        </span>
      </div>
    );
  }

  return null;
}

function NetworkStatus({ online }: { online: boolean }) {
  return (
    <span aria-live="polite" className="text-[0.8125rem] text-ink-2">
      {online ? (
        "Network on"
      ) : (
        <>
          Network off · <span className="text-positive">still answering</span>
        </>
      )}
    </span>
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
