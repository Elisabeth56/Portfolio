import { cn } from "@/lib/utils";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-14 xl:px-20">
      {children}
    </div>
  );
}

export function Label({
  children,
  className,
  as: As = "span",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "span" | "div" | "p" | "h2" | "h3";
}) {
  return (
    <As className={cn("t-label text-fg-faint", className)}>{children}</As>
  );
}

/**
 * Section header: mono index + rule + oversized display heading.
 * The index is what makes the whole page read as one document.
 */
export function SectionHead({
  index,
  eyebrow,
  title,
  lede,
  id,
}: {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  lede?: string;
  id: string;
}) {
  return (
    <header className="pt-24 sm:pt-32 lg:pt-40">
      <div className="flex items-baseline gap-5 border-t border-line pt-4">
        <span className="t-label text-accent">{index}/</span>
        <Label>{eyebrow}</Label>
      </div>
      <h2
        id={id}
        className="t-display mt-10 text-[clamp(2.5rem,8.5vw,7.5rem)] uppercase scroll-mt-24"
      >
        {title}
      </h2>
      {lede ? (
        <p className="t-prose mt-8 text-[1.0625rem] text-fg-muted sm:text-lg lg:ml-auto lg:max-w-[52ch] lg:text-right">
          {lede}
        </p>
      ) : null}
    </header>
  );
}

/** Small key/value row used in the hanging metadata columns. */
export function MetaRow({
  k,
  children,
}: {
  k: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[7.5rem_1fr] items-baseline gap-4 border-t border-line-soft py-3 first:border-t-0 sm:grid-cols-[9rem_1fr]">
      <dt className="t-label text-fg-faint">{k}</dt>
      <dd className="text-[0.9375rem] leading-relaxed text-fg">{children}</dd>
    </div>
  );
}

export function Rule({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-line", className)} />;
}

/** Text link with the accent underline that grows on hover. */
export function TextLink({
  href,
  children,
  external,
  className,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      className={cn(
        "group relative inline-flex items-baseline gap-1.5 py-1 text-fg transition-colors hover:text-accent",
        className,
      )}
    >
      <span className="relative">
        {children}
        <span
          aria-hidden
          className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
        />
      </span>
      {external ? (
        <span aria-hidden className="text-[0.75em] opacity-60">
          ↗
        </span>
      ) : null}
    </a>
  );
}

const statusTone: Record<string, string> = {
  Live: "text-run",
  Deployed: "text-run",
  Submitted: "text-fg-muted",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "t-label inline-flex items-center gap-2",
        statusTone[status] ?? "text-fg-muted",
      )}
    >
      <span
        aria-hidden
        className="inline-block size-1.5 rounded-full bg-current"
      />
      {status}
    </span>
  );
}
