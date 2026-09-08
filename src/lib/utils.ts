export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const MODE_KEY = "elisynth:mode";
export const BOOTED_KEY = "elisynth:booted";

/** The three surfaces. `shell` is whichever of the first two the viewport fits. */
export type Mode = "workstation" | "phone" | "document";

/** What we persist: the visitor's preference, not the resolved surface. */
export type ModePref = "shell" | "document";

/** The workstation needs the room; below this the shell is the phone. */
export const WORKSTATION_MIN_WIDTH = 1024;
