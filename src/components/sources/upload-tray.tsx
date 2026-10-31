"use client";

import { CircleAlert, Clock, LoaderCircle, RotateCcw, X } from "lucide-react";
import { fileKind, formatFileSize } from "@/components/sources/source-format";
import type { UploadItem } from "@/components/sources/use-upload-queue";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function heading(active: number, failed: number): string {
  if (active > 0) return active === 1 ? "Uploading 1 file" : `Uploading ${active} files`;
  return failed === 1 ? "1 file was not added" : `${failed} files were not added`;
}

/** Files on their way into the knowledge base, and the ones that could not be added. */
export function UploadTray({
  items,
  onRetry,
  onDismiss,
  onClearFailed,
}: {
  items: readonly UploadItem[];
  onRetry: (id: number) => void;
  onDismiss: (id: number) => void;
  onClearFailed: () => void;
}) {
  const failed = items.filter(item => item.status === "failed").length;
  const active = items.length - failed;

  return (
    <Card className="mb-6 gap-0 py-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-(--card-padding) py-3">
        {/* Announced as it changes, so screen reader users hear progress without moving focus. */}
        <div role="status" className="min-w-0">
          <p className="text-sm font-semibold">{heading(active, failed)}</p>
          {active > 0 && <p className="text-xs text-muted-foreground">Keep this page open until the uploads finish.</p>}
        </div>
        {active === 0 && failed > 0 && <Button variant="ghost" size="sm" onClick={onClearFailed}>Clear list</Button>}
      </div>
      <ul>
        {items.map(item => {
          const Kind = fileKind(item.file.name).icon;
          return <li key={item.id} className="flex items-start gap-3 border-b px-(--card-padding) py-3 last:border-b-0 sm:gap-4">
            {/* Decorative, so phones give its width to the file name and the reason. */}
            <span className="grid size-10 shrink-0 place-items-center rounded-md border bg-secondary max-sm:hidden" aria-hidden="true">
              <Kind className="size-5 text-muted-foreground" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium wrap-anywhere">{item.file.name}</p>
              <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                {item.status === "uploading" && <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                  <LoaderCircle className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden="true" />Uploading...
                </span>}
                {item.status === "waiting" && <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-3.5" aria-hidden="true" />Waiting
                </span>}
                <span>{formatFileSize(item.file.size)}</span>
              </p>
              {item.status === "failed" && <p className="mt-1 flex items-start gap-1.5 text-xs font-medium text-error-foreground">
                <CircleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                <span className="min-w-0 wrap-anywhere">Not added. {item.error}</span>
              </p>}
              {/* -ml-2.5 lines the label up with the text above while the button keeps its padding. */}
              {item.status === "failed" && item.retryable && <Button variant="ghost" size="sm" className="mt-1 -ml-2.5" onClick={() => onRetry(item.id)}>
                <RotateCcw aria-hidden="true" />Try again
              </Button>}
            </div>
            {item.status !== "uploading" && <Button
              variant="ghost"
              size="icon-sm"
              className="-mr-2 shrink-0"
              aria-label={`Remove ${item.file.name} from the list`}
              onClick={() => onDismiss(item.id)}
            >
              <X aria-hidden="true" />
            </Button>}
          </li>;
        })}
      </ul>
    </Card>
  );
}
