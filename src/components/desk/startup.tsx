"use client";

import { useEffect } from "react";
import { site } from "@/content/site";
import { STARTUP_KEY } from "@/lib/theme";

const DURATION_MS = 1700;

/**
 * The Mac moment: her name on plain paper, then the desk settles in. The
 * animation is CSS keyed on <html data-startup>, set before paint, so this
 * component only has to end it: on a timer, or at once on any key or tap.
 */
export function Startup() {
  useEffect(() => {
    const root = document.documentElement;
    if (!("startup" in root.dataset)) return;

    const finish = () => {
      delete root.dataset.startup;
      try {
        sessionStorage.setItem(STARTUP_KEY, "1");
      } catch {
        /* without storage it simply plays again next load */
      }
    };
    const timer = window.setTimeout(finish, DURATION_MS);
    window.addEventListener("keydown", finish, { once: true });
    window.addEventListener("pointerdown", finish, { once: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", finish);
      window.removeEventListener("pointerdown", finish);
    };
  }, []);

  return (
    <div aria-hidden className="startup-mark fixed inset-0 z-50 place-items-center bg-paper">
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-[1.375rem] font-medium tracking-[-0.02em]">{site.name}</span>
        <svg viewBox="0 0 150 10" fill="none" className="h-2.5 w-[150px] text-accent">
          <path
            className="startup-stroke"
            pathLength={1}
            d="M3 6C40 2 80 8 147 4"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
