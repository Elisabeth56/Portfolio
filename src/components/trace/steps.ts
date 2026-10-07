import type { Trace, TraceNode } from "@/content/projects";

export type Step = {
  id: string;
  label: string;
  /** What happens at this step, shown while it is active. */
  note?: string;
  nodes: TraceNode[];
};

/**
 * Turns a trace into the steps a visitor moves through.
 *
 * A sequence id that is not a node (PrismOS's "debate") is a group: it
 * collects every node the sequence never names, and they activate together.
 * Without a group, a node the sequence leaves out (Atlas AI's approval gates)
 * becomes its own step, right after the node that leads into it.
 */
export function buildSteps(trace: Trace): Step[] {
  const byId = new Map(trace.nodes.map((node) => [node.id, node]));
  const unnamed = trace.nodes.filter((node) => !trace.sequence.includes(node.id));
  const hasGroup = trace.sequence.some((id) => !byId.has(id));

  const single = (node: TraceNode): Step => ({
    id: node.id,
    label: node.label,
    note: node.note,
    nodes: [node],
  });

  const steps: Step[] = trace.sequence.map((id) => {
    const node = byId.get(id);
    if (node) return single(node);
    return {
      id,
      label: unnamed.map((member) => member.label).join(", "),
      note: trace.caption,
      nodes: unnamed,
    };
  });
  if (hasGroup) return steps;

  for (const node of unnamed) {
    const from = trace.edges.find((edge) => edge.to === node.id)?.from;
    const after = steps.findIndex((step) => step.id === from);
    steps.splice(after === -1 ? steps.length : after + 1, 0, single(node));
  }
  return steps;
}

/** Which step each node belongs to, for colouring nodes and edges. */
export function stepIndexByNode(steps: Step[]) {
  const index = new Map<string, number>();
  steps.forEach((step, i) => step.nodes.forEach((node) => index.set(node.id, i)));
  return index;
}
