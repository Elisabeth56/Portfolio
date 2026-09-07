"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type WindowSpec = {
  id: string;
  title: string;
  subtitle?: string;
  /** Permanent URL for this content, if it has one. */
  href?: string;
  width: number;
  height: number;
};

export function WindowFrame({
  spec,
  index,
  focused,
  onFocus,
  onClose,
  children,
}: {
  spec: WindowSpec;
  index: number;
  focused: boolean;
  onFocus: () => void;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const drag = useRef<{ dx: number; dy: number } | null>(null);

  /* Cascade from a base position, clamped so nothing lands off-screen. */
  useEffect(() => {
    const place = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const w = Math.min(spec.width, vw - 340);
      const h = Math.min(spec.height, vh - 190);
      const baseX = 300 + index * 34;
      const baseY = 92 + index * 30;
      setPos({
        x: Math.max(24, Math.min(baseX, vw - w - 32)),
        y: Math.max(56, Math.min(baseY, vh - h - 110)),
      });
    };
    place();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spec.id]);

  /* Keep the window reachable if the viewport shrinks under it. */
  useEffect(() => {
    const onResize = () => {
      setPos((p) => {
        if (!p) return p;
        const w = Math.min(spec.width, window.innerWidth - 340);
        return {
          x: Math.max(16, Math.min(p.x, window.innerWidth - w - 24)),
          y: Math.max(52, Math.min(p.y, window.innerHeight - 200)),
        };
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [spec.width]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
      onFocus();
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      drag.current = { dx: e.clientX - rect.left, dy: e.clientY - rect.top };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [onFocus],
  );

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current) return;
    const w = ref.current?.offsetWidth ?? 600;
    setPos({
      x: Math.max(
        8,
        Math.min(e.clientX - drag.current.dx, window.innerWidth - w - 8),
      ),
      y: Math.max(
        44,
        Math.min(e.clientY - drag.current.dy, window.innerHeight - 120),
      ),
    });
  }, []);

  const endDrag = useCallback(() => {
    drag.current = null;
  }, []);

  if (!pos) return null;

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={spec.title}
      onPointerDown={onFocus}
      style={{
        left: pos.x,
        top: pos.y,
        width: `min(${spec.width}px, calc(100vw - 3rem))`,
        height: `min(${spec.height}px, calc(100vh - 11rem))`,
        zIndex: 30 + index,
      }}
      className={cn(
        "absolute flex flex-col overflow-hidden rounded-xl border bg-surface shadow-2xl shadow-black/50 transition-[border-color,opacity] duration-200",
        focused ? "border-line opacity-100" : "border-line-soft opacity-90",
      )}
    >
      {/* title bar */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="flex shrink-0 cursor-grab touch-none items-center gap-3 border-b border-line-soft bg-raised px-3 py-2.5 active:cursor-grabbing"
      >
        <div className="flex items-center gap-2" data-no-drag>
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${spec.title}`}
            className="group grid size-3 place-items-center rounded-full bg-flag/80 transition-colors hover:bg-flag"
          >
            <span className="text-[0.5rem] leading-none text-bg opacity-0 transition-opacity group-hover:opacity-100">
              ×
            </span>
          </button>
          {spec.href ? (
            <Link
              href={spec.href}
              aria-label={`Open ${spec.title} as a full page`}
              title="Open as a full page"
              className="group grid size-3 place-items-center rounded-full bg-run/80 transition-colors hover:bg-run"
            >
              <span className="text-[0.5rem] leading-none text-bg opacity-0 transition-opacity group-hover:opacity-100">
                ↗
              </span>
            </Link>
          ) : (
            <span className="size-3 rounded-full bg-line" />
          )}
        </div>

        <div className="min-w-0 flex-1 truncate text-center">
          <span className="t-mono text-[0.75rem] text-fg">{spec.title}</span>
          {spec.subtitle && (
            <span className="t-mono ml-2 text-[0.6875rem] text-fg-faint">
              {spec.subtitle}
            </span>
          )}
        </div>

        <span className="w-[3.25rem]" aria-hidden />
      </div>

      {/* body */}
      <div className="thin-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {children}
      </div>
    </div>
  );
}
