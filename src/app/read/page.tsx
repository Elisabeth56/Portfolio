import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { capabilities, roles } from "@/content/experience";
import { methodIntro, principles } from "@/content/method";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "The full portfolio as a single document: five AI systems, the decisions behind them, and the working method that produced them.",
  alternates: { canonical: "/read" },
};

const h2 = "text-[1.625rem] leading-[1.12] font-medium tracking-[-0.025em] lg:text-[2rem]";
const section = "flex flex-col gap-4 pt-16 lg:pt-24";

/**
 * The portfolio as one plain document, for sending. No desk, no trace, nothing
 * that moves: everything the home page says, in reading order.
 */
export default function ReadPage() {
  return (
    <>
      <main
       
        className="min-h-dvh bg-paper px-5 pb-24 print:pb-0 lg:pb-36"
      >
        <div className="mx-auto max-w-[50rem]">
          <header className="flex h-16 items-center justify-between text-[0.9375rem] lg:h-[4.5rem]">
            <span className="font-semibold">{site.name}</span>
            <Link
              href="/"
              className="flex h-11 items-center rounded-full bg-well px-4 font-medium transition-colors duration-200 ease-ui hover:text-accent print:hidden lg:px-[18px]"
            >
              Open the desk
            </Link>
          </header>

          <Intro />
          <About />
          <Systems />
          <Trajectory />
          <Capabilities />
          <Method />
          <Contact />
        </div>
      </main>
      <script
        type="application/ld+json"
        // Structured data is static, authored here rather than user input.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: site.name,
            jobTitle: site.role,
            url: site.domain,
            email: `mailto:${site.links.email}`,
            sameAs: [site.links.github, site.links.linkedin, site.links.x],
            address: { "@type": "PostalAddress", addressCountry: "NG" },
          }),
        }}
      />
    </>
  );
}

function Intro() {
  return (
    <section aria-label="Introduction" className="flex flex-col gap-4 pt-10 lg:flex-row-reverse lg:items-start lg:gap-12 lg:pt-24">
      <div className="flex items-center gap-3.5 lg:block lg:shrink-0">
        <div className="flex size-[72px] items-end justify-center overflow-hidden rounded-[18px] bg-well lg:h-[13.75rem] lg:w-[11.25rem] lg:rounded-3xl">
          <Image
            src="/img/portrait.webp"
            alt={`Portrait of ${site.name}`}
            width={540}
            height={580}
            sizes="(min-width: 1024px) 180px, 72px"
            className="h-[84px] w-[72px] object-cover object-top lg:h-[13.125rem] lg:w-[11.25rem]"
          />
        </div>
        <p className="text-sm leading-[1.45] text-ink-2 lg:hidden">
          {site.role} · {site.location}
          <br />
          Open to AI engineering roles
        </p>
      </div>
      <div className="flex flex-col gap-4 lg:grow lg:gap-5">
        <p className="hidden text-[0.9375rem] text-ink-2 lg:block">
          {site.role} · {site.location} · {site.now.open}
        </p>
        <h1 className="mt-2 text-[2.25rem] leading-[1.06] font-medium tracking-[-0.035em] text-balance lg:mt-0 lg:text-[3.5rem] lg:leading-[1.04]">
          {site.thesis}
        </h1>
        <p className="text-[1.0625rem] leading-normal text-ink-2 lg:text-[1.1875rem]">
          {site.intro}
        </p>
      </div>
    </section>
  );
}

function About() {
  const [lead, ...rest] = site.about;
  return (
    <section aria-label="About" className={section}>
      <p className="text-[1.0625rem] leading-[1.6]">{lead}</p>
      {rest.map((paragraph) => (
        <p key={paragraph} className="text-[1.0625rem] leading-[1.6] text-ink-2">
          {paragraph}
        </p>
      ))}
    </section>
  );
}

function Systems() {
  return (
    <section aria-labelledby="systems-title" className={`${section} gap-2`}>
      <h2 id="systems-title" className={`${h2} mb-3 lg:mb-4`}>
        Five systems, one argument
      </h2>
      {projects.map((p) => (
        <Link
          key={p.slug}
          href={`/work/${p.slug}`}
          className="group flex flex-col gap-1 rounded-[20px] bg-surface px-[18px] py-4 transition-colors duration-200 ease-ui hover:bg-[color-mix(in_srgb,var(--color-ink)_3%,var(--color-surface))] print:break-inside-avoid lg:px-6 lg:py-5"
        >
          <span className="flex flex-col gap-1 lg:flex-row lg:items-baseline lg:gap-2">
            <span className="text-lg font-medium tracking-[-0.015em] transition-colors duration-200 ease-ui group-hover:text-accent lg:text-xl">
              {p.name}
            </span>
            <span className="text-[0.8125rem] text-ink-2 lg:text-sm">
              {p.kind} · {p.period} · {p.status}
            </span>
          </span>
          <span className="text-[0.9375rem] leading-normal text-ink-2 lg:text-base">
            {p.tagline}
          </span>
        </Link>
      ))}
    </section>
  );
}

/* Newest first, like the home page. */
function Trajectory() {
  return (
    <section aria-labelledby="trajectory-title" className={section}>
      <h2 id="trajectory-title" className={`${h2} mb-2`}>
        How the work changed
      </h2>
      {[...roles].reverse().map((role) => (
        <div key={role.index} className="flex flex-col gap-2 pb-4 print:break-inside-avoid">
          <h3 className="text-lg font-medium tracking-[-0.015em] lg:text-xl">
            {role.title}
            <span className="ml-2 text-sm font-normal tracking-normal text-ink-2">
              {role.org} · {role.period}
            </span>
          </h3>
          <p className="text-base leading-[1.6] font-medium lg:text-[1.0625rem]">{role.frame}</p>
          {role.body.map((paragraph) => (
            <p key={paragraph} className="text-base leading-[1.6] text-ink-2 lg:text-[1.0625rem]">
              {paragraph}
            </p>
          ))}
        </div>
      ))}
    </section>
  );
}

function Capabilities() {
  return (
    <section aria-labelledby="capabilities-title" className={section}>
      <h2 id="capabilities-title" className={`${h2} mb-2`}>
        Grouped by what I do with them
      </h2>
      <dl className="flex flex-col gap-4">
        {capabilities.map((group) => (
          <div key={group.index} className="flex flex-col gap-1 print:break-inside-avoid">
            <dt className="text-base font-medium lg:text-[1.0625rem]">{group.verb}</dt>
            <dd className="text-[0.9375rem] leading-normal text-ink-2 lg:text-base">
              {group.items.join(" · ")}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Method() {
  return (
    <section aria-labelledby="method-title" className={section}>
      <h2 id="method-title" className={h2}>
        Seven things that cost me something
      </h2>
      <p className="mb-2 text-[1.0625rem] leading-[1.6] text-ink-2">{methodIntro[0]}</p>
      {principles.map((principle) => (
        <div key={principle.index} className="flex flex-col gap-2 pb-4">
          <h3 className="text-lg font-medium tracking-[-0.015em] lg:text-xl">{principle.title}</h3>
          {principle.body.map((paragraph) => (
            <p key={paragraph} className="text-base leading-[1.6] text-ink-2 lg:text-[1.0625rem]">
              {paragraph}
            </p>
          ))}
          <p className="text-sm text-ink-2">
            Learned on{" "}
            <Link
              href={`/work/${principle.evidence.slug}`}
              className="font-medium text-accent transition-colors duration-200 ease-ui hover:text-ink"
            >
              {principle.evidence.project}
            </Link>{" "}
            · {principle.evidence.note}
          </p>
        </div>
      ))}
    </section>
  );
}

function Contact() {
  const rows = [
    { label: "Email", href: `mailto:${site.links.email}`, value: site.links.email },
    { label: "GitHub", href: site.links.github, value: "Elisabeth56" },
    { label: "LinkedIn", href: site.links.linkedin, value: "elisabethnnamani" },
    { label: "X", href: site.links.x, value: "@elisynthdev" },
  ];
  return (
    <section aria-labelledby="contact-title" className={section}>
      <h2 id="contact-title" className={h2}>
        Tell me what breaks
      </h2>
      <p className="text-[1.0625rem] leading-[1.6] text-ink-2">
        I am most useful on systems where a wrong answer is expensive and the failure does not
        announce itself. {site.now.open}.
      </p>
      <dl className="flex flex-col rounded-[20px] bg-surface px-[18px] py-1 print:break-inside-avoid lg:px-6">
        {rows.map((row) => (
          <div key={row.label} className="flex min-h-14 items-center justify-between gap-4 py-2">
            <dt className="text-ink-2">{row.label}</dt>
            <dd>
              <a
                href={row.href}
                className="inline-flex min-h-11 items-center font-medium break-all transition-colors duration-200 ease-ui hover:text-accent"
              >
                {row.value}
              </a>
            </dd>
          </div>
        ))}
      </dl>
      <p className="pt-6 text-sm text-ink-2">© 2026 {site.name}</p>
    </section>
  );
}
