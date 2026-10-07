"use client";

import { type KeyboardEvent, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props<T extends string> = {
  label: string;
  options: readonly { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  /** Prefix for tab and panel ids, so each tab can name the panel it controls. */
  idBase: string;
  className?: string;
};

/**
 * A pill-shaped tab control. The selected segment is a raised thumb that
 * slides between options; arrow keys, Home and End move the selection.
 */
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  idBase,
  className,
}: Props<T>) {
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [thumb, setThumb] = useState<{ left: number; width: number } | null>(null);
  const selected = options.findIndex((option) => option.id === value);

  useLayoutEffect(() => {
    const measure = () => {
      const tab = tabs.current[selected];
      if (tab) setThumb({ left: tab.offsetLeft, width: tab.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [selected]);

  const onKeyDown = (event: KeyboardEvent) => {
    const last = options.length - 1;
    const moves: Record<string, number> = {
      ArrowRight: selected === last ? 0 : selected + 1,
      ArrowLeft: selected === 0 ? last : selected - 1,
      Home: 0,
      End: last,
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    onChange(options[next].id);
    tabs.current[next]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn("relative flex h-12 gap-0.5 rounded-full bg-well p-1", className)}
    >
      {thumb && (
        <span
          aria-hidden
          style={{ transform: `translateX(${thumb.left - 4}px)`, width: thumb.width }}
          className="absolute inset-y-1 left-1 rounded-full bg-surface shadow-[0_1px_2px_rgb(41_40_38/0.08)] transition-[transform,width] duration-200 ease-ui"
        />
      )}
      {options.map((option, i) => {
        const isSelected = i === selected;
        return (
          <button
            key={option.id}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${idBase}-tab-${option.id}`}
            aria-selected={isSelected}
            aria-controls={`${idBase}-panel`}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onChange(option.id)}
            className={cn(
              "relative flex-1 rounded-full px-[18px] text-sm font-medium whitespace-nowrap transition-colors duration-200 ease-ui sm:flex-none",
              isSelected ? "text-ink" : "text-ink-2 hover:text-ink",
              /* Until the thumb is measured, the tab carries its own fill. */
              isSelected && !thumb && "bg-surface",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
