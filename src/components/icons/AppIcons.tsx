import { cn } from "@/lib/utils";

/**
 * App icons for the workstation dock, the phone home screen and the desk
 * tiles. Each one is self-contained — its own colour, not theme-dependent —
 * the way a real app icon is. Squircle tile, white glyph, one soft inner
 * highlight so it reads as a physical thing rather than a flat swatch.
 */

export type AppId =
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
  | "document"
  | "shell";

/** Each app's colour, also used for tile tinting and trace highlights. */
export const appColor: Record<AppId, string> = {
  prismos: "#8b7cf0",
  "atlas-ai": "#3fa9c4",
  finsight: "#e0a03f",
  farmtwin: "#5aab72",
  flowmind: "#ec7fa0",
  about: "#e0648c",
  systems: "#7b6ee8",
  trajectory: "#dd9440",
  capabilities: "#3ea2bd",
  method: "#a86fb5",
  contact: "#6286dd",
  document: "#b9a68a",
  shell: "#4a4a55",
};

const R = 11.4; // squircle-ish corner on a 48-unit tile

function Tile({ id, children }: { id: AppId; children: React.ReactNode }) {
  const c = appColor[id];
  const gid = `ic-${id}`;
  return (
    <>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx={R} fill={c} />
      <rect width="48" height="48" rx={R} fill={`url(#${gid})`} />
      <g
        fill="none"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </g>
      <rect
        x="0.6"
        y="0.6"
        width="46.8"
        height="46.8"
        rx={R - 0.6}
        fill="none"
        stroke="#000"
        strokeOpacity="0.14"
        strokeWidth="1.2"
      />
    </>
  );
}

const glyphs: Record<AppId, React.ReactNode> = {
  // a prism splitting a beam
  prismos: (
    <>
      <path d="M24 14.5 L32.5 30 H15.5 Z" />
      <path d="M7.5 23 H19.4" />
      <path d="M28.4 23.2 L40 18.5" strokeWidth="2" />
      <path d="M28.9 24.6 L40.5 23.8" strokeWidth="2" />
      <path d="M29.4 26 L39.5 29" strokeWidth="2" />
    </>
  ),
  // a globe — the catalog it is grounded in
  "atlas-ai": (
    <>
      <circle cx="24" cy="24" r="11" />
      <ellipse cx="24" cy="24" rx="4.6" ry="11" />
      <path d="M13.4 20.5 H34.6" />
      <path d="M13.4 27.5 H34.6" />
    </>
  ),
  // ascending bars — the statement, read
  finsight: (
    <>
      <path d="M13 35 H35" />
      <path d="M17.5 30.5 V25" />
      <path d="M24 30.5 V19" />
      <path d="M30.5 30.5 V22.5" />
      <circle cx="30.5" cy="17.5" r="1.9" fill="#fff" stroke="none" />
    </>
  ),
  // a sprout — the farm, offline
  farmtwin: (
    <>
      <path d="M24 35 V21" />
      <path d="M24 24.5 C24 19 20 15.5 14.5 15.5 C14.5 21 18 24.5 24 24.5 Z" />
      <path d="M24 21.5 C24 16.5 27.6 13.5 32.5 13.5 C32.5 18.5 29 21.5 24 21.5 Z" />
      <path d="M17.5 35 H30.5" />
    </>
  ),
  // capture becoming structure
  flowmind: (
    <>
      <circle cx="24" cy="24" r="4.2" />
      <circle cx="24" cy="13.5" r="2.4" />
      <circle cx="34.5" cy="24" r="2.4" />
      <circle cx="24" cy="34.5" r="2.4" />
      <circle cx="13.5" cy="24" r="2.4" />
      <path d="M24 19.8 V16" strokeWidth="2" />
      <path d="M28.2 24 H32.1" strokeWidth="2" />
      <path d="M24 28.2 V32.1" strokeWidth="2" />
      <path d="M19.8 24 H15.9" strokeWidth="2" />
    </>
  ),
  about: (
    <>
      <circle cx="24" cy="19.5" r="5.5" />
      <path d="M14 35.5 C14 29.7 18.5 26.5 24 26.5 C29.5 26.5 34 29.7 34 35.5" />
    </>
  ),
  systems: (
    <>
      <rect x="13" y="13" width="22" height="7" rx="3" />
      <rect x="13" y="24" width="22" height="7" rx="3" />
      <path d="M17.5 35.5 H30.5" strokeWidth="2" />
    </>
  ),
  trajectory: (
    <>
      <path d="M13 34 L20 27 L25.5 30.5 L35 19" />
      <path d="M29.5 18.5 H35.5 V24.5" />
      <circle cx="20" cy="27" r="1.7" fill="#fff" stroke="none" />
    </>
  ),
  capabilities: (
    <>
      <rect x="12.5" y="12.5" width="9.5" height="9.5" rx="3" />
      <rect x="26" y="12.5" width="9.5" height="9.5" rx="3" />
      <rect x="12.5" y="26" width="9.5" height="9.5" rx="3" />
      <rect x="26" y="26" width="9.5" height="9.5" rx="3" />
    </>
  ),
  method: (
    <>
      <path d="M13.5 15 C17.5 13 21 13.5 24 15.5 C27 13.5 30.5 13 34.5 15 V33 C30.5 31 27 31.5 24 33.5 C21 31.5 17.5 31 13.5 33 Z" />
      <path d="M24 15.5 V33.5" strokeWidth="2" />
    </>
  ),
  contact: (
    <>
      <rect x="12.5" y="16" width="23" height="16" rx="4" />
      <path d="M14 19 L24 26 L34 19" />
    </>
  ),
  document: (
    <>
      <path d="M16 13.5 H27 L32.5 19 V34.5 H16 Z" />
      <path d="M27 13.5 V19 H32.5" strokeWidth="2" />
      <path d="M20 24 H28" strokeWidth="2" />
      <path d="M20 28.5 H26" strokeWidth="2" />
    </>
  ),
  shell: (
    <>
      <path d="M16 19 L22 24 L16 29" />
      <path d="M25.5 30 H33" />
    </>
  ),
};

export function AppIcon({
  id,
  className,
  title,
}: {
  id: AppId;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("block", className)}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <Tile id={id}>{glyphs[id]}</Tile>
    </svg>
  );
}
