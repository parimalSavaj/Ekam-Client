"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building, Plus } from "lucide-react";
import { EmptyState } from "@/components/platform/empty-state";
import { LoadError } from "@/components/platform/load-error";
import { CardGridPlaceholder } from "@/components/platform/loading-placeholders";
import { PageHeader } from "@/components/platform/page-header";
import { Button } from "@/components/ui/button";
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog";
import { WorkspaceCard } from "@/components/workspaces/workspace-card";
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

  const count = workspaces?.length ?? 0;

  return <>
    <PageHeader
      eyebrow="TEAMS AND ORGANIZATIONS"
      title="Workspaces"
      description="Keep each team or organization's knowledge in its own space."
      meta={workspaces && count > 0 ? (count === 1 ? "1 workspace" : `${count} workspaces`) : undefined}
      actions={<Button className="max-sm:flex-1" onClick={() => setCreating(true)}><Plus aria-hidden="true" />New workspace</Button>}
    />

    {error && workspaces === null ? (
      <LoadError message={error} onRetry={() => { setError(""); void load(); }} />
    ) : workspaces === null ? (
      <CardGridPlaceholder label="Loading workspaces..." />
    ) : workspaces.length === 0 ? (
      <EmptyState
        icon={Building}
        title="Create your first workspace"
        description="A workspace keeps one team or organization's knowledge together, separate from everything else."
        actions={<Button variant="outline" onClick={() => setCreating(true)}><Plus aria-hidden="true" />Create workspace</Button>}
      />
    ) : (
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workspaces.map(workspace => <li key={workspace.id} className="min-w-0">
          <WorkspaceCard workspace={workspace} />
        </li>)}
      </ul>
    )}

    <CreateWorkspaceDialog
      open={creating}
      onOpenChange={setCreating}
      onCreated={workspace => router.push(`/workspaces/${workspace.id}`)}
    />
  </>;
}
