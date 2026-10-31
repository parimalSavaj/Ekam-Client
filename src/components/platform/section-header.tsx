import type { ReactNode } from "react";

/** Heading for one section of a page (h2), with an optional count and controls on the right. */
export function SectionHeader({
  title,
  count,
  actions,
  id,
}: {
  title: string;
  count?: number;
  actions?: ReactNode;
  id?: string;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      {/* tabIndex -1: focus can be moved here after the item that had it was removed. It only
          receives focus from code, so like <main> it draws no outline. */}
      <h2 id={id} tabIndex={-1} className="flex items-baseline gap-2 text-lg leading-snug font-semibold focus-visible:outline-none">
        {title}
        {count !== undefined && <span className="text-sm font-normal text-muted-foreground">{count}</span>}
      </h2>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
