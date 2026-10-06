"use client";

import { type RefObject, useCallback, useEffect, useState } from "react";

/**
 * Maps how far a section has scrolled to one of `count` steps.
 *
 * A pinned section is much taller than the viewport and its content sticks,
 * so progress is the share of that extra height already scrolled. A section
 * that just flows marks each [data-step] element as it rises past the reading
 * line at the middle of the viewport.
 */
export function useScrollStep(ref: RefObject<HTMLElement | null>, count: number) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;

    const measure = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const viewport = window.innerHeight;
      const travel = rect.height - viewport;
      const isPinned = travel > viewport * 0.5;
      if (isPinned) {
        const progress = -rect.top / travel;
        setStep(Math.min(count - 1, Math.max(0, Math.floor(progress * count))));
        return;
      }
      // Flowing: the last listed step to rise past the reading line.
      const items = el.querySelectorAll("[data-step]");
      let passed = 0;
      items.forEach((item) => {
        if (item.getBoundingClientRect().top < viewport * 0.5) passed += 1;
      });
      setStep(Math.max(0, passed - 1));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref, count]);

  /** Scrolls a pinned section to the middle of a step. */
  const goTo = useCallback(
    (index: number) => {
      const el = ref.current;
      if (!el) return;
      const travel = el.offsetHeight - window.innerHeight;
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + (travel * (index + 0.5)) / count });
    },
    [ref, count],
  );

  return { step, goTo };
}
