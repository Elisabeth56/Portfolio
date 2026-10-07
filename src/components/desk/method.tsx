"use client";

import { useState } from "react";
import { SectionHead } from "@/components/ui/section-head";
import { methodIntro, principles } from "@/content/method";
import { WindowLink } from "./project-window";

/** The seven principles as a list that opens one at a time, each tied to its project. */
export function Method() {
  const [open, setOpen] = useState(0);

  return (
    <section id="method" aria-labelledby="method-title" className="flex scroll-mt-6 flex-col gap-5 lg:gap-10">
      <SectionHead id="method-title" title="Seven things that cost me something" lede={methodIntro[0]} />
      <ul className="flex flex-col gap-2">
        {principles.map((principle, i) => {
          const isOpen = open === i;
          const panel = `principle-${principle.index}`;
          return (
            <li key={principle.index} className="rounded-[20px] bg-surface lg:rounded-3xl">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex min-h-[60px] w-full items-center justify-between gap-6 rounded-[20px] px-5 py-3 text-left text-[1.0625rem] leading-[1.3] font-medium transition-colors duration-200 ease-ui hover:text-accent lg:min-h-[68px] lg:rounded-3xl lg:px-8 lg:text-xl lg:tracking-[-0.015em]"
              >
                {principle.title}
                <span className="hidden shrink-0 text-sm font-normal tracking-normal text-ink-2 lg:inline">
                  {principle.evidence.project}
                </span>
              </button>
              {isOpen && (
                <div id={panel} className="flex flex-col gap-3 px-5 pb-5 lg:px-8 lg:pb-7">
                  {principle.body.map((paragraph) => (
                    <p key={paragraph} className="max-w-[65ch] text-[0.9375rem] leading-[1.55] text-ink-2 lg:text-base">
                      {paragraph}
                    </p>
                  ))}
                  <p className="mt-1 text-sm text-ink-2">
                    Learned on{" "}
                    <WindowLink
                      slug={principle.evidence.slug}
                      className="font-medium text-accent transition-colors duration-200 ease-ui hover:text-ink"
                    >
                      {principle.evidence.project}
                    </WindowLink>{" "}
                    · {principle.evidence.note}
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
