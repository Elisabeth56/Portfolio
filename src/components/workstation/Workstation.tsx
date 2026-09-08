"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { projects, getProject } from "@/content/projects";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { useZonedClock } from "@/lib/hooks";
import { AppIcon, appColor, type AppId } from "@/components/icons/AppIcons";
import { Boot } from "./Boot";
import { ProjectWidget } from "./ProjectWidget";
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
  about: { title: "About", subtitle: "identity", width: 700, height: 620 },
  systems: { title: "Systems", subtitle: "index", width: 560, height: 480 },
  trajectory: { title: "Trajectory", subtitle: "experience", width: 760, height: 640 },
  capabilities: { title: "Capabilities", subtitle: "stack", width: 760, height: 620 },
  method: { title: "Method", subtitle: "how I think", width: 800, height: 680 },
  contact: { title: "Contact", width: 620, height: 520 },
};

/** Desk composition — deliberately uneven, placed rather than flowed. */
const PLACEMENT: Record<string, string> = {
  prismos: "col-start-1 col-end-4 row-start-1 row-end-3",
  "atlas-ai": "col-start-4 col-end-7 row-start-1 row-end-2",
  finsight: "col-start-4 col-end-6 row-start-2 row-end-3",
  farmtwin: "col-start-2 col-end-5 row-start-3 row-end-4",
  flowmind: "col-start-5 col-end-7 row-start-3 row-end-4",
};

const DOCK: Array<{ id: AppId; label: string }> = [
  { id: "about", label: "About" },
  { id: "systems", label: "Systems" },
  { id: "trajectory", label: "Trajectory" },
  { id: "capabilities", label: "Capabilities" },
  { id: "method", label: "Method" },
  { id: "contact", label: "Contact" },
];

/* ------------------------------------------------------------------ */

export function Workstation({ onDocument }: { onDocument: () => void }) {
  const [booting, setBooting] = useState(true);
  const [open, setOpen] = useState<string[]>([]);
  const clock = useZonedClock(site.timezone, !booting);

  const openWindow = useCallback((id: string) => {
    setOpen((prev) => [...prev.filter((w) => w !== id), id].slice(-3));
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
        title: p?.name ?? "System",
        subtitle: p?.kind.toLowerCase(),
        href: p ? `/work/${p.slug}` : undefined,
        accent: p ? appColor[p.slug as AppId] : undefined,
        icon: p ? (p.slug as AppId) : undefined,
        width: 1040,
        height: 720,
      };
    }
    const panel = PANELS[id] ?? PANELS.about;
    return {
      id,
      ...panel,
      icon: id as AppId,
      accent: appColor[id as AppId],
      href: id === "method" ? "/read#method" : undefined,
    };
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
          <SystemsIndexWindow onOpen={(slug) => openWindow(`project:${slug}`)} />
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

  const menuItems = useMemo(() => DOCK, []);

  return (
    <div
      data-surface="dark"
      className="fixed inset-0 overflow-hidden bg-bg text-fg"
    >
      {booting && <Boot onDone={() => setBooting(false)} />}

      <div aria-hidden className="tx-grid absolute inset-0 opacity-[0.06]" />
      {/* one soft warm bloom so the desk is not a flat black field */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 size-[720px] rounded-full opacity-[0.10] blur-3xl"
        style={{ background: "#ec7fa0" }}
      />

      {/* ---------------- menu bar ---------------- */}
      <header className="absolute inset-x-0 top-0 z-40 flex h-10 items-center gap-3 border-b border-line-soft bg-bg/70 px-3 backdrop-blur-xl">
        <span className="t-mono rounded-full bg-raised px-2.5 py-1 text-[0.75rem] font-medium">
          elisynth<span className="text-fg-faint">/os</span>
        </span>

        <nav aria-label="Panels" className="hidden items-center gap-0.5 xl:flex">
          {menuItems.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => openWindow(d.id)}
              className="t-label rounded-full px-2.5 py-1.5 text-fg-muted transition-colors hover:bg-raised hover:text-fg"
            >
              {d.label}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            onClick={onDocument}
            className="t-label inline-flex items-center gap-1.5 rounded-full border border-line bg-raised px-2.5 py-1.5 text-fg-muted transition-colors hover:border-accent hover:text-accent"
          >
            <AppIcon id="document" className="size-3.5 rounded-[4px]" />
            Document
          </button>
          <span className="t-label inline-flex items-center gap-1.5 text-fg-faint">
            <span
              aria-hidden
              className="inline-block size-1.5 rounded-full bg-run"
            />
            {site.location}
          </span>
          <span className="t-mono t-nums text-[0.75rem] text-fg-muted">
            {clock ?? "--:--"}
          </span>
        </div>
      </header>

      {/* ---------------- desk ---------------- */}
      <div className="absolute inset-x-0 bottom-[5.25rem] top-10 flex overflow-hidden">
        {/* rail */}
        <aside className="hidden w-64 shrink-0 flex-col gap-3 p-3 lg:flex">
          <button
            type="button"
            onClick={() => openWindow("about")}
            className="group flex gap-3 rounded-[18px] border border-line-soft bg-surface p-3 text-left transition-all hover:border-line hover:bg-raised"
          >
            <Image
              src="/img/portrait.webp"
              alt=""
              width={1000}
              height={1250}
              sizes="72px"
              className="h-auto w-16 shrink-0 rounded-[12px] bg-raised"
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

          <div className="rounded-[18px] border border-line-soft bg-surface p-3">
            <p className="t-label text-fg-faint">Now</p>
            <p className="mt-2 text-[0.8125rem] leading-snug">
              {site.now.building}
            </p>
            <p className="t-mono mt-2 text-[0.625rem] leading-relaxed text-run">
              {site.now.open}
            </p>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[18px] border border-line-soft bg-surface">
            <p className="t-label flex shrink-0 items-center gap-2 border-b border-line-soft px-3 py-2 text-fg-faint">
              <AppIcon id="shell" className="size-3.5 rounded-[4px]" />
              shell
            </p>
            <Terminal onOpen={openWindow} onDocument={onDocument} />
          </div>
        </aside>

        {/* surface */}
        <main className="thin-scrollbar min-w-0 flex-1 overflow-y-auto px-5 py-5 lg:px-8 lg:py-7">
          <div className="mx-auto max-w-[1180px]">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-8">
              <div className="max-w-3xl">
                <h1 className="t-display text-[clamp(1.625rem,3.1vw,2.75rem)] uppercase">
                  Systems that survive{" "}
                  <span className="text-accent">contact with reality</span>
                </h1>
                <p className="t-prose mt-3 text-[0.875rem] text-fg-muted">
                  {site.intro}
                </p>
              </div>

              {/* a few true numbers, so the top of the desk is not empty */}
              <dl className="hidden self-end rounded-[18px] border border-line-soft bg-surface/60 p-3.5 lg:block">
                {[
                  ["5", "systems shipped"],
                  ["4", "live right now"],
                  ["7", "agents in the largest"],
                  ["2014", "oldest laptop one runs on"],
                ].map(([n, label]) => (
                  <div
                    key={label}
                    className="flex items-baseline gap-2.5 border-t border-line-soft py-1.5 first:border-t-0 first:pt-0 last:pb-0"
                  >
                    <dt className="t-mono t-nums w-9 shrink-0 text-right text-[0.8125rem] font-medium text-accent">
                      {n}
                    </dt>
                    <dd className="text-[0.75rem] leading-tight text-fg-muted">
                      {label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-line-soft pt-3">
              <p className="t-label text-fg-faint">Running systems</p>
              <p className="t-label text-fg-faint">
                Select one to open its trace
              </p>
            </div>

            <div className="mt-3 grid auto-rows-[minmax(8.5rem,auto)] grid-cols-2 gap-3 md:grid-cols-6">
              {projects.map((p) => {
                const c = appColor[p.slug as AppId];
                const big = p.slug === "prismos";
                return (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => openWindow(`project:${p.slug}`)}
                    style={{ ["--tile" as string]: c }}
                    className={cn(
                      "group relative flex flex-col overflow-hidden rounded-[20px] border border-line-soft bg-surface p-3.5 text-left transition-all duration-300",
                      "hover:-translate-y-0.5 hover:border-[color:var(--tile)] hover:shadow-lg hover:shadow-black/40",
                      "col-span-2",
                      PLACEMENT[p.slug],
                    )}
                  >
                    {/* the app's own colour, washed across the card */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 opacity-[0.055] transition-opacity duration-300 group-hover:opacity-[0.11]"
                      style={{ background: c }}
                    />

                    <span className="relative flex items-start gap-2.5">
                      <AppIcon
                        id={p.slug as AppId}
                        className="size-9 shrink-0 rounded-[10px] shadow-sm shadow-black/40 transition-transform duration-300 group-hover:scale-105"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[0.9375rem] font-semibold leading-tight">
                          {p.name}
                        </span>
                        <span className="t-mono mt-1 block truncate text-[0.625rem] text-fg-faint">
                          {p.kind.toLowerCase()}
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className="mt-1 inline-block size-1.5 shrink-0 rounded-full bg-run/70"
                      />
                    </span>

                    {/* a specimen of the product, not an abstract graph */}
                    <span className="relative mt-3 flex min-h-0 flex-1 flex-col">
                      <ProjectWidget slug={p.slug} size={big ? "lg" : "sm"} />
                    </span>

                    {big && (
                      <span className="relative mt-3 border-t border-line-soft pt-3 text-[0.8125rem] leading-snug text-fg-muted">
                        {p.tagline}
                      </span>
                    )}
                  </button>
                );
              })}
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
        className="absolute inset-x-0 bottom-0 z-40 flex h-[5.25rem] items-center justify-center"
      >
        <ul className="flex items-end gap-1.5 rounded-[26px] border border-line-soft bg-surface/80 px-2.5 py-2.5 shadow-2xl shadow-black/40 backdrop-blur-xl">
          {DOCK.map((d) => {
            const active = open.includes(d.id);
            return (
              <li key={d.id} className="relative">
                <button
                  type="button"
                  onClick={() => openWindow(d.id)}
                  className="group relative block rounded-[14px] transition-transform duration-200 hover:-translate-y-1.5"
                >
                  <AppIcon
                    id={d.id}
                    className="size-[46px] rounded-[13px] shadow-md shadow-black/30"
                  />
                  <span className="sr-only">{d.label}</span>
                  <span
                    aria-hidden
                    className="t-label pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-line-soft bg-raised px-2.5 py-1 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    {d.label}
                  </span>
                </button>
                <span
                  aria-hidden
                  className={cn(
                    "absolute -bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full transition-opacity",
                    active ? "bg-fg opacity-70" : "opacity-0",
                  )}
                />
              </li>
            );
          })}

          <li aria-hidden className="mx-1 h-11 w-px self-center bg-line-soft" />

          <li>
            <button
              type="button"
              onClick={onDocument}
              className="group relative block rounded-[14px] transition-transform duration-200 hover:-translate-y-1.5"
            >
              <AppIcon
                id="document"
                className="size-[46px] rounded-[13px] shadow-md shadow-black/30"
              />
              <span className="sr-only">Read as a document</span>
              <span
                aria-hidden
                className="t-label pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-line-soft bg-raised px-2.5 py-1 opacity-0 transition-opacity group-hover:opacity-100"
              >
                Document
              </span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
