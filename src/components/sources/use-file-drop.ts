"use client";

import { useEffect, useRef, useState } from "react";

// Fallback for drags that end without a dragleave or drop (for example cancelled with Escape).
// Browsers repeat dragover at least every 350ms (plus or minus 200ms) while files are held over
// the page, so a pause longer than this means the drag is over.
const DRAG_IDLE_MS = 1000;

/**
 * Lets people drop files anywhere on the page. Returns true while files are dragged over it.
 * Dropped files always stay on the page (the browser would otherwise open them and leave the app);
 * they are only handed to `onFiles` while `enabled`, for example not while a dialog is open.
 */
export function useFileDrop(onFiles: (files: File[]) => void, enabled: boolean): boolean {
  const [dragging, setDragging] = useState(false);
  const latest = useRef({ onFiles, enabled });
  useEffect(() => {
    latest.current = { onFiles, enabled };
  });

  useEffect(() => {
    // dragenter and dragleave fire for every element the pointer crosses, so they are counted.
    let depth = 0;
    let idle: ReturnType<typeof setTimeout> | undefined;
    const hasFiles = (event: DragEvent) => event.dataTransfer?.types.includes("Files") ?? false;
    const stop = () => {
      depth = 0;
      clearTimeout(idle);
      setDragging(false);
    };
    const keepAlive = () => {
      clearTimeout(idle);
      idle = setTimeout(stop, DRAG_IDLE_MS);
    };

    function enter(event: DragEvent) {
      if (!hasFiles(event)) return;
      event.preventDefault();
      depth++;
      if (latest.current.enabled) setDragging(true);
      keepAlive();
    }

    function over(event: DragEvent) {
      if (!hasFiles(event)) return;
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = latest.current.enabled ? "copy" : "none";
      keepAlive();
    }

    function leave(event: DragEvent) {
      if (!hasFiles(event)) return;
      depth--;
      if (depth <= 0) stop();
    }

    function drop(event: DragEvent) {
      if (!hasFiles(event)) return;
      event.preventDefault();
      stop();
      const files = Array.from(event.dataTransfer?.files ?? []);
      if (latest.current.enabled && files.length > 0) latest.current.onFiles(files);
    }

    window.addEventListener("dragenter", enter);
    window.addEventListener("dragover", over);
    window.addEventListener("dragleave", leave);
    window.addEventListener("drop", drop);
    return () => {
      clearTimeout(idle);
      window.removeEventListener("dragenter", enter);
      window.removeEventListener("dragover", over);
      window.removeEventListener("dragleave", leave);
      window.removeEventListener("drop", drop);
    };
  }, []);

  return dragging && enabled;
}
