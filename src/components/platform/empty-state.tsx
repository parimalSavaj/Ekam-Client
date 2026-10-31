import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * What a page or section shows before it has content: an illustrative icon, a heading that says
 * what to do, one sentence on why, and optional actions. Use outline buttons here when the page
 * header already holds the primary action.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actions,
  headingLevel = "h2",
  children,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: ReactNode;
  actions?: ReactNode;
  headingLevel?: "h2" | "h3";
  children?: ReactNode;
  className?: string;
}) {
  const Heading = headingLevel;
  return (
    <Card className={cn("items-center gap-0 px-6 py-12 text-center sm:py-16", className)}>
      <span className="mb-5 grid size-14 place-items-center rounded-full bg-secondary" aria-hidden="true">
        <Icon className="size-7 text-brand" strokeWidth={1.75} />
      </span>
      <Heading className="text-lg leading-snug font-semibold">{title}</Heading>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {actions && <div className="mt-6 flex flex-wrap items-center justify-center gap-2">{actions}</div>}
      {children}
    </Card>
  );
}
