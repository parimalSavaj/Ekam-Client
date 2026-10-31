"use client";

import { useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { errorMessage } from "@/lib/api-client";
import { addWebPageSource, type Source } from "@/lib/sources-api";

/** People often paste "example.com/page"; the server needs the scheme, so https:// is added for them. */
function withScheme(address: string): string {
  return /^[a-z][a-z0-9+.-]*:/i.test(address) ? address : `https://${address}`;
}

export function AddWebPageDialog({
  workspaceId,
  knowledgeBaseId,
  open,
  onOpenChange,
  onAdded,
}: {
  workspaceId: string;
  knowledgeBaseId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdded: (source: Source) => void;
}) {
  // Kept here so the dialog cannot be closed while the request runs and the result is never lost.
  const [pending, setPending] = useState(false);
  return (
    <Dialog open={open} onOpenChange={next => { if (!pending) onOpenChange(next); }}>
      <DialogContent>
        {/* The form mounts each time the dialog opens, so it always starts empty. */}
        <AddWebPageForm
          workspaceId={workspaceId}
          knowledgeBaseId={knowledgeBaseId}
          pending={pending}
          onPendingChange={setPending}
          onCancel={() => onOpenChange(false)}
          onAdded={onAdded}
        />
      </DialogContent>
    </Dialog>
  );
}

function AddWebPageForm({
  workspaceId,
  knowledgeBaseId,
  pending,
  onPendingChange,
  onCancel,
  onAdded,
}: {
  workspaceId: string;
  knowledgeBaseId: string;
  pending: boolean;
  onPendingChange: (pending: boolean) => void;
  onCancel: () => void;
  onAdded: (source: Source) => void;
}) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const address = url.trim();
    if (!address) { setError("Enter the address of the web page."); return; }
    onPendingChange(true);
    setError("");
    try {
      const source = await addWebPageSource(workspaceId, knowledgeBaseId, withScheme(address));
      onPendingChange(false);
      onAdded(source);
    } catch (cause) {
      setError(errorMessage(cause));
      onPendingChange(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={event => void submit(event)} noValidate>
      <DialogHeader>
        <DialogTitle>Add a web page</DialogTitle>
        <DialogDescription>The address is saved to this knowledge base. The page itself is read in a later step.</DialogDescription>
      </DialogHeader>
      {error && <Alert variant="error">{error}</Alert>}
      <div className="grid gap-2">
        <Label htmlFor="web-page-url">Web address</Label>
        <Input
          id="web-page-url"
          type="url"
          inputMode="url"
          autoComplete="url"
          spellCheck={false}
          maxLength={2048}
          required
          placeholder="https://example.com/help/getting-started"
          value={url}
          onChange={event => setUrl(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby="web-page-url-hint"
        />
        <p id="web-page-url-hint" className="text-xs text-muted-foreground">One page at a time. If you leave out https://, it is added for you.</p>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" disabled={pending} onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={pending}>Add web page</Button>
      </DialogFooter>
    </form>
  );
}
