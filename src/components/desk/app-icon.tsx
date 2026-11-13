import Link from "next/link";
import type { CSSProperties } from "react";
import { AppTile, type GlyphId } from "./glyphs";
import { WindowLink } from "./project-window";

type Props = {
  href: string;
  label: string;
  glyph: GlyphId;
  style?: CSSProperties;
  /** A project to open in the window on a large screen, instead of following `href`. */
  opens?: string;
};

export function AppIcon({ href, label, glyph, style, opens }: Props) {
  const content = (
    <>
      <AppTile
        id={glyph}
        className="size-[60px] rounded-[16px] transition-transform duration-200 ease-ui group-hover:-translate-y-0.5"
        glyphClassName="size-7"
      />
      {label}
    </>
  );
  const link = {
    "data-settle": true,
    style,
    className: "group flex flex-col items-center gap-1.5 rounded-icon text-xs font-medium text-ink",
  };

  return opens ? (
    <WindowLink slug={opens} {...link}>
      {content}
    </WindowLink>
  ) : (
    <Link href={href} {...link}>
      {content}
    </Link>
  );
}
