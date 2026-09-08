"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { projects, getProject } from "@/content/projects";
import { site } from "@/content/site";
import { useZonedClock } from "@/lib/hooks";
import { AppIcon, type AppId } from "@/components/icons/AppIcons";
import {
  AboutWindow,
  CapabilitiesWindow,
  ContactWindow,
  MethodWindow,
  ProjectWindow,
  SystemsIndexWindow,
  TrajectoryWindow,
} from "@/components/workstation/windows";

/* ------------------------------------------------------------------ */

type AppEntry = { id: string; icon: AppId; label: string };

const HOME: AppEntry[] = [
  ...projects.map((p) => ({
    id: `project:${p.slug}`,
    icon: p.slug as AppId,
    label: p.name,
  })),
  { id: "about", icon: "about", label: "About" },
  { id: "trajectory", icon: "trajectory", label: "Trajectory" },
  { id: "capabilities", icon: "capabilities", label: "Stack" },
];

const DOCK: AppEntry[] = [
  { id: "systems", icon: "systems", label: "Systems" },
  { id: "method", icon: "method", label: "Method" },
  { id: "contact", icon: "contact", label: "Contact" },
  { id: "document", icon: "document", label: "Read" },
];

const TITLES: Record<string, string> = {
  about: "About",
  systems: "Systems",
  trajectory: "Trajectory",
  capabilities: "Capabilities",
  method: "Method",
  contact: "Contact",
};

/* ------------------------------------------------------------------ */

export function Phone({ onDocument }: { onDocument: () => void }) {
  const [app, setApp] = useState<string | null>(null);
  const clock = useZonedClock(site.timezone);

  const open = useCallback(
    (id: string) => {
      if (id === "document") {
        onDocument();
        return;
      }
      setApp(id);
    },
    [onDocument],
  );

  /* Lock the page behind an open app so only the sheet scrolls. */
  useEffect(() => {
    document.body.style.overflow = app ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [app]);

  useEffect(() => {
    if (!app) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setApp(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [app]);

  const project = app?.startsWith("project:")
    ? getProject(app.slice(8))
    : undefined;

  const sheetTitle = project ? project.name : app ? TITLES[app] : "";
  const sheetIcon: AppId | undefined = project
    ? (project.slug as AppId)
    : app
      ? (app as AppId)
      : undefined;

  const body = () => {
    if (project) return <ProjectWindow project={project} />;
    switch (app) {
      case "about":
        return <AboutWindow />;
      case "systems":
        return <SystemsIndexWindow onOpen={(s) => setApp(`project:${s}`)} />;
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

  return (
    <div
      data-surface="dark"
      className="relative min-h-[100svh] overflow-hidden bg-bg text-fg"
    >
      {/* wallpaper — one soft warm bloom, nothing busy */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-32 size-[420px] rounded-full opacity-[0.16] blur-3xl"
        style={{ background: "#ec7fa0" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-28 size-[380px] rounded-full opacity-[0.10] blur-3xl"
        style={{ background: "#7b6ee8" }}
      />

      {/* status bar */}
      <div className="relative flex items-center justify-between px-6 pb-1 pt-3">
        <span className="t-mono t-nums text-[0.8125rem] font-medium">
          {clock ?? "--:--"}
        </span>
        <span className="t-label flex items-center gap-1.5 text-fg-faint">
          <span aria-hidden className="inline-block size-1.5 rounded-full bg-run" />
          {site.location}
        </span>
      </div>

      <div className="relative px-5 pb-36 pt-3">
        {/* identity widget */}
        <button
          type="button"
          onClick={() => open("about")}
          className="flex w-full items-center gap-3.5 rounded-[22px] border border-line-soft bg-surface/80 p-3.5 text-left backdrop-blur-xl transition-transform active:scale-[0.985]"
        >
          <Image
            src="/img/portrait.webp"
            alt=""
            width={1000}
            height={1250}
            sizes="80px"
            priority
            className="h-auto w-[4.25rem] shrink-0 rounded-[16px] bg-raised"
          />
          <span className="min-w-0">
            <span className="block text-[0.9375rem] font-semibold leading-tight">
              Elisabeth Nnamani
            </span>
            <span className="t-mono mt-1 block text-[0.6875rem] text-fg-faint">
              AI Software Engineer · {site.location}
            </span>
            <span className="mt-2 flex items-center gap-1.5 text-[0.75rem] text-run">
              <span
                aria-hidden
                className="inline-block size-1.5 rounded-full bg-current"
              />
              Available for AI engineering roles
            </span>
          </span>
        </button>

        {/* thesis widget */}
        <div className="mt-3 rounded-[22px] border border-line-soft bg-surface/80 p-4 backdrop-blur-xl">
          <p className="t-display text-[1.375rem] uppercase leading-[0.95]">
            Systems that survive{" "}
            <span className="text-accent">contact with reality</span>
          </p>
          <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-fg-muted">
            {site.intro}
          </p>
        </div>

        {/* home screen */}
        <p className="t-label mt-7 px-1 text-fg-faint">Systems &amp; panels</p>
        <ul className="mt-3 grid grid-cols-4 gap-x-3 gap-y-5">
          {HOME.map((a) => (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => open(a.id)}
                className="flex w-full flex-col items-center gap-1.5 transition-transform active:scale-90"
              >
                <AppIcon
                  id={a.icon}
                  className="size-[58px] rounded-[16px] shadow-lg shadow-black/30"
                />
                <span className="w-full truncate text-center text-[0.6875rem] leading-tight text-fg-muted">
                  {a.label}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <p className="t-label mt-3 px-1 text-fg-faint">
          Tap a system to open its trace
        </p>

        {/* Now — the same status the workstation rail carries */}
        <div className="mt-6 rounded-[22px] border border-line-soft bg-surface/80 p-4 backdrop-blur-xl">
          <p className="t-label text-fg-faint">Now</p>
          <p className="mt-2 text-[0.875rem] leading-snug">
            {site.now.building}
          </p>
          <p className="t-mono mt-2 text-[0.6875rem] leading-relaxed text-run">
            {site.now.open}
          </p>
          <button
            type="button"
            onClick={onDocument}
            className="mt-4 flex w-full items-center gap-2.5 rounded-[14px] border border-line-soft bg-raised px-3 py-2.5 text-left transition-transform active:scale-[0.985]"
          >
            <AppIcon id="document" className="size-7 shrink-0 rounded-[8px]" />
            <span className="min-w-0">
              <span className="block text-[0.8125rem] font-medium">
                Read everything as one document
              </span>
              <span className="t-mono block text-[0.625rem] text-fg-faint">
                the version to send someone
              </span>
            </span>
            <span aria-hidden className="ml-auto text-fg-faint">
              →
            </span>
          </button>
        </div>
      </div>

      {/* dock */}
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-30 px-4 pb-4"
      >
        <ul className="mx-auto flex max-w-sm items-center justify-around rounded-[26px] border border-line-soft bg-surface/85 px-3 py-3 shadow-2xl shadow-black/50 backdrop-blur-xl">
          {DOCK.map((d) => (
            <li key={d.id}>
              <button
                type="button"
                onClick={() => open(d.id)}
                className="flex flex-col items-center gap-1 transition-transform active:scale-90"
              >
                <AppIcon
                  id={d.icon}
                  className="size-[52px] rounded-[15px] shadow-md shadow-black/30"
                />
                <span className="sr-only">{d.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* app sheet */}
      {app && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={sheetTitle}
          className="fixed inset-0 z-50 flex flex-col"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setApp(null)}
            className="h-10 w-full shrink-0 bg-black/50 backdrop-blur-sm"
          />
          <div
            data-surface="dark"
            className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-[24px] border-t border-line bg-surface shadow-[0_-12px_40px_rgba(0,0,0,0.55)]"
            style={{ animation: "sheet-up 320ms cubic-bezier(0.16,1,0.3,1)" }}
          >
            <div className="flex shrink-0 items-center gap-2.5 border-b border-line-soft px-4 py-3">
              {sheetIcon && (
                <AppIcon
                  id={sheetIcon}
                  className="size-6 shrink-0 rounded-[7px]"
                />
              )}
              <span className="min-w-0 flex-1 truncate text-[0.9375rem] font-semibold">
                {sheetTitle}
              </span>
              <button
                type="button"
                onClick={() => setApp(null)}
                className="t-label grid size-8 place-items-center rounded-full border border-line-soft bg-raised text-fg-muted transition-colors active:text-fg"
              >
                <span aria-hidden className="text-[0.9rem] leading-none">
                  ×
                </span>
                <span className="sr-only">Close {sheetTitle}</span>
              </button>
            </div>
            <div className="thin-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain">
              {body()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
