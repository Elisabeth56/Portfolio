import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/content/projects";
import { site } from "@/content/site";
import { TraceCanvas } from "@/components/traces/TraceCanvas";
import { TopBar } from "@/components/document/TopBar";
import {
  Label,
  MetaRow,
  Shell,
  StatusPill,
  TextLink,
} from "@/components/document/primitives";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: `${p.name} — ${p.kind}`,
    description: p.tagline,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: {
      type: "article",
      title: `${p.name} — ${site.name}`,
      description: p.tagline,
      url: `${site.domain}/work/${p.slug}`,
    },
    twitter: { card: "summary_large_image", title: p.name, description: p.tagline },
  };
}

export default async function WorkPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const i = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(i + 1) % projects.length];

  return (
    <div data-surface="light" className="relative min-h-screen bg-bg text-fg">
      <div aria-hidden className="tx-paper pointer-events-none fixed inset-0 z-0" />
      <div className="relative z-10">
        <TopBar />

        <main>
          <Shell>
            {/* masthead */}
            <header className="pt-28 sm:pt-32 lg:pt-36">
              <div className="flex flex-wrap items-baseline justify-between gap-4 border-t border-line pt-4">
                <div className="flex items-baseline gap-5">
                  <span className="t-label text-accent">{p.index}/</span>
                  <Label>{p.kind}</Label>
                </div>
                <StatusPill status={p.status} />
              </div>

              <h1 className="t-display mt-10 text-[clamp(3rem,11vw,9rem)] uppercase">
                {p.name}
              </h1>

              <p className="t-display mt-8 max-w-4xl text-[clamp(1.25rem,3vw,2.25rem)] tracking-[-0.02em]">
                {p.tagline}
              </p>
            </header>

            {/* meta + links */}
            <div className="mt-14 grid gap-8 border-t border-line pt-6 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-5">
                <dl>
                  <MetaRow k="Period">{p.period}</MetaRow>
                  <MetaRow k="Role">{p.role}</MetaRow>
                  <MetaRow k="Status">{p.status}</MetaRow>
                </dl>
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
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
              {p.roleNote && (
                <div className="lg:col-span-7">
                  <Label className="mb-3 block">On my role</Label>
                  <p className="t-prose text-[1.0625rem] text-fg-muted">
                    {p.roleNote}
                  </p>
                </div>
              )}
            </div>

            {/* problem */}
            <Section index="01" title="The problem">
              <div className="t-prose space-y-4 text-[1.0625rem] text-fg-muted">
                {p.problem.map((x, n) => (
                  <p key={n}>{x}</p>
                ))}
              </div>
              <p className="t-prose mt-8 border-l-2 border-accent/50 pl-5 text-[1.0625rem] text-fg">
                <span className="t-label mb-2 block text-accent">
                  Why it matters
                </span>
                {p.stakes}
              </p>
            </Section>

            {/* what I built */}
            <Section index="02" title="What I built">
              <div className="t-prose space-y-4 text-[1.0625rem] text-fg-muted">
                {p.built.map((x, n) => (
                  <p key={n}>{x}</p>
                ))}
              </div>
            </Section>
          </Shell>

          {/* architecture — full measure */}
          <Shell>
            <section className="mt-24 border-t border-line pt-6 sm:mt-32">
              <div className="flex items-baseline gap-5">
                <span className="t-label text-accent">03/</span>
                <Label>Architecture</Label>
              </div>
              <h2 className="t-display mt-6 text-[clamp(1.75rem,4.4vw,3.25rem)] uppercase">
                How it holds together
              </h2>
              <div className="mt-9">
                <TraceCanvas trace={p.trace} />
              </div>
              <div className="t-prose mt-10 space-y-4 text-[1.0625rem] text-fg-muted">
                {p.architecture.map((x, n) => (
                  <p key={n}>{x}</p>
                ))}
              </div>
            </section>
          </Shell>

          <Shell>
            {/* decisions */}
            <Section index="04" title="Decisions">
              <ol className="space-y-12">
                {p.decisions.map((d, n) => (
                  <li key={n} className="grid gap-4 lg:grid-cols-12 lg:gap-10">
                    <div className="lg:col-span-4">
                      <span className="t-label text-fg-faint">
                        {String(n + 1).padStart(2, "0")}
                      </span>
                      <h3 className="t-serif mt-3 text-[clamp(1.375rem,2.6vw,1.875rem)] leading-tight">
                        {d.title}
                      </h3>
                    </div>
                    <div className="lg:col-span-8">
                      <p className="t-prose text-[1.0625rem] text-fg-muted">
                        {d.body}
                      </p>
                      {d.cost && (
                        <p className="t-prose mt-4 border-l-2 border-accent/50 pl-5 text-[1.0625rem] text-fg-muted">
                          <span className="t-label mr-2 text-accent">Cost</span>
                          {d.cost}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </Section>

            {/* stack + demonstrates */}
            <Section index="05" title="Stack">
              <div className="grid gap-10 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <div className="divide-y divide-line-soft border-y border-line-soft">
                    {p.stack.map((g) => (
                      <div
                        key={g.group}
                        className="grid grid-cols-[7.5rem_1fr] gap-4 py-4 sm:grid-cols-[9rem_1fr]"
                      >
                        <Label>{g.group}</Label>
                        <ul className="flex flex-wrap gap-x-3 gap-y-2">
                          {g.items.map((it) => (
                            <li
                              key={it}
                              className="t-mono text-[0.8125rem] after:ml-3 after:text-fg-faint after:content-['·'] last:after:content-none"
                            >
                              {it}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-5">
                  <Label className="mb-4 block">What it demonstrates</Label>
                  <ul className="space-y-3">
                    {p.demonstrates.map((d) => (
                      <li
                        key={d}
                        className="flex gap-3 text-[0.9375rem] text-fg-muted"
                      >
                        <span
                          aria-hidden
                          className="mt-[0.5em] text-[0.4rem] text-accent"
                        >
                          ●
                        </span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Section>

            {/* next */}
            <nav className="mt-28 border-t border-line pt-6 sm:mt-36">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <Link
                  href="/read#systems"
                  className="t-label inline-block py-1.5 text-fg-muted transition-colors hover:text-accent"
                >
                  ← All systems
                </Link>
                <Link href={`/work/${next.slug}`} className="group text-right">
                  <span className="t-label block text-fg-faint">Next</span>
                  <span className="t-display mt-2 block text-[clamp(1.75rem,5vw,3.5rem)] uppercase transition-colors group-hover:text-accent">
                    {next.name}
                  </span>
                </Link>
              </div>
              <p className="t-label py-14 text-fg-faint">
                © {new Date().getFullYear()} Elisabeth Nnamani
              </p>
            </nav>
          </Shell>
        </main>
      </div>
    </div>
  );
}

function Section({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-24 border-t border-line pt-6 sm:mt-32">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-3">
          <div className="flex items-baseline gap-4 lg:sticky lg:top-24 lg:block">
            <span className="t-label text-accent">{index}/</span>
            <h2 className="t-display mt-0 text-[clamp(1.25rem,2.4vw,1.75rem)] uppercase lg:mt-3">
              {title}
            </h2>
          </div>
        </div>
        <div className="lg:col-span-9">{children}</div>
      </div>
    </section>
  );
}
