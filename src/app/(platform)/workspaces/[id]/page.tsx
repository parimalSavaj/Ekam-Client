"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Library, Pencil, Plus, Trash } from "lucide-react";
import { CreateKnowledgeBaseDialog } from "@/components/knowledge-bases/create-knowledge-base-dialog";
import { KnowledgeBaseCard } from "@/components/knowledge-bases/knowledge-base-card";
import { ActionMenu } from "@/components/platform/action-menu";
import { Breadcrumbs } from "@/components/platform/breadcrumbs";
import { ConfirmDeleteDialog } from "@/components/platform/confirm-delete-dialog";
import { DotList } from "@/components/platform/dot-list";
import { EmptyState } from "@/components/platform/empty-state";
import { LoadError } from "@/components/platform/load-error";
import { CardGridPlaceholder, HeaderPlaceholder } from "@/components/platform/loading-placeholders";
import { PageHeader } from "@/components/platform/page-header";
import { SectionHeader } from "@/components/platform/section-header";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/components/workspaces/format-date";
import { RenameWorkspaceDialog } from "@/components/workspaces/rename-workspace-dialog";
import { ApiRequestError, errorMessage } from "@/lib/api-client";
import { listKnowledgeBases, type KnowledgeBase } from "@/lib/knowledge-bases-api";
import { deleteWorkspace, getWorkspace, type Workspace } from "@/lib/workspaces-api";

type LoadState = "loading" | "ready" | "missing" | "error";
type OpenDialog = "" | "create" | "rename" | "delete";

const TRAIL_ROOT = { label: "Workspaces", href: "/workspaces" };

export default function WorkspacePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [state, setState] = useState<LoadState>("loading");
  const [loadError, setLoadError] = useState("");
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[] | null>(null);
  const [listError, setListError] = useState("");
  const [dialog, setDialog] = useState<OpenDialog>("");
  const [notice, setNotice] = useState("");

  const loadWorkspace = useCallback(async () => {
    try {
      setWorkspace(await getWorkspace(id));
      setState("ready");
    } catch (cause) {
      // 400 (malformed id) and 404 (missing or someone else's) look the same to the user.
      if (cause instanceof ApiRequestError && (cause.status === 404 || cause.status === 400)) {
        setState("missing");
      } else {
        setLoadError(errorMessage(cause));
        setState("error");
      }
    }
  }, [id]);

  const loadKnowledgeBases = useCallback(async () => {
    try {
      setKnowledgeBases(await listKnowledgeBases(id));
    } catch (cause) {
      setListError(errorMessage(cause));
    }
  }, [id]);

  useEffect(() => {
    queueMicrotask(() => { void loadWorkspace(); void loadKnowledgeBases(); });
  }, [loadWorkspace, loadKnowledgeBases]);

  function open(next: OpenDialog) {
    setNotice("");
    setDialog(next);
  }

  async function remove() {
    try {
      await deleteWorkspace(id);
    } catch (cause) {
      // Already gone (for example deleted in another tab): the goal is reached.
      if (!(cause instanceof ApiRequestError && cause.status === 404)) throw cause;
    }
    router.replace("/workspaces");
  }

  if (state === "loading") {
    return <>
      <Breadcrumbs items={[TRAIL_ROOT, { label: "Workspace" }]} />
      <HeaderPlaceholder label="Loading workspace..." />
      <CardGridPlaceholder label="Loading knowledge bases..." />
    </>;
  }

  if (state === "missing") {
    return <>
      <Breadcrumbs items={[TRAIL_ROOT, { label: "Not found" }]} />
      <PageHeader title="Workspace not found" description="It may have been deleted, or it may belong to another account." />
    </>;
  }

  if (state === "error" || !workspace) {
    return <>
      <Breadcrumbs items={[TRAIL_ROOT, { label: "Workspace" }]} />
      <PageHeader eyebrow="WORKSPACE" title="Workspace" />
      <LoadError message={loadError} onRetry={() => { setState("loading"); void loadWorkspace(); }} />
    </>;
  }

  const count = knowledgeBases?.length;
  const meta = <DotList items={[
    count !== undefined && (count === 0 ? "No knowledge bases yet" : count === 1 ? "1 knowledge base" : `${count} knowledge bases`),
    `Created ${formatDate(workspace.createdAt)}`,
  ]} />;

  return <>
    <Breadcrumbs items={[TRAIL_ROOT, { label: workspace.name }]} />
    <PageHeader
      eyebrow="WORKSPACE"
      title={<span className="wrap-anywhere">{workspace.name}</span>}
      meta={meta}
      actions={<>
        <Button className="max-sm:flex-1" onClick={() => open("create")}><Plus aria-hidden="true" />New knowledge base</Button>
        <ActionMenu label="Workspace actions" entries={[
          { kind: "action", label: "Rename workspace", icon: Pencil, onSelect: () => open("rename") },
          { kind: "separator" },
          { kind: "action", label: "Delete workspace", icon: Trash, destructive: true, onSelect: () => open("delete") },
        ]} />
      </>}
    />

    {notice && <Alert variant="success" className="mb-6">{notice}</Alert>}

    <section aria-labelledby="knowledge-bases-heading">
      <SectionHeader id="knowledge-bases-heading" title="Knowledge bases" count={count || undefined} />
      {listError && knowledgeBases === null ? (
        <LoadError message={listError} onRetry={() => { setListError(""); void loadKnowledgeBases(); }} />
      ) : knowledgeBases === null ? (
        <CardGridPlaceholder label="Loading knowledge bases..." />
      ) : knowledgeBases.length === 0 ? (
        <EmptyState
          icon={Library}
          headingLevel="h3"
          title="Create your first knowledge base"
          description="A knowledge base keeps the sources on one subject together, such as a product handbook or a support playbook, so you can ask questions about just that."
          actions={<Button variant="outline" onClick={() => open("create")}><Plus aria-hidden="true" />Create knowledge base</Button>}
        />
      ) : (
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {knowledgeBases.map(knowledgeBase => <li key={knowledgeBase.id} className="min-w-0">
            <KnowledgeBaseCard knowledgeBase={knowledgeBase} />
          </li>)}
        </ul>
      )}
    </section>

    <CreateKnowledgeBaseDialog
      workspaceId={workspace.id}
      open={dialog === "create"}
      onOpenChange={next => setDialog(next ? "create" : "")}
      onCreated={knowledgeBase => router.push(`/workspaces/${workspace.id}/knowledge-bases/${knowledgeBase.id}`)}
    />
    <RenameWorkspaceDialog
      workspace={workspace}
      open={dialog === "rename"}
      onOpenChange={next => setDialog(next ? "rename" : "")}
      onRenamed={renamed => { setWorkspace(renamed); setDialog(""); setNotice("Workspace renamed."); }}
    />
    <ConfirmDeleteDialog
      open={dialog === "delete"}
      onOpenChange={next => setDialog(next ? "delete" : "")}
      title="Delete this workspace?"
      description={<>This permanently deletes the workspace &ldquo;{workspace.name}&rdquo;, its knowledge bases and their sources. This cannot be undone.</>}
      keepLabel="Keep workspace"
      onConfirm={remove}
    />
  </>;
}
