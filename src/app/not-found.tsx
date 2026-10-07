import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main
     
      className="relative flex min-h-dvh flex-col overflow-hidden px-5 py-6 md:px-8 md:py-3.5"
    >
      <p className="text-sm font-semibold md:text-[0.9375rem]">
        {site.name}
        <span className="ml-3 hidden font-normal text-ink-2 md:inline">{site.role}</span>
      </p>

      <IconColumn />

      <div className="mx-auto flex w-full max-w-[45rem] flex-1 flex-col md:items-center md:justify-center md:pb-24 md:text-center">
        <div className="mt-24 flex items-center gap-4 pl-6 md:mt-0 md:pl-0">
          <span className="grid size-24 -rotate-[11deg] place-items-center rounded-[30px] bg-accent text-on-accent shadow-dock md:size-[7.5rem] md:rounded-[38px]">
            <PageGlyph />
          </span>
          <span className="rotate-[4deg] font-hand text-2xl text-accent md:text-[1.625rem]">
            wandered off
          </span>
        </div>

        <h1 className="mt-14 text-[2.5rem] leading-[1.04] font-medium tracking-[-0.035em] text-balance md:mt-12 md:text-[4.75rem] md:leading-[1.02]">
          That page isn&rsquo;t on the desk
        </h1>
        <p className="mt-4 max-w-[30rem] text-[1.0625rem] leading-normal text-pretty text-ink-2 md:mt-5 md:text-[1.1875rem]">
          It may have moved, or the link was mistyped. Everything else is where you left it.
        </p>

        <div className="mt-auto flex flex-col gap-2 pt-10 md:mt-8 md:flex-row md:items-center md:gap-6 md:pt-0">
          <ButtonLink href="/">Back to the desk</ButtonLink>
          <ButtonLink href="/read" variant="text">
            Read as one document
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}

/* The desk's icon column with one place empty: the page that wandered off. */
function IconColumn() {
  const tile = "size-[68px] rounded-icon bg-surface shadow-lift";
  return (
    <div aria-hidden className="absolute top-[84px] right-[54px] hidden flex-col gap-11 lg:flex">
      <span className={tile} />
      <span className={tile} />
      <span className="size-[68px] rounded-icon border-2 border-dashed border-ink-4" />
      <span className={tile} />
      <span className={tile} />
    </div>
  );
}

function PageGlyph() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-[42px] md:size-[52px]"
    >
      <path d="M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V4.5a1 1 0 0 1 1-1Z" />
      <path d="M14 3.5V8h4" />
    </svg>
  );
}
