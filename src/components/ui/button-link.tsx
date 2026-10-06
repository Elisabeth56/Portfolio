import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Props = ComponentProps<typeof Link> & {
  /** `primary` is the tinted pill, one per view. `text` is the quiet second action. */
  variant?: "primary" | "text";
};

const base =
  "inline-flex h-12 items-center justify-center text-base font-medium transition-[background-color,color,transform] duration-200 ease-ui active:scale-[0.98]";

const variants = {
  primary:
    "rounded-full bg-accent-tint px-6 text-accent-ink hover:bg-[color-mix(in_srgb,var(--color-accent)_10%,var(--color-accent-tint))]",
  text: "text-ink hover:text-accent",
};

export function ButtonLink({ variant = "primary", className, ...props }: Props) {
  return <Link className={cn(base, variants[variant], className)} {...props} />;
}
