"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Project } from "@/content/projects";
import { projects } from "@/content/projects";
import { roles, capabilities } from "@/content/experience";
import { principles, methodIntro } from "@/content/method";
import { site } from "@/content/site";
import { TraceCanvas } from "@/components/traces/TraceCanvas";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */

function Pad({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("p-5 sm:p-7", className)}>{children}</div>;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="t-label text-fg-faint">{children}</p>;
}

/* ------------------------------------------------------------------ */
/* Project — the tabbed anatomy                                        */

const TABS = ["brief", "architecture", "decisions", "stack"] as const;
type Tab = (typeof TABS)[number];

export function ProjectWindow({ project }: { project: Project }) {
  const [tab, setTab] = useState<Tab>("brief");

  return (
    <div>
      <div
        role="tablist"
        aria-label={`${project.name} sections`}
        className="sticky top-0 z-10 flex gap-1 border-b border-line-soft bg-surface/95 px-3 py-2 backdrop-blur"
      >
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn(
              "t-label rounded px-2.5 py-1.5 transition-colors",
              tab === t
                ? "bg-raised text-accent"
                : "text-fg-faint hover:text-fg",
            )}
          >
            {t}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-3 pr-1">
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noreferrer noopener"
              className="t-label text-run transition-opacity hover:opacity-75"
            >
              live ↗
            </a>
          )}
          {project.links.repo && (
            <a
              href={project.links.repo}
              target="_blank"
              rel="noreferrer noopener"
              className="t-label text-fg-muted transition-colors hover:text-fg"
            >
              repo ↗
            </a>
          )}
        </div>
      </div>

      {tab === "brief" && (
        <Pad className="space-y-7">
          <div>
            <div className="flex flex-wrap items-baseline gap-x-3">
              <span className="t-label text-accent">{project.index}/</span>
              <h2 className="t-display text-3xl uppercase sm:text-4xl">
                {project.name}
              </h2>
            </div>
            <p className="t-mono mt-2 text-xs text-fg-faint">
              {project.kind} · {project.period} · {project.status}
            </p>
            <p className="mt-5 text-[1.0625rem] font-medium leading-snug text-fg">
              {project.tagline}
            </p>
          </div>

          <section>
            <Eyebrow>The problem</Eyebrow>
            <div className="t-prose mt-2.5 space-y-3 text-[0.9375rem] text-fg-muted">
              {project.problem.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          <section>
            <Eyebrow>Why it matters</Eyebrow>
            <p className="t-prose mt-2.5 text-[0.9375rem] text-fg-muted">
              {project.stakes}
            </p>
          </section>

          <section>
            <Eyebrow>What I built</Eyebrow>
            <div className="t-prose mt-2.5 space-y-3 text-[0.9375rem] text-fg-muted">
              {project.built.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          <section className="border-t border-line-soft pt-5">
            <Eyebrow>My role</Eyebrow>
            <p className="mt-2 text-[0.9375rem] font-medium text-fg">
              {project.role}
            </p>
            {project.roleNote && (
              <p className="t-prose mt-2 text-[0.9375rem] text-fg-muted">
                {project.roleNote}
              </p>
            )}
          </section>

          <section className="border-t border-line-soft pt-5">
            <Eyebrow>What it demonstrates</Eyebrow>
            <ul className="mt-3 space-y-1.5">
              {project.demonstrates.map((d) => (
                <li
                  key={d}
                  className="flex gap-2.5 text-[0.9375rem] text-fg-muted"
                >
                  <span aria-hidden className="mt-[0.45em] text-[0.4rem] text-accent">
                    ●
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </section>
        </Pad>
      )}

      {tab === "architecture" && (
        <Pad className="space-y-6">
          <TraceCanvas trace={project.trace} />
          <section className="border-t border-line-soft pt-5">
            <Eyebrow>How it holds together</Eyebrow>
            <div className="t-prose mt-2.5 space-y-3 text-[0.9375rem] text-fg-muted">
              {project.architecture.map((a, i) => (
                <p key={i}>{a}</p>
              ))}
            </div>
          </section>
        </Pad>
      )}

      {tab === "decisions" && (
        <Pad className="space-y-6">
          <p className="t-prose text-[0.9375rem] text-fg-muted">
            The calls that shaped this build, including the ones that cost
            something.
          </p>
          <ol className="space-y-6">
            {project.decisions.map((d, i) => (
              <li key={i} className="border-t border-line-soft pt-5">
                <div className="flex gap-3">
                  <span className="t-label mt-1 text-fg-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[1rem] font-medium text-fg">
                      {d.title}
                    </h3>
                    <p className="t-prose mt-2 text-[0.9375rem] text-fg-muted">
                      {d.body}
                    </p>
                    {d.cost && (
                      <p className="t-prose mt-3 border-l-2 border-accent/50 pl-3.5 text-[0.9375rem] text-fg-muted">
                        <span className="t-label mr-2 text-accent">Cost</span>
                        {d.cost}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Pad>
      )}

      {tab === "stack" && (
        <Pad className="space-y-5">
          {project.stack.map((g) => (
            <div
              key={g.group}
              className="grid grid-cols-[7.5rem_1fr] gap-4 border-t border-line-soft pt-4"
            >
              <Eyebrow>{g.group}</Eyebrow>
              <ul className="flex flex-wrap gap-x-2.5 gap-y-1.5">
                {g.items.map((it) => (
                  <li
                    key={it}
                    className="t-mono text-[0.8125rem] text-fg after:ml-2.5 after:text-fg-faint after:content-['·'] last:after:content-none"
                  >
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Pad>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function AboutWindow() {
  return (
    <Pad className="space-y-6">
      <div className="flex gap-5">
        <Image
          src="/img/portrait-duo.webp"
          alt="Elisabeth Nnamani"
          width={360}
          height={450}
          sizes="140px"
          className="h-auto w-[7.5rem] shrink-0 rounded"
        />
        <div className="min-w-0">
          <h2 className="t-display text-2xl uppercase">Elisabeth Nnamani</h2>
          <p className="t-mono mt-1.5 text-xs text-fg-faint">
            AI Software Engineer · Computer Science student
          </p>
          <p className="t-mono mt-1 text-xs text-fg-faint">
            {site.location} · WAT (UTC+1)
          </p>
          <p className="mt-4 text-[0.9375rem] font-medium leading-snug text-accent">
            {site.thesis}
          </p>
        </div>
      </div>

      <div className="t-prose space-y-3.5 border-t border-line-soft pt-5 text-[0.9375rem] text-fg-muted">
        {site.about.map((p, i) => (
          <p key={i} className={i === 0 ? "text-fg" : undefined}>
            {p}
          </p>
        ))}
      </div>

      <div className="border-t border-line-soft pt-5">
        <Eyebrow>Currently</Eyebrow>
        <dl className="mt-3 space-y-2 text-[0.9375rem]">
          <div className="flex gap-3">
            <dt className="t-mono w-20 shrink-0 text-xs text-fg-faint">
              building
            </dt>
            <dd className="text-fg-muted">{site.now.building}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="t-mono w-20 shrink-0 text-xs text-fg-faint">
              reading
            </dt>
            <dd className="text-fg-muted">{site.now.reading}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="t-mono w-20 shrink-0 text-xs text-fg-faint">
              status
            </dt>
            <dd className="text-run">{site.now.open}</dd>
          </div>
        </dl>
      </div>
    </Pad>
  );
}

/* ------------------------------------------------------------------ */

export function TrajectoryWindow() {
  return (
    <Pad className="space-y-7">
      <div>
        <h2 className="t-display text-2xl uppercase">How the work changed</h2>
        <p className="t-prose mt-2 text-[0.9375rem] text-fg-muted">
          Read downward. Each stage moved the boundary of what I was
          accountable for.
        </p>
      </div>

      <ol className="space-y-6">
        {roles.map((r) => (
          <li key={r.index} className="border-t border-line-soft pt-5">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="t-label text-accent">{r.index}/</span>
              <h3 className="text-[1rem] font-medium text-fg">{r.title}</h3>
              {r.current && (
                <span className="t-label inline-flex items-center gap-1.5 text-run">
                  <span
                    aria-hidden
                    className="inline-block size-1.5 rounded-full bg-current"
                  />
                  now
                </span>
              )}
            </div>
            <p className="t-mono mt-1.5 text-xs text-fg-faint">
              {r.org} · {r.period}
            </p>
            <p className="mt-3 text-[0.9375rem] font-medium text-fg">
              {r.frame}
            </p>
            <div className="t-prose mt-2.5 space-y-2.5 text-[0.9375rem] text-fg-muted">
              {r.body.map((b, i) => (
                <p key={i}>{b}</p>
              ))}
            </div>
            <p className="t-prose mt-3 border-l-2 border-accent/50 pl-3.5 text-[0.9375rem] text-fg-muted">
              <span className="t-label mr-2 text-accent">Shift</span>
              {r.shift}
            </p>
          </li>
        ))}
      </ol>
    </Pad>
  );
}

/* ------------------------------------------------------------------ */

export function CapabilitiesWindow() {
  return (
    <Pad className="space-y-5">
      <div>
        <h2 className="t-display text-2xl uppercase">Capabilities</h2>
        <p className="t-prose mt-2 text-[0.9375rem] text-fg-muted">
          Grouped by the job each layer is doing, because a list of logos only
          tells you what someone has installed.
        </p>
      </div>
      {capabilities.map((c) => (
        <section key={c.index} className="border-t border-line-soft pt-4">
          <div className="flex items-baseline gap-3">
            <span className="t-label text-fg-faint">{c.index}</span>
            <h3 className="text-[0.9375rem] font-medium text-fg">{c.verb}</h3>
          </div>
          <p className="t-prose mt-1.5 text-[0.875rem] text-fg-muted">
            {c.detail}
          </p>
          <ul className="mt-2.5 flex flex-wrap gap-x-2.5 gap-y-1.5">
            {c.items.map((i) => (
              <li
                key={i}
                className="t-mono text-[0.8125rem] text-fg after:ml-2.5 after:text-fg-faint after:content-['·'] last:after:content-none"
              >
                {i}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </Pad>
  );
}

/* ------------------------------------------------------------------ */

export function MethodWindow() {
  return (
    <Pad className="space-y-7">
      <div>
        <h2 className="t-serif text-3xl leading-tight">
          Seven things that cost me something
        </h2>
        <p className="t-prose mt-3 text-[0.9375rem] text-fg-muted">
          {methodIntro[0]}
        </p>
      </div>

      <ol className="space-y-7">
        {principles.map((p) => (
          <li key={p.index} className="border-t border-line-soft pt-5">
            <span className="t-label text-accent">{p.index}/</span>
            <h3 className="t-serif mt-2 text-2xl leading-tight text-fg">
              {p.title}
            </h3>
            <div className="t-prose mt-3 space-y-3 text-[0.9375rem] leading-relaxed text-fg-muted">
              {p.body.map((b, i) => (
                <p key={i}>{b}</p>
              ))}
            </div>
            <p className="mt-3 flex flex-wrap items-baseline gap-x-2.5 gap-y-1 border-t border-line-soft pt-3">
              <span className="t-label text-fg-faint">From</span>
              <Link
                href={`/work/${p.evidence.slug}`}
                className="text-[0.875rem] font-medium text-fg underline decoration-accent/40 underline-offset-4 hover:text-accent"
              >
                {p.evidence.project}
              </Link>
              <span className="t-mono text-[0.75rem] text-fg-faint">
                {p.evidence.note}
              </span>
            </p>
          </li>
        ))}
      </ol>
    </Pad>
  );
}

/* ------------------------------------------------------------------ */

export function ContactWindow() {
  const rows = [
    { k: "email", v: site.links.email, h: `mailto:${site.links.email}` },
    { k: "github", v: "Elisabeth56", h: site.links.github },
    { k: "linkedin", v: "elisabethnnamani", h: site.links.linkedin },
    { k: "x", v: "@elisynthdev", h: site.links.x },
  ];

  return (
    <Pad className="space-y-6">
      <div>
        <h2 className="t-display text-2xl uppercase">Tell me what breaks</h2>
        <p className="t-prose mt-3 text-[0.9375rem] text-fg-muted">
          I am most useful on systems where a wrong answer is expensive and the
          failure does not announce itself. Open to AI engineering roles and
          selected contract work.
        </p>
      </div>

      <ul className="divide-y divide-line-soft border-y border-line-soft">
        {rows.map((r) => (
          <li key={r.k}>
            <a
              href={r.h}
              {...(r.h.startsWith("mailto")
                ? {}
                : { target: "_blank", rel: "noreferrer noopener" })}
              className="group flex items-baseline justify-between gap-4 py-3.5 transition-colors hover:text-accent"
            >
              <span className="t-label text-fg-faint transition-colors group-hover:text-accent">
                {r.k}
              </span>
              <span className="t-mono truncate text-[0.875rem]">{r.v}</span>
              <span
                aria-hidden
                className="text-fg-faint transition-transform group-hover:translate-x-1 group-hover:text-accent"
              >
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>

      <p className="t-prose text-[0.875rem] text-fg-faint">
        Everything on this workstation also exists as a plain scrolling
        document, which is the version to send to someone on a phone.
      </p>
    </Pad>
  );
}

/* ------------------------------------------------------------------ */

export function SystemsIndexWindow({
  onOpen,
}: {
  onOpen: (slug: string) => void;
}) {
  return (
    <Pad className="space-y-4">
      <div>
        <h2 className="t-display text-2xl uppercase">Selected systems</h2>
        <p className="t-prose mt-2 text-[0.9375rem] text-fg-muted">
          Five answers to the same question: what has to be true for a language
          model to be trusted inside a system that has to be correct?
        </p>
      </div>
      <ul className="divide-y divide-line-soft border-t border-line-soft">
        {projects.map((p) => (
          <li key={p.slug}>
            <button
              type="button"
              onClick={() => onOpen(p.slug)}
              className="group flex w-full items-baseline gap-3 py-3 text-left transition-colors hover:text-accent"
            >
              <span className="t-label text-fg-faint">{p.index}</span>
              <span className="text-[0.9375rem] font-medium">{p.name}</span>
              <span className="t-mono ml-auto truncate text-[0.75rem] text-fg-faint">
                {p.kind}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Pad>
  );
}
