# Portfolio redesign (October 2026)

Frontend-only redesign of elisabethnnamani.dev. Content, routes and stack stay (Next.js, TypeScript, Tailwind).

## Status

- Audit, references, direction, design system and screens: approved.
- Direction: "Paper desk" with a mulberry accent.
- Build: in progress (see PRs below).
- Polish pass (design critique, accessibility, Lighthouse 90+ on all four scores): not started.

## PRs

Each PR targets `main` and goes live as it lands. Merges are done by fast-forwarding `main` and pushing, so there are no merge commits.

| # | Branch | Scope | State |
|---|---|---|---|
| 1 | `feat/design-foundation` | Tokens, Geist and Caveat, `ButtonLink`, new 404 | Live 7 Oct |
| 2 | `feat/home-desk` | Home desk, dock, theme switch, startup | Live 7 Oct |
| 3 | `feat/lead-trace` | PrismOS pinned trace chapter | Live 7 Oct |
| 4 | `elisabeth/lucid-ramanujan-7kgup0` | Other four system cards, project window with Brief / Architecture / Decisions / Stack tabs, mobile gap fix | In review |
| 5 | next | Trajectory, capabilities, method, about, contact | Not started |
| 6 | | Case page `/work/<slug>` | |
| 7 | | `/read` | |
| 8 | | Remove old shells and fonts, move tokens to `:root` | |

Until PR 5 lands, the live home page has no trajectory, capabilities, method, about or contact sections; they remain at `/read`. The dock tiles and "Read the method" point at anchors that do not exist yet; the Systems tile now works.

PR 4 notes:

- Mobile gap fixed: the desk's bottom padding went from 128px to 56px, matching the board. The space the fixed dock needs now sits at the bottom of the systems section, the page's last element. PR 5 moves it to whichever section ends the page.
- Until PR 6, "Open full page" in the window and every card on a phone or tablet go to the old `/work/<slug>` page.
- Atlas AI's gates now pause the window's trace until approved. FarmTwin's network switch and FinSight's file-type branch (Trace component notes) are not built yet; they belong with the case page in PR 6.

## Design sources

- Screens canvas (every page, light and dark): https://claude.ai/artifact/PDNMZoSe4sFFZs2E9nq1dd
- Design system "Elisabeth Portfolio" (tokens, components, rules): https://claude.ai/artifact/8pSrGeYKuZPKPspgF7Jzcj
- Directions canvas: https://claude.ai/artifact/7yAtJepMe4XqdNFxvYcNe7
- Audit: https://claude.ai/artifact/65nuz6Wd2stWbdP2fLLnZJ

## Decisions

- Shell and document merge. `/` opens as a desk (menu bar, portrait and Now widgets, project icons, headline, dock) and scrolls into the document. The dock stays.
- Startup is a Mac-style moment: her name on paper, then the desk settles. Skippable, once per session, off under reduced motion.
- PrismOS is the lead project with a pinned, scroll-advanced trace. The other four are large cards that open a window on desktop or `/work/<slug>`.
- `/work/<slug>` is the full case page. `/read` stays as a plain document for sending.
- One family (Geist 400/500/600), sentence case, no mono labels. Caveat for at most two handwritten asides per page.
- One accent: mulberry `#7A2E4B` light, `#E39AB5` dark. The primary button is the tint `#F3D6E0`; solid accent means "active".
- Paper `#F0EEEB` with a faint dotted grid; surfaces `#F8F7F4`, wells `#E9E6E1`. Dark: `#1B1A19` / `#252422` / `#2F2D2B`.
- Radii 8 / 16 / 22 (icons) / 24 / 32 / pill. Easing `cubic-bezier(0.22, 1, 0.36, 1)` at 700ms for reveals, `cubic-bezier(0.4, 0, 0.2, 1)` at 200ms for UI.
- No per-project colours, no pulsing dots, no traffic-light chrome, no stats block.

## Implementation notes

- New tokens are scoped to `data-ui="desk"` while the old shells exist, because both systems use `--color-surface` and `--color-accent`.
- Theme: system by default, `<html data-theme>` when chosen, stored under `theme`. The startup flag is `<html data-startup>`. Both are set before paint by the inline script in `src/lib/theme.ts`.
- New components live in `src/components/desk/`, `src/components/trace/` and `src/components/ui/`, in kebab-case files.
- Trace: `buildSteps` turns `trace.sequence` into steps; a sequence id that is not a node becomes a group of the nodes the sequence never names. Without a group, a node the sequence leaves out (Atlas AI's two gates) becomes its own step after the node that leads into it, so Atlas has 8 steps. `TraceMap` draws any project's trace from content. The `pin:` Tailwind variant (1280px wide and 832px tall) switches between the pinned and list layouts.
- System cards (`desk/system-cards.tsx`) show four steps of the trace around `trace.focus`, the node that carries the project's argument. A gate shows its `action` label in the tint.
- Project window (`desk/project-window.tsx`): a native `<dialog>` opened by `WindowLink` (the cards and the desk icons) when the viewport is at least 1280 by 720. Smaller screens, and Cmd, Ctrl or Shift clicks, follow the link to `/work/<slug>`. It grows from the card or icon that opened it; Esc, the close button or a click on the scrim closes it, and focus returns to the opener. The last tab is remembered per project under `window:tab:<slug>`; the default is Architecture.
- Window Architecture tab: Next step and Back buttons, or the arrow keys, walk the trace. The trace scrolls sideways inside its well and follows the active step; `TraceMap` takes a `nodeWidth` so tightly spaced rows (Atlas) do not overlap. On a gated trace a gate step replaces Next with its approval button.
- `ui/segmented.tsx` is the Brief / Architecture / Decisions / Stack control: a `tablist` with a sliding thumb, arrow keys, Home and End.
- Semantic colours `positive`, `caution` and `negative` are now tokens (light and dark), scoped like the rest.
- The Vercel project is `elisynths`. Previews are behind Vercel login.
- The `redesign` branch on the remote is unused and can be deleted.

## Open with Elisabeth

- Her taglines for the hero.
- One screenshot per product for case pages and icons.
- Approval of new interface copy: 404 text, empty and error states, "Back to the desk", "Open the desk".
- Copy flags from the audit: FlowMind's headline length, system-speak in the old chrome.

## Build rules

- Small PRs, one section or page each, each with a Vercel preview.
- Commit as Elisabeth56 <nnamanielisabeth@gmail.com>, no co-author trailers.
- Nothing merges to `main` without Elisabeth's go-ahead.
- After each PR: open the preview at 375px and desktop, screenshot, compare to the screens canvas, fix before showing.
- Never interrupt `next build`. Read `node_modules/next/dist/docs/` before writing code (Next 16).
