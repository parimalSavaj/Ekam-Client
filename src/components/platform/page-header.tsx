import type { ReactNode } from "react";

/**
 * Title block for every authenticated page: optional eyebrow, serif h1, description, a short
 * meta line (counts, dates; use DotList) and the page's actions. Actions sit to the right of the
 * title from `sm` up and below it on phones, on one line: on phones keep them to the primary
 * button plus a menu. Put at most one `default` button in `actions`.
 * Pages must not draw their own h1.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  meta,
  actions,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <div className="min-w-0 space-y-2">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="font-serif text-3xl leading-tight font-normal tracking-tight sm:text-4xl">{title}</h1>
        {description && <p className="max-w-3xl text-base text-muted-foreground">{description}</p>}
        {meta && <p className="text-sm text-muted-foreground">{meta}</p>}
      </div>
      {/* On phones the actions take the full width; give the primary button max-sm:flex-1. */}
      {actions && <div className="flex w-full items-center gap-2 sm:w-auto sm:shrink-0 sm:pt-6">{actions}</div>}
    </div>
  );
}
