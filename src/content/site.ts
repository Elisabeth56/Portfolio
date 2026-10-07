export const site = {
  name: "Elisabeth Nnamani",
  handle: "elisynth",
  role: "AI Engineer",
  domain: "https://elisabethnnamani.dev",
  location: "Nigeria",
  timezone: "Africa/Lagos",

  /** The single line the whole site argues for. */
  thesis: "Systems that survive contact with reality.",

  intro:
    "I build multi-agent orchestration, retrieval grounded in schemas that actually exist, and inference that keeps working with the network unplugged.",

  /** Longer identity copy: the About section on the desk and on /read. */
  about: [
    "I am an AI engineer. Most of what I build sits in the same place: the layer between a language model and a system that has to be correct.",
    "That layer is where the interesting failures live. A model that writes fluent SQL against columns nobody has. A retrieval step that splits a transaction table mid-row and hands back an amount with no date attached. A pipeline that reports success because the frontend quietly fell back to mock data. None of these throw an error. They return something plausible, which is worse.",
    "So the work is rarely the model call. It is the chunking strategy, the schema the output has to survive, the gate that stops a run before it writes to production, the isolation policy that lives in the database instead of in a code path someone can forget. I care about the parts that hold when conditions are not ideal — which, in the market I build for, is most of the time.",
  ],

  links: {
    email: "nnamanielisabeth@gmail.com",
    github: "https://github.com/Elisabeth56",
    linkedin: "https://www.linkedin.com/in/elisabethnnamani",
    x: "https://x.com/elisynthdev",
  },

  /** The desk's Now widget, and the line under contact. */
  now: {
    building: "PrismOS — agent-society tooling",
    open: "Open to AI engineering roles and selected contract work",
  },
} as const;
