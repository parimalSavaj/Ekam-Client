import Link from "next/link";
import { ArrowRight, Library } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/components/workspaces/format-date";
import type { KnowledgeBase } from "@/lib/knowledge-bases-api";

/** A knowledge base in the workspace grid. The whole card is the link. */
export function KnowledgeBaseCard({ knowledgeBase }: { knowledgeBase: KnowledgeBase }) {
  return (
    <Link
      href={`/workspaces/${knowledgeBase.workspaceId}/knowledge-bases/${knowledgeBase.id}`}
      className="group block h-full rounded-lg"
    >
      <Card interactive className="h-full gap-5">
        <div className="flex items-start gap-4 px-(--card-padding)">
          <span className="grid size-10 shrink-0 place-items-center rounded-md border bg-secondary" aria-hidden="true">
            <Library className="size-5 text-brand" strokeWidth={1.75} />
          </span>
          <div className="min-w-0 wrap-anywhere">
            <CardTitle asChild><h3>{knowledgeBase.name}</h3></CardTitle>
            {knowledgeBase.description
              ? <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{knowledgeBase.description}</p>
              : <p className="mt-1 text-sm text-muted-foreground">No description yet.</p>}
          </div>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 border-t px-(--card-padding) pt-4 text-sm">
          <span className="text-xs text-muted-foreground">Updated {formatDate(knowledgeBase.updatedAt)}</span>
          <span className="flex items-center gap-2 font-medium">
            Open
            <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
          </span>
        </div>
      </Card>
    </Link>
  );
}
