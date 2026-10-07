import Image from "next/image";
import Link from "next/link";
import { SectionHead } from "@/components/ui/section-head";
import { capabilities, roles } from "@/content/experience";
import type { Project } from "@/content/projects";
import { site } from "@/content/site";
import { CopyEmail } from "./copy-email";
import { Method } from "./method";
import { SystemCards } from "./system-cards";

/**
 * Everything after the lead project: the desk scrolled into a document. One
 * column of chapters, 160px apart on desktop and 96px on a phone.
 */
export function DeskDocument({ systems }: { systems: Project[] }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-24 px-5 pt-24 pb-32 lg:max-w-[79rem] lg:gap-40 lg:px-8 lg:pt-40 lg:pb-36">
      <SystemCards projects={systems} />
      <Trajectory />
      <Capabilities />
      <Method />
      <About />
      <Contact />
    </div>
  );
}

/* Newest first; the lede asks the reader to read upward, oldest to newest. */
function Trajectory() {
  return (
    <section id="trajectory" aria-labelledby="trajectory-title" className="flex scroll-mt-6 flex-col gap-5 lg:gap-10">
      <SectionHead
        id="trajectory-title"
        title="How the work changed"
        lede="Read upward. Each stage moved the boundary of what I was accountable for."
      />
      <ol className="flex flex-col gap-3">
        {[...roles].reverse().map((role) => (
          <li
            key={role.index}
            className="flex flex-col gap-2 rounded-3xl bg-surface p-5 lg:flex-row lg:gap-10 lg:px-8 lg:py-7"
          >
            <div className="flex flex-col gap-1.5 lg:w-[18.75rem] lg:shrink-0">
              <div className="flex items-center justify-between gap-3 lg:contents">
                <h3 className="text-xl font-medium tracking-[-0.015em] lg:text-2xl lg:tracking-[-0.02em]">
                  {role.title}
                </h3>
                {role.current && <NowTag className="lg:order-last lg:mt-1" />}
              </div>
              <p className="text-[0.8125rem] text-ink-2 lg:text-sm">
                {role.org} · {role.period}
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-1 lg:pt-0">
              <p className="text-base font-medium lg:text-lg">{role.frame}</p>
              <p className="hidden max-w-[65ch] text-[0.9375rem] leading-normal text-ink-2 lg:block">
                {role.body[0]}
              </p>
              <p className="max-w-[65ch] text-[0.9375rem] leading-normal text-ink-2 lg:text-ink">
                {role.shift}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function NowTag({ className = "" }: { className?: string }) {
  return (
    <span
      className={`flex h-[26px] shrink-0 items-center self-start rounded-full bg-accent-tint px-2.5 text-[0.8125rem] font-medium text-accent-ink lg:h-7 lg:px-3 ${className}`}
    >
      Now
    </span>
  );
}

function Capabilities() {
  return (
    <section id="capabilities" aria-labelledby="capabilities-title" className="flex scroll-mt-6 flex-col gap-5 lg:gap-10">
      <SectionHead
        id="capabilities-title"
        title="Grouped by what I do with them"
        lede="A list of logos tells you what someone has installed. This is organised by the job each layer is doing."
      />
      <dl className="flex flex-col rounded-3xl bg-surface px-5 py-2 lg:rounded-[28px] lg:px-8 lg:py-3">
        {capabilities.map((group) => (
          <div
            key={group.index}
            className="flex flex-col gap-1 py-3.5 lg:min-h-[78px] lg:flex-row lg:items-center lg:gap-8 lg:py-4"
          >
            <dt className="text-[1.0625rem] font-medium lg:w-[17.5rem] lg:shrink-0 lg:text-xl lg:tracking-[-0.015em]">
              {group.verb}
            </dt>
            <dd className="text-sm leading-normal text-ink-2 lg:text-[0.9375rem]">
              {group.items.join("\u00a0· ")}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function About() {
  const [lead, ...rest] = site.about;
  return (
    <section
      id="about"
      aria-label="About"
      className="flex scroll-mt-6 flex-col gap-5 lg:flex-row lg:items-start lg:gap-16"
    >
      <div className="flex h-80 shrink-0 items-end justify-center overflow-hidden rounded-[28px] bg-well lg:h-[25rem] lg:w-80 lg:rounded-[32px]">
        <Image
          src="/img/portrait.webp"
          alt={`Portrait of ${site.name}`}
          width={540}
          height={580}
          sizes="(min-width: 1024px) 320px, 280px"
          className="h-[19rem] w-[17.5rem] object-cover object-top lg:h-[23.75rem] lg:w-80"
        />
      </div>
      <div className="flex flex-col gap-5 lg:pt-2">
        <p className="text-2xl leading-[1.25] font-medium tracking-[-0.02em] text-pretty lg:text-[2rem] lg:leading-[1.2] lg:tracking-[-0.025em]">
          {lead}
        </p>
        {rest.map((paragraph) => (
          <p key={paragraph} className="max-w-[65ch] text-base leading-[1.55] text-ink-2">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}

const socials = [
  { label: "GitHub", href: site.links.github, handle: "Elisabeth56" },
  { label: "LinkedIn", href: site.links.linkedin, handle: "elisabethnnamani" },
  { label: "X", href: site.links.x, handle: "@elisynthdev" },
];

function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="flex scroll-mt-6 flex-col gap-10 lg:gap-16">
      <div className="flex flex-col gap-3 rounded-[28px] bg-surface px-5 py-7 lg:flex-row lg:gap-16 lg:rounded-[32px] lg:p-14">
        <div className="flex flex-col gap-3 pb-2 lg:w-[32.5rem] lg:shrink-0 lg:gap-5 lg:pb-0">
          <h2
            id="contact-title"
            className="text-[2.5rem] leading-[1.02] font-medium tracking-[-0.035em] lg:text-[4rem] lg:leading-none"
          >
            Tell me what breaks
          </h2>
          <p className="text-base leading-normal text-ink-2 lg:text-[1.0625rem]">
            I am most useful on systems where a wrong answer is expensive and the failure does not
            announce itself. {site.now.open}.
          </p>
        </div>
        <div className="flex flex-1 flex-col gap-3 lg:gap-2">
          <CopyEmail email={site.links.email} />
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="flex h-14 items-center justify-between rounded-[18px] bg-paper px-4 text-base transition-colors duration-200 ease-ui hover:text-accent lg:h-16 lg:rounded-[20px] lg:px-6 lg:text-[1.0625rem]"
            >
              <span className="text-ink-2">{social.label}</span>
              <span className="font-medium">{social.handle}</span>
            </a>
          ))}
        </div>
      </div>
      <footer className="flex items-center justify-between text-sm text-ink-2">
        <span>© 2026 {site.name}</span>
        <Link href="/read" className="py-3 transition-colors duration-200 ease-ui hover:text-accent">
          Read as one document
        </Link>
      </footer>
    </section>
  );
}
