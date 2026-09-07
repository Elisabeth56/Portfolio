"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { NodeKind, Trace, TraceNode } from "@/content/projects";
import { cn } from "@/lib/utils";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";

/* ------------------------------------------------------------------ */

const kindGlyph: Record<NodeKind, string> = {
  io: "▤",
  compute: "◇",
  model: "◆",
  store: "▣",
  gate: "⊘",
  agent: "◉",
  ui: "▢",
};

const kindLabel: Record<NodeKind, string> = {
  io: "i/o",
  compute: "compute",
  model: "model",
  store: "store",
  gate: "gate",
  agent: "agent",
  ui: "interface",
};

type NodeState = "idle" | "active" | "done" | "blocked" | "flagged";

const DEBATE_IDS = ["architect", "engineer", "qa"];

/** Node box is 10.6% of the canvas; edges start just clear of it. */
const HALF_NODE = 5.45;

/* ------------------------------------------------------------------ */

export function TraceCanvas({
  trace,
  className,
}: {
  trace: Trace;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  /** Below this the diagram stops being a diagram and becomes a stepped list. */
  const wide = useMediaQuery("(min-width: 900px)");

  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [approved, setApproved] = useState<Set<string>>(new Set());
  const [online, setOnline] = useState(true);
  const timer = useRef<number | null>(null);

  const nodeById = useMemo(
    () => new Map(trace.nodes.map((n) => [n.id, n])),
    [trace.nodes],
  );

  const expand = useCallback(
    (id: string) => (id === "debate" ? DEBATE_IDS : [id]),
    [],
  );

  const activeIds = useMemo(() => {
    const ids = new Set<string>();
    if (step < 0) return ids;
    trace.sequence
      .slice(0, step + 1)
      .forEach((s) => expand(s).forEach((i) => ids.add(i)));
    return ids;
  }, [step, trace.sequence, expand]);

  const currentIds = useMemo(() => {
    if (step < 0 || step >= trace.sequence.length) return new Set<string>();
    return new Set(expand(trace.sequence[step]));
  }, [step, trace.sequence, expand]);

  const blockedAt = useMemo(() => {
    if (trace.mode !== "gated" || step < 0 || step >= trace.sequence.length)
      return null;
    const id = trace.sequence[step];
    return nodeById.get(id)?.kind === "gate" && !approved.has(id) ? id : null;
  }, [trace.mode, trace.sequence, step, nodeById, approved]);

  const finished = step >= trace.sequence.length - 1;
  const running = playing && !blockedAt && !finished;

  const clear = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };

  /* No setState here — when the run is finished we simply stop scheduling. */
  useEffect(() => {
    if (!playing || blockedAt || finished) return;
    const next = trace.sequence[step + 1];
    const delay = reduced ? 140 : next === "debate" ? 1200 : 760;
    timer.current = window.setTimeout(() => setStep((s) => s + 1), delay);
    return clear;
  }, [playing, step, blockedAt, finished, reduced, trace.sequence]);

  useEffect(() => clear, []);

  const run = () => {
    clear();
    setSelected(null);
    setApproved(new Set());
    setStep(-1);
    setPlaying(true);
  };

  const reset = () => {
    clear();
    setPlaying(false);
    setSelected(null);
    setApproved(new Set());
    setStep(-1);
  };

  const approve = (id: string) => {
    setApproved((prev) => new Set(prev).add(id));
    setPlaying(true);
  };

  const stateOf = (node: TraceNode): NodeState => {
    if (blockedAt === node.id) return "blocked";
    if (currentIds.has(node.id)) {
      if (trace.mode === "debate" && node.id === "qa" && step >= 2)
        return "flagged";
      return "active";
    }
    if (activeIds.has(node.id)) return "done";
    return "idle";
  };

  const selectedNode = selected ? nodeById.get(selected) : null;
  const showConflict =
    trace.mode === "debate" && activeIds.has("architect") && step >= 2;

  /** A single-row pipeline does not need a 440px box of empty grid. */
  const flat = useMemo(() => {
    const ys = trace.nodes.map((n) => n.y);
    return Math.max(...ys) - Math.min(...ys) < 20;
  }, [trace.nodes]);

  const nodeProps = (node: TraceNode) => ({
    node,
    state: stateOf(node),
    selected: selected === node.id,
    onSelect: () => setSelected((s) => (s === node.id ? null : node.id)),
    onApprove:
      trace.mode === "gated" && node.kind === "gate"
        ? () => approve(node.id)
        : undefined,
    approved: approved.has(node.id),
    blocked: blockedAt === node.id,
  });

  return (
    <div className={cn("w-full", className)}>
      {/* ---------------- controls ---------------- */}
      <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        <button
          type="button"
          onClick={running ? () => setPlaying(false) : run}
          className="t-label inline-flex items-center gap-2 rounded-full border border-line bg-raised px-3.5 py-2 text-fg transition-colors hover:border-accent hover:text-accent"
        >
          <span aria-hidden>{running ? "❚❚" : "▶"}</span>
          {step < 0
            ? "Run trace"
            : running
              ? "Pause"
              : finished
                ? "Run again"
                : "Resume"}
        </button>

        {step >= 0 && (
          <button
            type="button"
            onClick={reset}
            className="t-label px-2 py-2 text-fg-faint transition-colors hover:text-fg"
          >
            Reset
          </button>
        )}

        {trace.mode === "offline" ? (
          <button
            type="button"
            onClick={() => setOnline((v) => !v)}
            aria-pressed={!online}
            className={cn(
              "t-label ml-auto inline-flex items-center gap-2 rounded-full border px-3.5 py-2 transition-colors",
              online
                ? "border-line bg-raised text-fg-muted hover:border-accent hover:text-accent"
                : "border-run/50 bg-run/10 text-run",
            )}
          >
            <span aria-hidden>{online ? "◎" : "⊗"}</span>
            {online ? "Cut the network" : "Network down · still running"}
          </button>
        ) : (
          <span className="t-label t-nums ml-auto text-fg-faint">
            {step < 0
              ? `${trace.nodes.length} nodes`
              : `step ${Math.min(step + 1, trace.sequence.length)} / ${trace.sequence.length}`}
          </span>
        )}
      </div>

      {/* ---------------- canvas ---------------- */}
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-lg border bg-surface transition-colors",
          trace.mode === "offline" && !online ? "border-run/40" : "border-line",
        )}
      >
        <div aria-hidden className="tx-grid absolute inset-0 opacity-[0.13]" />

        {trace.mode === "offline" && (
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-4 rounded-md border border-dashed transition-colors sm:inset-6",
              online ? "border-line" : "border-run/50",
            )}
          >
            <span
              className={cn(
                "t-label absolute -top-2 left-4 bg-surface px-2 transition-colors",
                online ? "text-fg-faint" : "text-run",
              )}
            >
              on device
            </span>
          </div>
        )}

        {wide ? (
          <div
            className={cn(
              "@container relative w-full",
              flat ? "h-[210px]" : "h-[380px] lg:h-[430px]",
            )}
          >
            <EdgeLayer
              trace={trace}
              activeIds={activeIds}
              currentIds={currentIds}
            />
            {trace.nodes.map((n) => (
              <PositionedNode key={n.id} {...nodeProps(n)} />
            ))}
            {showConflict && <ConflictMarkers />}
          </div>
        ) : (
          <ol className="relative space-y-2 p-4 sm:p-5">
            {trace.nodes.map((n, i) => (
              <StackedNode
                key={n.id}
                {...nodeProps(n)}
                last={i === trace.nodes.length - 1}
              />
            ))}
          </ol>
        )}
      </div>

      {/* ---------------- note panel ---------------- */}
      <div
        className="mt-4 min-h-[6rem] border-t border-line pt-4"
        aria-live="polite"
      >
        {selectedNode ? (
          <div>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="t-label text-accent">
                {kindLabel[selectedNode.kind]}
              </span>
              <h4 className="font-medium text-fg">{selectedNode.label}</h4>
              {selectedNode.sub && (
                <span className="t-mono text-xs text-fg-faint">
                  {selectedNode.sub}
                </span>
              )}
            </div>
            <p className="t-prose mt-2 text-[0.9375rem] text-fg-muted">
              {selectedNode.note ??
                "A straightforward step. The decisions worth reading are on the marked nodes."}
            </p>
          </div>
        ) : (
          <p className="t-prose text-[0.9375rem] text-fg-muted">
            {trace.caption}
          </p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Node shells                                                         */

type NodeViewProps = {
  node: TraceNode;
  state: NodeState;
  selected: boolean;
  onSelect: () => void;
  onApprove?: () => void;
  approved: boolean;
  blocked: boolean;
};

function nodeClasses(node: TraceNode, state: NodeState, selected: boolean) {
  return cn(
    "group block rounded-md border bg-raised text-left transition-all duration-300",
    state === "idle" && "border-line opacity-50",
    state === "done" && "border-line opacity-100",
    state === "active" && "border-run/70",
    state === "flagged" && "border-flag/70",
    state === "blocked" && "border-accent",
    selected && "border-accent ring-1 ring-accent/40",
    node.kind === "gate" && "border-dashed",
    node.kind === "ui" && "border-dotted",
  );
}

function NodeBody({
  node,
  state,
  selected,
}: {
  node: TraceNode;
  state: NodeState;
  selected: boolean;
}) {
  return (
    <>
      <span className="flex items-start gap-1.5">
        <span
          aria-hidden
          className={cn(
            "mt-[0.2rem] shrink-0 text-[0.6rem] leading-none transition-colors",
            state === "active"
              ? "text-run"
              : state === "flagged"
                ? "text-flag"
                : state === "blocked"
                  ? "text-accent"
                  : "text-fg-faint",
          )}
        >
          {kindGlyph[node.kind]}
        </span>
        <span className="break-words text-[0.8125rem] font-medium leading-[1.25] text-fg">
          {node.label}
        </span>
        {node.note && (
          <span
            aria-hidden
            className={cn(
              "ml-auto mt-[0.2rem] shrink-0 pl-1 text-[0.55rem] leading-none transition-opacity",
              selected
                ? "text-accent opacity-100"
                : "text-fg-faint opacity-45 group-hover:opacity-90",
            )}
          >
            ●
          </span>
        )}
      </span>
      {node.sub && (
        <span className="t-mono mt-1 block break-words text-[0.625rem] leading-[1.3] text-fg-faint">
          {node.sub}
        </span>
      )}
      <span className="sr-only">
        {" "}
        {kindLabel[node.kind]}
        {node.note ? ". Has an engineering note." : ""}
      </span>
    </>
  );
}

function PositionedNode(props: NodeViewProps) {
  const { node, state, selected, onSelect, onApprove, approved, blocked } =
    props;
  return (
    <div
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${node.x}%`, top: `${node.y}%` }}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={cn(
          nodeClasses(node, state, selected),
          "w-[clamp(6rem,10.6cqi,10.5rem)] px-3 py-2.5",
        )}
        style={
          state === "active"
            ? { animation: "pulse-ring 1.6s ease-out infinite" }
            : undefined
        }
      >
        <NodeBody node={node} state={state} selected={selected} />
      </button>

      {onApprove && blocked && !approved && (
        <button
          type="button"
          onClick={onApprove}
          className="t-label absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-full border border-accent bg-accent px-3 py-1.5 text-bg transition-transform hover:scale-[1.04]"
        >
          Approve →
        </button>
      )}
      {onApprove && approved && (
        <span className="t-label absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-run">
          approved
        </span>
      )}
    </div>
  );
}

function StackedNode({
  node,
  state,
  selected,
  onSelect,
  onApprove,
  approved,
  blocked,
  last,
}: NodeViewProps & { last: boolean }) {
  return (
    <li className="relative pl-6">
      {/* rail */}
      <span
        aria-hidden
        className={cn(
          "absolute left-[0.3125rem] top-2 size-1.5 rounded-full transition-colors",
          state === "idle"
            ? "bg-line"
            : state === "flagged"
              ? "bg-flag"
              : state === "blocked"
                ? "bg-accent"
                : state === "active"
                  ? "bg-run"
                  : "bg-fg-faint",
        )}
      />
      {!last && (
        <span
          aria-hidden
          className="absolute bottom-0 left-[0.5625rem] top-5 w-px bg-line"
        />
      )}

      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={cn(nodeClasses(node, state, selected), "w-full px-3 py-2.5")}
      >
        <NodeBody node={node} state={state} selected={selected} />
      </button>

      {onApprove && blocked && !approved && (
        <button
          type="button"
          onClick={onApprove}
          className="t-label mt-2 inline-flex rounded-full border border-accent bg-accent px-3 py-1.5 text-bg"
        >
          Approve →
        </button>
      )}
      {onApprove && approved && (
        <span className="t-label mt-2 inline-block text-run">approved</span>
      )}
    </li>
  );
}

/* ------------------------------------------------------------------ */

function EdgeLayer({
  trace,
  activeIds,
  currentIds,
}: {
  trace: Trace;
  activeIds: Set<string>;
  currentIds: Set<string>;
}) {
  const pos = useMemo(
    () => new Map(trace.nodes.map((n) => [n.id, { x: n.x, y: n.y }])),
    [trace.nodes],
  );

  return (
    <svg
      className="absolute inset-0 size-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      {trace.edges.map((edge, i) => {
        const a = pos.get(edge.from);
        const b = pos.get(edge.to);
        if (!a || !b) return null;

        const lit = activeIds.has(edge.from) && activeIds.has(edge.to);
        const flowing = currentIds.has(edge.to) && activeIds.has(edge.from);

        // Leave from the node's edge, not its centre, or the line hides
        // underneath the opaque node box on a straight horizontal run.
        const dir = b.x >= a.x ? 1 : -1;
        const ax = a.x + HALF_NODE * dir;
        const bx = b.x - HALF_NODE * dir;

        let d: string;
        if (edge.kind === "loop") {
          const dip = Math.max(a.y, b.y) + 26;
          d = `M ${a.x} ${a.y + 9} C ${a.x} ${dip}, ${b.x} ${dip}, ${b.x} ${b.y + 9}`;
        } else {
          const mx = (ax + bx) / 2;
          d = `M ${ax} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${bx} ${b.y}`;
        }

        return (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={lit ? "var(--color-run)" : "var(--color-line)"}
            strokeWidth={lit ? 1.6 : 1.2}
            strokeOpacity={lit ? 0.9 : 0.75}
            strokeDasharray={
              edge.kind === "branch" || edge.kind === "loop" ? "5 4" : undefined
            }
            vectorEffect="non-scaling-stroke"
            style={
              flowing
                ? { animation: "trace-flow 0.9s linear infinite" }
                : undefined
            }
          />
        );
      })}
    </svg>
  );
}

function ConflictMarkers() {
  return (
    <>
      <span className="t-label absolute left-[40%] top-[86%] z-20 -translate-x-1/2 translate-y-10 whitespace-nowrap rounded border border-flag/50 bg-flag/10 px-2 py-1 text-flag">
        security flag
      </span>
      <span className="t-label absolute left-[40%] top-[14%] z-20 -translate-x-1/2 -translate-y-10 whitespace-nowrap rounded border border-accent/50 bg-accent/10 px-2 py-1 text-accent">
        integration risk
      </span>
    </>
  );
}
