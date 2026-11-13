import Image from "next/image";
import type { CSSProperties } from "react";
import { ButtonLink } from "@/components/ui/button-link";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { AppIcon } from "./app-icon";
import type { GlyphId } from "./glyphs";
import { MenuBar } from "./menu-bar";
import { ThemeToggle } from "./theme-toggle";

/** Order in which pieces settle during startup; read by the CSS as --i. */
const settle = (i: number) => ({ "--i": i }) as CSSProperties;

/* On a phone these sit with the apps; on desktop they live in the dock. */
const panels: { id: GlyphId; label: string }[] = [
  { id: "about", label: "About" },
  { id: "trajectory", label: "Trajectory" },
];

/**
 * The first screen, as a Mac desktop: a wallpaper, the headline in a frosted
 * window, a portrait widget on the left and a contact widget on the right.
 * The projects live in the dock. On a phone it is a home screen, with the
 * apps in a frosted panel. The headline is plain HTML with no entrance, so it
 * is readable from the first frame.
 */
export function Desk() {
  return (
    <section className="wallpaper relative px-5 lg:rounded-b-[2.5rem] pt-5 pb-28 lg:min-h-[max(100dvh,40rem)] lg:px-8 lg:pt-0 lg:pb-0">
      <MenuBar />

      <div className="mx-auto flex max-w-xl flex-col gap-4 pt-2 lg:max-w-none lg:grid lg:min-h-[calc(100dvh-9.5rem)] lg:grid-cols-[15rem_minmax(0,1fr)_15rem] lg:items-start lg:gap-10 lg:pt-6 lg:pb-6">
        <aside className="flex flex-col gap-4">
          <Identity />
        </aside>

        <HelloWindow />

        <aside className="hidden lg:block">
          <ContactWidget />
        </aside>

        <nav
          aria-label="Systems"
          className="glass grid grid-cols-4 gap-x-2 gap-y-4 rounded-[28px] px-3 py-5 lg:hidden"
        >
          {projects.map((project, i) => (
            <AppIcon
              key={project.slug}
              href={`/work/${project.slug}`}
              opens={project.slug}
              label={project.name}
              glyph={project.slug as GlyphId}
              style={settle(2 + i)}
            />
          ))}
          {panels.map((panel, i) => (
            <AppIcon
              key={panel.id}
              href={`#${panel.id}`}
              label={panel.label}
              glyph={panel.id}
              style={settle(8 + i)}
            />
          ))}
        </nav>
      </div>
    </section>
  );
}

/* The headline window. Its title bar is decoration, so it is hidden from
   assistive tech; the window itself is the page's introduction. */
function HelloWindow() {
  return (
    <div className="glass overflow-hidden rounded-[28px] lg:self-center lg:rounded-[24px]">
      <div aria-hidden className="hidden h-11 items-center px-4 text-[0.8125rem] text-ink-3 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <span className="flex gap-2">
          <span className="size-3 rounded-full bg-[#ed6a5e]" />
          <span className="size-3 rounded-full bg-[#f4bf4f]" />
          <span className="size-3 rounded-full bg-[#61c554]" />
        </span>
        hello.md
      </div>
      <div className="flex flex-col gap-4 px-5 py-6 lg:items-center lg:gap-6 lg:px-12 lg:pt-4 lg:pb-11 lg:text-center">
        <span className="hidden -rotate-3 font-hand text-[1.625rem] text-accent lg:block">
          AI engineer
        </span>
        <h1 className="text-[2.125rem] leading-[1.06] font-medium tracking-[-0.035em] lg:max-w-[45rem] lg:text-[clamp(2.75rem,calc((100vw-38rem)/11),4.25rem)] lg:leading-[1.02] lg:text-balance">
          Systems that survive <Underlined>contact with reality</Underlined>
        </h1>
        <p className="mt-1 text-base leading-normal text-pretty text-ink-2 lg:mt-1 lg:max-w-[35rem] lg:text-[1.1875rem]">
          {site.intro}
        </p>
        <div className="hidden items-center gap-6 lg:flex">
          <ButtonLink href="#systems" variant="solid">
            See the work
          </ButtonLink>
          <ButtonLink href="#method" variant="text">
            Read the method
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

function ContactWidget() {
  return (
    <div
      data-settle
      style={settle(1)}
      className="glass flex flex-col gap-2 rounded-3xl p-5"
    >
      <span className="text-[0.8125rem] text-ink-2">Say hello</span>
      <a
        href={`mailto:${site.links.email}`}
        className="text-sm font-medium whitespace-nowrap transition-colors duration-200 ease-ui hover:text-accent"
      >
        {site.links.email}
      </a>
      <span className="text-sm leading-normal text-ink-2">{site.now.open}</span>
    </div>
  );
}

function Identity() {
  return (
    <div
      data-settle
      style={settle(0)}
      className="glass relative flex items-center gap-3.5 rounded-[28px] p-3 lg:block"
    >
      <div className="flex size-[84px] shrink-0 items-end justify-center overflow-hidden rounded-[20px] bg-well lg:h-[15.5rem] lg:w-full lg:rounded-[18px]">
        <Image
          src="/img/portrait.webp"
          alt={`Portrait of ${site.name}`}
          width={540}
          height={580}
          priority
          sizes="(min-width: 1024px) 240px, 84px"
          className="h-24 w-[84px] object-cover object-top lg:h-[15rem] lg:w-[13rem]"
        />
      </div>
      <div className="flex flex-col gap-0.5 lg:hidden">
        <span className="text-lg font-semibold tracking-[-0.01em]">{site.name}</span>
        <span className="text-sm text-ink-2">
          {site.role} · {site.location}
        </span>
        <span className="text-sm font-medium text-accent">Open to AI engineering roles</span>
      </div>
      <div className="absolute top-1.5 right-2 lg:hidden">
        <ThemeToggle />
      </div>
    </div>
  );
}

/* The hand-drawn line under the key phrase. Draws itself once during startup. */
function Underlined({ children }: { children: string }) {
  return (
    <span className="relative whitespace-nowrap">
      {children}
      <svg
        aria-hidden
        viewBox="0 0 560 16"
        fill="none"
        preserveAspectRatio="none"
        className="absolute -bottom-[0.18em] left-[1%] h-[0.21em] w-[98%] text-accent"
      >
        <path
          className="startup-stroke"
          pathLength={1}
          d="M3 10C90 3 180 12 280 7s190-6 277 2"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
}
