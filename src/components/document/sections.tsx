import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import { projects } from "@/content/projects";
import { roles, capabilities } from "@/content/experience";
import { principles, methodIntro } from "@/content/method";
import { TraceCanvas } from "@/components/traces/TraceCanvas";
import {
  Label,
  MetaRow,
  SectionHead,
  Shell,
  StatusPill,
  TextLink,
} from "./primitives";

/* ================================================================== */
/* 01 — Identity                                                       */

export function Hero() {
  return (
    <Shell>
      <section className="pt-28 sm:pt-32 lg:pt-40">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="inline-block size-1.5 rounded-full bg-run"
              />
              <Label className="text-fg-muted">
                Available for AI engineering roles
              </Label>
            </div>

            <h1 className="t-display mt-7 text-[clamp(3rem,8vw,7rem)] uppercase">
              Elisabeth
              <br />
              Nnamani
            </h1>

            <div className="mt-9 grid max-w-xl grid-cols-2 gap-x-8 gap-y-4 border-t border-line pt-5">
              <div>
                <Label>Role</Label>
                <p className="mt-1.5 text-[0.9375rem]">
                  AI Software Engineer
                  <br />
                  <span className="text-fg-muted">
                    Systems &amp; LLM engineering
                  </span>
                </p>
              </div>
              <div>
                <Label>Based</Label>
                <p className="mt-1.5 text-[0.9375rem]">
                  {site.location}
                  <br />
                  <span className="text-fg-muted">WAT · UTC+1</span>
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 xl:col-span-4 lg:self-end">
            <figure className="relative lg:-mt-16">
              <Image
                src="/img/portrait.webp"
                alt="Elisabeth Nnamani"
                width={1000}
                height={1250}
                priority
                sizes="(max-width: 1024px) 70vw, 30vw"
                className="w-full max-w-[19rem] sm:max-w-[22rem] lg:max-w-none"
              />
              <figcaption className="t-label mt-2 border-t border-line pt-3 text-fg-faint">
                {site.location} · WAT
              </figcaption>
            </figure>
          </div>
        </div>

        {/* thesis band */}
        <div className="mt-20 border-t border-line pt-8 sm:mt-28">
          <p className="t-display text-[clamp(1.75rem,5.4vw,4.75rem)] uppercase text-fg">
            Systems that survive{" "}
            <span className="text-accent">contact with reality.</span>
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Label>What that means in practice</Label>
          </div>
          <div className="lg:col-span-7">
            <div className="t-prose space-y-4 text-[1.0625rem] text-fg-muted sm:text-lg">
              {site.about.map((p, i) => (
                <p key={i} className={i === 0 ? "text-fg" : undefined}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}

/* ================================================================== */
/* 02 — Selected systems                                               */

export function Systems() {
  return (
    <Shell>
      <section>
        <SectionHead
          id="systems"
          index="02"
          eyebrow="Selected systems"
          title={
            <>
              Five systems,
              <br />
              one argument
            </>
          }
          lede="Each one is a different answer to the same question: what has to be true for a language model to be trusted inside a system that has to be correct?"
        />

        <div className="mt-20 space-y-28 sm:space-y-36">
          {projects.map((p) => (
            <article key={p.slug} className="border-t border-line pt-8">
              <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
                {/* index + meta column */}
                <div className="lg:col-span-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="t-label text-accent">{p.index}/</span>
                    <StatusPill status={p.status} />
                  </div>

                  <h3 className="t-display mt-6 text-[clamp(2.25rem,6vw,4.25rem)] uppercase">
                    {p.name}
                  </h3>

                  <dl className="mt-8">
                    <MetaRow k="Type">{p.kind}</MetaRow>
                    <MetaRow k="Period">{p.period}</MetaRow>
                    <MetaRow k="Role">{p.role}</MetaRow>
                  </dl>

                  <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <Link
                      href={`/work/${p.slug}`}
                      className="group relative inline-flex items-baseline gap-1.5 py-1 text-fg transition-colors hover:text-accent"
                    >
                      <span className="relative text-[0.9375rem] font-medium">
                        Read the case study
                        <span
                          aria-hidden
                          className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100"
                        />
                      </span>
                      <span aria-hidden className="text-xs">
                        →
                      </span>
                    </Link>
                    {p.links.live && (
                      <TextLink href={p.links.live} external className="text-[0.9375rem]">
                        Visit {p.name}
                      </TextLink>
                    )}
                    {p.links.repo && (
                      <TextLink href={p.links.repo} external className="text-[0.9375rem]">
                        Repository
                      </TextLink>
                    )}
                  </div>
                </div>

                {/* narrative column */}
                <div className="lg:col-span-8">
                  <p className="t-display text-[clamp(1.375rem,2.9vw,2.125rem)] tracking-[-0.02em]">
                    {p.tagline}
                  </p>

                  <p className="t-prose mt-6 text-[1.0625rem] text-fg-muted">
                    {p.problem[0]}
                  </p>

                  <div className="mt-8 border-t border-line-soft pt-6">
                    <Label className="mb-3 block">
                      A decision worth arguing about
                    </Label>
                    <h4 className="text-[1.0625rem] font-medium">
                      {p.decisions[0].title}
                    </h4>
                    <p className="t-prose mt-2 text-[0.9375rem] text-fg-muted">
                      {p.decisions[0].body}
                    </p>
                    {p.decisions[0].cost && (
                      <p className="t-prose mt-3 border-l-2 border-accent/50 pl-4 text-[0.9375rem] text-fg-muted">
                        <span className="t-label mr-2 text-accent">Cost</span>
                        {p.decisions[0].cost}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* the diagram gets the full measure — it is a figure, not an inset */}
              <figure className="mt-12">
                <figcaption className="mb-3">
                  <Label>Architecture · {p.name}</Label>
                </figcaption>
                <TraceCanvas trace={p.trace} />
              </figure>
            </article>
          ))}
        </div>
      </section>
    </Shell>
  );
}

/* ================================================================== */
/* 03 — Trajectory                                                     */

export function Trajectory() {
  return (
    <Shell>
      <section>
        <SectionHead
          id="trajectory"
          index="03"
          eyebrow="Trajectory"
          title="How the work changed"
          lede="Read upward. Each stage moved the boundary of what I was accountable for."
        />

        <div className="mt-20 space-y-16 sm:space-y-20">
          {roles.map((r) => (
            <article
              key={r.index}
              className="grid gap-6 border-t border-line pt-8 lg:grid-cols-12 lg:gap-10"
            >
              <div className="lg:col-span-4">
                <div className="flex items-baseline gap-4">
                  <span className="t-label text-accent">{r.index}/</span>
                  {r.current && (
                    <span className="t-label inline-flex items-center gap-2 text-run">
                      <span
                        aria-hidden
                        className="inline-block size-1.5 rounded-full bg-current"
                      />
                      Now
                    </span>
                  )}
                </div>
                <h3 className="t-display mt-5 text-[clamp(1.5rem,3.4vw,2.5rem)] uppercase">
                  {r.title}
                </h3>
                <p className="t-mono mt-3 text-[0.8125rem] text-fg-muted">
                  {r.org} · {r.period}
                </p>
              </div>

              <div className="lg:col-span-8">
                <p className="t-display text-[clamp(1.125rem,2.2vw,1.625rem)] tracking-[-0.015em]">
                  {r.frame}
                </p>
                <div className="t-prose mt-5 space-y-3.5 text-[1.0625rem] text-fg-muted">
                  {r.body.map((b, i) => (
                    <p key={i}>{b}</p>
                  ))}
                </div>
                <p className="mt-6 border-l-2 border-accent/50 pl-4 text-[0.9375rem] text-fg">
                  <span className="t-label mr-2 text-accent">Shift</span>
                  {r.shift}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Shell>
  );
}

/* ================================================================== */
/* 04 — Capabilities                                                   */

export function Capabilities() {
  return (
    <Shell>
      <section>
        <SectionHead
          id="capabilities"
          index="04"
          eyebrow="Capabilities"
          title="Grouped by what I do with them"
          lede="A list of logos tells you what someone has installed. This is organised by the job each layer is doing."
        />

        <div className="mt-20 divide-y divide-line border-y border-line">
          {capabilities.map((c) => (
            <div
              key={c.index}
              className="grid gap-4 py-8 lg:grid-cols-12 lg:gap-10"
            >
              <div className="lg:col-span-4">
                <div className="flex items-baseline gap-4">
                  <span className="t-label text-fg-faint">{c.index}</span>
                  <h3 className="t-display text-[clamp(1.25rem,2.6vw,1.875rem)] uppercase">
                    {c.verb}
                  </h3>
                </div>
              </div>
              <div className="lg:col-span-4">
                <p className="t-prose text-[0.9375rem] text-fg-muted">
                  {c.detail}
                </p>
              </div>
              <div className="lg:col-span-4">
                <ul className="flex flex-wrap gap-x-3 gap-y-2">
                  {c.items.map((item) => (
                    <li
                      key={item}
                      className="t-mono text-[0.8125rem] text-fg after:ml-3 after:text-fg-faint after:content-['·'] last:after:content-none"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Shell>
  );
}

/* ================================================================== */
/* 05 — Method                                                         */

export function Method() {
  return (
    <Shell>
      <section>
        <SectionHead
          id="method"
          index="05"
          eyebrow="Method"
          title="Seven things that cost me something"
          lede={methodIntro[0]}
        />

        <div className="mt-20 space-y-20 sm:space-y-24">
          {principles.map((p) => (
            <article
              key={p.index}
              className="grid gap-6 border-t border-line pt-8 lg:grid-cols-12 lg:gap-10"
            >
              <div className="lg:col-span-4">
                <span className="t-label text-accent">{p.index}/</span>
                <h3 className="t-serif mt-4 text-[clamp(1.625rem,3.4vw,2.5rem)] leading-[1.1]">
                  {p.title}
                </h3>
              </div>
              <div className="lg:col-span-8">
                <div className="t-prose space-y-4 text-[1.0625rem] leading-[1.68] text-fg sm:text-[1.125rem]">
                  {p.body.map((b, i) => (
                    <p key={i}>{b}</p>
                  ))}
                </div>
                <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-line-soft pt-4">
                  <span className="t-label text-fg-faint">From</span>
                  <Link
                    href={`/work/${p.evidence.slug}`}
                    className="inline-block py-1 text-[0.9375rem] font-medium text-fg underline decoration-accent/40 underline-offset-4 transition-colors hover:text-accent"
                  >
                    {p.evidence.project}
                  </Link>
                  <span className="t-mono text-[0.8125rem] text-fg-muted">
                    {p.evidence.note}
                  </span>
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Shell>
  );
}

/* ================================================================== */
/* 06 — Contact                                                        */

export function Contact() {
  const links = [
    { label: "Email", value: site.links.email, href: `mailto:${site.links.email}` },
    { label: "GitHub", value: "Elisabeth56", href: site.links.github },
    { label: "LinkedIn", value: "elisabethnnamani", href: site.links.linkedin },
    { label: "X", value: "@elisynthdev", href: site.links.x },
  ];

  return (
    <Shell>
      <section>
        <SectionHead
          id="contact"
          index="06"
          eyebrow="Contact"
          title="Tell me what breaks"
          lede="I am most useful on systems where a wrong answer is expensive and the failure does not announce itself. Open to AI engineering roles and selected contract work."
        />

        <ul className="mt-16 divide-y divide-line border-y border-line">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                {...(l.href.startsWith("mailto")
                  ? {}
                  : { target: "_blank", rel: "noreferrer noopener" })}
                className="group flex items-baseline justify-between gap-6 py-6 transition-colors hover:text-accent sm:py-8"
              >
                <span className="t-label text-fg-faint transition-colors group-hover:text-accent">
                  {l.label}
                </span>
                <span className="t-display flex-1 truncate text-right text-[clamp(1.125rem,3.6vw,2.5rem)]">
                  {l.value}
                </span>
                <span
                  aria-hidden
                  className="translate-x-0 text-fg-faint transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-accent"
                >
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>

        <footer className="flex flex-wrap items-baseline justify-between gap-4 py-14 sm:py-20">
          <p className="t-label text-fg-faint">
            © {new Date().getFullYear()} Elisabeth Nnamani
          </p>
          <p className="t-label text-fg-faint">
            elisynth · built with Next.js, TypeScript and Tailwind
          </p>
        </footer>
      </section>
    </Shell>
  );
}
