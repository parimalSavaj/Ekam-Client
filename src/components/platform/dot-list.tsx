import { Fragment } from "react";

/**
 * Short facts separated by middle dots ("PDF · 12 MB · Added 30 Oct 2026"). Lines only break
 * between facts, never inside one, and the dot stays at the end of the line it follows.
 */
export function DotList({ items, className }: { items: readonly (string | false | null | undefined)[]; className?: string }) {
  const facts = items.filter((item): item is string => Boolean(item));
  return (
    <span className={className}>
      {facts.map((fact, index) => <Fragment key={`${index}-${fact}`}>
        {index > 0 && <><span aria-hidden="true">{"\u00a0\u00b7"}</span>{" "}</>}
        <span className="whitespace-nowrap">{fact}</span>
      </Fragment>)}
    </span>
  );
}
