import { site } from "@/content/site";
import { DeskClock } from "./desk-clock";
import { ThemeToggle } from "./theme-toggle";

export function MenuBar() {
  return (
    <header className="hidden h-12 items-center justify-between text-sm lg:flex">
      <p className="flex items-baseline gap-3">
        <span className="font-semibold">{site.name}</span>
        <span className="text-ink-2">{site.role}</span>
      </p>
      <div className="flex items-center gap-5 text-ink-2">
        <p>
          {site.location} · <DeskClock timeZone={site.timezone} />
        </p>
        <ThemeToggle />
      </div>
    </header>
  );
}
