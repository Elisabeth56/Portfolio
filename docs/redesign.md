# Portfolio redesign (October 2026)

Frontend-only redesign of elisabethnnamani.dev. Content, routes and stack stay (Next.js, TypeScript, Tailwind).

## Status

- Audit, references, direction, design system and screens: approved.
- Direction: "Paper desk" with a mulberry accent.
- Build: done (see PRs below).
- Polish pass (design critique, accessibility, Lighthouse 90+ on all four scores): done 7 Oct.
  - Lighthouse on the production build, mobile / desktop. Home: performance 92 / 100, accessibility, best practices and SEO 100 / 100. `/work/atlas-ai`: 98 / 100, the rest 100. `/read`: 97 / 100, the rest 100. Home's mobile LCP is the hero lede rising in after the startup, which plays once per session.
  - Every link and button on a phone is at least 44px (FinSight's CSV/PDF switch and `/read`'s contact links were raised to it). Focus is a 2px mulberry ring on every interactive element. Under reduced motion the startup never plays.

## PRs

Each PR targets `main` and goes live as it lands. Merges are done by fast-forwarding `main` and pushing, so there are no merge commits.

| # | Branch | Scope | State |
|---|---|---|---|
| 1 | `feat/design-foundation` | Tokens, Geist and Caveat, `ButtonLink`, new 404 | Live 7 Oct |
| 2 | `feat/home-desk` | Home desk, dock, theme switch, startup | Live 7 Oct |
| 3 | `feat/lead-trace` | PrismOS pinned trace chapter | Live 7 Oct |
| 4 | `elisabeth/lucid-ramanujan-7kgup0` | Other four system cards, project window with Brief / Architecture / Decisions / Stack tabs, mobile gap fix | Live 7 Oct |
| 5 | `feat/home-document` | Trajectory, capabilities, method, about, contact, footer | Live 7 Oct |
| 6 | `feat/case-page` | Case page `/work/<slug>` | Live 7 Oct |
| 7 | `feat/read` | `/read` | Live 7 Oct |
| 8 | `feat/cleanup` | Remove old shells and fonts, move tokens to `:root` | Live 7 Oct |

The home page now has every section of the screens canvas, and every dock tile and "Read the method" lands on its section.

PR 4 notes:

- Mobile gap fixed: the desk's bottom padding went from 128px to 56px, matching the board. In PR 5 the room the fixed dock needs sits at the bottom of `DeskDocument`, under the footer.
- Atlas AI's gates now pause the window's trace until approved.

PR 6 notes:

- `/work/<slug>` follows the screens canvas: back link and "Systems · n of 5", header with the "On my role" card, the pinned trace, problem and build with the product screenshot, the architecture in words, decisions, stack and what it demonstrates, and the next system.
- The pinned trace is `ProjectChapter` with `variant="case"`: it leads with "How it holds together", shows the active step's note under it in the rail, and carries each project's behaviour. Atlas AI halts at a gate however far the page has scrolled, and approving lets it catch up; on a phone the approve button sits in the waiting step. FinSight's "Statement type" picks CSV or PDF, and the branch not taken is dashed and takes no step. FarmTwin has a network switch and a dashed "On this laptop" line around the trace.
- `trace/trace-well.tsx` (`TraceWell`) is the map in a well that scrolls sideways when nodes would get too narrow, following the active step. The window uses it at 132px per node, the chapters at 96px, so only Atlas scrolls on a case page and the home chapter's nodes no longer touch. A packed trace (Atlas) gets 120px nodes at least, so its longest label fits. The case page's trace is 1200px wide with a 300px rail, as on the canvas.
- FarmTwin has no live link: its header offers "View the code" and says why there is nothing to visit.
- "Back to the desk" returns to the PrismOS chapter from its page and to the cards from the others.
- The project window clears the dock. `--spacing-dock` (the dock's height) and `--spacing-dock-inset` (its distance from the bottom on desktop) are spacing tokens; the window sits above the dock with the inset as the gap above and below it, at most 700px tall. In a short window the Architecture tagline scrolls so the step card stays in view, and fades at its cut edge until scrolled to the end; the other tabs already scroll.
- The IT Intern role (Cool Group) is out of the content, so Freelance AI Engineer is the only current role. It rendered on the old pages and, in PR 5, in the home trajectory.

PR 7 notes:

- `/read` is one plain column on paper without the dots, no client code: intro with the portrait, about, the five systems (each links to its case page), trajectory, capabilities, every method principle written out, and contact. It prints cleanly; "Open the desk" hides in print.

PR 8 notes:

- The workstation, phone and document shells, their trace canvas and icons, and Archivo, Inter, IBM Plex Mono and Instrument Serif are gone.
- The tokens are on `:root` (light) with the dark theme under `prefers-color-scheme` and `html[data-theme="dark"]`; `data-ui="desk"` is no longer needed. `body` carries the paper, dots, ink and Geist, so every page starts on the desk. `/read` paints plain paper over the dots.
- The OG card is redrawn in the paper-desk style: headline with the mulberry underline and the portrait.
- The README describes the desk, the case pages and `/read`.

Final touches (7 Oct):

- The desk is symmetrical at every desktop width: the widget column and the icon column are both 15rem, with the icons in a two-column grid (FlowMind centred under both) mirroring the widgets 32px from either edge. The headline sits at the centre of the screen and over the dock, with the same gap on both sides, and scales with the room between the columns (44px at 1024, 62px at 1200, 76px from about 1340). It sits midway between the menu bar and the dock, so the dock never covers the buttons on a short window at 100% zoom. Earlier attempts (a 96px shift, then a wider icon column with a single row of icons) left the gaps either side unequal, which read as off-centre in Safari and Chrome.
- The contact card's two columns sit side by side from 1280px; at 1024 they overflowed the page.
- The dock behaves like the macOS Dock: with a mouse, tiles near the pointer grow (up to 1.42×) and push their neighbours aside, rising out of the dock, and settle back when the pointer leaves. Distances are measured from the resting layout so the swell does not chase itself; touch screens and reduced motion keep it still. The dock is translucent with a soft blur and a hairline ring, and after a divider (like the one before Downloads and Trash) a document tile opens `/read`, on desktop.
- The menu bar works like a Mac's: a translucent full-width strip with drop-down menus. Her name (About, Read as one document, switch light and dark), Systems (each project with its status, opening its window), Go (each section) and Contact (copy the email address, GitHub, LinkedIn, X). Once a menu is open, moving across the bar opens the others; arrow keys, Home, End and Esc work as on a Mac, and a click outside closes. Location, time and the theme switch stay on the right. Desktop only, as before.
- The Freelance Web Developer entry describes the kind of work in general terms (no client names or figures).
- "Open PrismOS" and the PrismOS desk icon open PrismOS's window, like the other icons (the case page on smaller screens). They used to scroll to the chapter just below.
- The startup is a boot screen: her name over a progress bar that fills quickly, pauses near the end and completes, then the screen lifts and the desk settles. Once per session, skippable with any key or tap, never under reduced motion. The hero underline draws after it lifts.
- Each system card on the home page and the window's Brief tab show the product's screenshot.
- Copy: "Building PrismOS" in the Now widget; the trajectory lede drops "Read upward"; "organized"; "a market that bank-linking APIs do not serve"; "View the code" for a project with no live link, in the window and on the case page.
- The README no longer carries questions for Elisabeth; they go to her directly.

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

- Tokens are on `:root` in `src/app/globals.css` (PR 8); `body` carries the paper and dots.
- Theme: system by default, `<html data-theme>` when chosen, stored under `theme`. The startup flag is `<html data-startup>`. Both are set before paint by the inline script in `src/lib/theme.ts`.
- Components live in `src/components/desk/`, `src/components/trace/`, `src/components/case/` and `src/components/ui/`, in kebab-case files.
- Trace: `buildSteps` turns `trace.sequence` into steps; a sequence id that is not a node becomes a group of the nodes the sequence never names. Without a group, a node the sequence leaves out (Atlas AI's two gates) becomes its own step after the node that leads into it, so Atlas has 8 steps. `TraceMap` draws any project's trace from content. The `pin:` Tailwind variant (1280px wide and 832px tall) switches between the pinned and list layouts.
- System cards (`desk/system-cards.tsx`) show four steps of the trace around `trace.focus`, the node that carries the project's argument. A gate shows its `action` label in the tint.
- Project window (`desk/project-window.tsx`): a native `<dialog>` opened by `WindowLink` (the cards and the desk icons) when the viewport is at least 1280 by 720. Smaller screens, and Cmd, Ctrl or Shift clicks, follow the link to `/work/<slug>`. It grows from the card or icon that opened it; Esc, the close button or a click on the scrim closes it, and focus returns to the opener. The last tab is remembered per project under `window:tab:<slug>`; the default is Architecture. It is sized from the dock tokens so it never covers the dock.
- Window Architecture tab: Next step and Back buttons, or the arrow keys, walk the trace. The trace scrolls sideways inside its well and follows the active step; `TraceMap` takes a `nodeWidth` so tightly spaced rows (Atlas) do not overlap. On a gated trace a gate step replaces Next with its approval button.
- `desk/document.tsx` (`DeskDocument`) holds everything after the lead chapter: systems, trajectory, capabilities, method, about, contact and the footer, 160px apart on desktop and 96px on a phone. `ui/section-head.tsx` is the shared title-and-lede heading.
- Trajectory lists the newest role first. Method is an accordion with the first principle open; each principle ends with "Learned on <project>", which opens that project's window. Contact's Copy button reads "Copied" for two seconds.
- `ui/segmented.tsx` is the Brief / Architecture / Decisions / Stack control: a `tablist` with a sliding thumb, arrow keys, Home and End.
- Semantic colours `positive`, `caution` and `negative` are now tokens (light and dark), scoped like the rest.
- The Vercel project is `elisynths`. Previews are behind Vercel login.
- The `redesign` branch on the remote is unused and can be deleted.

## Open with Elisabeth

- Nothing open. System-speak in the old chrome went with the old shells in PR 8.

Decided on 7 Oct:

- Trajectory: leave the IT Intern role out.
- Project window: clear the dock instead of overlapping it.
- Hero: keep the current headline and lede; no new taglines.
- New interface copy approved: 404 text, empty and error states, "Back to the desk", "Open the desk".
- "Learned on FinSight" stays plain text, keeping the two-aside rule.
- Capabilities: "Serving it" lists Next.js where the content had NestJS.
- FlowMind's tagline is shortened to "Removing the triage tax that kills productivity systems."
- The window's tagline fades where a short window cuts it off.
- Product screenshots received. They are cropped to each product's own interface (no gradient backdrop, no browser chrome, per the design rules) and saved as `public/img/work/<slug>.webp`, 1600px wide. Each project's `shot` gives its size and alt text.

## Build rules

- Small PRs, one section or page each, each with a Vercel preview.
- Commit as Elisabeth56 <nnamanielisabeth@gmail.com>, no co-author trailers.
- Nothing merges to `main` without Elisabeth's go-ahead.
- After each PR: open the preview at 375px and desktop, screenshot, compare to the screens canvas, fix before showing.
- Never interrupt `next build`. Read `node_modules/next/dist/docs/` before writing code (Next 16).
