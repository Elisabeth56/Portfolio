export type NodeKind =
  | "io"
  | "compute"
  | "model"
  | "store"
  | "gate"
  | "agent"
  | "ui";

export type TraceNode = {
  id: string;
  label: string;
  /** Small mono detail under the label. */
  sub?: string;
  kind: NodeKind;
  /** Percentage position on the trace canvas. */
  x: number;
  y: number;
  /** Revealed when the node is selected. This is where the engineering lives. */
  note?: string;
};

export type TraceEdge = {
  from: string;
  to: string;
  label?: string;
  /** `branch` renders dashed, `loop` renders as a return path. */
  kind?: "default" | "branch" | "loop";
};

export type Trace = {
  /** Order in which nodes activate when the trace plays. */
  sequence: string[];
  nodes: TraceNode[];
  edges: TraceEdge[];
  /** Bespoke interaction layer, handled per project. */
  mode: "flow" | "debate" | "gated" | "offline";
  caption: string;
};

export type Decision = {
  title: string;
  body: string;
  /** The honest cost of the call. Rendered as a distinct line. */
  cost?: string;
};

export type Project = {
  slug: string;
  index: string;
  name: string;
  kind: string;
  period: string;
  status: "Live" | "Deployed" | "Submitted";
  tagline: string;
  role: string;
  roleNote?: string;
  links: { live?: string; repo?: string };
  problem: string[];
  stakes: string;
  built: string[];
  architecture: string[];
  decisions: Decision[];
  stack: { group: string; items: string[] }[];
  demonstrates: string[];
  trace: Trace;
};

export const projects: Project[] = [
  /* ====================================================================== */
  {
    slug: "prismos",
    index: "01",
    name: "PrismOS",
    kind: "Multi-agent system",
    period: "2026",
    status: "Live",
    tagline:
      "Seven agents that are required to disagree before any code ships.",
    role: "Product owner, architect, lead designer",
    roleNote:
      "I defined the agent-society model, owned the blueprint through three versions, and made the architectural and scope calls. Implementation was directed rather than hand-typed — I reviewed output and gave corrective feedback. The scope enforcement was the part that mattered: every capability added after v1.0 went in as a patch against working architecture, never a rebuild.",
    links: { live: "https://prism-os-jade.vercel.app/" },
    problem: [
      "AI coding assistants are single-voiced. One model takes a feature request and decides everything itself — scope, architecture, implementation, testing — and it never disagrees with itself. The output compiles and demos well, and it quietly skips every tradeoff a real team would argue about.",
      "The second failure is context. Most agent tools generate in a vacuum. They do not know what the codebase already looks like, what stack it runs on, or what was decided three features ago. The result is technically valid and architecturally foreign.",
    ],
    stakes:
      "Feature delivery is a coordination problem before it is a code-generation problem. The value in a team comes from friction — the architect pushing back, QA refusing to sign off, the PM cutting scope. Strip that out and call the result autonomous development, and you have a demo rather than a delivery system.",
    built: [
      "Point PrismOS at a codebase and describe a feature. It reads the existing product, loads project memory from prior runs, activates seven specialized agents, streams their reasoning live, forces them into structured debate, resolves conflicts through a Release Manager, and returns a package: production-ready code, tests, a conflict log, a benchmark, and a binding SHIPPABLE or NEEDS_REVISION verdict.",
      "The full surface shipped — landing page, dashboard, two-step run creation, a live seven-agent streaming view, project and session history, a conflicts explorer, a benchmark comparison, an architecture page, and a self-contained demo mode.",
    ],
    architecture: [
      "Context ingestion runs before any model call. GitHub parsing, file reading and URL crawling are deterministic and synchronous, targeted under five seconds, so no tokens are spent on I/O.",
      "Context is injected at the system-prompt level rather than as a user message, so it does not inflate the turn count for every downstream agent.",
      "Conflict is mandatory rather than emergent. Step three requires disagreement, and structured markers — SECURITY FLAG, INTEGRATION RISK — drive orchestration. A security flag from QA is non-negotiable and routes to the Release Manager. An unopposed integration risk logs as a warning without triggering resolution.",
      "With zero context supplied, Agent 0 emits a minimal summary and the workflow proceeds normally, preserving the original feature-request-only path.",
    ],
    decisions: [
      {
        title: "Agreement was the failure mode, not disagreement",
        body: "Running seven agents was straightforward. Stopping them collapsing into polite consensus was not. Agents respond in parallel without seeing each other's output first, prompts require at least one surfaced disagreement, and the orchestrator routes on structured markers rather than on sentiment. Conflict had to be consequential or it was theatre.",
      },
      {
        title: "The conflict log is the product",
        body: "Code generation is commodity. What almost nothing offers is the reasoning trail — what was contested, who won, and why. A run returns the argument that produced the code alongside the code, which is auditability rather than output.",
      },
      {
        title: "One revision cycle, maximum",
        body: "QA can send work back once. After that the verdict stands, even if it is NEEDS_REVISION. An agent loop with no ceiling is a system that will happily spend your budget converging on nothing.",
        cost: "A genuinely fixable second-order defect ships flagged instead of fixed.",
      },
      {
        title: "Patches over rebuilds, enforced",
        body: "Agent 0, the UI/UX Designer, project memory, feature classification and frontend QA checks were all added after v1.0 — every one as an incremental patch against working architecture. Multiple proposed rebuilds were rejected. Auth, rate limiting and webhooks were cut and documented as deferred rather than half-built.",
      },
      {
        title: "Serverless pivot mid-build",
        body: "Started on Alibaba Cloud ECS and moved to Serverless App Engine once the operational overhead became a schedule risk, while keeping the Alibaba Cloud deployment requirement satisfied.",
      },
    ],
    stack: [
      {
        group: "Orchestration",
        items: ["LangGraph StateGraph", "FastAPI", "SSE streaming"],
      },
      { group: "Model", items: ["Qwen3-235B-A22B", "DashScope"] },
      {
        group: "Interface",
        items: ["Next.js App Router", "TypeScript", "Tailwind v4", "Framer Motion", "EventSource"],
      },
      { group: "Data", items: ["Supabase", "PostgreSQL", "Alibaba OSS"] },
      { group: "Deploy", items: ["Alibaba Cloud SAE"] },
    ],
    demonstrates: [
      "Multi-agent orchestration with real conflict generation and resolution",
      "Codebase-aware generation that fits an existing system",
      "Project memory that compounds across runs",
      "Seven concurrent token streams rendered legibly",
      "A quality gate that will refuse to ship",
    ],
    trace: {
      mode: "debate",
      caption:
        "Run the pipeline. Step three is a parallel debate — three agents respond independently and are required to surface disagreement before the Release Manager rules.",
      sequence: [
        "ctx",
        "pm",
        "debate",
        "release",
        "design",
        "build",
        "verdict",
      ],
      nodes: [
        {
          id: "ctx",
          label: "Context Analyst",
          sub: "agent 0 · pre-LLM",
          kind: "agent",
          x: 7,
          y: 50,
          note: "Parses the GitHub repo, stack description and any URLs deterministically — no model call. Emits a structured ProductContextSummary injected at system-prompt level. Target: under five seconds.",
        },
        {
          id: "pm",
          label: "Product Manager",
          sub: "PRD · classify",
          kind: "agent",
          x: 22,
          y: 50,
          note: "Writes the PRD grounded in Agent 0's summary and classifies the feature. Classification decides whether the UI/UX Designer is activated later.",
        },
        {
          id: "architect",
          label: "Architect",
          sub: "position",
          kind: "agent",
          x: 40,
          y: 14,
          note: "Responds independently, without seeing the Engineer or QA positions. Must surface at least one disagreement.",
        },
        {
          id: "engineer",
          label: "Engineer",
          sub: "position",
          kind: "agent",
          x: 40,
          y: 50,
          note: "Argues the implementation view. Integration risks raised here log as warnings unless another agent opposes them.",
        },
        {
          id: "qa",
          label: "QA",
          sub: "position · flags",
          kind: "agent",
          x: 40,
          y: 86,
          note: "A SECURITY FLAG raised here is non-negotiable and routes straight to the Release Manager for a binding ruling.",
        },
        {
          id: "release",
          label: "Release Manager",
          sub: "binding rulings",
          kind: "gate",
          x: 59,
          y: 50,
          note: "Reads all three positions, issues binding decisions, and writes every contested point to the conflict log. This log ships with the code.",
        },
        {
          id: "design",
          label: "UI/UX Designer",
          sub: "frontend only",
          kind: "agent",
          x: 76,
          y: 16,
          note: "Activated only when the PM classified the feature as frontend. Otherwise the workflow skips this node entirely.",
        },
        {
          id: "build",
          label: "Engineer",
          sub: "builds the ruling",
          kind: "compute",
          x: 76,
          y: 52,
          note: "Builds against the Release Manager's rulings rather than its own earlier position.",
        },
        {
          id: "verdict",
          label: "Verdict",
          sub: "binding verdict",
          kind: "gate",
          x: 93,
          y: 52,
          note: "QA runs test scenarios and returns a binding verdict. One revision cycle is allowed. There is no infinite loop.",
        },
      ],
      edges: [
        { from: "ctx", to: "pm" },
        { from: "pm", to: "architect", kind: "branch" },
        { from: "pm", to: "engineer", kind: "branch" },
        { from: "pm", to: "qa", kind: "branch" },
        { from: "architect", to: "release", kind: "branch" },
        { from: "engineer", to: "release", kind: "branch" },
        { from: "qa", to: "release", kind: "branch" },
        { from: "release", to: "design", kind: "branch" },
        { from: "release", to: "build" },
        { from: "build", to: "verdict" },
        { from: "verdict", to: "build", kind: "loop", label: "1 revision max" },
      ],
    },
  },

  /* ====================================================================== */
  {
    slug: "atlas-ai",
    index: "02",
    name: "Atlas AI",
    kind: "Autonomous data engineering",
    period: "2026",
    status: "Live",
    tagline:
      "Natural language to production dbt models, grounded in the catalog your organization already has.",
    role: "Sole architect and engineer",
    links: { live: "https://atlas-ai-taupe.vercel.app/" },
    problem: [
      "A business question — daily revenue by customer segment for the last ninety days — becomes a ticket, which sits in a queue, which becomes a data engineer hunting for the right tables, checking which columns are trustworthy, writing SQL and a dbt model, adding tests, writing docs and updating the catalog. Hours to days per request, and almost none of it creative.",
      "Point a language model at it and you hit a specific wall: it hallucinates schemas. It invents column names that sound plausible and joins on keys that do not exist. Ungrounded generation is worse than useless, because the output looks correct.",
    ],
    stakes:
      "The gap between an LLM writing SQL and an LLM writing SQL that runs in your warehouse is entirely a metadata problem — and organizations already solved half of it. DataHub holds the schemas, ownership, lineage and PII tags. That knowledge graph is exactly the context the model needs, sitting unused next to it.",
    built: [
      "A six-agent pipeline that turns a natural-language request into production-ready data artifacts — dbt models, SQL, tests, documentation and metadata — every one grounded in the organization's DataHub knowledge graph.",
      "Two genuine human approval gates: one after metadata matching, before a line of SQL is generated, and one before anything is written back to the catalog.",
    ],
    architecture: [
      "The pipeline splits into three resumable phases around the two checkpoints. Each phase reconstructs RunContext from persisted agent_runs.output_json rather than holding in-memory state across HTTP requests, so a pause survives a restart and each phase resumes independently.",
      "Deliberately a modular monolith. The v1 design was enterprise microservices — Temporal, NATS, Kubernetes, service mesh — and collapsing it was correct for the scope. LLMProvider, DataHubGateway and Agent were preserved as clean interfaces, so any agent can later be extracted behind the same Agent.run() contract.",
      "Every external dependency sits behind an interface. The system runs fully standalone in mock mode and switches to live backends purely through configuration.",
    ],
    decisions: [
      {
        title: "Invisible grounding is indistinguishable from hallucination",
        body: "Early on, DataHub was load-bearing in execution and completely invisible in the interface — buried in output_json and one scrolling log line. For a tool whose entire pitch is grounding, that is a product failure regardless of correctness. It drove the context review panel: matched datasets, confidence scores, columns and PII tags sitting directly beside the generated SQL.",
      },
      {
        title: "Checkpoints that are real, not theatrical",
        body: "The easy version keeps state in memory and calls the pause a checkpoint. Persisting each agent's output and rebuilding context per phase costs more to write and means a paused run survives a process restart. An approval gate that evaporates on redeploy is not a gate.",
      },
      {
        title: "The bug that reported success",
        body: "NEXT_PUBLIC_API_URL was set as a runtime environment variable where Next.js requires build-time injection. The frontend silently fell back to mock mode. No error, no warning, no failed request — just a working-looking application answering from fixtures.",
      },
      {
        title: "Shipping in mock mode, and saying so",
        body: "DataHub's RAM footprint does not fit Vercel, Render or Neon, so the deployed site runs in DataHub mock mode. It runs cleanly against a live instance at 6GB locally. The MCP gateway was built against documentation rather than a live instance and is flagged unverified in the repo, with an inspection script written to confirm tool call shapes once an instance is available.",
        cost: "A visitor cannot exercise the live catalog path. Stating that is better than a demo that implies otherwise.",
      },
      {
        title: "PII tags bleeding down the hierarchy",
        body: "The QA agent over-flagged non-PII columns because dataset-level tags were inheriting to field level. A governance check that cries wolf gets switched off, which is worse than not having one.",
      },
    ],
    stack: [
      {
        group: "Backend",
        items: ["FastAPI", "Python", "asyncpg", "SQLAlchemy 2.x async", "WebSockets"],
      },
      { group: "Model", items: ["Groq", "gpt-oss-120b", "LLMProvider interface"] },
      { group: "Metadata", items: ["DataHub OSS", "MCP", "REST / GraphQL gateway"] },
      {
        group: "Interface",
        items: ["Next.js App Router", "TypeScript", "Tailwind v4", "Motion", "Recharts", "Zod v4"],
      },
      { group: "Deploy", items: ["Vercel", "Render", "Neon", "Apache 2.0"] },
    ],
    demonstrates: [
      "Retrieval grounded in a real organizational knowledge graph",
      "Human-in-the-loop gates that survive a restart",
      "PII-aware QA against field-level catalog tags",
      "Live execution streamed over WebSocket",
      "Interface-boundary design that keeps a monolith extractable",
    ],
    trace: {
      mode: "gated",
      caption:
        "Two checkpoints are real. The pipeline will not generate SQL until the matched context is approved, and will not touch the catalog until writeback is approved. Approve them to continue.",
      sequence: [
        "planner",
        "metadata",
        "gate1",
        "engineer",
        "qa",
        "docs",
        "gate2",
        "writeback",
      ],
      nodes: [
        {
          id: "planner",
          label: "Planner",
          sub: "intent · plan",
          kind: "agent",
          x: 6.5,
          y: 50,
          note: "Interprets the request and decomposes it into the work the downstream agents will do.",
        },
        {
          id: "metadata",
          label: "Metadata Analyst",
          sub: "DataHub query",
          kind: "agent",
          x: 19,
          y: 50,
          note: "Queries DataHub for datasets that actually exist, returning confidence scores, columns, owners and PII tags. This is the grounding step everything else depends on.",
        },
        {
          id: "gate1",
          label: "Context review",
          sub: "human approval",
          kind: "gate",
          x: 31.5,
          y: 50,
          note: "The run pauses here. The user sees exactly which datasets matched and how confident the match was, and either accepts the context or starts fresh — before a line of SQL exists.",
        },
        {
          id: "engineer",
          label: "Data Engineer",
          sub: "SQL · dbt models",
          kind: "agent",
          x: 44,
          y: 50,
          note: "Generates SQL and dbt models strictly against the retrieved schemas. No column it has not been shown.",
        },
        {
          id: "qa",
          label: "QA",
          sub: "validation · PII",
          kind: "agent",
          x: 56.5,
          y: 50,
          note: "Validates the output and checks PII handling against DataHub's field-level tags.",
        },
        {
          id: "docs",
          label: "Documentation",
          sub: "model + column docs",
          kind: "agent",
          x: 69,
          y: 50,
        },
        {
          id: "gate2",
          label: "Writeback approval",
          sub: "human approval",
          kind: "gate",
          x: 81.5,
          y: 50,
          note: "Nothing reaches the catalog without this. An agent that pushes lineage into production metadata unasked is a liability, not a feature.",
        },
        {
          id: "writeback",
          label: "Writeback",
          sub: "docs + lineage",
          kind: "store",
          x: 94,
          y: 50,
        },
      ],
      edges: [
        { from: "planner", to: "metadata" },
        { from: "metadata", to: "gate1" },
        { from: "gate1", to: "engineer" },
        { from: "engineer", to: "qa" },
        { from: "qa", to: "docs" },
        { from: "docs", to: "gate2" },
        { from: "gate2", to: "writeback" },
      ],
    },
  },

  /* ====================================================================== */
  {
    slug: "finsight",
    index: "03",
    name: "FinSight",
    kind: "Document intelligence · SaaS",
    period: "2025 — 2026",
    status: "Live",
    tagline:
      "Turning a messy bank statement into clean rows, for a market bank-linking APIs do not serve.",
    role: "Sole engineer",
    roleNote:
      "Architecture, backend, AI pipeline, frontend integration, payments and deployment. The marketing site predated the build; everything from the API surface inward is mine.",
    links: { live: "https://finsight-red-two.vercel.app/" },
    problem: [
      "Bank statements are one of the richest personal datasets most people own and one of the least usable. They arrive as CSVs with inconsistent column names, or as PDFs where the transaction table is a visual artifact rather than structured data. Getting anything out of them means manual tagging in a spreadsheet, which almost nobody sustains past the first month.",
      "For Nigerian users the existing tools are worse than tedious. Western personal-finance apps depend on bank-linking APIs with poor or no coverage for Nigerian banks, price in USD only, and categorize against merchant vocabularies that do not recognize local transaction descriptors.",
    ],
    stakes:
      "The gap is not analytical sophistication. Once transactions are normalized and labeled, category breakdowns, trend lines and outlier detection are cheap. The whole product hinges on turning a messy document into clean rows without asking the user to do it — for a market the incumbent ingestion method cannot reach at all.",
    built: [
      "Upload a statement as CSV or PDF and get back categorized transactions, monthly trend charts, anomaly flags on unusual spending, a chat interface answering natural-language questions against your own history, and an on-demand savings report.",
      "Behind it: authentication, per-user data isolation, a freemium paywall with Paystack billing in NGN and USD, and a documented two-platform deployment.",
    ],
    architecture: [
      "A monorepo with backend and frontend as separate deployment targets. Files hit POST /upload and the parser branches on type — CSV through pandas with column normalization, PDF through pdfplumber for structured table extraction with pymupdf as a raw-text fallback when there is no recoverable table structure.",
      "Extracted tables are re-serialized as markdown before reaching the model. It preserves the row and column relationship the model needs in order to know that a number is an amount and not a date.",
      "Isolation lives in the database. Supabase Postgres with row-level security policies, and FastAPI middleware validating Supabase JWTs on every request — the guarantee is not in application code.",
      "Anomaly detection runs z-scores over per-category monthly baselines, so it flags genuine outliers rather than large absolute amounts.",
    ],
    decisions: [
      {
        title: "Naive chunking produced plausible garbage",
        body: "Fixed-size chunking splits transaction tables mid-row. Retrieved context then contains an amount orphaned from its date and description, and the model answers confidently and wrongly. Chunking semantically around section headers with row boundaries as hard splits fixed it. The failure never surfaced as an error — only as answers that looked right.",
      },
      {
        title: "LLM-only categorization, no rule table",
        body: "The obvious design is a rule-based first pass on known merchant strings falling back to the model for ambiguous entries. I went model-only. A rule table is a maintenance liability that needs constant curation to stay useful, and with Groq's inference speed and 40-transaction batching the latency difference did not justify it.",
        cost: "A per-upload token cost, permanently, in exchange for zero rule maintenance. A tradeoff, not a free win.",
      },
      {
        title: "Currency detection without a geo-IP dependency",
        body: "Rather than adding a third-party lookup and its latency and failure mode, currency defaults are inferred client-side from navigator.language and an Africa/Lagos timezone check. The part that makes an imperfect heuristic acceptable is the override toggle sitting next to it.",
      },
      {
        title: "Authorization has to resolve before the first byte",
        body: "Gating a streamed SSE endpoint is not the same as gating a request. You cannot retroactively return 402 on a response that has already started streaming, so the entitlement check has to complete before the stream opens.",
      },
      {
        title: "Cutting weight the architecture never needed",
        body: "Deployment broke on ML dependency wheels unbuilt for Python 3.13. I pinned to 3.11 via runtime.txt and, separately, stripped torch and HuggingFace embeddings out of requirements entirely rather than carrying heavyweight local inference for a system that calls a hosted model.",
      },
    ],
    stack: [
      { group: "Backend", items: ["FastAPI", "Python 3.11", "Railway"] },
      { group: "Model", items: ["Groq", "LLaMA 3.3", "JSON mode", "LlamaIndex RAG"] },
      { group: "Parsing", items: ["pdfplumber", "pymupdf", "pandas"] },
      {
        group: "Data & auth",
        items: ["Supabase Postgres", "Row-level security", "Google OAuth", "JWT middleware"],
      },
      { group: "Payments", items: ["Paystack", "HMAC-SHA512 webhooks", "NGN + USD"] },
      { group: "Interface", items: ["Next.js App Router", "Recharts", "SSE", "Vercel"] },
    ],
    demonstrates: [
      "Structured extraction from genuinely unstructured documents",
      "RAG over private user data with per-tenant isolation enforced in the database",
      "Streaming inference behind an entitlement check",
      "Real payment integration with signature-verified webhooks",
      "Market-specific engineering where the incumbent approach does not reach",
    ],
    trace: {
      mode: "flow",
      caption:
        "The ingestion path. The markdown re-serialization step is the one that decides whether the model can reason about the table at all.",
      sequence: [
        "upload",
        "csv",
        "pdf",
        "markdown",
        "batch",
        "groq",
        "postgres",
        "chat",
      ],
      nodes: [
        {
          id: "upload",
          label: "Upload",
          sub: "POST /upload",
          kind: "io",
          x: 6,
          y: 46,
          note: "The parser branches on file type here. Everything downstream depends on which branch recovers usable structure.",
        },
        {
          id: "csv",
          label: "CSV parse",
          sub: "pandas · normalize",
          kind: "compute",
          x: 24,
          y: 16,
          note: "Column names are inconsistent between banks, so normalization maps them to a canonical schema before anything else runs.",
        },
        {
          id: "pdf",
          label: "PDF parse",
          sub: "pdfplumber → pymupdf",
          kind: "compute",
          x: 24,
          y: 74,
          note: "pdfplumber recovers tables and bounding boxes. When a PDF has no recoverable table structure at all, pymupdf raw-text extraction takes over rather than failing the upload.",
        },
        {
          id: "markdown",
          label: "Markdown table",
          sub: "row/column kept",
          kind: "compute",
          x: 43,
          y: 44,
          note: "The formatting decision that measurably improved reasoning quality over flat text. Markdown keeps the row and column relationship intact, which is how the model knows a number is an amount and not a date.",
        },
        {
          id: "batch",
          label: "Batch",
          sub: "groups of 40",
          kind: "compute",
          x: 60,
          y: 44,
          note: "Batching at 40 is what makes model-only categorization viable on cost and latency.",
        },
        {
          id: "groq",
          label: "Categorize",
          sub: "Groq · LLaMA 3.3 · json",
          kind: "model",
          x: 79,
          y: 20,
          note: "JSON mode because the output has to survive contact with typed Postgres columns.",
        },
        {
          id: "postgres",
          label: "Persist",
          sub: "Supabase Postgres · RLS",
          kind: "store",
          x: 79,
          y: 68,
          note: "Row-level security policies mean the per-user isolation guarantee lives in the database rather than in application code that someone can forget to write.",
        },
        {
          id: "chat",
          label: "Chat + analysis",
          sub: "RAG · SSE stream",
          kind: "io",
          x: 94,
          y: 44,
          note: "RAG over the user's own transactions, streamed over SSE so tokens render as they arrive. The entitlement check resolves before the first byte, because a stream cannot be retroactively refused.",
        },
      ],
      edges: [
        { from: "upload", to: "csv", kind: "branch" },
        { from: "upload", to: "pdf", kind: "branch" },
        { from: "csv", to: "markdown" },
        { from: "pdf", to: "markdown" },
        { from: "markdown", to: "batch" },
        { from: "batch", to: "groq" },
        { from: "groq", to: "postgres" },
        { from: "postgres", to: "chat" },
      ],
    },
  },

  /* ====================================================================== */
  {
    slug: "farmtwin",
    index: "04",
    name: "FarmTwin",
    kind: "Offline-first local inference",
    period: "2026 · 7-day sprint",
    status: "Submitted",
    tagline:
      "A cited agronomic advisor that runs entirely on a 2014 laptop with the network unplugged.",
    role: "Sole developer",
    roleNote:
      "Model selection and benchmarking, knowledge base curation and chunking, retrieval pipeline, backend, frontend and design system, the speech-to-text evaluation, and the full submission artifacts including ADRs.",
    links: { repo: "https://github.com/Elisabeth56/FarmTwin" },
    problem: [
      "Smallholder maize farmers in Nigeria make high-stakes agronomic decisions — planting dates, fertilizer timing and rates, pest response — largely without extension services. Where digital advisory tools exist they assume reliable connectivity, a modern smartphone and a cloud backend. That assumption fails in exactly the places the advice is most needed.",
      "There is also a trust problem specific to AI advisory in agriculture. A chatbot answering how much urea to apply at six weeks with a plausible but ungrounded number is worse than no tool at all, because a wrong dose costs a season.",
    ],
    stakes:
      "The agronomic knowledge is not missing — NAERLS, IITA, CIMMYT and FAO have published extensively. It sits in PDFs and extension bulletins that never reach the farm. Making that corpus queryable in natural language, on a device with no network, is the actual delivery problem. Offline is not a constraint imposed by a brief; it decides whether the system is usable at all.",
    built: [
      "A fully offline digital twin of a smallholder maize farm. It models the farm's state and answers agronomic questions in natural language, with every answer grounded in a curated knowledge base and cited back to source. No network calls, no API keys, no cloud inference — the model, the vector index and the data all live on the device.",
      "Built in a seven-day sprint for the Africa Deep Tech Challenge 2026 Laptop LLM Challenge.",
    ],
    architecture: [
      "45 curated chunks drawn from NAERLS, IITA, CIMMYT and FAO, embedded and stored in SQLite via sqlite-vec. Using SQLite as the vector store rather than a dedicated vector database keeps the whole system to a single file dependency and avoids running a second server process on a machine already CPU-bound by inference.",
      "Qwen2.5-3B-Instruct at Q4_K_M quantization through llama.cpp. Queries are embedded, top-k chunks retrieved, and context assembled into a prompt that requires the model to cite the chunks it used.",
      "FastAPI and SQLAlchemy over SQLite, exposing a streaming SSE endpoint with a non-streaming fallback preserved. On the client, a stripJsonBlock utility separates the structured citation payload from the prose stream as tokens arrive, so text renders progressively without raw JSON scrolling past.",
    ],
    decisions: [
      {
        title: "Model selection turned on grounding, not fluency",
        body: "Benchmarked Qwen2.5-3B against Llama-3.2-3B on a structured rubric with manual grading against gold prompts. Llama was disqualified primarily because it hallucinated citations — inventing sources that were not in the retrieved context. For a system whose entire value is that an answer comes from IITA and here is the chunk, that is decisive rather than a rough edge. Qwen took the composite 83.5 to 72.9, driven by retrieval grounding.",
      },
      {
        title: "I graded my own benchmark down",
        body: "My first pass scored Qwen around 98.8. That was inflated — I had been generous on partial-credit cases. Re-graded against a stricter reading of the rubric it landed at 87.6. The temptation to let your chosen model score well is real, and a benchmark you have quietly rigged tells you nothing.",
      },
      {
        title: "I cut the feature I wanted most, on evidence",
        body: "I am a native Pidgin speaker, and Pidgin voice input was the feature I most wanted — it is the language a large share of the target users actually speak. I ran a 15-clip evaluation against a 40% WER gate defined before testing. Whisper base failed on Pidgin. The Nigerian-English fine-tune failed on Pidgin. NCAIR1's dataset was behind a gated repo and Orinode was not publicly available inside the sprint window. The feature scoped down to English-only, labelled honestly in the interface and documented as ADR-011.",
        cost: "The most valuable feature for the target user is not in the product. The gate existed so that decision would be forced by data rather than by how much I wanted it.",
      },
      {
        title: "The development environment was a variable",
        body: "On an 8GB 2014 Intel MacBook Pro, the desktop app I was using competed with llama.cpp for CPU cores during inference testing. I moved to the browser client for the sprint and wrote it up as ADR-009. Small, but the kind of thing that silently wrecks benchmark timings if you do not notice it.",
      },
    ],
    stack: [
      { group: "Inference", items: ["llama.cpp", "Qwen2.5-3B-Instruct", "Q4_K_M"] },
      { group: "Retrieval", items: ["SQLite", "sqlite-vec", "semantic chunking"] },
      { group: "Backend", items: ["FastAPI", "SQLAlchemy", "SSE"] },
      { group: "Interface", items: ["Vite", "React", "TypeScript", "Tailwind"] },
      {
        group: "Evaluated",
        items: ["whisper.cpp", "Whisper base", "Nigerian-accent fine-tune"],
      },
      { group: "Sources", items: ["NAERLS", "IITA", "CIMMYT", "FAO"] },
    ],
    demonstrates: [
      "Local quantized inference on decade-old consumer hardware",
      "Retrieval fidelity verified by a benchmark I re-graded against myself",
      "Citation enforcement as a model selection criterion",
      "Streaming prose and structured payload separated client-side",
      "A decision trail in ADRs, so the tradeoffs are auditable rather than folklore",
    ],
    trace: {
      mode: "offline",
      caption:
        "Everything inside the boundary runs on the device. Cut the network and nothing changes — that is the entire thesis. Try the switch.",
      sequence: ["query", "embed", "vec", "assemble", "qwen", "stream"],
      nodes: [
        {
          id: "query",
          label: "Question",
          sub: "text or voice (EN)",
          kind: "io",
          x: 8,
          y: 50,
          note: "Voice input ships as English-only and is labelled that way in the interface — 'Voice input (Nigerian English)' — rather than quietly underperforming on Pidgin.",
        },
        {
          id: "embed",
          label: "Embed",
          sub: "local embedding",
          kind: "compute",
          x: 26,
          y: 50,
        },
        {
          id: "vec",
          label: "Retrieve",
          sub: "sqlite-vec · 45 chunks",
          kind: "store",
          x: 44,
          y: 50,
          note: "SQLite as the vector store keeps the system to a single file dependency and avoids a second server process competing for CPU with inference on an already-constrained machine.",
        },
        {
          id: "assemble",
          label: "Ground",
          sub: "citation required",
          kind: "compute",
          x: 62,
          y: 50,
          note: "The prompt requires the model to cite the chunks it used. Model selection was decided on whether a candidate would obey this or invent sources.",
        },
        {
          id: "qwen",
          label: "Qwen2.5-3B",
          sub: "llama.cpp · Q4_K_M",
          kind: "model",
          x: 82,
          y: 26,
          note: "Chosen over Llama-3.2-3B because Llama hallucinated citations. Composite 83.5 against 72.9.",
        },
        {
          id: "stream",
          label: "Answer",
          sub: "SSE · cited",
          kind: "io",
          x: 82,
          y: 72,
          note: "Prose and the structured citation payload arrive in the same response. The client peels the JSON out as tokens stream so the reader never watches raw JSON scroll past.",
        },
      ],
      edges: [
        { from: "query", to: "embed" },
        { from: "embed", to: "vec" },
        { from: "vec", to: "assemble" },
        { from: "assemble", to: "qwen" },
        { from: "qwen", to: "stream" },
      ],
    },
  },

  /* ====================================================================== */
  {
    slug: "flowmind",
    index: "05",
    name: "FlowMind",
    kind: "AI product · SaaS",
    period: "2025 — 2026",
    status: "Live",
    tagline:
      "Removing the triage tax that kills productivity systems, with the model as the mechanic rather than a chat box.",
    role: "Architect and product owner",
    roleNote:
      "Defined the product, chose the stack, and drove it through four phases — schema, AI orchestration, payments, deployment. The consequential calls were mine, including replacing Stripe with Paystack for the Nigerian market and catching the incomplete migration when stripe_customer_id was still sitting in the schema afterwards.",
    links: { live: "https://flowmind-sage.vercel.app/" },
    problem: [
      "Knowledge workers capture information faster than they can organize it. Notes land in one app, tasks in another, half-formed ideas in a file nobody reopens. The bottleneck is the triage afterwards — deciding what belongs to which project, what actually matters today, and whether last week's intentions matched last week's reality.",
      "Notion, Todoist and Apple Notes are storage layers. They require the user to do the sorting.",
    ],
    stakes:
      "Manual triage is the tax that kills productivity systems. People abandon them within weeks because maintaining the system costs more than the clarity it returns. Classification, entity extraction and prioritization reasoning are things a language model is genuinely good at, which makes this one of the rarer cases where the model removes work instead of adding a chat box on top of it.",
    built: [
      "A unified inbox for unstructured capture, auto-organization that classifies items and extracts entities into projects and priorities, a reasoned daily plan rather than a sorted list, and a weekly summary comparing planned against accomplished.",
      "Three connected surfaces: a marketing site, an authenticated app across dashboard, inbox, today, projects, insights, settings and billing, and the backend powering both.",
    ],
    architecture: [
      "Seven user-scoped Postgres tables behind row-level security, with triggers for derived counts and every table reaching auth.users through profiles.id.",
      "Three endpoint shapes rather than one prompt: a single-pass classification and extraction that writes back with a confidence score; a multi-step daily planner that gathers context from projects and open items, reasons about priorities, then emits a structured plan; and a comparative weekly chain over daily plans against completed items.",
      "Usage metering on profiles ties the free and paid boundary to the actual cost driver — model calls — rather than an arbitrary feature gate, with ai_processing_log recording calls for debugging.",
    ],
    decisions: [
      {
        title: "Structured output is the hard boundary, not the prompt",
        body: "Auto-organize has to return something that maps cleanly onto typed Postgres columns — project assignment, priority, extracted entities, and a confidence float constrained to 0–1. Free-text output does not survive contact with a schema. The real work sits at the join between the chain and the database.",
      },
      {
        title: "Multi-step chains inside a serverless timeout",
        body: "The daily planner gathers context, then reasons, then generates — sequential model calls under a Vercel function limit. Groq's inference speed is what makes it viable at all; maxDuration of 30 is the accommodation rather than the solution.",
      },
      {
        title: "Paystack over Stripe, and it was not a client swap",
        body: "Stripe does not serve the market this is built for. Migrating touched the schema, the subscription status enum — Paystack's non_renewing has no Stripe equivalent — webhook signature verification, and the entire billing interface. It got consolidated into a single authoritative schema file rather than left as an incremental migration.",
      },
      {
        title: "A bleeding-edge stack with no settled patterns",
        body: "Tailwind v4 dropped the config file for a CSS-first @theme directive, Framer Motion renamed to motion with new import paths, and Next 15 split viewport out of the metadata export. Most tutorials and most training data describe the previous versions, so the design system had to be built against documentation rather than convention.",
      },
      {
        title: "globals.css as a contract between sessions",
        body: "The landing page, auth pages and dashboard were built at different times. Keeping the palette, elevation and motion timing identical across three separately-built surfaces meant treating the token file as a real contract rather than a place to put colours.",
      },
    ],
    stack: [
      { group: "Framework", items: ["Next.js 15", "React 19", "Server Components", "Turbopack"] },
      { group: "AI", items: ["Groq", "Mistral", "LangChain", "multi-step chains"] },
      {
        group: "Data",
        items: ["Supabase", "Postgres", "Realtime", "Row-level security", "usage metering"],
      },
      { group: "Payments", items: ["Paystack", "signed webhooks", "subscription sync"] },
      { group: "Design", items: ["Tailwind v4", "Motion 12", "DM Sans", "Playfair Display"] },
    ],
    demonstrates: [
      "Multi-step chains with context gathering and reasoning, not single-shot prompting",
      "Open-model orchestration rather than defaulting to a single vendor",
      "Model output constrained to survive a relational schema",
      "Multi-tenancy enforced at the database",
      "Usage metering tied to the real cost driver",
    ],
    trace: {
      mode: "flow",
      caption:
        "Capture is the user's only job. Everything right of the inbox is chained model work writing structured results back into a relational model the interface reads directly.",
      sequence: ["capture", "organize", "schema", "planner", "summary", "ui"],
      nodes: [
        {
          id: "capture",
          label: "Inbox",
          sub: "unstructured capture",
          kind: "io",
          x: 7,
          y: 50,
          note: "Notes, tasks and ideas go in raw. No fields, no project picker, no priority dropdown — the sorting is what the product is supposed to remove.",
        },
        {
          id: "organize",
          label: "Auto-organize",
          sub: "single pass",
          kind: "model",
          x: 26,
          y: 50,
          note: "Classification and entity extraction in one pass, returning a project assignment, a priority and a confidence score.",
        },
        {
          id: "schema",
          label: "Typed write",
          sub: "7 tables · RLS",
          kind: "store",
          x: 45,
          y: 50,
          note: "The boundary where the real work sits. Free-text model output does not survive contact with typed columns, so the chain has to emit something the schema will accept.",
        },
        {
          id: "planner",
          label: "Daily plan",
          sub: "gather → reason",
          kind: "model",
          x: 66,
          y: 24,
          note: "A multi-step chain running sequential model calls inside a serverless function limit. Groq's speed is what makes three steps fit inside 30 seconds.",
        },
        {
          id: "summary",
          label: "Weekly summary",
          sub: "planned vs. actual",
          kind: "model",
          x: 66,
          y: 76,
          note: "A comparative chain over daily plans against completed items, producing narrative insight rather than a completion percentage.",
        },
        {
          id: "ui",
          label: "App surfaces",
          sub: "dashboard · insights",
          kind: "ui",
          x: 88,
          y: 50,
        },
      ],
      edges: [
        { from: "capture", to: "organize" },
        { from: "organize", to: "schema" },
        { from: "schema", to: "planner", kind: "branch" },
        { from: "schema", to: "summary", kind: "branch" },
        { from: "planner", to: "ui", kind: "branch" },
        { from: "summary", to: "ui", kind: "branch" },
      ],
    },
  },
];

export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);
