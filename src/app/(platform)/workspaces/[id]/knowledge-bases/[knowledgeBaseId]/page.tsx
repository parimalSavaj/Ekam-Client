"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CloudUpload, Globe, Pencil, Trash, Upload } from "lucide-react";
import { EditKnowledgeBaseDialog } from "@/components/knowledge-bases/edit-knowledge-base-dialog";
import { ActionMenu } from "@/components/platform/action-menu";
import { Breadcrumbs } from "@/components/platform/breadcrumbs";
import { ConfirmDeleteDialog } from "@/components/platform/confirm-delete-dialog";
import { DotList } from "@/components/platform/dot-list";
import { EmptyState } from "@/components/platform/empty-state";
import { LoadError } from "@/components/platform/load-error";
import { HeaderPlaceholder, RowListPlaceholder } from "@/components/platform/loading-placeholders";
import { PageHeader } from "@/components/platform/page-header";
import { SectionHeader } from "@/components/platform/section-header";
import { AddWebPageDialog } from "@/components/sources/add-web-page-dialog";
import { DropOverlay } from "@/components/sources/drop-overlay";
import { ACCEPT_ATTRIBUTE, FILE_RULES_TEXT, sourceTitle, summarizeSources } from "@/components/sources/source-format";
import { SourceList } from "@/components/sources/source-list";
import { UploadTray } from "@/components/sources/upload-tray";
import { useFileDrop } from "@/components/sources/use-file-drop";
import { useUploadQueue } from "@/components/sources/use-upload-queue";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/components/workspaces/format-date";
import { ApiRequestError, errorMessage } from "@/lib/api-client";
import { deleteKnowledgeBase, getKnowledgeBase, type KnowledgeBase } from "@/lib/knowledge-bases-api";
import { deleteSource, listSources, uploadFileSource, type Source } from "@/lib/sources-api";
import { getWorkspace } from "@/lib/workspaces-api";

type LoadState = "loading" | "ready" | "missing" | "error";
type OpenDialog = "" | "web-page" | "edit" | "delete-knowledge-base" | "delete-source";

const newestFirst = (a: Source, b: Source) => b.createdAt.localeCompare(a.createdAt);

export default function KnowledgeBasePage() {
  const router = useRouter();
  const { id: workspaceId, knowledgeBaseId } = useParams<{ id: string; knowledgeBaseId: string }>();
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase | null>(null);
  const [workspaceName, setWorkspaceName] = useState<string | null>(null);
  const [state, setState] = useState<LoadState>("loading");
  const [loadError, setLoadError] = useState("");
  const [sources, setSources] = useState<Source[] | null>(null);
  const [sourcesError, setSourcesError] = useState("");
  const [dialog, setDialog] = useState<OpenDialog>("");
  // Kept after the dialog closes so its text does not change during the closing animation.
  const [sourceToDelete, setSourceToDelete] = useState<Source | null>(null);
  const [notice, setNotice] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const loadKnowledgeBase = useCallback(async () => {
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

  const loadSources = useCallback(async () => {
    try {
      setSources((await listSources(workspaceId, knowledgeBaseId)).sort(newestFirst));
    } catch (cause) {
      setSourcesError(errorMessage(cause));
    }
  }, [workspaceId, knowledgeBaseId]);

  useEffect(() => {
    queueMicrotask(() => { void loadKnowledgeBase(); void loadSources(); });
  }, [loadKnowledgeBase, loadSources]);

  // Only used to label the middle crumb. If it fails the crumb says "Workspace" and the page still works.
  useEffect(() => {
    let cancelled = false;
    getWorkspace(workspaceId)
      .then(workspace => { if (!cancelled) setWorkspaceName(workspace.name); })
      .catch(() => { /* fall back to the generic label */ });
    return () => { cancelled = true; };
  }, [workspaceId]);

  const upload = useCallback(
    (file: File) => uploadFileSource(workspaceId, knowledgeBaseId, file),
    [workspaceId, knowledgeBaseId],
  );
  const uploads = useUploadQueue({
    upload,
    // Without a loaded list there is nothing to add to; "Try again" loads the full list.
    onUploaded: source => setSources(current => (current ? [source, ...current] : current)),
    onFinished: added => { if (added > 0) setNotice(added === 1 ? "1 file added." : `${added} files added.`); },
  });

  function addFiles(files: File[]) {
    setNotice("");
    uploads.enqueue(files);
  }

  const dragging = useFileDrop(addFiles, state === "ready" && dialog === "");

  function open(next: OpenDialog) {
    setNotice("");
    setDialog(next);
  }

  function chooseFiles() {
    setNotice("");
    fileInput.current?.click();
  }

  async function removeKnowledgeBase() {
    try {
      await deleteKnowledgeBase(workspaceId, knowledgeBaseId);
    } catch (cause) {
      // Already gone (for example deleted in another tab): the goal is reached.
      if (!(cause instanceof ApiRequestError && cause.status === 404)) throw cause;
    }
    router.replace(`/workspaces/${workspaceId}`);
  }

  async function removeSource() {
    if (!sourceToDelete) return;
    try {
      await deleteSource(workspaceId, knowledgeBaseId, sourceToDelete.id);
    } catch (cause) {
      if (!(cause instanceof ApiRequestError && cause.status === 404)) throw cause;
    }
    const removedId = sourceToDelete.id;
    setSources(current => current?.filter(source => source.id !== removedId) ?? current);
    setNotice("Source deleted.");
  }

  const trail = (current: string) => [
    { label: "Workspaces", href: "/workspaces" },
    { label: workspaceName ?? "Workspace", href: `/workspaces/${workspaceId}` },
    { label: current },
  ];

  if (state === "loading") {
    return <div className="max-w-4xl">
      <Breadcrumbs items={trail("Knowledge base")} />
      <HeaderPlaceholder label="Loading knowledge base..." />
      <RowListPlaceholder label="Loading sources..." />
    </div>;
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
      <LoadError message={loadError} onRetry={() => { setState("loading"); void loadKnowledgeBase(); }} />
    </>;
  }

  const meta = <DotList items={[...(sources ? summarizeSources(sources) : []), `Created ${formatDate(knowledgeBase.createdAt)}`]} />;

  return <div className="max-w-4xl">
    <Breadcrumbs items={trail(knowledgeBase.name)} />
    <PageHeader
      eyebrow="KNOWLEDGE BASE"
      title={<span className="wrap-anywhere">{knowledgeBase.name}</span>}
      description={knowledgeBase.description ?? undefined}
      meta={meta}
      actions={<>
        {/* On phones this moves into the menu, so the header keeps one row: Upload files and the menu. */}
        <Button variant="outline" className="max-sm:hidden" onClick={() => open("web-page")}><Globe aria-hidden="true" />Add web page</Button>
        <Button className="max-sm:flex-1" onClick={chooseFiles}><Upload aria-hidden="true" />Upload files</Button>
        <ActionMenu label="Knowledge base actions" entries={[
          { kind: "action", label: "Add web page", icon: Globe, className: "sm:hidden", onSelect: () => open("web-page") },
          { kind: "action", label: "Edit name and description", icon: Pencil, onSelect: () => open("edit") },
          { kind: "separator" },
          { kind: "action", label: "Delete knowledge base", icon: Trash, destructive: true, onSelect: () => open("delete-knowledge-base") },
        ]} />
      </>}
    />

    {/* Opened by the Upload files buttons; the visible controls are those buttons. */}
    <input
      ref={fileInput}
      type="file"
      multiple
      accept={ACCEPT_ATTRIBUTE}
      hidden
      tabIndex={-1}
      onChange={event => {
        const files = Array.from(event.target.files ?? []);
        // Cleared so choosing the same file again still counts as a change.
        event.target.value = "";
        addFiles(files);
      }}
    />

    {notice && <Alert variant="success" className="mb-6">{notice}</Alert>}

    <section aria-labelledby="sources-heading">
      <SectionHeader id="sources-heading" title="Sources" count={sources?.length || undefined} />

      {uploads.items.length > 0 && <UploadTray
        items={uploads.items}
        onRetry={uploads.retry}
        onDismiss={uploads.dismiss}
        onClearFailed={uploads.clearFailed}
      />}

      {sourcesError && sources === null ? (
        <LoadError message={sourcesError} onRetry={() => { setSourcesError(""); void loadSources(); }} />
      ) : sources === null ? (
        <RowListPlaceholder label="Loading sources..." />
      ) : sources.length === 0 ? (
        <EmptyState
          icon={CloudUpload}
          headingLevel="h3"
          className="border-dashed border-input"
          title="Add the first sources"
          description={<>Drag files anywhere onto this page, or choose them from your computer. {FILE_RULES_TEXT}</>}
          actions={<>
            <Button variant="outline" onClick={chooseFiles}><Upload aria-hidden="true" />Choose files</Button>
            <Button variant="outline" onClick={() => open("web-page")}><Globe aria-hidden="true" />Add web page</Button>
          </>}
        />
      ) : <>
        <SourceList sources={sources} onDelete={source => { setSourceToDelete(source); open("delete-source"); }} />
        <p className="mt-4 text-xs text-muted-foreground">
          Sources are stored as soon as you add them. Reading and indexing them for questions comes in a later step.
          Drag more files onto this page at any time.
        </p>
      </>}
    </section>

    <DropOverlay visible={dragging} knowledgeBaseName={knowledgeBase.name} />

    <AddWebPageDialog
      workspaceId={workspaceId}
      knowledgeBaseId={knowledgeBase.id}
      open={dialog === "web-page"}
      onOpenChange={next => setDialog(next ? "web-page" : "")}
      onAdded={source => {
        setSources(current => (current ? [source, ...current] : current));
        setDialog("");
        setNotice("Web page added.");
      }}
    />
    <EditKnowledgeBaseDialog
      knowledgeBase={knowledgeBase}
      open={dialog === "edit"}
      onOpenChange={next => setDialog(next ? "edit" : "")}
      onSaved={saved => { setKnowledgeBase(saved); setDialog(""); setNotice("Changes saved."); }}
    />
    <ConfirmDeleteDialog
      open={dialog === "delete-knowledge-base"}
      onOpenChange={next => setDialog(next ? "delete-knowledge-base" : "")}
      title="Delete this knowledge base?"
      description={<>This permanently deletes the knowledge base &ldquo;{knowledgeBase.name}&rdquo; and all of its sources. This cannot be undone.</>}
      keepLabel="Keep knowledge base"
      onConfirm={removeKnowledgeBase}
    />
    <ConfirmDeleteDialog
      open={dialog === "delete-source"}
      onOpenChange={next => setDialog(next ? "delete-source" : "")}
      title="Delete this source?"
      description={sourceToDelete?.type === "web_page"
        ? <>This removes the web page &ldquo;{sourceTitle(sourceToDelete)}&rdquo; from this knowledge base. This cannot be undone.</>
        : <>This permanently deletes &ldquo;{sourceToDelete ? sourceTitle(sourceToDelete) : ""}&rdquo; and its stored file. This cannot be undone.</>}
      keepLabel="Keep source"
      onConfirm={removeSource}
      focusAfterDelete={() => document.getElementById("sources-heading")}
    />
  </div>;
}
