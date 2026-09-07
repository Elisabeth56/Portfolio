export type Principle = {
  index: string;
  title: string;
  body: string[];
  /** Where this came from. Keeps the principle attached to evidence. */
  evidence: { project: string; slug: string; note: string };
};

export const methodIntro = [
  "Every principle below came from something that went wrong. None of them are opinions I arrived at in the abstract, and I would not trust them if they were.",
];

export const principles: Principle[] = [
  {
    index: "01",
    title: "The expensive failures return an answer",
    body: [
      "The bugs I remember all have the same shape. Nothing throws. Nothing logs. The system returns something plausible and you carry on.",
      "Fixed-size chunking split a transaction table mid-row, so the model got an amount with no date attached and answered confidently. An environment variable set at runtime where Next.js needs it at build time made a frontend fall back silently to fixtures, and the application looked like it was working. A Tailwind v4 migration compiled cleanly and simply did not apply any styles.",
      "So I have stopped treating a green run as evidence. The question is not whether it completed. It is whether I can name what it would look like if it were quietly wrong.",
    ],
    evidence: {
      project: "FinSight",
      slug: "finsight",
      note: "Semantic chunking around section headers, row boundaries as hard splits",
    },
  },
  {
    index: "02",
    title: "Set the gate before you run the test",
    body: [
      "I wanted Pidgin voice input in FarmTwin more than any other feature in it. I am a native speaker and it is the language a large share of the users actually speak.",
      "I defined a 40% word error rate gate before I ran a single clip. Whisper base failed. The Nigerian-English fine-tune failed. The datasets that might have fixed it were gated or unpublished inside the sprint window. The feature shipped as English-only, labelled honestly in the interface.",
      "The gate existed precisely so that decision would be forced by data rather than by how badly I wanted the feature. A threshold you set afterwards is not a threshold.",
    ],
    evidence: {
      project: "FarmTwin",
      slug: "farmtwin",
      note: "ADR-011 — 15-clip evaluation, feature scoped to English",
    },
  },
  {
    index: "03",
    title: "Grade your own work down",
    body: [
      "My first benchmark pass scored the model I had chosen at 98.8. I had been generous on partial credit, in the direction that happened to suit me.",
      "I re-graded against a stricter reading of the same rubric and it came out at 87.6. That number is less flattering and considerably more useful.",
      "A benchmark you have quietly rigged tells you nothing. It only tells other people something, and briefly.",
    ],
    evidence: {
      project: "FarmTwin",
      slug: "farmtwin",
      note: "Qwen2.5-3B chosen over Llama-3.2-3B on citation fidelity, 83.5 to 72.9",
    },
  },
  {
    index: "04",
    title: "Name the cost of the call",
    body: [
      "I categorize transactions with a model and no rule table. The honest description of that is a permanent per-upload token cost traded against zero rule maintenance.",
      "I could describe it as the elegant choice and leave the sentence there. It would read better and mean less.",
      "Every architectural decision I am confident about, I can state what it costs. The ones I cannot state a cost for are usually the ones I have not thought about hard enough.",
    ],
    evidence: {
      project: "FinSight",
      slug: "finsight",
      note: "Model-only categorization, 40-transaction batching",
    },
  },
  {
    index: "05",
    title: "Put the guarantee in the system, not the code path",
    body: [
      "Per-user isolation lives in row-level security policies in the database. It does not live in a middleware function that a future endpoint might forget to call.",
      "Approval checkpoints reconstruct their context from persisted output rather than holding it in memory, so a paused run survives a restart. A gate that evaporates on redeploy was never a gate.",
      "The pattern is the same each time: move the guarantee somewhere it cannot be skipped by someone who is in a hurry, including me.",
    ],
    evidence: {
      project: "Atlas AI",
      slug: "atlas-ai",
      note: "Three resumable phases rebuilt from agent_runs.output_json",
    },
  },
  {
    index: "06",
    title: "Patch what works",
    body: [
      "Across three versions of PrismOS, every capability added after v1.0 went in as an incremental patch against working architecture. Agent 0, the designer role, project memory, feature classification. Several proposed rebuilds were rejected.",
      "Auth, rate limiting and webhooks were cut and written down as deferred, rather than half-built and left looking finished.",
      "A rewrite is the most expensive way to avoid understanding the thing you already have.",
    ],
    evidence: {
      project: "PrismOS",
      slug: "prismos",
      note: "Versioned blueprint as single source of truth, v1.0 through v1.2",
    },
  },
  {
    index: "07",
    title: "Build for the market you are actually in",
    body: [
      "Stripe does not serve Nigerian payment rails, so FlowMind and FinSight run on Paystack, and the migration touched the schema, the status enum, webhook verification and the whole billing interface. It was not a client library swap.",
      "FarmTwin runs with the network unplugged on a 2014 laptop because that is the hardware and the connectivity the farms actually have. FinSight parses statements because bank-linking APIs do not cover Nigerian banks at all.",
      "None of this is a constraint I am working around. It is the specification.",
    ],
    evidence: {
      project: "FlowMind",
      slug: "flowmind",
      note: "Paystack migration, NGN and USD pricing",
    },
  },
];
