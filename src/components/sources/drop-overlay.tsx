import { CloudUpload } from "lucide-react";
import { FILE_RULES_TEXT } from "@/components/sources/source-format";

/**
 * Shown while files are dragged over the page. It never takes pointer events, so the drop
 * reaches the page; keyboard and screen reader users use the Upload files button instead.
 */
export function DropOverlay({ visible, knowledgeBaseName }: { visible: boolean; knowledgeBaseName: string }) {
  if (!visible) return null;
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 animate-in fade-in-0 motion-reduce:animate-none"
      aria-hidden="true"
    >
      <div className="grid w-full max-w-md justify-items-center gap-3 rounded-xl border-2 border-dashed border-primary bg-card px-8 py-12 text-center shadow-overlay">
        <span className="grid size-14 place-items-center rounded-full bg-primary-soft">
          <CloudUpload className="size-7 text-primary-soft-foreground" strokeWidth={1.75} />
        </span>
        <p className="text-lg leading-snug font-semibold">Drop to add files</p>
        <p className="text-sm wrap-anywhere text-muted-foreground">
          They are added to &ldquo;{knowledgeBaseName}&rdquo;. {FILE_RULES_TEXT}
        </p>
      </div>
    </div>
  );
}
