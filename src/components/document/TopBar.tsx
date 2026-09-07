"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { navSections, site } from "@/content/site";
import { projects } from "@/content/projects";
import { cn, MODE_KEY, WORKSTATION_MIN_WIDTH } from "@/lib/utils";
import { useEscape, useMediaQuery } from "@/lib/hooks";

export function TopBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const roomy = useMediaQuery(`(min-width: ${WORKSTATION_MIN_WIDTH}px)`);

  useEscape(open, () => setOpen(false));

  const enterWorkstation = () => {
    try {
      window.localStorage.setItem(MODE_KEY, "workstation");
    } catch {
      /* private mode — the session still switches, it just will not persist */
    }
    setOpen(false);
    if (pathname === "/") {
      window.dispatchEvent(new CustomEvent("elisynth:mode"));
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          scrolled && !open
            ? "border-b border-line bg-bg/85 backdrop-blur-md"
            : "border-b border-transparent",
        )}
      >
        <div className="mx-auto flex w-full max-w-[1680px] items-center justify-between px-5 py-4 sm:px-8 lg:px-14 xl:px-20">
          <Link
            href="/"
            className="t-mono inline-block py-1.5 text-[0.8125rem] font-medium tracking-tight text-fg transition-colors hover:text-accent"
          >
            elisynth
            <span className="text-fg-faint">/</span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            {roomy && (
              <button
                type="button"
                onClick={enterWorkstation}
                className="t-label inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-2 text-fg-muted transition-colors hover:border-accent hover:text-accent"
              >
                <span aria-hidden>⌘</span> Workstation
              </button>
            )}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="doc-index"
              className="t-label rounded-full border border-line px-3.5 py-2 text-fg transition-colors hover:border-accent hover:text-accent"
            >
              {open ? "Close" : "Index"}
            </button>
          </div>
        </div>
      </header>

      {/* index overlay */}
      <div
        id="doc-index"
        hidden={!open}
        className="fixed inset-0 z-40 overflow-y-auto bg-bg"
      >
        <div className="mx-auto w-full max-w-[1680px] px-5 pb-16 pt-24 sm:px-8 lg:px-14 xl:px-20">
          <div className="grid gap-12 lg:grid-cols-12">
            <nav className="lg:col-span-7" aria-label="Sections">
              <ul>
                {navSections.map((s) => (
                  <li key={s.id} className="border-t border-line">
                    <a
                      href={`#${s.id}`}
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline gap-5 py-4 transition-colors hover:text-accent sm:py-5"
                    >
                      <span className="t-label text-fg-faint transition-colors group-hover:text-accent">
                        {s.index}
                      </span>
                      <span className="t-display text-[clamp(1.75rem,5.5vw,3.5rem)] uppercase">
                        {s.label}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="lg:col-span-5">
              <p className="t-label text-fg-faint">Case studies</p>
              <ul className="mt-4">
                {projects.map((p) => (
                  <li key={p.slug} className="border-t border-line-soft">
                    <Link
                      href={`/work/${p.slug}`}
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline justify-between gap-4 py-3 transition-colors hover:text-accent"
                    >
                      <span className="text-[0.9375rem] font-medium">
                        {p.name}
                      </span>
                      <span className="t-mono text-[0.75rem] text-fg-faint">
                        {p.kind}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="t-label mt-10 text-fg-faint">Elsewhere</p>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                {[
                  { l: "Email", h: `mailto:${site.links.email}` },
                  { l: "GitHub", h: site.links.github },
                  { l: "LinkedIn", h: site.links.linkedin },
                  { l: "X", h: site.links.x },
                ].map((x) => (
                  <li key={x.l}>
                    <a
                      href={x.h}
                      target={x.h.startsWith("mailto") ? undefined : "_blank"}
                      rel="noreferrer noopener"
                      className="text-[0.9375rem] underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                    >
                      {x.l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
