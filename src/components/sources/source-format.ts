import { FileBraces, FileCode, FileSpreadsheet, FileText, FileType, Globe, type LucideIcon } from "lucide-react";
import { MAX_FILE_MB, type Source, type SourceStatus, type SourceType } from "@/lib/sources-api";

/** File extensions the server accepts. The server checks the type and the content again. */
export const ACCEPTED_EXTENSIONS = [".pdf", ".txt", ".md", ".markdown", ".csv", ".json", ".html", ".htm"] as const;
export const ACCEPT_ATTRIBUTE = ACCEPTED_EXTENSIONS.join(",");
export const ACCEPTED_DESCRIPTION = "PDF, TXT, Markdown, CSV, JSON or HTML";
export const FILE_RULES_TEXT = `${ACCEPTED_DESCRIPTION}, up to ${MAX_FILE_MB} MB each.`;

/** Why a file cannot be uploaded, or null when it can. Checked before anything is sent. */
export function fileProblem(file: File): string | null {
  const name = file.name.toLowerCase();
  if (!ACCEPTED_EXTENSIONS.some(extension => name.endsWith(extension))) {
    return `This file type is not supported. Use ${ACCEPTED_DESCRIPTION}.`;
  }
  if (file.size === 0) return "The file is empty.";
  if (file.size > MAX_FILE_MB * 1024 * 1024) return `The file is larger than ${MAX_FILE_MB} MB.`;
  return null;
}

type Kind = { label: string; icon: LucideIcon };

const KIND_BY_CONTENT_TYPE: Record<string, Kind> = {
  "application/pdf": { label: "PDF", icon: FileText },
  "text/csv": { label: "CSV", icon: FileSpreadsheet },
  "application/json": { label: "JSON", icon: FileBraces },
  "text/html": { label: "HTML", icon: FileCode },
  "text/markdown": { label: "Markdown", icon: FileType },
  "text/plain": { label: "Text", icon: FileType },
};

const KIND_BY_EXTENSION: Record<string, string> = {
  pdf: "application/pdf",
  csv: "text/csv",
  json: "application/json",
  html: "text/html",
  htm: "text/html",
  md: "text/markdown",
  markdown: "text/markdown",
  txt: "text/plain",
};

const WEB_PAGE: Kind = { label: "Web page", icon: Globe };
const TEXT: Kind = { label: "Text", icon: FileType };

/** What a source holds, more specific than its type: a CSV or a JSON file rather than "text file". */
export function sourceKind(source: Pick<Source, "type" | "contentType">): Kind {
  if (source.type === "web_page") return WEB_PAGE;
  return KIND_BY_CONTENT_TYPE[source.contentType ?? ""] ?? (source.type === "pdf" ? KIND_BY_CONTENT_TYPE["application/pdf"]! : TEXT);
}

/** The same, for a file that is still being uploaded. */
export function fileKind(fileName: string): Kind {
  const extension = fileName.toLowerCase().split(".").pop() ?? "";
  return KIND_BY_CONTENT_TYPE[KIND_BY_EXTENSION[extension] ?? ""] ?? TEXT;
}

export const SOURCE_TYPE_PLURAL: Record<SourceType, string> = {
  pdf: "PDFs",
  web_page: "Web pages",
  text_file: "Text files",
};

export const SOURCE_STATUS_LABEL: Record<SourceStatus, string> = {
  stored: "Stored",
  processing: "Processing",
  ready: "Ready",
  failed: "Failed",
};

export const SOURCE_STATUS_VARIANT: Record<SourceStatus, "neutral" | "info" | "success" | "error"> = {
  stored: "neutral",
  processing: "info",
  ready: "success",
  failed: "error",
};

/** File size for people, such as "482 KB" or "1.4 MB". */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kilobytes = bytes / 1024;
  if (kilobytes < 1024) return `${Math.round(kilobytes)} KB`;
  const megabytes = kilobytes / 1024;
  return `${megabytes.toFixed(megabytes < 10 ? 1 : 0)} MB`;
}

/** A web address without its scheme, for display: "example.com/docs/start". */
export function displayAddress(url: string): string {
  if (!URL.canParse(url)) return url;
  const parsed = new URL(url);
  const path = parsed.pathname === "/" ? "" : parsed.pathname;
  return `${parsed.host}${path}${parsed.search}${parsed.hash}`;
}

/** The name people should see for a source. */
export function sourceTitle(source: Pick<Source, "type" | "name" | "url">): string {
  return source.type === "web_page" && source.url ? displayAddress(source.url) : source.name;
}

/** ["6 sources", "4.2 MB"] for the page header; the size is left out when nothing is stored. */
export function summarizeSources(sources: readonly Pick<Source, "sizeBytes">[]): string[] {
  if (sources.length === 0) return ["No sources yet"];
  const count = sources.length === 1 ? "1 source" : `${sources.length} sources`;
  const bytes = sources.reduce((total, source) => total + (source.sizeBytes ?? 0), 0);
  return bytes > 0 ? [count, formatFileSize(bytes)] : [count];
}
