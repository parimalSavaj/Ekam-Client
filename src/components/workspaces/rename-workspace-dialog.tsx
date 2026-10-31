"use client";

import { useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { errorMessage } from "@/lib/api-client";
import { renameWorkspace, type Workspace } from "@/lib/workspaces-api";

export function RenameWorkspaceDialog({
  workspace,
  open,
  onOpenChange,
  onRenamed,
}: {
  workspace: Workspace;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRenamed: (workspace: Workspace) => void;
}) {
  // Kept here so the dialog cannot be closed while the request runs and the result is never lost.
  const [pending, setPending] = useState(false);
  return (
    <Dialog open={open} onOpenChange={next => { if (!pending) onOpenChange(next); }}>
      <DialogContent>
        {/* The form mounts each time the dialog opens, so it always starts from the saved name. */}
        <RenameForm
          workspace={workspace}
          pending={pending}
          onPendingChange={setPending}
          onCancel={() => onOpenChange(false)}
          onRenamed={onRenamed}
        />
      </DialogContent>
    </Dialog>
  );
}

function RenameForm({
  workspace,
  pending,
  onPendingChange,
  onCancel,
  onRenamed,
}: {
  workspace: Workspace;
  pending: boolean;
  onPendingChange: (pending: boolean) => void;
  onCancel: () => void;
  onRenamed: (workspace: Workspace) => void;
}) {
  const [name, setName] = useState(workspace.name);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) { setError("Enter a workspace name."); return; }
    if (trimmed === workspace.name) { onCancel(); return; }
    onPendingChange(true);
    setError("");
    try {
      const renamed = await renameWorkspace(workspace.id, trimmed);
      onPendingChange(false);
      onRenamed(renamed);
    } catch (cause) {
      setError(errorMessage(cause));
      onPendingChange(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={event => void submit(event)}>
      <DialogHeader>
        <DialogTitle>Rename workspace</DialogTitle>
        <DialogDescription>The new name is used everywhere this workspace appears.</DialogDescription>
      </DialogHeader>
      {error && <Alert variant="error">{error}</Alert>}
      <div className="grid gap-2">
        <Label htmlFor="rename-workspace-name">Workspace name</Label>
        <Input
          id="rename-workspace-name"
          autoComplete="off"
          maxLength={100}
          required
          value={name}
          onChange={event => setName(event.target.value)}
          aria-invalid={error ? true : undefined}
        />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" disabled={pending} onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={pending}>Save name</Button>
      </DialogFooter>
    </form>
  );
}
