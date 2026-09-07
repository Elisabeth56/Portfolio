"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { Workstation } from "@/components/workstation/Workstation";
import { MODE_KEY, WORKSTATION_MIN_WIDTH, type Mode } from "@/lib/utils";

/**
 * The server always renders the document. On a roomy viewport this upgrades to
 * the workstation, unless the visitor has said they prefer the document.
 *
 * A blocking script decides before first paint and cloaks the page with a style
 * tag, so the document never flashes behind the workstation on the way in. It
 * signals through a window global rather than a DOM attribute, because anything
 * written onto <html> or <body> would be a hydration mismatch.
 *
 * The mode lives in a tiny external store read through useSyncExternalStore:
 * that is the supported way to render browser-only state without mismatching
 * the server HTML, and it avoids a mount effect that immediately sets state.
 */

let current: Mode | null = null;
const listeners = new Set<() => void>();

function compute(): Mode {
  const w = window as unknown as { __elisynthWorkstation?: boolean };
  return w.__elisynthWorkstation && window.innerWidth >= WORKSTATION_MIN_WIDTH
    ? "workstation"
    : "document";
}

function getSnapshot(): Mode {
  if (current === null) current = compute();
  return current;
}

/** During hydration React uses this, so it matches what the server sent. */
function getServerSnapshot(): Mode {
  return "document";
}

function setMode(next: Mode) {
  if (current === next) return;
  current = next;
  listeners.forEach((l) => l());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);

  // A window narrower than the workstation needs falls back rather than breaks.
  const mql = window.matchMedia(`(min-width: ${WORKSTATION_MIN_WIDTH}px)`);
  const onResize = () => {
    if (!mql.matches) setMode("document");
  };
  // The document's menu bar asks for the workstation through this event.
  const onRequest = () => setMode("workstation");

  mql.addEventListener("change", onResize);
  window.addEventListener("elisynth:mode", onRequest);

  return () => {
    listeners.delete(onChange);
    mql.removeEventListener("change", onResize);
    window.removeEventListener("elisynth:mode", onRequest);
  };
}

export function AdaptiveShell({ children }: { children: React.ReactNode }) {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Uncloak once React owns the page.
  useEffect(() => {
    document.getElementById("ws-cloak")?.remove();
  }, []);

  const toDocument = useCallback(() => {
    try {
      window.localStorage.setItem(MODE_KEY, "document");
    } catch {
      /* no persistence available; the switch still works for this session */
    }
    setMode("document");
    window.scrollTo({ top: 0 });
  }, []);

  if (mode === "workstation") return <Workstation onDocument={toDocument} />;
  return <>{children}</>;
}

/** Runs before hydration so the correct surface is the first thing painted. */
export const WS_BOOTSTRAP = `(function(){try{
var m=localStorage.getItem(${JSON.stringify(MODE_KEY)});
if(m!=="document"&&window.innerWidth>=${WORKSTATION_MIN_WIDTH}){
window.__elisynthWorkstation=true;
var s=document.createElement("style");
s.id="ws-cloak";s.textContent="body{visibility:hidden}";
document.head.appendChild(s);}
}catch(e){}})();`;
