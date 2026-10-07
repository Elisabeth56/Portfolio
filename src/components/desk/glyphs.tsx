import type { ReactNode } from "react";

export type GlyphId =
  | "prismos"
  | "atlas-ai"
  | "finsight"
  | "farmtwin"
  | "flowmind"
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
