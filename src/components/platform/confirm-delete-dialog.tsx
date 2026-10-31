"use client";

import { useRef, useState, type ReactNode } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { errorMessage } from "@/lib/api-client";

/**
 * Confirmation step for every destructive action. The description must name the thing being
 * destroyed. The dialog stays open while `onConfirm` runs, shows its error if it throws, and
 * closes when it resolves (unless the caller has already navigated away).
 */
export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  keepLabel,
  confirmLabel = "Delete permanently",
  onConfirm,
  focusAfterDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  keepLabel: string;
  confirmLabel?: string;
  onConfirm: () => Promise<void>;
  /**
   * Where focus goes after a successful delete when the button that opened the dialog went away
   * with the deleted item (for example a list row). Without it focus returns to that button.
   */
  focusAfterDelete?: () => HTMLElement | null;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const deleted = useRef(false);

  function handleOpenChange(next: boolean) {
    if (pending) return;
    if (!next) setError("");
    onOpenChange(next);
  }

  async function confirm() {
    setPending(true);
    setError("");
    try {
      await onConfirm();
      deleted.current = true;
      setPending(false);
      onOpenChange(false);
    } catch (cause) {
      setError(errorMessage(cause));
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        onCloseAutoFocus={event => {
          const target = deleted.current ? focusAfterDelete?.() : null;
          deleted.current = false;
          if (target) {
            event.preventDefault();
            target.focus();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {error && <Alert variant="error">{error}</Alert>}
        <DialogFooter>
          <Button variant="outline" disabled={pending} onClick={() => handleOpenChange(false)}>{keepLabel}</Button>
          <Button variant="destructive" loading={pending} onClick={() => void confirm()}>{confirmLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
