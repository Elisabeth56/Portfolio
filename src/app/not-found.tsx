import Link from "next/link";

export default function NotFound() {
  return (
    <div
      data-surface="light"
      className="flex min-h-screen items-center bg-bg text-fg"
    >
      <div className="mx-auto w-full max-w-2xl px-6">
        <p className="t-label text-accent">404 /</p>
        <h1 className="t-display mt-6 text-[clamp(2.5rem,9vw,6rem)] uppercase">
          No such route
        </h1>
        <p className="t-prose mt-6 text-lg text-fg-muted">
          Nothing is mounted here. The systems index is the place to start.
        </p>
        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
          <Link
            href="/"
            className="text-[0.9375rem] font-medium underline decoration-accent/40 underline-offset-4 transition-colors hover:text-accent"
          >
            Workstation
          </Link>
          <Link
            href="/read"
            className="text-[0.9375rem] font-medium underline decoration-accent/40 underline-offset-4 transition-colors hover:text-accent"
          >
            Read the document
          </Link>
        </div>
      </div>
    </div>
  );
}
