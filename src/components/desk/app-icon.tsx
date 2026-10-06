import Link from "next/link";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { Glyph, type GlyphId } from "./glyphs";

type Props = {
  href: string;
  label: string;
  glyph: GlyphId;
  /** `lead` is solid accent (one per desk), `project` sits on paper, `panel` recedes. */
  tone?: "lead" | "project" | "panel";
  style?: CSSProperties;
};

const tiles = {
  lead: "bg-accent text-on-accent",
  project: "bg-surface text-accent shadow-lift",
  panel: "bg-well text-ink",
};

export function AppIcon({ href, label, glyph, tone = "project", style }: Props) {
  return (
    <Link
      href={href}
      data-settle
      style={style}
      className="group flex flex-col items-center gap-2 rounded-icon text-[0.8125rem] text-ink"
    >
      <span
        className={cn(
          "grid size-16 place-items-center rounded-[20px] transition-transform duration-200 ease-ui group-hover:-translate-y-0.5 lg:size-[68px] lg:rounded-icon",
          tiles[tone],
        )}
      >
        <Glyph id={glyph} className="size-7 lg:size-[30px]" />
      </span>
      {label}
    </Link>
  );
}
