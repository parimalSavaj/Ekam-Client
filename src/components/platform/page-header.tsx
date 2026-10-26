import type { ReactNode } from "react";

/**
 * Title block for every authenticated page: optional eyebrow, serif h1, one-line description.
 * Pages must not draw their own h1.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
}) {
  return (
    <div className="mb-8 space-y-2">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="font-serif text-3xl leading-tight font-normal tracking-tight sm:text-4xl">{title}</h1>
      {description && <p className="text-base text-muted-foreground">{description}</p>}
    </div>
  );
}
