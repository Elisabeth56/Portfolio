# elisynth

Personal portfolio for **Elisabeth Nnamani** — AI Software Engineer.
Live at [elisabethnnamani.dev](https://elisabethnnamani.dev).

## The idea

The site has two surfaces rendering the same content.

**Workstation** (`/`, ≥1024px) — a desktop shell where each project is a
*running process* rather than a card. Open one and you get a
tabbed window: brief, an interactive architecture trace, the decisions behind
it, and the stack. The traces are not decoration:

| Project  | The interaction                                                              |
| -------- | ---------------------------------------------------------------------------- |
| PrismOS  | Seven agents debate in parallel and fire conflict markers before ruling       |
| Atlas AI | The pipeline **halts** at each human gate until the visitor approves          |
| FinSight | The ingestion path, branching on file type                                    |
| FarmTwin | A network switch — cut it and everything keeps running                        |
| FlowMind | Capture flowing into a typed relational schema                                |

**Phone** (`/` below 1024px) — an iOS-style home screen. Identity and thesis
widgets, an app grid of the five systems plus the panels, and a dock. Tapping
an app raises a full-screen sheet carrying exactly the same content the
workstation shows in a window. The traces become vertical stepped lists, gates
and all.

**Document** (`/read`, and one tap from either shell) — the same material as a
linear editorial page. This is what crawlers and screen readers get, what
someone in a hurry gets, and the version to send to somebody. It is the
baseline the server always renders; both shells are a progressive upgrade on
top of it, and the choice persists in `localStorage`.

Every project also has a permanent, deep-linkable page at `/work/<slug>`, so
the OS is never a black hole for search or for sharing.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4
(CSS-first `@theme`) · Motion · self-hosted fonts via `next/font/local`.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm start
```

> Do not interrupt `next build`. A killed build leaves the Turbopack cache
> referencing chunks it never wrote, and the next build inherits it. If you see
> 500s on `/_next/static/chunks/*`, `rm -rf .next` and build again.

## Deploying

Vercel, zero config. Point `elisabethnnamani.dev` at it and set nothing —
there are no environment variables and no runtime dependencies.

`src/content/site.ts` holds the canonical domain, which drives `metadataBase`,
the sitemap, robots and the OG card. Change it there if the domain changes.

## Editing content

All copy is typed data. No JSX changes needed to update the site.

| File                       | What it holds                                          |
| -------------------------- | ------------------------------------------------------ |
| `src/content/site.ts`      | Name, thesis, about copy, links, "now"                  |
| `src/content/projects.ts`  | The five systems, including each interactive trace      |
| `src/content/experience.ts`| Roles and capability groups                             |
| `src/content/method.ts`    | The seven principles and their evidence                 |

Adding a sixth project is one object in `projects.ts`: give it a `trace` with
nodes positioned on a 0–100 grid, and add a placement class in `PLACEMENT`
inside `src/components/workstation/Workstation.tsx`.

### Trace node positions

Nodes are 10.6% of the canvas wide, so keep same-row nodes at least 13 apart on
`x`, and keep `x` between 6 and 94 so nothing clips. Below 900px the diagram
becomes a vertical stepped list automatically, so horizontal layout only has to
work on wide screens.

## Design system

Tokens live at the top of `src/app/globals.css`. Two surfaces, set with
`data-surface="light" | "dark"` on any container, so a dark window can sit
inside a light page.

One thing worth knowing: each surface redeclares the `--color-*` names
directly. An indirection like `--color-bg: var(--bg)` gets substituted on the
element that declares it, so it freezes at `:root` and never picks up a
descendant override.

Type: Archivo (display) · Inter (body) · IBM Plex Mono (system chrome) ·
Instrument Serif (the Method section only, so it reads in a different voice).

App icons live in `src/components/icons/AppIcons.tsx` — squircle tiles with
their own colour, the way a real app icon works rather than a theme-dependent
glyph. `appColor` is the single source for each system's colour, and it also
tints that system's desk tile, window title bar and trace glyph.

## Accessibility and performance notes

- Contrast passes WCAG AA on both surfaces, checked at label sizes.
- The boot sequence is skippable on any key and is skipped entirely under
  `prefers-reduced-motion`.
- Windows are labelled dialogs, close on Escape, and the terminal accepts
  `help`, `whoami`, `ls`, `open <name>`, `cat <file>`, `read`, `clear` — which
  doubles as a keyboard route to everything.
- No external requests at runtime: fonts are self-hosted, no analytics, no CDN.

## Still to do

Two things need Elisabeth's own detail rather than mine:

1. **Freelance Web Developer (2023–2024)** in `src/content/experience.ts` —
   currently describes the shape of the role. Replace with real clients,
   what was delivered, and anything measurable.
2. **IT Intern, Cool Group (Jun–Dec 2026)** — same. It is rendered as
   in-progress.

Also: the FlowMind landing page still shows placeholder stats (50K+ users,
2M+ tasks, 98% time saved). Nothing on this site repeats them, but they are
live on flowmind-sage.vercel.app and worth removing.
