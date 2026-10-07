"use client";

import { useEffect } from "react";
import { site } from "@/content/site";
import { STARTUP_KEY } from "@/lib/theme";

const DURATION_MS = 2800;

/**
 * The Mac moment: her name over a filling progress bar, then the screen lifts
 * and the desk settles in. The
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
      <div className="flex flex-col items-center gap-9 pb-[6vh]">
        <span className="text-[2rem] font-semibold tracking-[-0.03em] lg:text-[2.5rem]">
          {site.name}
        </span>
        <span className="h-[5px] w-44 overflow-hidden rounded-full bg-well lg:w-52">
          <span className="startup-bar block size-full origin-left rounded-full bg-ink" />
        </span>
      </div>
    </div>
  );
}
