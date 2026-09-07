"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

const SEQUENCE: Array<[string, string]> = [
  ["mount /systems", "5 found"],
  ["load agents", "7 active"],
  ["ground retrieval", "ok"],
  ["verify isolation", "row-level"],
  ["network", "optional"],
  ["identity", "elisabeth nnamani"],
];

export function Boot({ onDone }: { onDone: () => void }) {
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const done = useRef(false);

  const finish = () => {
    if (done.current) return;
    done.current = true;
    setLeaving(true);
    window.setTimeout(onDone, reduced ? 0 : 380);
  };

  useEffect(() => {
    if (reduced) {
      finish();
      return;
    }
    const timers: number[] = [];
    SEQUENCE.forEach((_, i) => {
      timers.push(window.setTimeout(() => setShown(i + 1), 130 + i * 165));
    });
    timers.push(window.setTimeout(finish, 130 + SEQUENCE.length * 165 + 420));
    return () => timers.forEach(window.clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  /* Any key, any click — this should never hold anyone up. */
  useEffect(() => {
    const skip = () => finish();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      role="status"
      aria-label="Starting"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-bg transition-opacity duration-300 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-full max-w-md px-8">
        <p className="t-mono text-[0.8125rem] text-fg">
          elisynth<span className="text-fg-faint">/os</span>
        </p>
        <div className="mt-6 space-y-1.5" aria-hidden>
          {SEQUENCE.map(([label, result], i) => (
            <p
              key={label}
              className={`t-mono flex items-baseline gap-2 text-[0.75rem] transition-opacity duration-200 ${
                i < shown ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="text-fg-faint">{label}</span>
              <span className="min-w-0 flex-1 overflow-hidden text-fg-faint/40">
                ····································
              </span>
              <span className="text-run">{result}</span>
            </p>
          ))}
        </div>
        <p className="t-label mt-8 text-fg-faint">Press any key to skip</p>
      </div>
    </div>
  );
}
