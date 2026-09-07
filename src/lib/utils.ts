export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const MODE_KEY = "elisynth:mode";
export const BOOTED_KEY = "elisynth:booted";

export type Mode = "workstation" | "document";

/** Workstation needs the room. Below this we always serve the document. */
export const WORKSTATION_MIN_WIDTH = 1024;
