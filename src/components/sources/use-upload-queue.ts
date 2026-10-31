"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fileProblem } from "@/components/sources/source-format";
import { ApiRequestError, errorMessage } from "@/lib/api-client";
import type { Source } from "@/lib/sources-api";

export type UploadStatus = "waiting" | "uploading" | "failed";

export type UploadItem = {
  id: number;
  file: File;
  status: UploadStatus;
  /** Why the upload failed; empty otherwise. */
  error: string;
  /** False when trying again cannot help, for example an unsupported file type. */
  retryable: boolean;
};

// Answers that mean the same file will fail again: invalid file (400), too large (413),
// knowledge base gone (404).
const FINAL_STATUSES = new Set([400, 404, 413]);

/**
 * Uploads files one at a time, so a large batch never holds several 20 MB bodies in the server's
 * memory at once. Finished uploads leave the queue (the caller adds them to its list); failed ones
 * stay with their reason until they are retried or removed. Files are checked before anything is sent.
 */
export function useUploadQueue({
  upload,
  onUploaded,
  onFinished,
}: {
  upload: (file: File) => Promise<Source>;
  onUploaded: (source: Source) => void;
  /** Called when the queue has nothing left to send, with the number of files added in that run. */
  onFinished: (added: number) => void;
}) {
  const [items, setItems] = useState<UploadItem[]>([]);
  // The upload loop runs across renders, so it reads and writes the queue through a ref.
  const itemsRef = useRef<UploadItem[]>([]);
  const nextId = useRef(1);
  const running = useRef(false);
  const callbacks = useRef({ upload, onUploaded, onFinished });
  useEffect(() => {
    callbacks.current = { upload, onUploaded, onFinished };
  });

  const commit = useCallback((next: UploadItem[]) => {
    itemsRef.current = next;
    setItems(next);
  }, []);

  const run = useCallback(async () => {
    if (running.current) return;
    running.current = true;
    let added = 0;
    try {
      for (;;) {
        const next = itemsRef.current.find(item => item.status === "waiting");
        if (!next) break;
        commit(itemsRef.current.map(item => (item.id === next.id ? { ...item, status: "uploading" } : item)));
        try {
          const source = await callbacks.current.upload(next.file);
          commit(itemsRef.current.filter(item => item.id !== next.id));
          added++;
          callbacks.current.onUploaded(source);
        } catch (cause) {
          const message = errorMessage(cause);
          const status = cause instanceof ApiRequestError ? cause.status : 0;
          // An ended session fails every later upload the same way, so the rest stop here too.
          const sessionEnded = status === 401;
          commit(itemsRef.current.map(item =>
            item.id === next.id || (sessionEnded && item.status === "waiting")
              ? { ...item, status: "failed", error: message, retryable: !FINAL_STATUSES.has(status) }
              : item,
          ));
        }
      }
    } finally {
      running.current = false;
    }
    callbacks.current.onFinished(added);
  }, [commit]);

  const enqueue = useCallback((files: readonly File[]) => {
    if (files.length === 0) return;
    const queued = files.map((file): UploadItem => {
      const problem = fileProblem(file);
      return { id: nextId.current++, file, status: problem ? "failed" : "waiting", error: problem ?? "", retryable: false };
    });
    commit([...itemsRef.current, ...queued]);
    void run();
  }, [commit, run]);

  const retry = useCallback((id: number) => {
    commit(itemsRef.current.map(item =>
      item.id === id && item.status === "failed" ? { ...item, status: "waiting", error: "" } : item,
    ));
    void run();
  }, [commit, run]);

  /** Removes a failed or waiting file. The file being sent cannot be removed. */
  const dismiss = useCallback((id: number) => {
    commit(itemsRef.current.filter(item => item.id !== id || item.status === "uploading"));
  }, [commit]);

  const clearFailed = useCallback(() => {
    commit(itemsRef.current.filter(item => item.status !== "failed"));
  }, [commit]);

  const busy = items.some(item => item.status !== "failed");

  // Leaving the page would cancel the uploads, so the browser asks first.
  useEffect(() => {
    if (!busy) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [busy]);

  return { items, busy, enqueue, retry, dismiss, clearFailed };
}
