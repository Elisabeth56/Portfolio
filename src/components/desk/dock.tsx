"use client";

import { useEffect, useState } from "react";
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

export function Dock() {
  const active = useActiveSection(sectionIds);

  return (
    <nav
      aria-label="Sections"
      data-settle
      style={{ "--i": 8 } as React.CSSProperties}
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-40 flex h-dock -translate-x-1/2 items-center gap-3 rounded-[28px] bg-surface px-3 shadow-dock lg:bottom-dock-inset"
    >
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          aria-label={item.label}
          aria-current={active === item.id ? "true" : undefined}
          className={cn(
            "group relative size-[52px] place-items-center rounded-2xl transition-colors duration-200 ease-ui",
            item.mobile ? "grid" : "hidden lg:grid",
            active === item.id ? "bg-accent text-on-accent" : "bg-well text-ink hover:text-accent",
          )}
        >
          <Glyph id={item.id} className="size-6" />
          <span className="pointer-events-none absolute bottom-16 rounded-lg bg-ink px-2.5 py-1.5 text-[0.8125rem] whitespace-nowrap text-paper opacity-0 transition-opacity duration-200 ease-ui group-hover:opacity-100 group-focus-visible:opacity-100">
            {item.label}
          </span>
        </a>
      ))}
    </nav>
  );
}
