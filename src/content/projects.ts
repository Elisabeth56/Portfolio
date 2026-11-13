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
  /** On a `gated` trace, the button that lets the run past this gate. */
  action?: string;
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
  /** The node that carries the project's argument; its system card leads with it. */
  focus?: string;
  /** A fork the visitor chooses: each option keeps one node and skips the others. */
  branch?: { label: string; options: { node: string; label: string }[] };
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
  /** A screenshot of the product at `/img/work/<slug>.webp`. */
  shot: { width: number; height: number; alt: string };
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
      "Describe a feature for your repo. Three critics review the plan, real disagreements get settled, and you approve one pull request.",
    role: "Product, architecture and design",
    roleNote:
      "I built the hackathon version, audited it, and rebuilt it as a product in four days on free tiers: the pipeline and its conflict rule, the Postgres queue, the GitHub App access model, the web app and its design system, and the eval.",
    links: { live: "https://prism-os-jade.vercel.app", repo: "https://github.com/Elisabeth56/PrismOS" },
    shot: { width: 2400, height: 1500, alt: "The PrismOS landing page, headed “One request in. One reviewed pull request out.”" },
    problem: [
      "Asking a model for a feature gets you code that skips the part a reviewer would catch: where the change belongs, how it can be abused, what the user sees when it fails.",
      "Running several agents usually does not help either, because each gives its own opinion on its own text and nobody resolves anything. And once the code is written, turning it into a pull request is still your job.",
    ],
    stakes:
      "The first version, built for a hackathon, had eight agents with job titles and looked impressive in a demo. When I audited it, most of it was theatre: the agents never read the user's code, the prompts forced every agent to object, runs lived in memory, and the output was a zip file. I rebuilt it into something I would let touch my own repos.",
    built: [
      "Install the GitHub App on the repos you choose and describe a feature. PrismOS reads the repo, picks the files the change touches and writes a numbered spec. Architect, Security/QA and UX critics object to specific items, with a severity and a fix.",
      "Only real disagreements become conflicts, and a resolver rules on each one. Then it writes the change, checks it against the spec, revises once if needed and waits for you. Approving opens one pull request whose body carries the spec, the decisions and the verdict. Every step streams to the run page, and a run survives a refresh or a server restart.",
    ],
    architecture: [
      "A Next.js app on Vercel talks to a FastAPI service on Render. Creating a run only inserts a row and returns 202. A worker in the same process claims it with FOR UPDATE SKIP LOCKED, keeps a heartbeat, and a reaper requeues runs whose worker died.",
      "The LangGraph pipeline goes read repo, select files, plan, three critics in parallel, triage, resolve only when there are conflicts, build, verify. Each model call's output is cached per step, so a retried run resumes where it failed.",
      "Each step appends to an ordered events table. The browser replays what it missed, then follows new rows over Supabase Realtime. Approving commits through the Git Data API with no clone and opens the pull request idempotently.",
    ],
    decisions: [
      {
        title: "Conflicts are found in code",
        body: "A small pure function decides what counts as a conflict: two critics objecting to the same spec item, or one blocking objection. Everything else is a note the builder applies. Because the rule is code, every branch of it has a unit test, and the critics no longer argue for the sake of it. On the first live run they raised notes and no conflicts, which was the honest answer for a small change.",
      },
      {
        title: "Postgres is the queue, the log and the cache",
        body: "Exactly-once claims, heartbeats, a reaper, resumable steps and an ordered event stream, with no extra service to host. The tests caught a real race: the three critics write events at the same instant and their sequence numbers collided, which a per-run advisory lock fixed.",
      },
      {
        title: "Repo access that GitHub has to confirm",
        body: "The user's OAuth token would have been faster, but it grants write access to every repo they can reach. The GitHub App gets per-repo access the owner can revoke, with a one-hour token minted per operation. Installation ids are small integers, so the API only attaches an installation that GitHub lists when asked with the user's own token.",
      },
      {
        title: "The bugs only production found",
        body: "Every unit test passed and the first real sign-in still failed. The app needed permission to read email addresses, Supabase dropped the GitHub token after an hour, and the first runs stopped at planning because the Gemini model I had configured was deprecated. My fallback chain only handled rate limits, so a refusal skipped it. Now any refusal falls through to the next provider, and the run page shows each provider's reason.",
      },
      {
        title: "The eval gave an answer I did not want",
        body: "On six requests against a 14-file API, the pipeline and a single prompt that sees every file both pass 17 of 18 acceptance checks. The critics settle real conflicts and the verifier agreed with the checks every time, but on a repo that small they do not change the result.",
        cost: "The pipeline uses about 3.5 times the tokens of a single prompt. Harder cases, with larger repos and security traps, are next.",
      },
    ],
    stack: [
      { group: "Web", items: ["Next.js 16", "React 19", "Tailwind v4"] },
      { group: "API", items: ["FastAPI", "Python 3.12", "psycopg 3", "LangGraph"] },
      { group: "Data", items: ["Supabase Postgres", "Row-level security", "Realtime", "GitHub auth"] },
      { group: "Models", items: ["Gemini Flash", "Groq", "fallback chain"] },
      { group: "Infra", items: ["Vercel", "Render", "Docker", "GitHub Actions"] },
    ],
    demonstrates: [
      "Multi-agent review where conflict is decided by tested code",
      "A durable run queue built on Postgres alone",
      "Least-privilege repo access through a GitHub App",
      "Runs that stream live and resume after a crash",
      "An eval reported honestly when it does not flatter the design",
    ],
    trace: {
      mode: "debate",
      focus: "triage",
      caption:
        "Three critics review the same numbered spec in parallel. Code, not a prompt, decides which objections are real conflicts.",
      sequence: ["read", "plan", "critics", "triage", "resolve", "build", "verify", "pr"],
      nodes: [
        {
          id: "read",
          label: "Read repo",
          sub: "GitHub App · select files",
          kind: "io",
          x: 7,
          y: 50,
          note: "Reads the repo through a GitHub App installed only where the owner allows it, then picks the files the change touches.",
        },
        {
          id: "plan",
          label: "Plan",
          sub: "numbered spec",
          kind: "model",
          x: 21,
          y: 50,
          note: "One spec with numbered items, so every objection can point at the exact item it disagrees with.",
        },
        {
          id: "architect",
          label: "Architect",
          sub: "critic",
          kind: "agent",
          x: 36,
          y: 16,
          note: "Objects to where the change belongs and how it fits the code that is already there.",
        },
        {
          id: "security",
          label: "Security/QA",
          sub: "critic",
          kind: "agent",
          x: 36,
          y: 50,
          note: "Objects to how the change can be abused or break. A blocking objection is a conflict on its own.",
        },
        {
          id: "ux",
          label: "UX",
          sub: "critic",
          kind: "agent",
          x: 36,
          y: 84,
          note: "Objects to what the user sees, especially when something fails.",
        },
        {
          id: "triage",
          label: "Triage",
          sub: "rule in code",
          kind: "gate",
          x: 51,
          y: 50,
          note: "Two critics on the same item, or one blocking objection, is a conflict. Everything else becomes a note. The rule is a pure function with full unit tests.",
        },
        {
          id: "resolve",
          label: "Resolve",
          sub: "only on conflicts",
          kind: "model",
          x: 64,
          y: 20,
          note: "Returns exactly one decision per conflict, with a reason, or gets one correction and then fails.",
        },
        {
          id: "build",
          label: "Build",
          sub: "writes the change",
          kind: "compute",
          x: 67,
          y: 62,
          note: "Writes the change against the spec, the notes and the rulings.",
        },
        {
          id: "verify",
          label: "Verify",
          sub: "against the spec",
          kind: "gate",
          x: 81,
          y: 62,
          note: "Checks the change against the spec and can send it back once. There is no second loop.",
        },
        {
          id: "pr",
          label: "Pull request",
          sub: "after your approval",
          kind: "io",
          x: 94,
          y: 50,
          note: "Nothing reaches GitHub until you approve. Then it commits on a new branch and opens one pull request, idempotently.",
        },
      ],
      edges: [
        { from: "read", to: "plan" },
        { from: "plan", to: "architect", kind: "branch" },
        { from: "plan", to: "security", kind: "branch" },
        { from: "plan", to: "ux", kind: "branch" },
        { from: "architect", to: "triage", kind: "branch" },
        { from: "security", to: "triage", kind: "branch" },
        { from: "ux", to: "triage", kind: "branch" },
        { from: "triage", to: "resolve", kind: "branch" },
        { from: "triage", to: "build" },
        { from: "resolve", to: "build", kind: "branch" },
        { from: "build", to: "verify" },
        { from: "verify", to: "build", kind: "loop", label: "1 revision max" },
        { from: "verify", to: "pr" },
      ],
    },
  },

  /* ====================================================================== */
  {
    slug: "atlas-ai",
    index: "02",
    name: "Atlas",
    kind: "Data engineering agents",
    period: "2026",
    status: "Live",
    tagline:
      "Ask for a pipeline and get dbt models, tests and docs written against the real columns in your DataHub catalog, checked by code before anything is written back.",
    role: "Sole architect and engineer",
    links: { live: "https://atlas-ai-taupe.vercel.app", repo: "https://github.com/Elisabeth56/Atlas-AI" },
    shot: { width: 2400, height: 1500, alt: "The Atlas landing page, headed “Ask for a pipeline. Get dbt you can check.”" },
    problem: [
      "A language model will write a dbt model for any request. It will also invent a country column that no source has, pass a customer's email straight through to a mart, and sound equally sure either way.",
      "A data engineer then has to read every line to find out which parts are real, and that review takes longer than writing the model by hand.",
    ],
    stakes:
      "Most organisations already know what is real. DataHub holds the schemas, the lineage and the PII tags. The work is getting the model to build from that catalog, and having something other than the model check the result.",
    built: [
      "Atlas searches DataHub for datasets that match the request and shows what it found, with PII columns marked. Nothing is generated until you keep the sources or start fresh.",
      "Then it writes a full dbt change: staging models, a mart, tests and a data dictionary. QA resolves every column back to a catalog table, and unknown columns or unmasked PII block the run, usually with a one-line fix to apply and re-check. Docs and lineage go back to DataHub only after a second approval.",
    ],
    architecture: [
      "A Next.js app on Vercel, a FastAPI service on Render that also runs the worker, and Supabase for Postgres, auth and realtime. Creating a run stores it with a phase. A worker claims it with FOR UPDATE SKIP LOCKED and holds a 60-second lease, so a crashed run resumes from its last finished step.",
      "Each approval queues the next phase. The browser never holds a socket to the API: Supabase Realtime says a row changed, and the page refetches the run.",
      "DataHub is reached through its MCP server. Without a DataHub URL, a seeded sample catalog stands in, which is what the live demo uses.",
    ],
    decisions: [
      {
        title: "QA is deterministic code",
        body: "A model judge can pass a file on one run and fail it on the next. QA parses every model with sqlglot and resolves each column through CTEs and aliases back to the catalog, the same way every time, so a verdict can be tested and trusted.",
      },
      {
        title: "Runs are rows, claimed with a lease",
        body: "FastAPI's background tasks die with the process, and the free host restarts often. A run is a row with a phase, and the lease means a crash costs a step, never the run. A queue service would have been a second thing to host for no gain at this volume.",
      },
      {
        title: "Grounding, measured",
        body: "The eval runs 26 requests, including ones that ask for columns that do not exist, invite a PII leak or cannot be answered. Grounded in the catalog, 16.7% of runs used a column the catalog does not have. Started fresh, 96.2% did. No unanswerable request was matched to a source.",
        cost: "Grounded runs still tried to pass personal data through 79% of the time, because they work with real tables that hold it. The masking check in QA is what makes those runs safe.",
      },
      {
        title: "Two free providers and no framework",
        body: "The pipeline is four fixed calls with structured output. A provider chain over Groq and Gemini, with fallback on 429s, 5xx errors and timeouts, is about 200 lines on one httpx client, and every call is logged with tokens, latency and outcome.",
      },
      {
        title: "Saying what the demo runs on",
        body: "DataHub needs more memory than any free host offers, so the live demo uses the sample catalog and the README says so. Screenshots from a live DataHub show the tool schemas and a search through MCP.",
      },
    ],
    stack: [
      { group: "Web", items: ["Next.js 16", "React 19", "Tailwind v4"] },
      { group: "API", items: ["FastAPI", "async SQLAlchemy", "asyncpg", "sqlglot"] },
      { group: "Data", items: ["Supabase Postgres", "Row-level security", "Realtime"] },
      { group: "AI", items: ["Groq gpt-oss-120b", "Gemini Flash-Lite", "provider chain"] },
      { group: "Catalog", items: ["DataHub", "mcp-server-datahub", "sample catalog"] },
      { group: "Infra", items: ["Vercel", "Render", "Docker", "GitHub Actions"] },
    ],
    demonstrates: [
      "Generation grounded in an organisation's own catalog",
      "QA by static analysis, so verdicts are reproducible",
      "Human approval gates that survive a restart",
      "An eval that measures invented columns and PII leaks",
      "Free-tier hosting split by what each host does best",
    ],
    trace: {
      mode: "gated",
      focus: "gate1",
      caption:
        "Two checkpoints are real. Atlas writes nothing until you keep the sources it found, and touches the catalog only after you approve writeback. Approve them to continue.",
      sequence: ["planner", "metadata", "gate1", "engineer", "qa", "docs", "gate2", "writeback"],
      nodes: [
        {
          id: "planner",
          label: "Planner",
          sub: "request → plan",
          kind: "agent",
          x: 6.5,
          y: 50,
          note: "Turns the request into the plan the other steps follow.",
        },
        {
          id: "metadata",
          label: "Metadata analyst",
          sub: "DataHub search",
          kind: "agent",
          x: 19,
          y: 50,
          note: "Searches DataHub for datasets that match the request and returns their real schemas, with PII columns marked.",
        },
        {
          id: "gate1",
          label: "Keep sources",
          sub: "your approval",
          kind: "gate",
          action: "Keep sources",
          x: 31.5,
          y: 50,
          note: "The run stops here. You see exactly which datasets matched and either keep them or start fresh, before a line of SQL exists.",
        },
        {
          id: "engineer",
          label: "Data engineer",
          sub: "dbt models · tests",
          kind: "agent",
          x: 44,
          y: 50,
          note: "Writes staging models, a mart, tests and a data dictionary, built from the schemas DataHub returned.",
        },
        {
          id: "qa",
          label: "QA",
          sub: "sqlglot · columns · PII",
          kind: "compute",
          x: 56.5,
          y: 50,
          note: "Code, not a model. Every column is resolved back to a catalog table. Unknown columns and unmasked PII are critical and lock writeback until fixed.",
        },
        {
          id: "docs",
          label: "Documentation",
          sub: "models · columns",
          kind: "agent",
          x: 69,
          y: 50,
        },
        {
          id: "gate2",
          label: "Writeback",
          sub: "your approval",
          kind: "gate",
          action: "Approve writeback",
          x: 81.5,
          y: 50,
          note: "Allowed only when QA has nothing critical. Nothing reaches the catalog without it.",
        },
        {
          id: "writeback",
          label: "DataHub",
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
    kind: "Personal finance · SaaS",
    period: "2025 — 2026",
    status: "Live",
    tagline:
      "Reads the PDF or CSV statement a Nigerian bank or OPay wallet already gives you, sorts every line and answers questions about your money with exact figures.",
    role: "Sole engineer",
    roleNote:
      "Architecture, parsing, the AI pipeline and its evals, payments, the design and the deployment.",
    links: { live: "https://finsight-red-two.vercel.app", repo: "https://github.com/Elisabeth56/FinSight" },
    shot: { width: 2400, height: 1500, alt: "The FinSight landing page, headed “Your bank statement, read properly,” beside a sorted statement." },
    problem: [
      "Budgeting apps in other markets connect to banks through services like Plaid. Almost nothing like that works in Nigeria, so those apps never reach the people who would use them.",
      "Everyone does have a statement export, but it is written for the bank's systems. A line like TRF/NIP/FBN/OKONKWO C/09203941 tells you very little about where the month went.",
    ],
    stakes:
      "Money has to be exact: a chat answer that is off by ₦2,000 is worse than no answer. And it had to run on free tiers only, after the first version's free database paused and was deleted with the schema in it.",
    built: [
      "Upload a CSV or a PDF, including OPay's layout where narrations wrap across lines. FinSight sorts every line into twelve plain categories, gives it a readable name, and marks a charge far above your usual for that category.",
      "The overview shows the month and six months side by side. Ask a question like how much went on Bolt in the last three months, and the answer links to the rows behind it. Pro adds a savings report, sold as a one-time pass in NGN or USD through Paystack.",
    ],
    architecture: [
      "Next.js and FastAPI both on Vercel, with /api rewritten to the FastAPI deployment so the browser has one origin and no CORS. Neon Postgres in Frankfurt, plain SQL scoped by user.",
      "An upload parses the file with pandas or pdfplumber, dedupes narrations, categorizes the unique ones in batches, flags anomalies against 90 days of history, and inserts everything in one transaction.",
      "In chat, a small model turns the question into filters. SQL computes the totals and fetches the matching rows, and the answer model streams over SSE using only those numbers.",
    ],
    decisions: [
      {
        title: "The model never adds anything up",
        body: "The old chat sent rows to the model and let it total them, and it was wrong often enough that I stopped trusting it. Now the model picks filters and words, and every figure comes from SQL. That turned a vague quality problem into two checkable ones: did it pick the right filters, and did it repeat the numbers it was given.",
      },
      {
        title: "Dedupe before categorizing",
        body: "Nigerian statements repeat themselves: Bolt rides, airtime, the same POS terminal. Normalizing narrations and sending only the unique ones cuts model calls by about two thirds, which keeps a 600-row statement inside Groq's free per-minute limit.",
      },
      {
        title: "Integer kobo, totals per currency",
        body: "The original schema stored amounts as text and added naira to dollars. Amounts are now signed bigint minor units, and every summary groups by currency.",
      },
      {
        title: "A fallback chain can hide an outage",
        body: "Groq retired both Llama models the app used, and every request quietly moved to Gemini while the screen looked fine. Running the eval with Groq alone showed it at once. Provider changes now get an eval run with the fallback switched off.",
      },
      {
        title: "One-time passes instead of subscriptions",
        body: "Recurring billing meant webhooks, renewals and a plan flag nothing reset. A pass extends pro_until, verifying a reference twice does nothing, and expiry needs no cron.",
        cost: "No recurring revenue. A returning user buys another pass.",
      },
    ],
    stack: [
      { group: "Web", items: ["Next.js 16", "React 19", "Tailwind v4", "Motion"] },
      { group: "API", items: ["FastAPI", "Python 3.12", "pandas", "pdfplumber"] },
      { group: "Data", items: ["Neon Postgres", "psycopg 3", "SQL migrations"] },
      { group: "AI", items: ["Groq gpt-oss-120b", "gpt-oss-20b", "Gemini fallback"] },
      { group: "Payments", items: ["Paystack", "NGN + USD"] },
      { group: "Infra", items: ["Vercel", "GitHub Actions"] },
    ],
    demonstrates: [
      "Structured data from documents written for a bank's systems",
      "Answers about money where every figure comes from SQL",
      "Model cost kept inside a free tier by design",
      "Evals that caught an outage a fallback had hidden",
      "Built for a market bank-linking APIs do not reach",
    ],
    trace: {
      mode: "flow",
      focus: "sql",
      branch: {
        label: "Statement type",
        options: [
          { node: "csv", label: "CSV" },
          { node: "pdf", label: "PDF" },
        ],
      },
      caption:
        "From a statement to an answer. The model categorizes and words things, and SQL produces every number you see.",
      sequence: ["upload", "csv", "pdf", "categorize", "store", "intent", "sql", "answer"],
      nodes: [
        {
          id: "upload",
          label: "Upload",
          sub: "PDF or CSV",
          kind: "io",
          x: 6,
          y: 50,
          note: "No bank login. The statement the bank already gives you is the input.",
        },
        {
          id: "csv",
          label: "CSV parse",
          sub: "pandas",
          kind: "compute",
          x: 20,
          y: 22,
          note: "Column names differ between banks, so they are mapped to one schema first.",
        },
        {
          id: "pdf",
          label: "PDF parse",
          sub: "pdfplumber",
          kind: "compute",
          x: 20,
          y: 78,
          note: "Handles OPay's layout, where one narration wraps across several lines.",
        },
        {
          id: "categorize",
          label: "Categorize",
          sub: "unique lines · Groq",
          kind: "model",
          x: 35,
          y: 50,
          note: "Only unique narrations are sent, in batches, and the results are mapped back to every row. That cuts calls by about two thirds. Output is validated, retried once, and falls back to Other instead of failing the upload.",
        },
        {
          id: "store",
          label: "Store",
          sub: "kobo · one transaction",
          kind: "store",
          x: 50,
          y: 50,
          note: "Anomalies are flagged against 90 days of history, and everything is inserted in one transaction as signed integer kobo.",
        },
        {
          id: "intent",
          label: "Question",
          sub: "→ filters",
          kind: "model",
          x: 64,
          y: 50,
          note: "A small model turns the question into a date range, a category and a merchant. It never sees a total.",
        },
        {
          id: "sql",
          label: "SQL totals",
          sub: "scoped by user",
          kind: "store",
          x: 78,
          y: 50,
          note: "The database adds up the money and fetches the matching rows. 29 of 30 eval questions come back with the exact figure, including 5 it should decline.",
        },
        {
          id: "answer",
          label: "Answer",
          sub: "SSE · source chips",
          kind: "io",
          x: 93,
          y: 50,
          note: "The answer model may only repeat the numbers it was given, and the stream ends with chips that open the rows behind the answer.",
        },
      ],
      edges: [
        { from: "upload", to: "csv", kind: "branch" },
        { from: "upload", to: "pdf", kind: "branch" },
        { from: "csv", to: "categorize" },
        { from: "pdf", to: "categorize" },
        { from: "categorize", to: "store" },
        { from: "store", to: "intent" },
        { from: "intent", to: "sql" },
        { from: "sql", to: "answer" },
      ],
    },
  },

  /* ====================================================================== */
  {
    slug: "farmtwin",
    index: "04",
    name: "FarmTwin",
    kind: "Offline-first local inference",
    period: "2026",
    status: "Submitted",
    tagline:
      "A desktop app that keeps a record of each farm, works out crop stage and risk, and answers from extension guides with a model that runs on the laptop, without internet.",
    role: "Sole developer",
    roleNote:
      "Built the first version in seven days for the Africa Deep Tech Challenge 2026, then rebuilt it as something a farmer could install: the rules engine, retrieval and its eval set, the desktop packaging, the 3D farm and the website.",
    links: { live: "https://farmtwin-beta.vercel.app", repo: "https://github.com/Elisabeth56/FarmTwin" },
    shot: { width: 2400, height: 1767, alt: "The FarmTwin landing page, with a 3D model of a small farm above the headline “Your farm, on your laptop.”" },
    problem: [
      "An extension officer looks after many farms. The guidance they rely on sits in long PDFs from IITA, ICRISAT and others, and it is written for a crop, not for a farm.",
      "Watch for fungal disease after heavy rain is only useful if someone notices that this field had 65 mm of rain on Tuesday and the maize is six weeks old. Chat assistants that could do that need a data connection and a paid API, which many farmers and officers do not have reliably.",
    ],
    stakes:
      "No internet at the point of use, 8 GB of RAM and no GPU, no budget, and advice that has to be traceable. A wrong spraying recommendation costs a harvest, so every answer cites its sources and the app says when the guides do not cover a question.",
    built: [
      "A twin of every farm: fields, plantings including intercropping, rain, humidity, pests and notes, for maize, cassava, yam, sorghum, rice and cowpea. Log 65 mm of rain on young maize and the fungal-risk card appears with the rule that fired.",
      "Ask what to do this week and the answer uses the farm's stages, recent logs and open risks, with citations, in English or Pidgin in and English out. The farm screen draws the farm's own plots in 3D, with rain and the top risk on it. Installers build for Windows, Mac and Linux.",
    ],
    architecture: [
      "A Tauri shell starts a FastAPI backend, frozen with PyInstaller so the laptop needs no Python. The API starts llama-server with Qwen2.5-3B and restarts it if it dies.",
      "Farm data, the vector index and full-text search live in one SQLite file, using sqlite-vec and FTS5. Retrieval merges both with reciprocal rank fusion, filtered to the farm's crops.",
      "The 2.1 GB model is downloaded once, resuming where it stopped, or imported from a flash drive. Both paths check its SHA-256 before it is used.",
    ],
    decisions: [
      {
        title: "Rules decide, the model explains",
        body: "Crop calendars and risk rules are YAML files, each threshold naming its source. Python evaluates them on every log, and the model gets the results as facts to explain. Risk cards are reproducible and unit-tested, and the model never does date arithmetic.",
      },
      {
        title: "A cutoff instead of always answering",
        body: "I built a 51-question golden set, including questions the guides cannot answer. Answerable questions found a passage at distance 0.63 on average and unanswerable ones at 0.87, so anything beyond 0.78 gets a not-in-my-guides answer. The right source is in the top six for every question in the set.",
      },
      {
        title: "One file, one process tree",
        body: "A separate vector database would be a second process to ship and keep in sync on a laptop with 8 GB of RAM. Owning llama-server from the API meant the model-stopped screen and its Restart button work the same in development and in the installed app, and are covered by tests.",
      },
      {
        title: "Silent failures were the expensive ones",
        body: "Two corpus passages had a stray colon in their frontmatter, and the parser skipped them without a word, so search quietly knew less. The parser now fails loudly, and the eval set tells me whether a corpus change helped or hurt.",
        cost: "Answer quality, speed and memory for the rebuilt version still need a run on the target laptop. The 87.6 out of 100 and 3.06 GB peak come from the maize-only hackathon build.",
      },
    ],
    stack: [
      { group: "Desktop", items: ["Tauri v2", "PyInstaller", "React 19", "Vite", "Three.js"] },
      { group: "Backend", items: ["FastAPI", "SQLAlchemy 2", "Alembic"] },
      { group: "Retrieval", items: ["SQLite", "sqlite-vec", "FTS5", "bge-small-en-v1.5"] },
      { group: "Inference", items: ["llama.cpp", "Qwen2.5-3B Q4_K_M", "whisper.cpp"] },
      { group: "Website", items: ["Astro", "Starlight", "Vercel"] },
    ],
    demonstrates: [
      "Local inference on an 8 GB laptop with no network",
      "Rules as data, so the risky numbers never come from a model",
      "Retrieval that can say the guides do not cover a question",
      "A desktop app that ships and supervises its own model",
      "Hybrid search in a single SQLite file",
    ],
    trace: {
      mode: "offline",
      focus: "cutoff",
      caption:
        "Everything inside the boundary runs on the laptop. Cut the network and nothing changes. Try the switch.",
      sequence: ["log", "rules", "question", "retrieve", "cutoff", "qwen", "answer"],
      nodes: [
        {
          id: "log",
          label: "Log",
          sub: "rain · pests · notes",
          kind: "io",
          x: 7,
          y: 24,
          note: "Observations are logged per field. Each one recomputes every planting's stage and risks.",
        },
        {
          id: "rules",
          label: "Rules engine",
          sub: "YAML · sourced",
          kind: "compute",
          x: 26,
          y: 24,
          note: "Stages and risks are computed in Python from rule files, each threshold naming its source. No model is involved.",
        },
        {
          id: "question",
          label: "Question",
          sub: "English or Pidgin",
          kind: "io",
          x: 7,
          y: 76,
        },
        {
          id: "retrieve",
          label: "Retrieve",
          sub: "sqlite-vec + FTS5",
          kind: "store",
          x: 26,
          y: 76,
          note: "Vector search for meaning and full-text search for exact pest and variety names, merged with reciprocal rank fusion and filtered to the farm's crops.",
        },
        {
          id: "cutoff",
          label: "Cutoff",
          sub: "0.78",
          kind: "gate",
          x: 45,
          y: 76,
          note: "If the closest passage is too far away, the app says the guides do not cover the question instead of guessing.",
        },
        {
          id: "qwen",
          label: "Qwen2.5-3B",
          sub: "llama.cpp · Q4_K_M",
          kind: "model",
          x: 66,
          y: 50,
          note: "Gets the farm state, the open risks and the numbered passages, and explains them.",
        },
        {
          id: "answer",
          label: "Answer",
          sub: "streamed · cited",
          kind: "io",
          x: 88,
          y: 50,
          note: "Citations that do not match a retrieved passage are dropped before the answer is shown.",
        },
      ],
      edges: [
        { from: "log", to: "rules" },
        { from: "rules", to: "qwen" },
        { from: "question", to: "retrieve" },
        { from: "retrieve", to: "cutoff" },
        { from: "cutoff", to: "qwen" },
        { from: "qwen", to: "answer" },
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
      "A second brain for people with too many inputs: it files what you drop in, plans your day and answers from your own notes.",
    role: "Architect and product owner",
    roleNote:
      "Defined the product, chose the stack and made the consequential calls, including moving plan and quota into tables only the server can write after finding that any user could make themselves Pro.",
    links: { live: "https://flowmind-sage.vercel.app", repo: "https://github.com/Elisabeth56/FlowMind" },
    shot: { width: 2400, height: 1500, alt: "The FlowMind landing page, headed “Put it down. We’ll sort it.”" },
    problem: [
      "Things to do arrive all day, in no order: a client asks for something on a call, a link looks worth reading, an idea turns up on the bus.",
      "Writing them down is easy. Sorting them, deciding what today is for, and finding one of them again three weeks later is the work that does not get done.",
    ],
    stakes:
      "Filing, prioritising and finding are things a language model does well, so this is a rare case where the model removes work. It only helps if saving never waits on it, and if what it says can be traced back to your own notes.",
    built: [
      "One inbox for tasks, notes, links and half-ideas. Each item gets a kind, a priority, a due date if it has one, tags and a project, and every field can be changed with a click.",
      "Today is a short plan with a reason for each step. Ask answers from your own items with the notes it used linked beside it, and says so when the answer is not there. A weekly reflection compares what was planned with what got done. Around that: email and Google sign-in, 50 free AI actions a month and Pro through Paystack in naira.",
    ],
    architecture: [
      "The browser writes an item straight to Supabase Postgres, where row-level security limits every table to its owner, so it appears at once. Filing happens afterwards, in a route that checks the quota, makes one structured call and writes the fields back.",
      "Ask embeds the question with gte-small in a Supabase Edge Function, then one SQL function merges nearest embeddings with keyword matches under the same row-level security as everything else.",
      "Every model call is logged with its provider, model, prompt version, tokens and latency. The free plan's quota is a count of those rows.",
    ],
    decisions: [
      {
        title: "Billing and quota belong to the server",
        body: "The first version let any signed-in user set their own plan to Pro from the browser, because the plan lived in a row they could update. Plan and usage now sit in tables only the service role can write, with database tests that try the attack.",
      },
      {
        title: "One small AI module, no framework",
        body: "Each feature is a single structured call, so LangChain came out. One module handles validated output, streaming, provider fallback from Groq to Gemini, timeouts and a log row per attempt. When nothing answers, capture still saves and the daily plan is built by rule and says so.",
      },
      {
        title: "The model never produces a number",
        body: "Counts, rates and trends are computed in SQL and handed to the model to write about. The weekly focus score the old version asked the model to invent is gone, and a plan step that is not one of the items it was given is rejected.",
      },
      {
        title: "Retrieval inside Postgres",
        body: "Items are short, so one item is one chunk. pgvector and full-text search live in the same database as the notes, so hybrid search runs under the same access rules. A separate vector store would have meant a second copy of private notes.",
        cost: "Measured on one seeded account of 48 items, where recall is 1.00 with or without hybrid search. A larger, messier set is the next thing to measure.",
      },
    ],
    stack: [
      { group: "Web", items: ["Next.js 15", "React 19", "Tailwind v4"] },
      { group: "Data", items: ["Supabase Postgres", "Row-level security", "pgvector", "Realtime", "pgTAP"] },
      { group: "AI", items: ["Vercel AI SDK", "Groq gpt-oss-20b / 120b", "Gemini fallback", "gte-small"] },
      { group: "Payments", items: ["Paystack", "signed webhooks"] },
      { group: "Infra", items: ["Vercel", "nightly cron", "GitHub Actions"] },
    ],
    demonstrates: [
      "Structured model output that a relational schema accepts",
      "Hybrid retrieval with citations, under the same access rules as the data",
      "Billing and quota that the browser cannot change",
      "Graceful degradation when every provider is down",
      "Evals per feature, with latency and token cost",
    ],
    trace: {
      mode: "flow",
      focus: "organize",
      caption:
        "Capture is the only thing you have to do. Filing, planning and answering read from the same rows, under the same access rules.",
      sequence: ["capture", "organize", "store", "plan", "search", "answer"],
      nodes: [
        {
          id: "capture",
          label: "Inbox",
          sub: "saved at once",
          kind: "io",
          x: 7,
          y: 50,
          note: "The item goes straight into Postgres. Saving never waits on a model.",
        },
        {
          id: "organize",
          label: "Organize",
          sub: "gpt-oss-20b · zod",
          kind: "model",
          x: 24,
          y: 50,
          note: "One structured call returns kind, priority, due date, tags and project, validated against a schema. 100% on 40 eval cases for everything but the project, 92% on project.",
        },
        {
          id: "store",
          label: "Postgres",
          sub: "RLS · pgvector",
          kind: "store",
          x: 42,
          y: 50,
          note: "Every table is limited to its owner by row-level security, including the embeddings.",
        },
        {
          id: "plan",
          label: "Plan today",
          sub: "steps must be items",
          kind: "model",
          x: 62,
          y: 22,
          note: "SQL ranks the open items, the model writes the plan, and any step that is not one of the items it was given is rejected.",
        },
        {
          id: "search",
          label: "Hybrid search",
          sub: "embeddings + keywords",
          kind: "store",
          x: 62,
          y: 78,
          note: "One SQL function merges nearest embeddings with keyword matches and returns the top 8 items.",
        },
        {
          id: "answer",
          label: "Cited answer",
          sub: "or “not found”",
          kind: "io",
          x: 86,
          y: 78,
          note: "The model returns claims with source numbers, and code places the citations. It cited the right note on 32 of 32 eval questions and said not found on 8 of 8.",
        },
      ],
      edges: [
        { from: "capture", to: "organize" },
        { from: "organize", to: "store" },
        { from: "store", to: "plan", kind: "branch" },
        { from: "store", to: "search", kind: "branch" },
        { from: "search", to: "answer" },
      ],
    },
  },
  /* ====================================================================== */
  {
    slug: "itoms",
    index: "06",
    name: "ITOMS",
    kind: "Internal tool · AI-assisted",
    period: "2026",
    status: "Live",
    tagline:
      "An IT desk for a small office: problems reported in under a minute, one queue sorted by due time, and a history for every device.",
    role: "Sole developer",
    roleNote:
      "Designed it from an IT support internship, then built the schema, the Express API, the three role-based interfaces, the quick fix with its eval sets, the tests and CI, and the 13 decision records.",
    links: { live: "https://itoms.vercel.app", repo: "https://github.com/Elisabeth56/ITOMS" },
    shot: { width: 2400, height: 1500, alt: "The ITOMS landing page, headed “Every device, every fix, on record.”" },
    problem: [
      "During an IT support internship at a 50-person office in Lagos, requests arrived by walking over, a phone call or a WhatsApp message. Nothing recorded who asked, what was done or how long it took.",
      "Nobody could say which laptop someone held or what a printer had cost in repairs, and the same jammed printer came back every few weeks. Many requests also had a safe first step, like restarting the printer or rejoining the Wi-Fi, that the person could have tried while they waited.",
    ],
    stakes:
      "A small IT team loses its week to requests it cannot see or rank. The constraints were real: about 50 users, a few hundred tickets a year, free tiers only, and a build one person could finish and explain.",
    built: [
      "Employees report a problem in under a minute and follow it through four stages, confirming the fix themselves. Before filing they can ask for a quick fix: up to five safe steps, or a hand-over to IT.",
      "IT staff work one queue sorted by due time, entirely from the keyboard. Every laptop and printer carries an asset tag, a holder and its own repair history. Admins manage people, devices and change requests.",
    ],
    architecture: [
      "A Next.js web app calls an Express API that runs as one Vercel function. Supabase provides auth and Postgres, and a daily cron closes tickets nobody confirmed.",
      "The rules that must never break live in the database: a partial unique index allows one holder per device and one pending change request, a check constraint refuses a resolved ticket without a resolution, and a trigger keeps the activity trail append-only. The API checks the same rules so it can return clear messages.",
      "The quick fix is one prompt with a validated JSON answer, served by Groq with Gemini as the fallback. A filter strips forbidden steps the model still writes, and every suggestion is stored so IT sees what was tried.",
    ],
    decisions: [
      {
        title: "The database is the last line",
        body: "Tickets, people and devices are joined on almost every screen and every change writes a history row, so I chose Postgres and pushed the invariants into constraints, indexes and triggers. Putting the one-holder rule in a unique index removed a whole class of race conditions and made the tests simpler.",
      },
      {
        title: "Lock the row, or let the index refuse",
        body: "When two IT staff act on the same ticket, the API locks the row with FOR UPDATE inside a transaction, so the second one sees the first one's change. A duplicate insert has no row to lock yet, so a second change request for the same laptop is stopped by the unique index instead.",
      },
      {
        title: "Due times without a job queue",
        body: "Each priority has a due time, from 4 hours for urgent to 72 for low. A trigger sets it when a ticket is filed or re-prioritised, and lateness is computed in each query. There is no scheduler to keep in sync, which matters on a free plan where cron runs once a day.",
        cost: "Due times run on the wall clock, so a ticket filed on Friday evening is late by Monday morning.",
      },
      {
        title: "Measured before trusted",
        body: "I built a golden set of 32 cases and 15 unseen ones, and a GitHub workflow runs both on every prompt change and commits the results. The latest run made 31 of 32 and 14 of 15 correct hand-over decisions on Groq's free tier. I kept the single prompt over retrieval because tickets recorded no fix yet, so resolving a ticket now requires a resolution note to build that corpus.",
      },
      {
        title: "I corrected my own decision record",
        body: "One record said the daily cron kept the free database awake. During a rebuild I found the project paused, because the live API had never been given its database settings. I amended the record instead of deleting it.",
      },
    ],
    stack: [
      { group: "Web", items: ["Next.js 16", "React 19", "Tailwind 4"] },
      { group: "API", items: ["Express 5", "TypeScript", "zod", "pg"] },
      { group: "Data & auth", items: ["Supabase Postgres", "Supabase Auth", "triggers", "row locks"] },
      { group: "AI", items: ["Groq", "Gemini fallback", "eval sets"] },
      { group: "Quality", items: ["Vitest", "Supertest", "Playwright", "GitHub Actions"] },
      { group: "Hosting", items: ["Vercel", "daily cron"] },
    ],
    demonstrates: [
      "Invariants enforced in the database rather than trusted to application code",
      "Concurrency handled with row locks and unique indexes, each where it fits",
      "A small AI feature with a safety filter and an eval that runs on every change",
      "Interfaces shaped for three roles, including a keyboard-first queue",
      "A decision trail of 13 records, one of them corrected in public",
    ],
    trace: {
      mode: "flow",
      focus: "quickfix",
      branch: {
        label: "The quick fix decides",
        options: [
          { node: "steps", label: "Safe steps" },
          { node: "handover", label: "Hand over" },
        ],
      },
      caption:
        "One request, from the person with the problem to the history of the device. The quick fix either gives safe steps or hands over to IT, and either way IT sees what was tried.",
      sequence: ["report", "quickfix", "filter", "steps", "handover", "queue", "resolve"],
      nodes: [
        {
          id: "report",
          label: "Report",
          sub: "under a minute",
          kind: "io",
          x: 7,
          y: 50,
          note: "An employee picks a category and describes the problem. The device they hold is already linked, so they never type an asset number.",
        },
        {
          id: "quickfix",
          label: "Quick fix",
          sub: "Groq → Gemini",
          kind: "model",
          x: 24,
          y: 50,
          note: "One prompt with a validated JSON answer: up to five safe steps, or a hand-over for anything involving passwords, damage, security or several people. 31 of 32 golden cases and 14 of 15 unseen ones get the hand-over decision right.",
        },
        {
          id: "filter",
          label: "Safety filter",
          sub: "zod · unsafe steps cut",
          kind: "gate",
          x: 41,
          y: 50,
          note: "The answer has to parse against a schema, then a filter removes forbidden steps the model still writes. Every suggestion is stored with the ticket.",
        },
        {
          id: "steps",
          label: "Try the steps",
          sub: "employee",
          kind: "ui",
          x: 58,
          y: 26,
        },
        {
          id: "handover",
          label: "Hand over",
          sub: "straight to IT",
          kind: "io",
          x: 58,
          y: 74,
        },
        {
          id: "queue",
          label: "IT queue",
          sub: "sorted by due_at",
          kind: "store",
          x: 76,
          y: 50,
          note: "A trigger sets the due time from the priority, and lateness is computed in the query. IT staff move through it with J and K and act without the mouse.",
        },
        {
          id: "resolve",
          label: "Resolve",
          sub: "row lock · history",
          kind: "store",
          x: 92,
          y: 50,
          note: "The update runs under a row lock and writes an append-only history row, so the device keeps its record and two staff never overwrite each other.",
        },
      ],
      edges: [
        { from: "report", to: "quickfix" },
        { from: "quickfix", to: "filter" },
        { from: "filter", to: "steps", kind: "branch" },
        { from: "filter", to: "handover", kind: "branch" },
        { from: "steps", to: "queue", kind: "branch" },
        { from: "handover", to: "queue", kind: "branch" },
        { from: "queue", to: "resolve" },
      ],
    },
  },
];

export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);
