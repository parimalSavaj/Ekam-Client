"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { Library, Settings } from "lucide-react";
import { KnowledgeBasesPanel } from "@/components/knowledge-bases/knowledge-bases-panel";
import { Breadcrumbs } from "@/components/platform/breadcrumbs";
import { PageHeader } from "@/components/platform/page-header";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/components/workspaces/format-date";
import { ApiRequestError, errorMessage } from "@/lib/api-client";
import { deleteWorkspace, getWorkspace, renameWorkspace, type Workspace } from "@/lib/workspaces-api";

type LoadState = "loading" | "ready" | "missing" | "error";

export default function WorkspacePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [state, setState] = useState<LoadState>("loading");
  const [loadError, setLoadError] = useState("");
  const [name, setName] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  // Which action is running, so only that button shows a spinner while the rest stay disabled.
  const [pending, setPending] = useState<"" | "rename" | "delete">("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const load = useCallback(async () => {
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

  useEffect(() => {
    queueMicrotask(() => { void load(); });
  }, [load]);

  async function rename(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!workspace) return;
    const trimmed = (name ?? workspace.name).trim();
    if (!trimmed) { setError("Enter a workspace name."); setMessage(""); return; }
    setPending("rename");
    setError("");
    setMessage("");
    try {
      setWorkspace(await renameWorkspace(workspace.id, trimmed));
      setName(null);
      setMessage("Workspace renamed.");
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setPending("");
    }
  }

  async function remove() {
    if (!workspace) return;
    setPending("delete");
    setDeleteError("");
    try {
      await deleteWorkspace(workspace.id);
      router.replace("/workspaces");
    } catch (cause) {
      // Already gone (for example deleted in another tab): the goal is reached.
      if (cause instanceof ApiRequestError && cause.status === 404) { router.replace("/workspaces"); return; }
      setDeleteError(errorMessage(cause));
      setPending("");
    }
  }

  if (state === "loading") {
    return <>
      <Breadcrumbs items={[{ label: "Workspaces", href: "/workspaces" }, { label: "Workspace" }]} />
      <PageHeader eyebrow="WORKSPACE" title="Workspace" />
      <p className="text-muted-foreground" aria-busy="true">Loading workspace...</p>
    </>;
  }

  if (state === "missing") {
    return <>
      <Breadcrumbs items={[{ label: "Workspaces", href: "/workspaces" }, { label: "Not found" }]} />
      <PageHeader title="Workspace not found" description="It may have been deleted, or it may belong to another account." />
    </>;
  }

  if (state === "error" || !workspace) {
    return <>
      <Breadcrumbs items={[{ label: "Workspaces", href: "/workspaces" }, { label: "Workspace" }]} />
      <PageHeader eyebrow="WORKSPACE" title="Workspace" />
      <div className="grid justify-items-start gap-3">
        <Alert variant="error">{loadError || "Something went wrong. Please try again."}</Alert>
        <Button variant="outline" onClick={() => { setState("loading"); void load(); }}>Try again</Button>
      </div>
    </>;
  }

  return <div>
    <Breadcrumbs items={[{ label: "Workspaces", href: "/workspaces" }, { label: workspace.name }]} />
    <PageHeader
      eyebrow="WORKSPACE"
      title={<span className="wrap-anywhere">{workspace.name}</span>}
      description={`Created ${formatDate(workspace.createdAt)}`}
    />
    {/* Tabs keep one primary action per view: "Create knowledge base" or "Save changes", never both. */}
    <Tabs defaultValue="knowledge-bases" className="gap-6">
      {/* No overflow clipping here: it would cut off the focus ring of the tabs. Both tabs fit at 320px. */}
      <TabsList variant="line" aria-label="Workspace sections">
        <TabsTrigger value="knowledge-bases"><Library aria-hidden="true" />Knowledge bases</TabsTrigger>
        <TabsTrigger value="settings"><Settings aria-hidden="true" />Settings</TabsTrigger>
      </TabsList>

      {/* The panels hold their own buttons and links, so the panel itself is not a tab stop and draws no ring. */}
      <TabsContent value="knowledge-bases" tabIndex={-1} className="focus-visible:outline-none">
        <KnowledgeBasesPanel workspaceId={workspace.id} />
      </TabsContent>

      <TabsContent value="settings" tabIndex={-1} className="max-w-3xl focus-visible:outline-none">
        {(message || error) && <div className="mb-6 grid gap-3">
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="error">{error}</Alert>}
        </div>}
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader><CardTitle asChild><h2>Workspace details</h2></CardTitle></CardHeader>
            <CardContent>
              <form className="grid max-w-sm gap-3" onSubmit={event => void rename(event)}>
                <Label htmlFor="workspace-name">Workspace name</Label>
                <Input
                  id="workspace-name"
                  autoComplete="off"
                  maxLength={100}
                  required
                  value={name ?? workspace.name}
                  onChange={event => setName(event.target.value)}
                />
                <Button type="submit" className="justify-self-start" disabled={pending === "delete"} loading={pending === "rename"}>Save changes</Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-error/30">
            <CardHeader>
              <CardTitle asChild><h2>Delete workspace</h2></CardTitle>
              <CardDescription>Permanently remove this workspace, including its knowledge bases. This cannot be undone.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" disabled={pending !== ""} onClick={() => { setDeleteError(""); setConfirmDelete(true); }}>Delete workspace</Button>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>

    <Dialog open={confirmDelete} onOpenChange={open => { if (pending !== "delete") setConfirmDelete(open); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this workspace?</DialogTitle>
          <DialogDescription>This permanently deletes the workspace &ldquo;{workspace.name}&rdquo;. This cannot be undone.</DialogDescription>
        </DialogHeader>
        {deleteError && <Alert variant="error">{deleteError}</Alert>}
        <DialogFooter>
          <Button variant="outline" disabled={pending === "delete"} onClick={() => setConfirmDelete(false)}>Keep workspace</Button>
          <Button variant="destructive" loading={pending === "delete"} onClick={() => void remove()}>Delete permanently</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>;
}
