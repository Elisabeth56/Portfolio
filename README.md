# elisynth

Personal portfolio for **Elisabeth Nnamani** — AI Engineer.
Live at [elisabethnnamani.dev](https://elisabethnnamani.dev).

## The idea

A paper desk. `/` opens like a Mac starting up: her name on paper, then the
desk settles in, with the portrait and Now widgets, the five project icons,
the headline and a dock. Scroll and the desk becomes a document: PrismOS as a
pinned chapter whose architecture trace advances as you scroll, then the other
four systems, trajectory, capabilities, method, about and contact.

On a large screen a project card opens a window with Brief, Architecture,
Decisions and Stack tabs. Everywhere else it goes to the case page,
`/work/<slug>`, which tells the project through the same pinned trace. Each
trace keeps the project's own behaviour:

| Project  | The interaction                                                     |
| -------- | ------------------------------------------------------------------- |
| PrismOS  | Three agents take their positions together before a binding ruling  |
| Atlas AI | The run **halts** at each human gate until the visitor approves     |
| FinSight | Pick CSV or PDF and the ingestion path takes that branch            |
| FarmTwin | A network switch: cut it and everything keeps answering             |
| FlowMind | Capture flowing into a typed relational schema                      |

`/read` is the whole portfolio as one plain column, for sending to someone and
for printing.

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

Adding a sixth project is one object in `projects.ts` (with a `trace` whose
nodes sit on a 0–100 grid and a `shot`), a glyph in
`src/components/desk/glyphs.tsx`, and a screenshot at
`public/img/work/<slug>.webp`, cropped to the product's own interface.

### Trace node positions

Nodes are 13.5% of the map wide. Keep `x` between 6 and 94 so nothing clips.
Same-row nodes closer than that get narrower nodes, and if they would drop
below 96px (132px in the window) the trace scrolls sideways and follows the
active step instead, as Atlas AI's does. Below the `pin:` size (1280 by 832)
the trace is a vertical list of steps, so the horizontal layout only has to
work on large screens.

## Design system

The design system "Elisabeth Portfolio" and the screens canvas are linked from
`docs/redesign.md`, which also records every decision and how each part is
built.

Tokens live at the top of `src/app/globals.css`: paper `#F0EEEB` with a faint
dotted grid, surfaces and wells one tone apart, an ink ramp, and one accent,
mulberry `#7A2E4B` (`#E39AB5` in dark). Dark mode is designed rather than
inverted. The theme follows the system until the visitor picks one with the
toggle, and the choice is remembered.

Type: Geist at 400, 500 and 600, sentence case. Caveat for at most two
handwritten asides per page.

## Accessibility and performance notes

- Text passes WCAG AA in both themes; colour never carries meaning without a
  word ("Live", "has a cost", "still answering").
- The startup plays once per session, skips on any key or tap and never runs
  under `prefers-reduced-motion`. The headline is in the HTML from the start.
- The window is a native `<dialog>`: Esc closes it and focus returns to the
  card that opened it. Tabs move with the arrow keys, Home and End.
- Every page is static. No external requests at runtime: fonts are
  self-hosted, no analytics, no CDN.
