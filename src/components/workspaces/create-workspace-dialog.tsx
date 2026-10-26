"use client";

import { useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { errorMessage } from "@/lib/api-client";
import { createWorkspace, type Workspace } from "@/lib/workspaces-api";

export function CreateWorkspaceDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (workspace: Workspace) => void;
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function handleOpenChange(next: boolean) {
    // Keep the dialog open while the request is running so the result is never lost.
    if (pending) return;
    if (!next) { setName(""); setError(""); }
    onOpenChange(next);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) { setError("Enter a workspace name."); return; }
    setPending(true);
    setError("");
    try {
      onCreated(await createWorkspace(trimmed));
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <form className="grid gap-4" onSubmit={event => void submit(event)}>
          <DialogHeader>
            <DialogTitle>Create a workspace</DialogTitle>
            <DialogDescription>Give your team or organization its own space.</DialogDescription>
          </DialogHeader>
          {error && <Alert variant="error">{error}</Alert>}
          <div className="grid gap-2">
            <Label htmlFor="workspace-name">Workspace name</Label>
            <Input
              id="workspace-name"
              autoComplete="off"
              maxLength={100}
              required
              value={name}
              onChange={event => setName(event.target.value)}
              aria-invalid={error ? true : undefined}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" disabled={pending} onClick={() => handleOpenChange(false)}>Cancel</Button>
            <Button type="submit" loading={pending}>Create workspace</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
