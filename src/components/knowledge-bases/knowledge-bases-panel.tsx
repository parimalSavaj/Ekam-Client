"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Library, Plus } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { CreateKnowledgeBaseDialog } from "@/components/knowledge-bases/create-knowledge-base-dialog";
import { formatDate } from "@/components/workspaces/format-date";
import { errorMessage } from "@/lib/api-client";
import { listKnowledgeBases, type KnowledgeBase } from "@/lib/knowledge-bases-api";

/** The knowledge bases of one workspace: list, empty state and the create dialog. */
export function KnowledgeBasesPanel({ workspaceId }: { workspaceId: string }) {
  const router = useRouter();
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[] | null>(null);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    try {
      setKnowledgeBases(await listKnowledgeBases(workspaceId));
    } catch (cause) {
      setError(errorMessage(cause));
    }
  }, [workspaceId]);

  useEffect(() => {
    queueMicrotask(() => { void load(); });
  }, [load]);

  if (error && knowledgeBases === null) {
    return <div className="grid justify-items-start gap-3">
      <Alert variant="error">{error}</Alert>
      <Button variant="outline" onClick={() => { setError(""); void load(); }}>Try again</Button>
    </div>;
  }

  if (knowledgeBases === null) {
    return <p className="text-muted-foreground" aria-busy="true">Loading knowledge bases...</p>;
  }

  return <>
    {knowledgeBases.length === 0 ? (
      <Card className="items-center gap-3 px-6 py-16 text-center">
        <Library className="mb-2 size-9 text-brand" aria-hidden="true" />
        <CardTitle asChild><h2>Create your first knowledge base.</h2></CardTitle>
        <p className="max-w-md text-sm text-muted-foreground">A knowledge base keeps the sources on one subject together, so you can ask questions about just that.</p>
        <Button className="mt-3" onClick={() => setCreating(true)}><Plus aria-hidden="true" />Create knowledge base</Button>
      </Card>
    ) : <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{knowledgeBases.length === 1 ? "1 knowledge base" : `${knowledgeBases.length} knowledge bases`}</p>
        <Button onClick={() => setCreating(true)}><Plus aria-hidden="true" />Create knowledge base</Button>
      </div>
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {knowledgeBases.map(knowledgeBase => <li key={knowledgeBase.id} className="min-w-0">
          <Link href={`/workspaces/${workspaceId}/knowledge-bases/${knowledgeBase.id}`} className="block h-full rounded-lg">
            <Card interactive className="h-full">
              <div className="flex items-start gap-3 px-(--card-padding)">
                <Library className="mt-1 size-5 shrink-0 text-brand" aria-hidden="true" />
                <div className="min-w-0 wrap-anywhere">
                  <CardTitle asChild><h2>{knowledgeBase.name}</h2></CardTitle>
                  {knowledgeBase.description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{knowledgeBase.description}</p>}
                  <p className="mt-2 text-xs text-muted-foreground">Created {formatDate(knowledgeBase.createdAt)}</p>
                </div>
              </div>
            </Card>
          </Link>
        </li>)}
      </ul>
    </>}

    <CreateKnowledgeBaseDialog
      workspaceId={workspaceId}
      open={creating}
      onOpenChange={setCreating}
      onCreated={knowledgeBase => router.push(`/workspaces/${workspaceId}/knowledge-bases/${knowledgeBase.id}`)}
    />
  </>;
}
