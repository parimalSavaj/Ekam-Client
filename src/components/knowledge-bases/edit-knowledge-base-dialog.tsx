"use client";

import { useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { errorMessage } from "@/lib/api-client";
import { updateKnowledgeBase, type KnowledgeBase } from "@/lib/knowledge-bases-api";

const DESCRIPTION_LIMIT = 500;

export function EditKnowledgeBaseDialog({
  knowledgeBase,
  open,
  onOpenChange,
  onSaved,
}: {
  knowledgeBase: KnowledgeBase;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (knowledgeBase: KnowledgeBase) => void;
}) {
  // Kept here so the dialog cannot be closed while the request runs and the result is never lost.
  const [pending, setPending] = useState(false);
  return (
    <Dialog open={open} onOpenChange={next => { if (!pending) onOpenChange(next); }}>
      <DialogContent>
        {/* The form mounts each time the dialog opens, so it always starts from the saved values. */}
        <EditForm
          knowledgeBase={knowledgeBase}
          pending={pending}
          onPendingChange={setPending}
          onCancel={() => onOpenChange(false)}
          onSaved={onSaved}
        />
      </DialogContent>
    </Dialog>
  );
}

function EditForm({
  knowledgeBase,
  pending,
  onPendingChange,
  onCancel,
  onSaved,
}: {
  knowledgeBase: KnowledgeBase;
  pending: boolean;
  onPendingChange: (pending: boolean) => void;
  onCancel: () => void;
  onSaved: (knowledgeBase: KnowledgeBase) => void;
}) {
  const [name, setName] = useState(knowledgeBase.name);
  const [description, setDescription] = useState(knowledgeBase.description ?? "");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) { setError("Enter a knowledge base name."); return; }
    onPendingChange(true);
    setError("");
    try {
      // An empty description clears it.
      const saved = await updateKnowledgeBase(knowledgeBase.workspaceId, knowledgeBase.id, { name: trimmed, description });
      onPendingChange(false);
      onSaved(saved);
    } catch (cause) {
      setError(errorMessage(cause));
      onPendingChange(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={event => void submit(event)}>
      <DialogHeader>
        <DialogTitle>Edit knowledge base</DialogTitle>
        <DialogDescription>A clear name and a short description help people pick the right knowledge base.</DialogDescription>
      </DialogHeader>
      {error && <Alert variant="error">{error}</Alert>}
      <div className="grid gap-2">
        <Label htmlFor="edit-knowledge-base-name">Name</Label>
        <Input
          id="edit-knowledge-base-name"
          autoComplete="off"
          maxLength={100}
          required
          value={name}
          onChange={event => setName(event.target.value)}
          aria-invalid={error ? true : undefined}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="edit-knowledge-base-description">Description (optional)</Label>
        <Textarea
          id="edit-knowledge-base-description"
          autoComplete="off"
          maxLength={DESCRIPTION_LIMIT}
          value={description}
          onChange={event => setDescription(event.target.value)}
          aria-describedby="edit-knowledge-base-description-count"
        />
        <p id="edit-knowledge-base-description-count" className="text-xs text-muted-foreground">
          {description.length} of {DESCRIPTION_LIMIT} characters
        </p>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" disabled={pending} onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={pending}>Save changes</Button>
      </DialogFooter>
    </form>
  );
}
