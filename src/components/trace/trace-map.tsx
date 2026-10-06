import type { Trace } from "@/content/projects";
import { cn } from "@/lib/utils";

type Props = {
  trace: Trace;
  /** Step index of every node, and the step the visitor is on. */
  stepOf: Map<string, number>;
  active: number;
  /** A handwritten aside pinned above the active group. */
  aside?: string;
};

/* Node width as a share of the map; edges start and end at its sides. */
const NODE_W = 13.5;

/**
 * The architecture as a map: nodes at the positions the content gives them,
 * joined by curved lines. A node is done, active or still ahead.
 */
export function TraceMap({ trace, stepOf, active, aside }: Props) {
  const byId = new Map(trace.nodes.map((node) => [node.id, node]));
  const state = (id: string) => {
    const index = stepOf.get(id) ?? 0;
    return index < active ? "done" : index === active ? "active" : "ahead";
  };
  const anchor = trace.nodes.find((node) => state(node.id) === "active");

  return (
    <div className="h-full min-h-[26rem] rounded-3xl bg-paper px-5 py-4 text-sm">
      {/* Inset so the outermost nodes clear the rounded corners. */}
      <div className="relative size-full">
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full"
          fill="none"
        >
          {trace.edges.map((edge) => {
            const from = byId.get(edge.from);
            const to = byId.get(edge.to);
            if (!from || !to) return null;
            const reached = (stepOf.get(edge.to) ?? 0) <= active;
            const isLoop = edge.kind === "loop";
            return (
              <path
                key={`${edge.from}-${edge.to}`}
                d={isLoop ? loopPath(from, to) : flowPath(from, to)}
                vectorEffect="non-scaling-stroke"
                strokeWidth={isLoop ? 1.5 : 2}
                strokeDasharray={isLoop ? "4 5" : undefined}
                strokeLinecap="round"
                className={cn(
                  "transition-[stroke] duration-500 ease-reveal",
                  reached && !isLoop ? "stroke-accent" : "stroke-ink-4",
                )}
              />
            );
          })}
        </svg>

        {trace.nodes.map((node) => {
          const nodeState = state(node.id);
          return (
            <div
              key={node.id}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                width: `${NODE_W}%`,
              }}
              className={cn(
                "absolute flex min-h-16 -translate-x-1/2 -translate-y-1/2 flex-col justify-center gap-0.5 rounded-2xl px-3 py-2.5 transition-colors duration-500 ease-reveal",
                nodeState === "active" && "bg-accent text-on-accent",
                nodeState === "done" && "bg-surface text-ink",
                nodeState === "ahead" && "bg-surface text-ink-3",
              )}
            >
              <span className="leading-tight font-medium">{node.label}</span>
              {node.sub && (
                <span
                  className={cn(
                    "text-xs leading-tight",
                    nodeState === "done" && "text-ink-2",
                  )}
                >
                  {node.sub}
                </span>
              )}
            </div>
          );
        })}

        {aside && anchor && (
          <span
            style={{
              left: `${anchor.x + NODE_W / 2 + 1.5}%`,
              top: `${Math.max(anchor.y - 12, 4)}%`,
            }}
            className="absolute hidden -rotate-2 font-hand text-[1.375rem] whitespace-nowrap text-accent min-[87.5rem]:block"
          >
            {aside}
          </span>
        )}
      </div>
    </div>
  );
}

type Point = { x: number; y: number };

/* Left to right, leaving one node's side and arriving at the next. */
function flowPath(from: Point, to: Point) {
  const x1 = from.x + NODE_W / 2;
  const x2 = to.x - NODE_W / 2;
  const mid = (x1 + x2) / 2;
  return `M${x1} ${from.y} C${mid} ${from.y} ${mid} ${to.y} ${x2} ${to.y}`;
}

/* A return path that dips under both nodes. */
function loopPath(from: Point, to: Point) {
  const dip = Math.max(from.y, to.y) + 22;
  return `M${from.x} ${from.y + 8} C${from.x} ${dip} ${to.x} ${dip} ${to.x} ${to.y + 8}`;
}
