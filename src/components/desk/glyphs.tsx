import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type GlyphId =
  | "prismos"
  | "atlas-ai"
  | "finsight"
  | "farmtwin"
  | "flowmind"
  | "itoms"
  | "about"
  | "systems"
  | "trajectory"
  | "capabilities"
  | "method"
  | "contact"
  | "read";

/* One idea per glyph, single stroke, no colour of its own. */
const paths: Record<GlyphId, ReactNode> = {
  prismos: (
    <>
      <path d="M12 4 20 19H4Z" />
      <path d="M2 13h7M14 12l8-2M14.5 14l7.5 1" />
    </>
  ),
  "atlas-ai": (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c3 3 3 14 0 17M12 3.5c-3 3-3 14 0 17" />
    </>
  ),
  finsight: <path d="M6 19v-6M12 19V6M18 19v-9" />,
  farmtwin: <path d="M12 20v-9M12 11c0-4 3-6 7-6 0 4-3 6-7 6ZM12 14c0-3-2-5-6-5 0 3 2 5 6 5Z" />,
  flowmind: (
    <>
      <circle cx="12" cy="12" r="2.5" />
      <circle cx="12" cy="4.5" r="1.8" />
      <circle cx="12" cy="19.5" r="1.8" />
      <circle cx="4.5" cy="12" r="1.8" />
      <circle cx="19.5" cy="12" r="1.8" />
      <path d="M12 6.3v3.2M12 14.5v3.2M6.3 12h3.2M14.5 12h3.2" />
    </>
  ),
  itoms: (
    <>
      <path d="M3.5 11.6V5a1.5 1.5 0 0 1 1.5-1.5h6.6l9 9-8.1 8.1Z" />
      <circle cx="8" cy="8" r="1.4" />
    </>
  ),
  about: (
    <>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 19.5c1-4 4-5.5 7-5.5s6 1.5 7 5.5" />
    </>
  ),
  systems: (
    <>
      <rect x="4" y="4.5" width="16" height="6" rx="3" />
      <rect x="4" y="13.5" width="16" height="6" rx="3" />
    </>
  ),
  trajectory: <path d="M4 17l5-5 4 3 7-8M15 7h5v5" />,
  capabilities: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="2.5" />
      <rect x="13" y="4" width="7" height="7" rx="2.5" />
      <rect x="4" y="13" width="7" height="7" rx="2.5" />
      <rect x="13" y="13" width="7" height="7" rx="2.5" />
    </>
  ),
  method: (
    <path d="M12 6.5C10 5 7 4.5 4 5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5ZM12 6.5V19.5" />
  ),
  contact: (
    <>
      <rect x="3.5" y="6" width="17" height="12" rx="3.5" />
      <path d="M4.5 8l7.5 5 7.5-5" />
    </>
  ),
  read: (
    <>
      <path d="M7 3.5h6.5l4.5 4.5v11a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V5a1.5 1.5 0 0 1 1-1.5Z" />
      <path d="M13.5 3.5V8H18M9 12.5h6M9 16h4" />
    </>
  ),
};

export function Glyph({ id, className }: { id: GlyphId; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths[id]}
    </svg>
  );
}

/* Each app's colour, like a macOS icon: projects take their product's colour. */
const tints: Record<GlyphId, [from: string, to: string, ink?: string]> = {
  prismos: ["#a34540", "#5e1f1c"],
  "atlas-ai": ["#3a3a33", "#14140f", "#dde8a6"],
  finsight: ["#3f8a63", "#1e5a3e"],
  farmtwin: ["#9cc46b", "#4f8a33"],
  flowmind: ["#4867a8", "#1e3466"],
  itoms: ["#f3d37a", "#e0a93a", "#3a2a08"],
  about: ["#f0b39a", "#d9725a"],
  systems: ["#b24a6f", "#6e2441"],
  trajectory: ["#f6c978", "#e58a3a"],
  capabilities: ["#9aa9da", "#5868a8"],
  method: ["#c9a27c", "#8c6240"],
  contact: ["#7fc3f2", "#2f86d6"],
  read: ["#ffffff", "#e9e4dd", "#7a2e4b"],
};

/** A glyph on its own coloured tile. Size and radius come from `className`. */
export function AppTile({
  id,
  className,
  glyphClassName,
}: {
  id: GlyphId;
  className?: string;
  glyphClassName?: string;
}) {
  const [from, to, ink = "#fff"] = tints[id];
  const style = { "--tile-from": from, "--tile-to": to, color: ink } as CSSProperties;
  return (
    <span className={cn("app-tile grid shrink-0 place-items-center", className)} style={style}>
      <Glyph id={id} className={glyphClassName} />
    </span>
  );
}
