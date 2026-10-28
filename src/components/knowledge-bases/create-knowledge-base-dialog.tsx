"use client";

import { useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { errorMessage } from "@/lib/api-client";
import { createKnowledgeBase, type KnowledgeBase } from "@/lib/knowledge-bases-api";

export function CreateKnowledgeBaseDialog({
  workspaceId,
  open,
  onOpenChange,
  onCreated,
}: {
  workspaceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (knowledgeBase: KnowledgeBase) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function handleOpenChange(next: boolean) {
    // Keep the dialog open while the request is running so the result is never lost.
    if (pending) return;
    if (!next) { setName(""); setDescription(""); setError(""); }
    onOpenChange(next);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) { setError("Enter a knowledge base name."); return; }
    setPending(true);
    setError("");
    try {
      const created = await createKnowledgeBase(workspaceId, { name: trimmed, description });
      setName("");
      setDescription("");
      onCreated(created);
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
            <DialogTitle>Create a knowledge base</DialogTitle>
            <DialogDescription>A knowledge base groups the sources on one subject, so answers stay focused.</DialogDescription>
          </DialogHeader>
          {error && <Alert variant="error">{error}</Alert>}
          <div className="grid gap-2">
            <Label htmlFor="knowledge-base-name">Knowledge base name</Label>
            <Input
              id="knowledge-base-name"
              autoComplete="off"
              maxLength={100}
              required
              value={name}
              onChange={event => setName(event.target.value)}
              aria-invalid={error ? true : undefined}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="knowledge-base-description">Description (optional)</Label>
            <Textarea
              id="knowledge-base-description"
              autoComplete="off"
              maxLength={500}
              value={description}
              onChange={event => setDescription(event.target.value)}
            />
            <p className="text-xs text-muted-foreground">{description.length} of 500 characters</p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" disabled={pending} onClick={() => handleOpenChange(false)}>Cancel</Button>
            <Button type="submit" loading={pending}>Create knowledge base</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
