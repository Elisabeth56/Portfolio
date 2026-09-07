export type Role = {
  index: string;
  title: string;
  org: string;
  period: string;
  current?: boolean;
  /** One line that frames what this stage was for. */
  frame: string;
  body: string[];
  /** What changed by the end of it. */
  shift: string;
};

/**
 * Ordered ascending, so it reads as a trajectory rather than a résumé dump.
 * The "NOW" marker carries the reverse-chronological information a recruiter
 * is scanning for.
 */
export const roles: Role[] = [
  {
    index: "01",
    title: "Freelance Web Developer",
    org: "Independent",
    period: "2023 — 2024",
    frame: "Learning to ship on someone else's terms.",
    body: [
      "Client sites and front-end builds, sold and delivered directly. The code was the smaller half of the job.",
      "The larger half was scoping against a fixed budget, shipping to a date I did not set, and handing over something the client could operate without me in the room. Constraints I have never since been able to unsee.",
    ],
    shift:
      "From building what I wanted to build to building what someone had agreed to pay for.",
  },
  {
    index: "02",
    title: "IT Intern",
    org: "Cool Group",
    period: "June 2026 — December 2026",
    current: true,
    frame: "Working inside an organization's operational context.",
    body: [
      "Six months inside a functioning IT organization, where systems have owners, history, and consequences that outlast the person who touched them last.",
      "The difference from independent work is not technical difficulty. It is that nothing exists in isolation — every change lands in an environment somebody else depends on.",
    ],
    shift:
      "From owning a repo end to end to operating inside something larger than the thing I built.",
  },
  {
    index: "03",
    title: "Freelance AI Software Engineer",
    org: "Independent",
    period: "2025 — Present",
    current: true,
    frame: "Owning the system, not just the surface.",
    body: [
      "Building LLM-backed products end to end, for clients and for myself: FinSight, FlowMind, PrismOS, Atlas AI, FarmTwin.",
      "This is where the work moved past the interface. Orchestration and agent design, retrieval that has to stay grounded, tenant isolation enforced in the database, billing that survives a webhook, deployment across platforms that each break differently. Five products shipped, each one teaching a failure mode the last one did not have.",
    ],
    shift:
      "From delivering interfaces to being accountable for everything behind them.",
  },
];

export type CapabilityGroup = {
  index: string;
  /** Framed as what she does with them, never as a logo wall. */
  verb: string;
  detail: string;
  items: string[];
};

export const capabilities: CapabilityGroup[] = [
  {
    index: "01",
    verb: "Orchestrating models",
    detail:
      "Multi-agent workflows, chained reasoning, structured output that has to survive a schema, and streaming the whole thing somewhere legible.",
    items: [
      "LangGraph",
      "LangChain",
      "LlamaIndex",
      "MCP",
      "Multi-agent systems",
      "SSE",
      "WebSockets",
      "Structured output",
    ],
  },
  {
    index: "02",
    verb: "Running inference",
    detail:
      "Hosted and local, open-weight by preference, quantized when the hardware demands it.",
    items: [
      "Groq",
      "LLaMA",
      "Mistral",
      "Qwen",
      "llama.cpp",
      "Q4_K_M quantization",
      "gpt-oss",
    ],
  },
  {
    index: "03",
    verb: "Grounding retrieval",
    detail:
      "The part that decides whether an answer is trustworthy or merely fluent. Chunking strategy, citation enforcement, and grounding in metadata that actually exists.",
    items: [
      "RAG pipelines",
      "Semantic chunking",
      "sqlite-vec",
      "DataHub knowledge graphs",
      "Citation enforcement",
      "Benchmark rubrics",
    ],
  },
  {
    index: "04",
    verb: "Serving it",
    detail:
      "APIs that hold under streaming, long-running chains, and authorization that has to resolve before the first byte.",
    items: ["FastAPI", "Python", "Node.js", "Express", "NestJS", "TypeScript"],
  },
  {
    index: "05",
    verb: "Storing it safely",
    detail:
      "Multi-tenancy enforced by the database rather than trusted to application code.",
    items: [
      "PostgreSQL",
      "Supabase",
      "Row-level security",
      "SQLAlchemy async",
      "asyncpg",
      "SQLite",
    ],
  },
  {
    index: "06",
    verb: "Building the product around it",
    detail:
      "The interface is where an AI system either earns trust or fails to. Grounding you cannot see is indistinguishable from hallucination.",
    items: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Motion",
      "Recharts",
      "Design systems",
    ],
  },
  {
    index: "07",
    verb: "Shipping it",
    detail:
      "Across platforms that each fail in their own way, with payment rails that serve the market I build for.",
    items: [
      "Docker",
      "Vercel",
      "Railway",
      "Render",
      "Neon",
      "Alibaba Cloud SAE",
      "Git",
      "Paystack",
    ],
  },
];
