import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Decisions } from "@/components/case/decisions";
import { Glyph, type GlyphId } from "@/components/desk/glyphs";
import { ProjectChapter } from "@/components/trace/project-chapter";
import { getProject, type Project, projects } from "@/content/projects";
import { site } from "@/content/site";

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

/* The lead project's aside, the only handwritten line on its case page. */
const asides: Partial<Record<string, string>> = { prismos: "they have to disagree" };

export default async function WorkPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const i = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(i + 1) % projects.length];
  // Back to where the visitor most likely came from: the lead chapter or the cards.
  const back = i === 0 ? `/#${p.slug}` : "/#systems";

  return (
    <main className="min-h-dvh">
      <nav
        aria-label="Case study"
        className="flex h-16 items-center justify-between px-5 text-sm lg:h-12 lg:px-8"
      >
        <Link
          href={back}
          className="-ml-1 flex h-11 items-center gap-2 px-1 text-[0.9375rem] text-ink-2 transition-colors duration-200 ease-ui hover:text-accent lg:gap-3 lg:text-sm"
        >
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-[18px] lg:hidden"
          >
            <path d="M15 5l-7 7 7 7" />
          </svg>
          <span className="hidden font-semibold text-ink lg:inline">{site.name}</span>
          Back to the desk
        </Link>
        <span className="hidden text-ink-2 lg:inline">
          Systems · {i + 1} of {projects.length}
        </span>
      </nav>

      <div className="mx-auto flex max-w-[79rem] flex-col gap-24 px-5 pt-6 pb-24 lg:gap-40 lg:px-8 lg:pt-[5.5rem] lg:pb-36">
        <Header project={p} />

        <div className="-mt-10 lg:-mt-16">
          <ProjectChapter project={p} variant="case" aside={asides[p.slug]} />
        </div>

        <ProblemAndBuild project={p} />

        <section aria-labelledby="architecture-title" className="flex flex-col gap-4 lg:gap-5">
          <h2
            id="architecture-title"
            className="text-[1.75rem] leading-[1.12] font-medium tracking-[-0.025em] lg:text-[2rem]"
          >
            The architecture
          </h2>
          {p.architecture.map((paragraph) => (
            <p
              key={paragraph}
              className="max-w-[65ch] text-base leading-[1.55] text-ink-2 lg:text-[1.0625rem]"
            >
              {paragraph}
            </p>
          ))}
        </section>

        <Decisions decisions={p.decisions} />

        <StackAndProof project={p} />

        <Link
          href={`/work/${next.slug}`}
          className="group -mt-8 flex h-[8.25rem] items-center justify-between rounded-[28px] bg-surface px-6 text-ink transition-[background-color,transform] duration-200 ease-ui hover:bg-[color-mix(in_srgb,var(--color-ink)_3%,var(--color-surface))] active:scale-[0.99] lg:h-[12.5rem] lg:rounded-[32px] lg:px-14"
        >
          <span className="flex flex-col gap-1.5 lg:gap-2">
            <span className="text-sm text-ink-2 lg:text-[0.9375rem]">Next system</span>
            <span className="text-[2.25rem] leading-none font-medium tracking-[-0.035em] transition-colors duration-200 ease-ui group-hover:text-accent lg:text-[4rem]">
              {next.name}
            </span>
          </span>
          <span className="grid size-16 place-items-center rounded-[20px] bg-well text-accent lg:size-24 lg:rounded-[30px]">
            <Glyph id={next.slug as GlyphId} className="size-7 lg:size-[42px]" />
          </span>
        </Link>
      </div>
    </main>
  );
}

function Header({ project: p }: { project: Project }) {
  const link = p.links.live ?? p.links.repo;
  return (
    <header className="flex flex-col gap-[18px] lg:flex-row lg:items-end lg:gap-20">
      <div className="flex flex-col gap-[18px] lg:w-[40rem] lg:shrink-0 lg:gap-6">
        <div className="mt-3 flex items-center gap-3 lg:mt-0 lg:gap-3.5">
          <span className="grid size-12 shrink-0 place-items-center rounded-[15px] bg-accent text-on-accent lg:size-[52px] lg:rounded-[17px]">
            <Glyph id={p.slug as GlyphId} className="size-6 lg:size-[26px]" />
          </span>
          <span className="text-sm text-ink-2 lg:text-[0.9375rem]">
            {p.kind} · {p.period} ·{" "}
            <span className={p.status === "Submitted" ? undefined : "text-positive"}>
              {p.status}
            </span>
          </span>
        </div>
        <h1 className="text-[4rem] leading-[0.95] font-medium tracking-[-0.045em] lg:text-[7rem]">
          {p.name}
        </h1>
        <p className="text-2xl leading-[1.2] tracking-[-0.02em] text-pretty lg:text-[2rem] lg:leading-[1.18] lg:tracking-[-0.025em]">
          {p.tagline}
        </p>
        <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="flex h-12 items-center justify-center rounded-full bg-accent-tint px-6 text-base font-medium text-accent-ink transition-[background-color,transform] duration-200 ease-ui hover:bg-[color-mix(in_srgb,var(--color-accent)_10%,var(--color-accent-tint))] active:scale-[0.98] lg:self-start"
            >
              {p.links.live ? `Visit ${p.name}` : "Read the code"}
            </a>
          )}
          <span className="hidden text-[0.9375rem] text-ink-2 lg:inline">{p.role}</span>
        </div>
        {!p.links.live && p.trace.mode === "offline" && (
          <p className="text-[0.9375rem] leading-normal text-ink-2">
            It runs offline on a laptop, so there is nothing to visit.
          </p>
        )}
      </div>
      {p.roleNote && (
        <div className="flex flex-col gap-1.5 rounded-[20px] bg-surface p-[18px] lg:grow lg:gap-2.5 lg:rounded-3xl lg:p-7">
          <span className="text-[0.8125rem] text-ink-2 lg:text-sm">
            <span className="lg:hidden">{p.role}</span>
            <span className="hidden lg:inline">On my role</span>
          </span>
          <p className="text-[0.9375rem] leading-normal lg:text-base lg:leading-[1.55]">
            {p.roleNote}
          </p>
        </div>
      )}
    </header>
  );
}

function ProblemAndBuild({ project: p }: { project: Project }) {
  const heading =
    "text-[1.75rem] leading-[1.12] font-medium tracking-[-0.025em] lg:text-[2rem]";
  const body = "max-w-[65ch] text-base leading-[1.55] text-ink-2 lg:text-[1.0625rem]";
  return (
    <div className="flex flex-col gap-10 lg:grid lg:grid-cols-2 lg:gap-20">
      <section aria-labelledby="problem-title" className="flex flex-col gap-4 lg:gap-5">
        <h2 id="problem-title" className={heading}>
          The problem
        </h2>
        {p.problem.map((paragraph) => (
          <p key={paragraph} className={body}>
            {paragraph}
          </p>
        ))}
        <p className="max-w-[65ch] text-base leading-[1.55] lg:text-[1.0625rem]">{p.stakes}</p>
      </section>
      <section aria-labelledby="built-title" className="flex flex-col gap-4 lg:gap-5">
        <h2 id="built-title" className={heading}>
          What I built
        </h2>
        {p.built.map((paragraph) => (
          <p key={paragraph} className={body}>
            {paragraph}
          </p>
        ))}
        <figure className="mt-2 overflow-hidden rounded-[20px] bg-well lg:rounded-3xl">
          <Image
            src={`/img/work/${p.slug}.webp`}
            alt={p.shot.alt}
            width={p.shot.width}
            height={p.shot.height}
            sizes="(min-width: 1024px) 560px, calc(100vw - 40px)"
            className="h-auto w-full"
          />
        </figure>
      </section>
    </div>
  );
}

function StackAndProof({ project: p }: { project: Project }) {
  return (
    <div className="flex flex-col gap-16 lg:flex-row lg:gap-20">
      <section aria-labelledby="stack-title" className="flex flex-col gap-4 lg:w-[38.75rem] lg:shrink-0 lg:gap-6">
        <h2
          id="stack-title"
          className="text-[1.75rem] leading-[1.12] font-medium tracking-[-0.025em] lg:text-[2rem]"
        >
          Stack
        </h2>
        <dl className="flex flex-col rounded-3xl bg-surface px-5 py-2 text-[0.9375rem] lg:px-7">
          {p.stack.map((group) => (
            <div
              key={group.group}
              className="flex flex-col gap-0.5 py-3 lg:min-h-14 lg:flex-row lg:items-center lg:gap-6"
            >
              <dt className="text-[0.8125rem] text-ink-2 lg:w-[8.125rem] lg:shrink-0 lg:text-[0.9375rem]">
                {group.group}
              </dt>
              <dd>{group.items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section aria-labelledby="proof-title" className="flex flex-col gap-4 lg:grow lg:gap-6">
        <h2
          id="proof-title"
          className="text-[1.75rem] leading-[1.12] font-medium tracking-[-0.025em] lg:text-[2rem]"
        >
          What it demonstrates
        </h2>
        <ul className="flex flex-col gap-3.5 text-base leading-[1.4] lg:pt-3 lg:text-[1.0625rem]">
          {p.demonstrates.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
