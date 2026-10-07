"use client";

import { useEffect, useState } from "react";

/** The address as selectable text, with a Copy button that confirms for two seconds. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      /* no clipboard access: the address is still selectable text */
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-[20px] bg-paper p-4 lg:h-[72px] lg:flex-row lg:items-center lg:justify-between lg:py-0 lg:pr-3 lg:pl-6">
      <span className="text-[1.0625rem] font-medium tracking-[-0.01em] select-all lg:text-xl">
        {email}
      </span>
      <button
        type="button"
        onClick={copy}
        className="h-12 rounded-full bg-accent-tint px-5 text-[0.9375rem] font-medium text-accent-ink transition-[background-color,transform] duration-200 ease-ui hover:bg-[color-mix(in_srgb,var(--color-accent)_10%,var(--color-accent-tint))] active:scale-[0.98]"
      >
        <span aria-live="polite">
          {copied ? "Copied" : <><span className="lg:hidden">Copy email</span><span className="hidden lg:inline">Copy</span></>}
        </span>
      </button>
    </div>
  );
}
