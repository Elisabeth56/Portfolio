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
      "Groq retired both models FinSight used, and every request moved quietly to the fallback while the screen looked fine. Two FarmTwin passages had a stray colon in their frontmatter, and the parser skipped them without a word, so search just knew less. An environment variable set at runtime where Next.js needs it at build time made a frontend fall back to fixtures, and the app looked like it was working.",
      "So I have stopped treating a green run as evidence. Before I trust a result, I try to name what it would look like if it were quietly wrong.",
    ],
    evidence: {
      project: "FinSight",
      slug: "finsight",
      note: "Provider changes now get an eval run with the fallback switched off",
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
      "PrismOS runs three critics, a resolver and a verifier on every request. On my own eval, against a 14-file API, that pipeline passed the same checks as a single prompt and used about 3.5 times the tokens.",
      "I could have called the critics what makes it reliable and left the sentence there. It would read better and mean less, so the README puts both numbers side by side.",
      "Every architectural decision I am confident about, I can state what it costs. The ones I cannot state a cost for are usually the ones I have not thought about hard enough.",
    ],
    evidence: {
      project: "PrismOS",
      slug: "prismos",
      note: "17 of 18 checks in both arms, 22,758 against 6,437 tokens per case",
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
      project: "Atlas",
      slug: "atlas-ai",
      note: "Runs claimed with a 60-second lease, resumed from the last finished step",
    },
  },
  {
    index: "06",
    title: "Decide where state lives first",
    body: [
      "The hackathon version of PrismOS had eight agents with job titles, and it demoed well. When I audited it afterwards, runs lived in memory, ownership was an anonymous ID in localStorage, the agents never read the user's code, and the prompts forced every agent to object.",
      "For the rebuild I designed the tables and the failure modes before writing a prompt. Postgres became the queue, the log and the step cache, with exactly-once claims, heartbeats and a reaper, so a run survives a deploy, a refresh and a crashed worker.",
      "Almost everything that was wrong came down to where state lived. The prompts were the easy part.",
    ],
    evidence: {
      project: "PrismOS",
      slug: "prismos",
      note: "Rebuilt in four days on free tiers, with 145 API tests",
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
