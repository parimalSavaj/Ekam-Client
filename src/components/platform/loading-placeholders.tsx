import { Card } from "@/components/ui/card";

// Static shapes that hold the layout while data loads. They do not pulse: the design system
// allows no looping animation except the loading spinner.
const bar = "block rounded-sm bg-secondary";

/** Placeholder for a grid of cards (workspaces, knowledge bases). */
export function CardGridPlaceholder({ label, count = 3 }: { label: string; count?: number }) {
  return (
    <div aria-busy="true">
      <span className="sr-only">{label}</span>
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
        {Array.from({ length: count }, (_, index) => <li key={index}>
          <Card className="gap-5 px-(--card-padding)">
            <span className="block size-10 rounded-md bg-secondary" />
            <span className="grid gap-2">
              <span className={`${bar} h-4 w-2/3`} />
              <span className={`${bar} h-3 w-1/2`} />
            </span>
            <span className={`${bar} h-3 w-1/3`} />
          </Card>
        </li>)}
      </ul>
    </div>
  );
}

/** Placeholder for a list of rows (sources). */
export function RowListPlaceholder({ label, count = 3 }: { label: string; count?: number }) {
  return (
    <div aria-busy="true">
      <span className="sr-only">{label}</span>
      <Card className="gap-0 py-0" aria-hidden="true">
        {Array.from({ length: count }, (_, index) => <div key={index} className="flex items-center gap-4 border-b px-(--card-padding) py-4 last:border-b-0">
          <span className="block size-10 shrink-0 rounded-md bg-secondary" />
          <span className="grid flex-1 gap-2">
            <span className={`${bar} h-4 w-1/2`} />
            <span className={`${bar} h-3 w-1/3`} />
          </span>
        </div>)}
      </Card>
    </div>
  );
}

/** Placeholder for the title block while the page's own record loads. */
export function HeaderPlaceholder({ label }: { label: string }) {
  return (
    <div className="mb-8 grid gap-3" aria-busy="true">
      <span className="sr-only">{label}</span>
      <span className={`${bar} h-3 w-24`} aria-hidden="true" />
      <span className={`${bar} h-9 w-64 max-w-full`} aria-hidden="true" />
      <span className={`${bar} h-4 w-48 max-w-full`} aria-hidden="true" />
    </div>
  );
}
