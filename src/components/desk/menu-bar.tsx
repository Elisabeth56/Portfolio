"use client";

import Link from "next/link";
import {
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { DeskClock } from "./desk-clock";
import { WindowLink } from "./project-window";
import { ThemeToggle, toggleTheme } from "./theme-toggle";

type Entry =
  | { kind: "link"; label: string; href: string; hint?: string; external?: boolean }
  | { kind: "window"; label: string; slug: string; hint?: string }
  | { kind: "action"; label: string; run: () => void; done?: string }
  | { kind: "separator" };

type Menu = { id: string; label: string; strong?: boolean; entries: Entry[] };

const copyEmail = () => navigator.clipboard?.writeText(site.links.email);

const menus: Menu[] = [
  {
    id: "name",
    label: site.name,
    strong: true,
    entries: [
      { kind: "link", label: `About ${site.name.split(" ")[0]}`, href: "#about" },
      { kind: "link", label: "Read as one document", href: "/read" },
      { kind: "separator" },
      { kind: "action", label: "Switch light and dark", run: toggleTheme },
    ],
  },
  {
    id: "systems",
    label: "Systems",
    entries: projects.map((p) => ({ kind: "window", label: p.name, slug: p.slug, hint: p.status })),
  },
  {
    id: "go",
    label: "Go",
    entries: [
      { kind: "link", label: "Systems", href: "#systems" },
      { kind: "link", label: "Trajectory", href: "#trajectory" },
      { kind: "link", label: "Capabilities", href: "#capabilities" },
      { kind: "link", label: "Method", href: "#method" },
      { kind: "link", label: "About", href: "#about" },
      { kind: "link", label: "Contact", href: "#contact" },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    entries: [
      { kind: "action", label: "Copy email address", run: copyEmail, done: "Email copied" },
      { kind: "separator" },
      { kind: "link", label: "GitHub", href: site.links.github, hint: "Elisabeth56", external: true },
      { kind: "link", label: "LinkedIn", href: site.links.linkedin, hint: "elisabethnnamani", external: true },
      { kind: "link", label: "X", href: site.links.x, hint: "@elisynthdev", external: true },
    ],
  },
];

/**
 * The desk's menu bar, the way a Mac's works: a translucent strip with menus
 * that drop down. Once one is open, moving across the bar opens the others;
 * arrow keys move through menus and items, and Esc or a click outside closes.
 */
export function MenuBar() {
  const [open, setOpen] = useState<string | null>(null);
  const bar = useRef<HTMLElement>(null);
  const buttons = useRef<Record<string, HTMLButtonElement | null>>({});

  // A click anywhere else closes the open menu.
  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (!bar.current?.contains(event.target as Node)) setOpen(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const items = (id: string) =>
    [...(bar.current?.querySelectorAll<HTMLElement>(`#menu-${id} [role="menuitem"]`) ?? [])];

  const openMenu = (id: string, focus?: "first" | "last") => {
    setOpen(id);
    if (focus) {
      requestAnimationFrame(() => {
        const list = items(id);
        (focus === "first" ? list[0] : list[list.length - 1])?.focus();
      });
    }
  };

  const close = (returnFocus?: string) => {
    setOpen(null);
    if (returnFocus) buttons.current[returnFocus]?.focus();
  };

  const step = (id: string, by: number) => {
    const i = menus.findIndex((m) => m.id === id);
    return menus[(i + by + menus.length) % menus.length].id;
  };

  const onBarKey = (event: KeyboardEvent, id: string) => {
    const keys: Record<string, () => void> = {
      ArrowDown: () => openMenu(id, "first"),
      ArrowUp: () => openMenu(id, "last"),
      ArrowRight: () => {
        const next = step(id, 1);
        buttons.current[next]?.focus();
        if (open) openMenu(next, "first");
      },
      ArrowLeft: () => {
        const prev = step(id, -1);
        buttons.current[prev]?.focus();
        if (open) openMenu(prev, "first");
      },
      Escape: () => close(id),
    };
    if (!keys[event.key]) return;
    event.preventDefault();
    keys[event.key]();
  };

  const onMenuKey = (event: KeyboardEvent, id: string) => {
    const list = items(id);
    const i = list.indexOf(document.activeElement as HTMLElement);
    const keys: Record<string, () => void> = {
      ArrowDown: () => list[(i + 1) % list.length]?.focus(),
      ArrowUp: () => list[(i - 1 + list.length) % list.length]?.focus(),
      Home: () => list[0]?.focus(),
      End: () => list[list.length - 1]?.focus(),
      ArrowRight: () => openMenu(step(id, 1), "first"),
      ArrowLeft: () => openMenu(step(id, -1), "first"),
      Escape: () => close(id),
      Tab: () => close(),
    };
    if (!keys[event.key]) return;
    if (event.key !== "Tab") event.preventDefault();
    keys[event.key]();
  };

  return (
    <header
      ref={bar}
      className="relative z-30 hidden h-9 items-center justify-between border-b border-[color-mix(in_srgb,var(--color-ink)_7%,transparent)] bg-[color-mix(in_srgb,var(--color-surface)_62%,transparent)] text-sm backdrop-blur-xl backdrop-saturate-150 lg:-mx-8 lg:flex lg:px-5"
    >
      <nav aria-label="Menu bar" className="flex items-center gap-0.5">
        {menus.map((menu) => {
          const isOpen = open === menu.id;
          return (
            <div key={menu.id} className="relative">
              <button
                ref={(el) => {
                  buttons.current[menu.id] = el;
                }}
                type="button"
                aria-haspopup="menu"
                aria-expanded={isOpen}
                aria-controls={`menu-${menu.id}`}
                onClick={() => (isOpen ? close() : openMenu(menu.id))}
                onPointerEnter={() => open && open !== menu.id && openMenu(menu.id)}
                onKeyDown={(event) => onBarKey(event, menu.id)}
                className={cn(
                  "flex h-7 items-center rounded-md px-2.5 transition-colors duration-150 ease-ui",
                  menu.strong ? "font-semibold" : "text-ink",
                  isOpen
                    ? "bg-[color-mix(in_srgb,var(--color-ink)_9%,transparent)]"
                    : "hover:bg-[color-mix(in_srgb,var(--color-ink)_6%,transparent)]",
                )}
              >
                {menu.label}
              </button>
              {isOpen && (
                <div
                  id={`menu-${menu.id}`}
                  role="menu"
                  aria-label={menu.label}
                  onKeyDown={(event) => onMenuKey(event, menu.id)}
                  className="absolute top-[calc(100%+6px)] left-0 flex min-w-60 flex-col rounded-xl bg-[color-mix(in_srgb,var(--color-surface)_88%,transparent)] p-1.5 shadow-dock ring-1 ring-[color-mix(in_srgb,var(--color-ink)_8%,transparent)] backdrop-blur-xl backdrop-saturate-150"
                >
                  {menu.entries.map((entry, i) => (
                    <MenuEntry key={i} entry={entry} onDone={() => close()} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="flex items-center gap-3 text-ink-2">
        <p>
          {site.location} · <DeskClock timeZone={site.timezone} />
        </p>
        <ThemeToggle />
      </div>
    </header>
  );
}

const item =
  "flex h-8 items-center justify-between gap-6 rounded-md px-2.5 text-left text-ink outline-none transition-colors duration-100 hover:bg-accent hover:text-on-accent focus-visible:bg-accent focus-visible:text-on-accent focus-visible:outline-none";

function Hint({ children }: { children?: ReactNode }) {
  return children ? (
    <span className="text-[0.8125rem] text-ink-3 group-hover:text-on-accent/80 group-focus-visible:text-on-accent/80">
      {children}
    </span>
  ) : null;
}

function MenuEntry({ entry, onDone }: { entry: Entry; onDone: () => void }) {
  const [done, setDone] = useState(false);

  if (entry.kind === "separator") {
    return (
      <div
        role="separator"
        className="mx-2.5 my-1 h-px bg-[color-mix(in_srgb,var(--color-ink)_10%,transparent)]"
      />
    );
  }

  if (entry.kind === "action") {
    return (
      <button
        type="button"
        role="menuitem"
        className={cn(item, "group")}
        onClick={() => {
          entry.run();
          if (!entry.done) return onDone();
          setDone(true);
          window.setTimeout(onDone, 900);
        }}
      >
        {done && entry.done ? entry.done : entry.label}
      </button>
    );
  }

  if (entry.kind === "window") {
    return (
      <WindowLink slug={entry.slug} role="menuitem" className={cn(item, "group")} onClick={onDone}>
        {entry.label}
        <Hint>{entry.hint}</Hint>
      </WindowLink>
    );
  }

  return (
    <Link
      href={entry.href}
      role="menuitem"
      className={cn(item, "group")}
      onClick={onDone}
      {...(entry.external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {entry.label}
      <Hint>{entry.hint}</Hint>
    </Link>
  );
}
