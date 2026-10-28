"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/platform/breadcrumbs";
import { PageHeader } from "@/components/platform/page-header";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/components/workspaces/format-date";
import { ApiRequestError, errorMessage } from "@/lib/api-client";
import { deleteKnowledgeBase, getKnowledgeBase, updateKnowledgeBase, type KnowledgeBase } from "@/lib/knowledge-bases-api";
import { getWorkspace } from "@/lib/workspaces-api";

type LoadState = "loading" | "ready" | "missing" | "error";

export default function KnowledgeBasePage() {
  const router = useRouter();
  const { id: workspaceId, knowledgeBaseId } = useParams<{ id: string; knowledgeBaseId: string }>();
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase | null>(null);
  const [workspaceName, setWorkspaceName] = useState<string | null>(null);
  const [state, setState] = useState<LoadState>("loading");
  const [loadError, setLoadError] = useState("");
  // null means "not edited yet": the field shows the saved value.
  const [name, setName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  // Which action is running, so only that button shows a spinner while the rest stay disabled.
  const [pending, setPending] = useState<"" | "save" | "delete">("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const load = useCallback(async () => {
    try {
      setKnowledgeBase(await getKnowledgeBase(workspaceId, knowledgeBaseId));
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
  }, [workspaceId, knowledgeBaseId]);

  useEffect(() => {
    queueMicrotask(() => { void load(); });
  }, [load]);

  // Only used to label the middle crumb. If it fails the crumb says "Workspace" and the page still works.
  useEffect(() => {
    let cancelled = false;
    getWorkspace(workspaceId)
      .then(workspace => { if (!cancelled) setWorkspaceName(workspace.name); })
      .catch(() => { /* fall back to the generic label */ });
    return () => { cancelled = true; };
  }, [workspaceId]);

  const trail = (current: string) => [
    { label: "Workspaces", href: "/workspaces" },
    { label: workspaceName ?? "Workspace", href: `/workspaces/${workspaceId}` },
    { label: current },
  ];

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!knowledgeBase) return;
    const nextName = (name ?? knowledgeBase.name).trim();
    if (!nextName) { setError("Enter a knowledge base name."); setMessage(""); return; }
    setPending("save");
    setError("");
    setMessage("");
    try {
      setKnowledgeBase(await updateKnowledgeBase(workspaceId, knowledgeBase.id, {
        name: nextName,
        description: description ?? knowledgeBase.description ?? "",
      }));
      setName(null);
      setDescription(null);
      setMessage("Knowledge base saved.");
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setPending("");
    }
  }

  async function remove() {
    if (!knowledgeBase) return;
    setPending("delete");
    setDeleteError("");
    try {
      await deleteKnowledgeBase(workspaceId, knowledgeBase.id);
      router.replace(`/workspaces/${workspaceId}`);
    } catch (cause) {
      // Already gone (for example deleted in another tab): the goal is reached.
      if (cause instanceof ApiRequestError && cause.status === 404) { router.replace(`/workspaces/${workspaceId}`); return; }
      setDeleteError(errorMessage(cause));
      setPending("");
    }
  }

  if (state === "loading") {
    return <>
      <Breadcrumbs items={trail("Knowledge base")} />
      <PageHeader eyebrow="KNOWLEDGE BASE" title="Knowledge base" />
      <p className="text-muted-foreground" aria-busy="true">Loading knowledge base...</p>
    </>;
  }

  if (state === "missing") {
    return <>
      <Breadcrumbs items={trail("Not found")} />
      <PageHeader title="Knowledge base not found" description="It may have been deleted, or it may belong to another account." />
    </>;
  }

  if (state === "error" || !knowledgeBase) {
    return <>
      <Breadcrumbs items={trail("Knowledge base")} />
      <PageHeader eyebrow="KNOWLEDGE BASE" title="Knowledge base" />
      <div className="grid justify-items-start gap-3">
        <Alert variant="error">{loadError || "Something went wrong. Please try again."}</Alert>
        <Button variant="outline" onClick={() => { setState("loading"); void load(); }}>Try again</Button>
      </div>
    </>;
  }

  const descriptionValue = description ?? knowledgeBase.description ?? "";

  return <div className="max-w-3xl">
    <Breadcrumbs items={trail(knowledgeBase.name)} />
    <PageHeader
      eyebrow="KNOWLEDGE BASE"
      title={<span className="wrap-anywhere">{knowledgeBase.name}</span>}
      description={`Created ${formatDate(knowledgeBase.createdAt)}`}
    />
    {(message || error) && <div className="mb-6 grid gap-3">
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="error">{error}</Alert>}
    </div>}
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader><CardTitle asChild><h2>Knowledge base details</h2></CardTitle></CardHeader>
        <CardContent>
          <form className="grid max-w-xl gap-4" onSubmit={event => void save(event)}>
            <div className="grid gap-2">
              <Label htmlFor="knowledge-base-name">Knowledge base name</Label>
              <Input
                id="knowledge-base-name"
                autoComplete="off"
                maxLength={100}
                required
                value={name ?? knowledgeBase.name}
                onChange={event => setName(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="knowledge-base-description">Description (optional)</Label>
              <Textarea
                id="knowledge-base-description"
                autoComplete="off"
                maxLength={500}
                value={descriptionValue}
                onChange={event => setDescription(event.target.value)}
              />
              <p className="text-xs text-muted-foreground">{descriptionValue.length} of 500 characters</p>
            </div>
            <Button type="submit" className="justify-self-start" disabled={pending === "delete"} loading={pending === "save"}>Save changes</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-error/30">
        <CardHeader>
          <CardTitle asChild><h2>Delete knowledge base</h2></CardTitle>
          <CardDescription>Permanently remove this knowledge base. This cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" disabled={pending !== ""} onClick={() => { setDeleteError(""); setConfirmDelete(true); }}>Delete knowledge base</Button>
        </CardContent>
      </Card>
    </div>

    <Dialog open={confirmDelete} onOpenChange={open => { if (pending !== "delete") setConfirmDelete(open); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this knowledge base?</DialogTitle>
          <DialogDescription>This permanently deletes the knowledge base &ldquo;{knowledgeBase.name}&rdquo;. This cannot be undone.</DialogDescription>
        </DialogHeader>
        {deleteError && <Alert variant="error">{deleteError}</Alert>}
        <DialogFooter>
          <Button variant="outline" disabled={pending === "delete"} onClick={() => setConfirmDelete(false)}>Keep knowledge base</Button>
          <Button variant="destructive" loading={pending === "delete"} onClick={() => void remove()}>Delete permanently</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>;
}
