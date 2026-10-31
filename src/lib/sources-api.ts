import { apiRequest } from "@/lib/api-client";

export type SourceType = "pdf" | "web_page" | "text_file";
export type SourceStatus = "stored" | "processing" | "ready" | "failed";

export type Source = {
  id: string;
  knowledgeBaseId: string;
  type: SourceType;
  /** The file name for files, the web address for web pages. */
  name: string;
  /** Web pages only. */
  url: string | null;
  /** Files only. */
  sizeBytes: number | null;
  contentType: string | null;
  status: SourceStatus;
  createdAt: string;
  updatedAt: string;
};

/**
 * Largest file the upload dialog accepts, in megabytes. It matches the server default
 * (UPLOAD_MAX_FILE_MB); the server stays the authority and rejects larger files with its own message.
 */
export const MAX_FILE_MB = 20;

function basePath(workspaceId: string, knowledgeBaseId: string): string {
  return `/api/workspaces/${encodeURIComponent(workspaceId)}/knowledge-bases/${encodeURIComponent(knowledgeBaseId)}/sources`;
}

export async function listSources(workspaceId: string, knowledgeBaseId: string): Promise<Source[]> {
  const data = await apiRequest<{ sources: Source[] }>(basePath(workspaceId, knowledgeBaseId));
  return data.sources;
}

export function addWebPageSource(workspaceId: string, knowledgeBaseId: string, url: string): Promise<Source> {
  return apiRequest<Source>(`${basePath(workspaceId, knowledgeBaseId)}/web-pages`, { method: "POST", body: { url } });
}

/** Uploads a PDF or a text file. The server decides the source type from the file extension. */
export function uploadFileSource(workspaceId: string, knowledgeBaseId: string, file: File): Promise<Source> {
  const form = new FormData();
  form.append("file", file);
  return apiRequest<Source>(`${basePath(workspaceId, knowledgeBaseId)}/files`, { method: "POST", body: form });
}

export function deleteSource(workspaceId: string, knowledgeBaseId: string, id: string): Promise<{ id: string }> {
  return apiRequest<{ id: string }>(`${basePath(workspaceId, knowledgeBaseId)}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
