"use client";

import { useEffect, useState } from "react";

/** Her local date and time, e.g. "Tue 6 Oct 19:15". Empty until the client knows the time. */
export function DeskClock({ timeZone }: { timeZone: string }) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    const date = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    const time = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const tick = () => {
      const now = new Date();
      setLabel(`${date.format(now).replace(",", "")} ${time.format(now)}`);
    };
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return <span className="tabular-nums">{label}</span>;
}
