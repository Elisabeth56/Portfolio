import type { Trace } from "@/content/projects";
import { cn } from "@/lib/utils";

/**
 * The project's own architecture, reduced to a glyph.
 * Each system has a genuinely different shape — linear, branching, a debate
 * fan-out — so a tile is recognisable before you read the name.
 *
 * Edges are drawn in a stretched SVG; nodes are positioned HTML, so they stay
 * circular however wide the tile gets.
 */
export function MiniTrace({
  trace,
  className,
  lit = false,
}: {
  trace: Trace;
  className?: string;
  lit?: boolean;
}) {
  const pos = new Map(trace.nodes.map((n) => [n.id, { x: n.x, y: n.y }]));

  return (
    <span className={cn("relative block", className)}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
        aria-hidden
      >
        {trace.edges.map((e, i) => {
          const a = pos.get(e.from);
          const b = pos.get(e.to);
          if (!a || !b || e.kind === "loop") return null;
          const mx = (a.x + b.x) / 2;
          return (
            <path
              key={i}
              d={`M ${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`}
              fill="none"
              stroke={lit ? "var(--color-run)" : "var(--color-line)"}
              strokeWidth={1}
              strokeOpacity={0.8}
              vectorEffect="non-scaling-stroke"
              className="transition-[stroke] duration-500"
            />
          );
        })}
      </svg>

      {trace.nodes.map((n) => (
        <span
          key={n.id}
          aria-hidden
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
          className={cn(
            "absolute size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-500",
            n.kind === "gate"
              ? "bg-accent"
              : lit
                ? "bg-run"
                : "bg-fg-faint",
          )}
        />
      ))}
    </span>
  );
}
