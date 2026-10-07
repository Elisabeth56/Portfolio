"use client";

import { useState } from "react";
import type { Decision } from "@/content/projects";
import { cn } from "@/lib/utils";

/** The calls behind a project, one open at a time, the first open to start. */
export function Decisions({ decisions }: { decisions: Decision[] }) {
  const [open, setOpen] = useState(0);

  return (
    <section aria-labelledby="decisions-title" className="flex flex-col gap-5 lg:gap-8">
      <h2
        id="decisions-title"
        className="text-[2.25rem] leading-[1.04] font-medium tracking-[-0.035em] lg:text-[3.5rem] lg:leading-[1.02]"
      >
        Decisions
      </h2>
      <ul className="flex flex-col gap-2">
        {decisions.map((decision, i) => {
          const isOpen = open === i;
          const panel = `decision-${i}`;
          return (
            <li key={decision.title} className="rounded-[20px] bg-surface lg:rounded-3xl">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className={cn(
                  "flex min-h-[60px] w-full items-center justify-between gap-6 rounded-[20px] px-5 py-3 text-left text-[1.0625rem] leading-[1.3] font-medium transition-colors duration-200 ease-ui hover:text-accent lg:min-h-[68px] lg:rounded-3xl lg:px-8 lg:text-xl lg:tracking-[-0.015em]",
                  isOpen && "lg:pt-6 lg:text-[1.375rem]",
                )}
              >
                {decision.title}
                {decision.cost && !isOpen && (
                  <span className="shrink-0 text-sm font-normal tracking-normal text-caution">
                    has a cost
                  </span>
                )}
              </button>
              {isOpen && (
                <div id={panel} className="flex flex-col gap-3 px-5 pb-5 lg:px-8 lg:pb-7">
                  <p className="max-w-[65ch] text-[0.9375rem] leading-[1.55] text-ink-2 lg:text-base">
                    {decision.body}
                  </p>
                  {decision.cost && (
                    <p className="max-w-[65ch] text-[0.9375rem] leading-[1.55] lg:text-base">
                      <span className="text-caution">The cost: </span>
                      {decision.cost}
                    </p>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
