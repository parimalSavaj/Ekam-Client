"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building, Plus } from "lucide-react";
import { PageHeader } from "@/components/platform/page-header";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog";
import { formatDate } from "@/components/workspaces/format-date";
import { errorMessage } from "@/lib/api-client";
import { listWorkspaces, type Workspace } from "@/lib/workspaces-api";

export default function WorkspacesPage() {
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<Workspace[] | null>(null);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    try {
      setWorkspaces(await listWorkspaces());
    } catch (cause) {
      setError(errorMessage(cause));
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => { void load(); });
  }, [load]);

  const header = (
    <PageHeader
      eyebrow="TEAMS AND ORGANIZATIONS"
      title="Workspaces"
      description="Keep each team or organization's knowledge in its own space."
    />
  );

  if (error && workspaces === null) {
    return <>
      {header}
      <div className="grid justify-items-start gap-3">
        <Alert variant="error">{error}</Alert>
        <Button variant="outline" onClick={() => { setError(""); void load(); }}>Try again</Button>
      </div>
    </>;
  }

  if (workspaces === null) {
    return <>
      {header}
      <p className="text-muted-foreground" aria-busy="true">Loading workspaces...</p>
    </>;
  }

  return <>
    {header}
    {workspaces.length === 0 ? (
      <Card className="items-center gap-3 px-6 py-16 text-center">
        <Building className="mb-2 size-9 text-brand" aria-hidden="true" />
        <CardTitle asChild><h2>Create your first workspace.</h2></CardTitle>
        <p className="max-w-md text-sm text-muted-foreground">A workspace keeps one team or organization&apos;s knowledge together, separate from everything else.</p>
        <Button className="mt-3" onClick={() => setCreating(true)}><Plus aria-hidden="true" />Create workspace</Button>
      </Card>
    ) : <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{workspaces.length === 1 ? "1 workspace" : `${workspaces.length} workspaces`}</p>
        <Button onClick={() => setCreating(true)}><Plus aria-hidden="true" />Create workspace</Button>
      </div>
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workspaces.map(workspace => <li key={workspace.id} className="min-w-0">
          <Link href={`/workspaces/${workspace.id}`} className="block h-full rounded-lg">
            <Card interactive className="h-full">
              <div className="flex items-start gap-3 px-(--card-padding)">
                <Building className="mt-1 size-5 shrink-0 text-brand" aria-hidden="true" />
                <div className="min-w-0 wrap-anywhere">
                  <CardTitle asChild><h2>{workspace.name}</h2></CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">Created {formatDate(workspace.createdAt)}</p>
                </div>
              </div>
            </Card>
          </Link>
        </li>)}
      </ul>
    </>}

    <CreateWorkspaceDialog
      open={creating}
      onOpenChange={setCreating}
      onCreated={workspace => router.push(`/workspaces/${workspace.id}`)}
    />
  </>;
}
