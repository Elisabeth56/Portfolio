"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { projects, getProject } from "@/content/projects";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { useZonedClock } from "@/lib/hooks";
import { Boot } from "./Boot";
import { MiniTrace } from "./MiniTrace";
import { Terminal } from "./Terminal";
import { WindowFrame, type WindowSpec } from "./WindowFrame";
import {
  AboutWindow,
  CapabilitiesWindow,
  ContactWindow,
  MethodWindow,
  ProjectWindow,
  SystemsIndexWindow,
  TrajectoryWindow,
} from "./windows";

/* ------------------------------------------------------------------ */

const PANELS: Record<string, Omit<WindowSpec, "id">> = {
  about: { title: "about", subtitle: "identity", width: 700, height: 620 },
  systems: { title: "systems", subtitle: "index", width: 560, height: 480 },
  trajectory: { title: "trajectory", subtitle: "experience", width: 760, height: 640 },
  capabilities: { title: "capabilities", subtitle: "stack", width: 760, height: 620 },
  method: { title: "method.md", subtitle: "how I think", width: 800, height: 680 },
  contact: { title: "contact", width: 620, height: 520 },
};

/** Desk composition — deliberately uneven, placed rather than flowed. */
const PLACEMENT: Record<string, string> = {
  prismos: "col-start-1 col-end-4 row-start-1 row-end-3",
  "atlas-ai": "col-start-4 col-end-7 row-start-1 row-end-2",
  finsight: "col-start-4 col-end-6 row-start-2 row-end-3",
  farmtwin: "col-start-2 col-end-5 row-start-3 row-end-4",
  flowmind: "col-start-5 col-end-7 row-start-3 row-end-4",
};

/* ------------------------------------------------------------------ */

export function Workstation({ onDocument }: { onDocument: () => void }) {
  const [booting, setBooting] = useState(true);
  const [open, setOpen] = useState<string[]>([]);
  const clock = useZonedClock(site.timezone, !booting);

  const openWindow = useCallback((id: string) => {
    setOpen((prev) => {
      const without = prev.filter((w) => w !== id);
      // Three at a time. Beyond that it stops being usable.
      return [...without, id].slice(-3);
    });
  }, []);

  const closeWindow = useCallback((id: string) => {
    setOpen((prev) => prev.filter((w) => w !== id));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setOpen((prev) =>
      prev[prev.length - 1] === id
        ? prev
        : [...prev.filter((w) => w !== id), id],
    );
  }, []);

  /* Esc closes the front window. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || open.length === 0) return;
      const el = document.activeElement as HTMLElement | null;
      if (el && el.tagName === "INPUT") return;
      setOpen((prev) => prev.slice(0, -1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open.length]);

  const specFor = (id: string): WindowSpec => {
    if (id.startsWith("project:")) {
      const p = getProject(id.slice(8));
      return {
        id,
        title: p?.name.toLowerCase() ?? "system",
        subtitle: p?.kind.toLowerCase(),
        href: p ? `/work/${p.slug}` : undefined,
        width: 1040,
        height: 720,
      };
    }
    const panel = PANELS[id] ?? PANELS.about;
    return { id, ...panel, href: id === "method" ? "/read#method" : undefined };
  };

  const renderWindow = (id: string) => {
    if (id.startsWith("project:")) {
      const p = getProject(id.slice(8));
      return p ? <ProjectWindow project={p} /> : null;
    }
    switch (id) {
      case "about":
        return <AboutWindow />;
      case "systems":
        return (
          <SystemsIndexWindow
            onOpen={(slug) => openWindow(`project:${slug}`)}
          />
        );
      case "trajectory":
        return <TrajectoryWindow />;
      case "capabilities":
        return <CapabilitiesWindow />;
      case "method":
        return <MethodWindow />;
      case "contact":
        return <ContactWindow />;
      default:
        return null;
    }
  };

  const dockItems = useMemo(
    () => [
      { id: "about", label: "About", glyph: "◉" },
      { id: "systems", label: "Systems", glyph: "▤" },
      { id: "trajectory", label: "Trajectory", glyph: "◇" },
      { id: "capabilities", label: "Capabilities", glyph: "▣" },
      { id: "method", label: "Method", glyph: "◆" },
      { id: "contact", label: "Contact", glyph: "▢" },
    ],
    [],
  );

  return (
    <div
      data-surface="dark"
      className="fixed inset-0 overflow-hidden bg-bg text-fg"
    >
      {booting && <Boot onDone={() => setBooting(false)} />}

      <div aria-hidden className="tx-grid absolute inset-0 opacity-[0.07]" />

      {/* ---------------- menu bar ---------------- */}
      <header className="absolute inset-x-0 top-0 z-40 flex h-9 items-center gap-4 border-b border-line-soft bg-bg/80 px-4 backdrop-blur">
        <span className="t-mono text-[0.75rem] font-medium">
          elisynth<span className="text-fg-faint">/os</span>
        </span>

        <nav aria-label="Panels" className="hidden items-center gap-1 xl:flex">
          {dockItems.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => openWindow(d.id)}
              className="t-label rounded px-2 py-1 text-fg-muted transition-colors hover:bg-raised hover:text-fg"
            >
              {d.label}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <button
            type="button"
            onClick={onDocument}
            className="t-label rounded border border-line px-2.5 py-1 text-fg-muted transition-colors hover:border-accent hover:text-accent"
          >
            Document ↗
          </button>
          <span className="t-label inline-flex items-center gap-1.5 text-fg-faint">
            <span aria-hidden className="inline-block size-1.5 rounded-full bg-run" />
            {site.location}
          </span>
          <span className="t-mono t-nums text-[0.75rem] text-fg-muted">
            {clock ?? "--:--"}
          </span>
        </div>
      </header>

      {/* ---------------- desk ---------------- */}
      <div className="absolute inset-0 top-9 bottom-[4.5rem] flex overflow-hidden">
        {/* rail */}
        <aside className="hidden w-64 shrink-0 flex-col gap-3 border-r border-line-soft p-3 lg:flex">
          <button
            type="button"
            onClick={() => openWindow("about")}
            className="group flex gap-3 rounded-lg border border-line-soft bg-surface p-3 text-left transition-colors hover:border-line"
          >
            <Image
              src="/img/portrait-duo.webp"
              alt=""
              width={360}
              height={450}
              sizes="64px"
              className="h-auto w-16 shrink-0 rounded"
            />
            <span className="min-w-0">
              <span className="block truncate text-[0.8125rem] font-medium">
                Elisabeth Nnamani
              </span>
              <span className="t-mono mt-0.5 block text-[0.625rem] leading-tight text-fg-faint">
                AI Software Engineer
              </span>
              <span className="t-label mt-2 block text-accent opacity-0 transition-opacity group-hover:opacity-100">
                open →
              </span>
            </span>
          </button>

          <div className="rounded-lg border border-line-soft bg-surface p-3">
            <p className="t-label text-fg-faint">Now</p>
            <p className="mt-2 text-[0.8125rem] leading-snug">
              {site.now.building}
            </p>
            <p className="t-mono mt-2 text-[0.625rem] leading-relaxed text-run">
              {site.now.open}
            </p>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-line-soft bg-surface">
            <p className="t-label shrink-0 border-b border-line-soft px-3 py-2 text-fg-faint">
              shell
            </p>
            <Terminal onOpen={openWindow} onDocument={onDocument} />
          </div>
        </aside>

        {/* surface */}
        <main className="thin-scrollbar min-w-0 flex-1 overflow-y-auto px-5 py-5 lg:px-8 lg:py-7">
          <div className="mx-auto max-w-[1180px]">
            {/* identity, set straight onto the desk */}
            <div className="max-w-3xl">
              <p className="t-label text-fg-faint">
                {site.role} · Computer Science student · {site.location}
              </p>
              <h1 className="t-display mt-3 text-[clamp(1.75rem,3.6vw,3.15rem)] uppercase">
                Systems that survive{" "}
                <span className="text-accent">contact with reality</span>
              </h1>
              <p className="t-prose mt-4 text-[0.9375rem] text-fg-muted">
                {site.intro}
              </p>
            </div>

            {/* processes */}
            <div className="mt-7 flex items-baseline justify-between gap-4 border-t border-line-soft pt-3">
              <p className="t-label text-fg-faint">Running systems</p>
              <p className="t-label text-fg-faint">
                Select one to open its trace
              </p>
            </div>

            <div className="mt-3 grid auto-rows-[minmax(8rem,auto)] grid-cols-2 gap-2.5 md:grid-cols-6">
              {projects.map((p) => (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => openWindow(`project:${p.slug}`)}
                  className={cn(
                    "group relative flex flex-col overflow-hidden rounded-lg border border-line-soft bg-surface p-3.5 text-left transition-all duration-300 hover:border-accent/60 hover:bg-raised",
                    "col-span-2",
                    PLACEMENT[p.slug],
                  )}
                >
                  <span className="flex items-baseline gap-2">
                    <span className="t-label text-fg-faint transition-colors group-hover:text-accent">
                      {p.index}
                    </span>
                    <span className="t-display text-lg uppercase leading-none">
                      {p.name}
                    </span>
                    <span
                      aria-hidden
                      className="ml-auto inline-block size-1.5 shrink-0 rounded-full bg-run/70"
                    />
                  </span>

                  <span className="t-mono mt-1.5 block text-[0.625rem] text-fg-faint">
                    {p.kind.toLowerCase()}
                  </span>

                  {/* the flagship gets a bigger diagram, because it fills a taller tile */}
                  <MiniTrace
                    trace={p.trace}
                    className="pointer-events-none mt-3 min-h-12 w-full flex-1 opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                  />

                  <span className="line-clamp-3 pt-3 text-[0.8125rem] leading-snug text-fg-muted">
                    {p.tagline}
                  </span>
                </button>
              ))}
            </div>

            <p className="t-label mt-6 text-fg-faint">
              Every panel here also exists as a plain document — the menu bar
              switches, and so does the shell command{" "}
              <span className="text-fg-muted">read</span>.
            </p>
          </div>
        </main>
      </div>

      {/* ---------------- windows ---------------- */}
      {open.map((id, i) => (
        <WindowFrame
          key={id}
          spec={specFor(id)}
          index={i}
          focused={i === open.length - 1}
          onFocus={() => focusWindow(id)}
          onClose={() => closeWindow(id)}
        >
          {renderWindow(id)}
        </WindowFrame>
      ))}

      {/* ---------------- dock ---------------- */}
      <nav
        aria-label="Open a panel"
        className="absolute inset-x-0 bottom-0 z-40 flex h-[4.5rem] items-center justify-center"
      >
        <ul className="flex items-center gap-1 rounded-2xl border border-line-soft bg-surface/90 px-2 py-2 backdrop-blur">
          {dockItems.map((d) => {
            const active = open.includes(d.id);
            return (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() => openWindow(d.id)}
                  className={cn(
                    "group relative flex size-11 flex-col items-center justify-center rounded-xl border transition-all duration-200",
                    active
                      ? "border-accent/50 bg-raised text-accent"
                      : "border-transparent text-fg-muted hover:border-line-soft hover:bg-raised hover:text-fg",
                  )}
                >
                  <span aria-hidden className="text-sm leading-none">
                    {d.glyph}
                  </span>
                  <span className="sr-only">{d.label}</span>
                  <span
                    aria-hidden
                    className="t-label pointer-events-none absolute -top-8 whitespace-nowrap rounded border border-line-soft bg-surface px-2 py-1 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    {d.label}
                  </span>
                  {active && (
                    <span
                      aria-hidden
                      className="absolute -bottom-1 size-1 rounded-full bg-accent"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
