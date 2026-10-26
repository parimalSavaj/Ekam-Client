import Link from "next/link";
import { Layers } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The Ekam wordmark. The only place the logo and "ekam." lockup are drawn.
 * `compact` hides the wordmark below the sm breakpoint (narrow sidebar rail).
 * The link keeps an accessible name even when the wordmark is hidden.
 */
export function Brand({
  href = "/",
  label = "Ekam home",
  compact = false,
  className,
}: {
  href?: string;
  label?: string;
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "inline-flex w-fit items-center gap-2 rounded-md text-2xl font-bold tracking-tighter text-foreground sm:text-3xl",
        className,
      )}
    >
      <Layers className="size-6 shrink-0 sm:size-7" strokeWidth={1.7} aria-hidden="true" />
      <span className={cn(compact && "max-sm:sr-only")} aria-hidden="true">
        ekam<b className="text-brand">.</b>
      </span>
    </Link>
  );
}
