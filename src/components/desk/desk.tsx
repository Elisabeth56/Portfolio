import Image from "next/image";
import type { CSSProperties } from "react";
import { ButtonLink, buttonClass } from "@/components/ui/button-link";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { AppIcon } from "./app-icon";
import type { GlyphId } from "./glyphs";
import { MenuBar } from "./menu-bar";
import { WindowLink } from "./project-window";
import { ThemeToggle } from "./theme-toggle";

/** Order in which pieces settle during startup; read by the CSS as --i. */
const settle = (i: number) => ({ "--i": i }) as CSSProperties;

const [lead, ...others] = projects;

/* On a phone these three sit in the grid; on desktop they live in the dock. */
const panels: { id: GlyphId; label: string }[] = [
  { id: "about", label: "About" },
  { id: "trajectory", label: "Trajectory" },
  { id: "capabilities", label: "Stack" },
];

/**
 * The first screen. A desk on desktop (widgets left, headline centre, project
 * icons right) and a home screen on a phone. The headline is plain HTML with
 * no entrance, so it is readable from the first frame.
 */
export function Desk() {
  return (
    <section className="relative px-5 pt-5 pb-14 lg:min-h-[max(100dvh,40rem)] lg:px-8 lg:pt-0 lg:pb-0">
      <MenuBar />

      <div className="mx-auto flex max-w-xl flex-col gap-5 pt-2 lg:max-w-none lg:grid lg:grid-cols-[15rem_minmax(0,1fr)_15rem] lg:items-start lg:gap-8 lg:pt-6">
        <aside className="flex flex-col gap-4">
          <Identity />
          <NowWidget />
        </aside>

        {/* The side columns are the same width, so the headline sits at the
            centre of the screen (and over the dock) with the same room on
            either side. It sits midway between the menu bar and the dock. */}
        <div className="flex flex-col gap-4 pt-5 lg:items-center lg:gap-7 lg:pt-[clamp(3rem,calc(50dvh-15rem),13rem)] lg:text-center">
          <span className="hidden -rotate-3 font-hand text-[1.625rem] text-accent lg:block">
            AI engineer
          </span>
          <h1 className="text-[2.125rem] leading-[1.06] font-medium tracking-[-0.035em] lg:text-balance lg:max-w-[45rem] lg:text-[clamp(2.75rem,calc((100vw-38rem)/9.6),4.75rem)] lg:leading-[1.02]">
            Systems that survive <Underlined>contact with reality</Underlined>
          </h1>
          <p className="mt-2 text-base leading-normal text-pretty text-ink-2 lg:mt-2 lg:max-w-[35rem] lg:text-[1.1875rem]">
            {site.intro}
          </p>
          <div className="hidden items-center gap-6 lg:flex">
            <WindowLink slug={lead.slug} className={buttonClass()}>
              Open {lead.name}
            </WindowLink>
            <ButtonLink href="#method" variant="text">
              Read the method
            </ButtonLink>
          </div>
        </div>

        <nav
          aria-label="Systems"
          className="grid grid-cols-4 gap-x-2 gap-y-[1.125rem] pt-1 lg:grid-cols-2 lg:gap-x-4 lg:gap-y-7 lg:pt-3 lg:[&>a:nth-of-type(5)]:col-span-2"
        >
          <AppIcon
            href={`/work/${lead.slug}`}
            opens={lead.slug}
            label={lead.name}
            glyph={lead.slug as GlyphId}
            tone="lead"
            style={settle(2)}
          />
          {others.map((project, i) => (
            <AppIcon
              key={project.slug}
              href={`/work/${project.slug}`}
              opens={project.slug}
              label={project.name}
              glyph={project.slug as GlyphId}
              style={settle(3 + i)}
            />
          ))}
          {panels.map((panel, i) => (
            <span key={panel.id} className="contents lg:hidden">
              <AppIcon
                href={`#${panel.id}`}
                label={panel.label}
                glyph={panel.id}
                tone="panel"
                style={settle(7 + i)}
              />
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}

function Identity() {
  return (
    <div
      data-settle
      style={settle(0)}
      className="relative flex items-center gap-3.5 rounded-[28px] bg-surface p-3 shadow-lift lg:block lg:bg-transparent lg:p-0 lg:shadow-none"
    >
      <div className="flex size-[84px] shrink-0 items-end justify-center overflow-hidden rounded-[20px] bg-well lg:h-[16.5rem] lg:w-full lg:rounded-[28px]">
        <Image
          src="/img/portrait.webp"
          alt={`Portrait of ${site.name}`}
          width={540}
          height={580}
          priority
          sizes="(min-width: 1024px) 240px, 84px"
          className="h-24 w-[84px] object-cover object-top lg:h-[16rem] lg:w-[14rem]"
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

function NowWidget() {
  return (
    <div
      data-settle
      style={settle(1)}
      className="hidden flex-col gap-2 rounded-3xl bg-surface p-5 shadow-lift lg:flex"
    >
      <span className="text-[0.8125rem] text-ink-2">Now</span>
      <span className="text-[1.0625rem] font-medium tracking-[-0.01em]">{site.now.building}</span>
      <span className="text-sm leading-normal text-ink-2">{site.now.open}</span>
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
