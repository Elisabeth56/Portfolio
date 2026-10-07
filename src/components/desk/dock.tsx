"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Glyph, type GlyphId } from "./glyphs";

type Item = { id: GlyphId; label: string; mobile?: boolean };

const items: Item[] = [
  { id: "about", label: "About" },
  { id: "systems", label: "Systems", mobile: true },
  { id: "trajectory", label: "Trajectory" },
  { id: "capabilities", label: "Capabilities" },
  { id: "method", label: "Method", mobile: true },
  { id: "contact", label: "Contact", mobile: true },
];

/** The section nearest the middle of the viewport, so the dock can mark it. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

const sectionIds = items.map((item) => item.id);

/* How much a tile grows under the pointer, and how far the swell reaches. */
const MAGNIFY = 0.42;
const REACH_PX = 72;

/**
 * Like the macOS Dock: with a mouse, the tiles near the pointer grow and push
 * their neighbours aside, then settle back when the pointer leaves. Distances
 * are measured from where the tiles sit at rest, so the swell does not chase
 * itself. Touch screens and reduced motion keep the tiles still.
 */
function useMagnify(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let centres: number[] = [];
    let frame = 0;

    const tiles = () => [...nav.querySelectorAll<HTMLElement>("[data-tile]")].filter((t) => t.offsetParent);
    const measure = () => {
      centres = tiles().map((t) => {
        const r = t.getBoundingClientRect();
        return r.left + r.width / 2;
      });
    };
    const swell = (x: number) => {
      frame = 0;
      tiles().forEach((tile, i) => {
        const d = (x - centres[i]) / REACH_PX;
        tile.style.setProperty("--s", String(1 + MAGNIFY * Math.exp(-(d * d) / 2)));
      });
    };
    const onEnter = () => {
      if (!fine.matches || reduce.matches) return;
      nav.dataset.magnify = "";
      measure();
    };
    const onMove = (event: PointerEvent) => {
      if (!("magnify" in nav.dataset)) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => swell(event.clientX));
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      delete nav.dataset.magnify;
      tiles().forEach((tile) => tile.style.removeProperty("--s"));
    };

    nav.addEventListener("pointerenter", onEnter);
    nav.addEventListener("pointermove", onMove);
    nav.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      nav.removeEventListener("pointerenter", onEnter);
      nav.removeEventListener("pointermove", onMove);
      nav.removeEventListener("pointerleave", onLeave);
    };
  }, [ref]);
}

/* A tile grows from its base, so it rises out of the dock. */
const tile =
  "group relative size-[calc(52px*var(--s,1))] shrink-0 place-items-center rounded-[calc(16px*var(--s,1))] transition-[width,height,border-radius,background-color,color] duration-300 ease-ui in-data-magnify:duration-100";

function Label({ children }: { children: string }) {
  return (
    <span className="pointer-events-none absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 rounded-lg bg-ink px-2.5 py-1.5 text-[0.8125rem] whitespace-nowrap text-paper opacity-0 transition-opacity duration-200 ease-ui group-hover:opacity-100 group-focus-visible:opacity-100">
      {children}
    </span>
  );
}

export function Dock() {
  const active = useActiveSection(sectionIds);
  const ref = useRef<HTMLElement>(null);
  useMagnify(ref);

  return (
    <nav
      ref={ref}
      aria-label="Sections"
      data-settle
      style={{ "--i": 8 } as React.CSSProperties}
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-40 flex h-dock -translate-x-1/2 items-end gap-3 rounded-[28px] bg-[color-mix(in_srgb,var(--color-surface)_78%,transparent)] px-3 pb-3 shadow-dock ring-1 ring-[color-mix(in_srgb,var(--color-ink)_7%,transparent)] backdrop-blur-xl backdrop-saturate-150 lg:bottom-dock-inset"
    >
      {items.map((item) => (
        <a
          key={item.id}
          data-tile
          href={`#${item.id}`}
          aria-label={item.label}
          aria-current={active === item.id ? "true" : undefined}
          className={cn(
            tile,
            item.mobile ? "grid" : "hidden lg:grid",
            active === item.id ? "bg-accent text-on-accent" : "bg-well text-ink hover:text-accent",
          )}
        >
          <Glyph id={item.id} className="size-[calc(24px*var(--s,1))] transition-[width,height] duration-150 ease-ui" />
          <Label>{item.label}</Label>
        </a>
      ))}

      {/* Like the line before the Dock's Downloads and Trash: the page as one document. */}
      <span aria-hidden className="mb-2.5 hidden h-8 w-px self-end bg-[color-mix(in_srgb,var(--color-ink)_14%,transparent)] lg:block" />
      <Link
        data-tile
        href="/read"
        aria-label="Read as one document"
        className={cn(tile, "hidden bg-well text-ink hover:text-accent lg:grid")}
      >
        <Glyph id="read" className="size-[calc(24px*var(--s,1))] transition-[width,height] duration-150 ease-ui" />
        <Label>Read as one document</Label>
      </Link>
    </nav>
  );
}
