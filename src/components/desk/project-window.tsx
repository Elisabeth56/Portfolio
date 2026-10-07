"use client";

import Link from "next/link";
import {
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
  type RefObject,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { buildSteps, stepIndexByNode } from "@/components/trace/steps";
import { NODE_W, TraceMap } from "@/components/trace/trace-map";
import { ButtonLink } from "@/components/ui/button-link";
import { Segmented } from "@/components/ui/segmented";
import { type Project, getProject } from "@/content/projects";
import { cn } from "@/lib/utils";
import { Glyph, type GlyphId } from "./glyphs";

/* The window needs the same room as the pinned trace; smaller screens get the case page. */
const WINDOW_QUERY = "(min-width: 80rem) and (min-height: 45rem)";
const TAB_KEY = "window:tab:";

const tabs = [
  { id: "brief", label: "Brief" },
  { id: "architecture", label: "Architecture" },
  { id: "decisions", label: "Decisions" },
  { id: "stack", label: "Stack" },
] as const;
type Tab = (typeof tabs)[number]["id"];

/* A handwritten aside for the step that carries the project's argument. */
const asides: Record<string, string> = { "atlas-ai": "nothing runs past here" };

const ProjectWindowContext = createContext<((slug: string, from: HTMLElement) => void) | null>(
  null,
);

/**
 * Owns the one project window on the desk. Any `WindowLink` inside opens it on
 * a large screen; everywhere else the link simply goes to the case page.
 */
export function ProjectWindowProvider({ children }: { children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const origin = useRef<HTMLElement | null>(null);
  const project = slug ? getProject(slug) : undefined;

  const open = useCallback((next: string, from: HTMLElement) => {
    origin.current = from;
    setSlug(next);
  }, []);

  // Show once the project has rendered, growing out of the card or icon that opened it.
  useEffect(() => {
    const el = dialog.current;
    if (!el || !project || el.open) return;
    el.showModal();
    const from = origin.current?.getBoundingClientRect();
    const box = el.getBoundingClientRect();
    if (from) {
      el.style.transformOrigin = `${from.left + from.width / 2 - box.left}px ${from.top + from.height / 2 - box.top}px`;
    }
  }, [project]);

  const close = () => dialog.current?.close();

  return (
    <ProjectWindowContext.Provider value={open}>
      {children}
      <dialog
        ref={dialog}
        aria-label={project?.name}
        onClose={() => setSlug(null)}
        onClick={(event) => {
          // A click on the scrim, outside the window, closes it.
          if (event.target === event.currentTarget) close();
        }}
        className="project-window bottom-[calc(var(--spacing-dock-inset)+var(--spacing-dock))] m-auto h-[min(43.75rem,calc(100dvh-var(--spacing-dock-inset)*3-var(--spacing-dock)))] w-[min(67.5rem,calc(100vw-4rem))] max-w-none overflow-hidden rounded-[32px] bg-surface p-0 text-ink shadow-dock"
      >
        {project && <WindowBody key={project.slug} project={project} onClose={close} />}
      </dialog>
    </ProjectWindowContext.Provider>
  );
}

/** A link to a case page that opens the project window instead when there is room. */
export function WindowLink({
  slug,
  onClick,
  ...props
}: Omit<ComponentProps<typeof Link>, "href"> & { slug: string }) {
  const open = useContext(ProjectWindowContext);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    const isPlainClick =
      event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
    if (!open || !isPlainClick || !window.matchMedia(WINDOW_QUERY).matches) return;
    event.preventDefault();
    open(slug, event.currentTarget);
  };

  return <Link href={`/work/${slug}`} onClick={handleClick} {...props} />;
}

function WindowBody({ project, onClose }: { project: Project; onClose: () => void }) {
  // The last tab chosen is remembered per project. The window only ever
  // renders after a click, so reading storage here cannot upset hydration.
  const [tab, setTab] = useState<Tab>(() => {
    try {
      const saved = localStorage.getItem(TAB_KEY + project.slug);
      return tabs.find((t) => t.id === saved)?.id ?? "architecture";
    } catch {
      return "architecture";
    }
  });
  const idBase = `window-${project.slug}`;

  const choose = (next: Tab) => {
    setTab(next);
    try {
      localStorage.setItem(TAB_KEY + project.slug, next);
    } catch {
      /* the choice just lasts while the window is open */
    }
  };

  return (
    <div className="flex h-full flex-col gap-6 px-10 pt-5 pb-10">
      <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-[13px] bg-accent text-on-accent">
            <Glyph id={project.slug as GlyphId} className="size-5" />
          </span>
          <h2 className="text-[1.0625rem] font-medium">{project.name}</h2>
        </div>
        <Segmented
          label={`${project.name} sections`}
          options={tabs}
          value={tab}
          onChange={choose}
          idBase={idBase}
        />
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/work/${project.slug}`}
            className="flex h-11 items-center px-4 text-[0.9375rem] font-medium text-accent transition-colors duration-200 ease-ui hover:text-ink"
          >
            Open full page
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-11 place-items-center rounded-full bg-well text-ink transition-colors duration-200 ease-ui hover:bg-[color-mix(in_srgb,var(--color-ink)_6%,var(--color-well))]"
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="size-[18px]"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
      </header>

      <div
        role="tabpanel"
        id={`${idBase}-panel`}
        aria-labelledby={`${idBase}-tab-${tab}`}
        className="flex min-h-0 flex-1 flex-col"
      >
        {tab === "brief" && <Brief project={project} />}
        {tab === "architecture" && <Architecture project={project} />}
        {tab === "decisions" && <Decisions project={project} />}
        {tab === "stack" && <Stack project={project} />}
      </div>
    </div>
  );
}

function Meta({ project }: { project: Project }) {
  return (
    <p className="text-sm text-ink-2">
      {project.kind} · {project.period} ·{" "}
      <span className={project.status === "Submitted" ? undefined : "text-positive"}>
        {project.status}
      </span>
    </p>
  );
}

/* ---------- Architecture: the trace, one step at a time ---------- */

function Architecture({ project }: { project: Project }) {
  const steps = useMemo(() => buildSteps(project.trace), [project.trace]);
  const stepOf = useMemo(() => stepIndexByNode(steps), [steps]);
  const [active, setActive] = useState(0);
  const [approved, setApproved] = useState<Set<string>>(() => new Set());
  const scroller = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const introCut = useMoreBelow(intro);
  const layout = useMemo(() => fitNodes(project), [project]);

  const step = steps[active];
  const gate =
    project.trace.mode === "gated" && step.nodes[0].kind === "gate" && !approved.has(step.id)
      ? step.nodes[0]
      : null;
  const isLast = active === steps.length - 1;

  const next = () => {
    if (gate) return;
    setActive(isLast ? 0 : active + 1);
  };
  const back = () => setActive(Math.max(0, active - 1));
  const approve = () => {
    setApproved((done) => new Set(done).add(step.id));
    setActive(active + 1);
  };

  // Keep the active step in view as the trace walks sideways.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const x = step.nodes.reduce((sum, node) => sum + node.x, 0) / step.nodes.length;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({
      left: (x / 100) * el.scrollWidth - el.clientWidth / 2,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [step]);

  return (
    <div
      className="flex min-h-0 flex-1 gap-10 outline-none"
      tabIndex={-1}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") next();
        else if (event.key === "ArrowLeft") back();
        else return;
        event.preventDefault();
      }}
    >
      <div className="flex min-h-0 w-80 shrink-0 flex-col gap-4">
        {/* In a short window the tagline scrolls, so the step card and its button stay in view. */}
        <div
          ref={intro}
          className={cn(
            "thin-scrollbar flex min-h-0 flex-col gap-4 overflow-y-auto",
            introCut && "[mask-image:linear-gradient(to_bottom,#000_calc(100%-3rem),transparent)]",
          )}
        >
          <Meta project={project} />
          <p className="text-[1.75rem] leading-[1.18] font-medium tracking-[-0.025em] text-pretty">
            {project.tagline}
          </p>
        </div>

        {gate ? (
          <div className="mt-auto flex shrink-0 flex-col gap-3 rounded-[20px] bg-accent-tint p-5 text-accent-ink">
            <span className="text-[0.8125rem]">Waiting for you</span>
            <p aria-live="polite" className="text-[1.0625rem] leading-[1.35] font-medium">
              {gate.note}
            </p>
            <button
              type="button"
              onClick={approve}
              className="h-12 self-start rounded-full bg-accent px-[22px] text-base font-medium text-on-accent transition-transform duration-200 ease-ui active:scale-[0.98]"
            >
              {gate.action ?? "Approve"}
            </button>
          </div>
        ) : (
          <div className="mt-auto flex shrink-0 flex-col gap-3 rounded-[20px] bg-paper p-5">
            <span className="text-[1.0625rem] font-medium tracking-[-0.01em]">{step.label}</span>
            <p aria-live="polite" className="text-[0.9375rem] leading-normal text-pretty text-ink-2">
              {step.note ?? step.nodes.map((node) => node.sub).join(" · ")}
            </p>
            <div className="mt-1 flex items-center gap-5">
              <button
                type="button"
                onClick={next}
                className="h-12 rounded-full bg-accent-tint px-[22px] text-base font-medium text-accent-ink transition-[background-color,transform] duration-200 ease-ui hover:bg-[color-mix(in_srgb,var(--color-accent)_10%,var(--color-accent-tint))] active:scale-[0.98]"
              >
                {isLast ? "Start over" : "Next step"}
              </button>
              {active > 0 && (
                <button
                  type="button"
                  onClick={back}
                  className="h-12 text-base font-medium text-ink transition-colors duration-200 ease-ui hover:text-accent"
                >
                  Back
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="relative min-w-0 flex-1">
        <p className="absolute top-6 left-6 z-10 text-[0.8125rem] text-ink-2 tabular-nums">
          Step {active + 1} of {steps.length}
          {gate && " · paused"}
        </p>
        <div
          ref={scroller}
          className="no-scrollbar h-full overflow-x-auto overflow-y-hidden rounded-3xl bg-paper"
        >
          <div style={{ minWidth: layout.minWidth }} className="h-full pt-10">
            <TraceMap
              trace={project.trace}
              stepOf={stepOf}
              active={active}
              aside={gate ? asides[project.slug] : undefined}
              nodeWidth={layout.nodeWidth}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* Nodes on one row must not touch, and each needs about 132px to stay legible. */
const NODE_MIN_PX = 132;

function fitNodes(project: Project) {
  const { nodes } = project.trace;
  let gap = Infinity;
  for (const a of nodes) {
    for (const b of nodes) {
      if (a !== b && Math.abs(a.y - b.y) < 12) gap = Math.min(gap, Math.abs(a.x - b.x));
    }
  }
  const nodeWidth = Math.min(NODE_W, gap * 0.9);
  return { nodeWidth, minWidth: Math.round((NODE_MIN_PX / nodeWidth) * 100) };
}

/** Whether a scrolling element has more content below what it shows, so its edge can fade. */
function useMoreBelow(ref: RefObject<HTMLElement | null>) {
  const [more, setMore] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setMore(el.scrollHeight - el.scrollTop - el.clientHeight > 1);
    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [ref]);

  return more;
}

/* ---------- Brief, Decisions, Stack: the case in short ---------- */

function Scroll({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("thin-scrollbar -mr-4 min-h-0 flex-1 overflow-y-auto pr-4", className)}>
      {children}
    </div>
  );
}

function Brief({ project }: { project: Project }) {
  const live = project.links.live;
  return (
    <Scroll className="grid grid-cols-2 gap-12">
      <div className="flex flex-col gap-4">
        <Meta project={project} />
        <h3 className="text-[1.75rem] leading-[1.15] font-medium tracking-[-0.025em]">
          The problem
        </h3>
        {project.problem.map((paragraph) => (
          <p key={paragraph} className="text-base leading-normal text-ink-2">
            {paragraph}
          </p>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="text-[1.75rem] leading-[1.15] font-medium tracking-[-0.025em] lg:mt-9">
          What I built
        </h3>
        {project.built.map((paragraph) => (
          <p key={paragraph} className="text-base leading-normal text-ink-2">
            {paragraph}
          </p>
        ))}
        <div className="flex flex-col gap-1.5 rounded-[20px] bg-paper p-5">
          <span className="text-[0.8125rem] text-ink-2">My role</span>
          <span className="text-base font-medium">{project.role}</span>
        </div>
        <div className="pt-2">
          {live ? (
            <ButtonLink href={live} target="_blank" rel="noreferrer">
              Visit {project.name}
            </ButtonLink>
          ) : (
            project.links.repo && (
              <ButtonLink href={project.links.repo} target="_blank" rel="noreferrer">
                View the repository
              </ButtonLink>
            )
          )}
        </div>
      </div>
    </Scroll>
  );
}

function Decisions({ project }: { project: Project }) {
  const [open, setOpen] = useState(0);
  return (
    <Scroll>
      <ul className="flex flex-col gap-2">
        {project.decisions.map((decision, i) => {
          const isOpen = open === i;
          const id = `decision-${project.slug}-${i}`;
          return (
            <li key={decision.title} className="rounded-3xl bg-paper">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={id}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex min-h-16 w-full items-center justify-between gap-6 rounded-3xl px-7 py-4 text-left text-xl font-medium tracking-[-0.015em] transition-colors duration-200 ease-ui hover:text-accent"
              >
                {decision.title}
                {decision.cost && !isOpen && (
                  <span className="shrink-0 text-sm font-normal tracking-normal text-caution">
                    has a cost
                  </span>
                )}
              </button>
              {isOpen && (
                <div id={id} className="flex max-w-[48rem] flex-col gap-3 px-7 pb-6">
                  <p className="text-base leading-normal text-ink-2">{decision.body}</p>
                  {decision.cost && (
                    <p className="text-base leading-normal text-ink-2">
                      <span className="font-medium text-caution">The cost: </span>
                      {decision.cost}
                    </p>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </Scroll>
  );
}

function Stack({ project }: { project: Project }) {
  return (
    <Scroll className="grid grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-12">
      <dl className="flex flex-col self-start rounded-3xl bg-paper px-7 py-2 text-[0.9375rem]">
        {project.stack.map((group) => (
          <div key={group.group} className="flex gap-6 py-4">
            <dt className="w-32 shrink-0 text-ink-2">{group.group}</dt>
            <dd>{group.items.join("\u00a0· ")}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-col gap-4">
        <h3 className="text-[1.75rem] leading-[1.15] font-medium tracking-[-0.025em]">
          What it demonstrates
        </h3>
        <ul className="flex flex-col gap-3.5 text-[1.0625rem] leading-[1.4]">
          {project.demonstrates.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </Scroll>
  );
}
