import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  /** Leave out on the last item: it is the current page and is not a link. */
  href?: string;
};

/**
 * Where-am-I trail for nested pages, placed above PageHeader. Every parent is a link,
 * the last item is the current page. Example: Workspaces / Product team / Handbook.
 */
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      {/* -ml-2 cancels the link padding so the first label lines up with the page title below. */}
      <ol className="-ml-2 flex flex-wrap items-center gap-y-1 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${index}-${item.label}`} className="flex min-w-0 items-center">
              {isLast || !item.href ? (
                <span aria-current={isLast ? "page" : undefined} className="rounded-md px-2 py-1.5 font-medium wrap-anywhere">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="rounded-md px-2 py-1.5 font-medium text-muted-foreground transition-colors wrap-anywhere hover:bg-secondary-hover hover:text-foreground active:bg-secondary-active active:text-foreground"
                >
                  {item.label}
                </Link>
              )}
              {!isLast && <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
