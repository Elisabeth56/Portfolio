import {
  Capabilities,
  Contact,
  Hero,
  Method,
  Systems,
  Trajectory,
} from "./sections";
import { TopBar } from "./TopBar";

export function DocumentView() {
  return (
    <div data-surface="light" className="relative min-h-screen bg-bg text-fg">
      <div
        aria-hidden
        className="tx-paper pointer-events-none fixed inset-0 z-0"
      />
      <div className="relative z-10">
        <TopBar />
        <a
          href="#systems"
          className="sr-only focus:not-sr-only focus:absolute focus:left-5 focus:top-20 focus:z-50 focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-bg"
        >
          Skip to selected work
        </a>
        <main id="identity">
          <Hero />
          <Systems />
          <Trajectory />
          <Capabilities />
          <Method />
          <Contact />
        </main>
      </div>
    </div>
  );
}
