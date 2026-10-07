"use client";

import { type ComponentProps, useEffect, useMemo, useRef } from "react";
import type { Trace } from "@/content/projects";
import { cn } from "@/lib/utils";
import { NODE_W, TraceMap } from "./trace-map";

type Props = ComponentProps<typeof TraceMap> & {
  /** Room above the map, for a label laid over the well. */
  className?: string;
  /** The narrowest a node may get before the well scrolls instead. */
  minNodePx?: number;
};

/**
 * The trace map in a well that scrolls sideways when the trace is too tight
 * for its width (Atlas AI's eight steps), following the active step.
 */
export function TraceWell({ className, minNodePx = 132, ...map }: Props) {
  const scroller = useRef<HTMLDivElement>(null);
  const layout = useMemo(() => fitNodes(map.trace, minNodePx), [map.trace, minNodePx]);
  const { trace, stepOf, active } = map;

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const nodes = trace.nodes.filter((node) => stepOf.get(node.id) === active);
    if (nodes.length === 0) return;
    const x = nodes.reduce((sum, node) => sum + node.x, 0) / nodes.length;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({
      left: (x / 100) * el.scrollWidth - el.clientWidth / 2,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [trace, stepOf, active]);

  return (
    <div
      ref={scroller}
      className="no-scrollbar h-full overflow-x-auto overflow-y-hidden rounded-3xl bg-paper"
    >
      <div style={{ minWidth: layout.minWidth }} className={cn("h-full", className)}>
        <TraceMap {...map} nodeWidth={layout.nodeWidth} />
      </div>
    </div>
  );
}

/* Nodes on one row must not touch, and each needs room to stay legible. */
function fitNodes(trace: Trace, minNodePx: number) {
  const { nodes } = trace;
  let gap = Infinity;
  for (const a of nodes) {
    for (const b of nodes) {
      if (a !== b && Math.abs(a.y - b.y) < 12) gap = Math.min(gap, Math.abs(a.x - b.x));
    }
  }
  const nodeWidth = Math.min(NODE_W, gap * 0.9);
  // A packed trace scrolls anyway, so its nodes get room for their longest label.
  const px = nodeWidth < NODE_W ? Math.max(minNodePx, 120) : minNodePx;
  return { nodeWidth, minWidth: Math.round((px / nodeWidth) * 100) };
}
