import type { Trace, TraceNode } from "@/content/projects";

export type Step = {
  id: string;
  label: string;
  /** What happens at this step, shown while it is active. */
  note?: string;
  nodes: TraceNode[];
};

/**
 * Turns a trace into the steps a visitor moves through. A sequence id that is
 * not a node (PrismOS's "debate") is a group: it collects every node the
 * sequence never names, and they activate together.
 */
export function buildSteps(trace: Trace): Step[] {
  const byId = new Map(trace.nodes.map((node) => [node.id, node]));
  const grouped = trace.nodes.filter((node) => !trace.sequence.includes(node.id));

  return trace.sequence.map((id) => {
    const node = byId.get(id);
    if (node) return { id, label: node.label, note: node.note, nodes: [node] };
    return {
      id,
      label: grouped.map((member) => member.label).join(", "),
      note: trace.caption,
      nodes: grouped,
    };
  });
}

/** Which step each node belongs to, for colouring nodes and edges. */
export function stepIndexByNode(steps: Step[]) {
  const index = new Map<string, number>();
  steps.forEach((step, i) => step.nodes.forEach((node) => index.set(node.id, i)));
  return index;
}
