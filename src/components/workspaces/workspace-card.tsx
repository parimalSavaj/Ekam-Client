import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/components/workspaces/format-date";
import type { Workspace } from "@/lib/workspaces-api";

/** First character of the name, for the monogram tile. Array.from keeps emoji and accents whole. */
function initialOf(name: string): string {
  return (Array.from(name.trim())[0] ?? "W").toUpperCase();
}

/** A workspace in a grid. The whole card is the link. */
export function WorkspaceCard({ workspace, headingLevel = "h2" }: { workspace: Workspace; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <Link href={`/workspaces/${workspace.id}`} className="group block h-full rounded-lg">
      <Card interactive className="h-full gap-5">
        <div className="flex items-start gap-4 px-(--card-padding)">
          <span className="grid size-10 shrink-0 place-items-center rounded-md border bg-secondary text-base font-semibold" aria-hidden="true">
            {initialOf(workspace.name)}
          </span>
          <div className="min-w-0 wrap-anywhere">
            <CardTitle asChild><Heading>{workspace.name}</Heading></CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">Created {formatDate(workspace.createdAt)}</p>
          </div>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 border-t px-(--card-padding) pt-4 text-sm font-medium">
          Open workspace
          <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
        </div>
      </Card>
    </Link>
  );
}
