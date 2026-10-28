import { apiRequest } from "@/lib/api-client";

export type KnowledgeBase = {
  id: string;
  workspaceId: string;
  name: string;
  /** Null when no description was written. */
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

function basePath(workspaceId: string): string {
  return `/api/workspaces/${encodeURIComponent(workspaceId)}/knowledge-bases`;
}

function pathFor(workspaceId: string, id: string): string {
  return `${basePath(workspaceId)}/${encodeURIComponent(id)}`;
}

export async function listKnowledgeBases(workspaceId: string): Promise<KnowledgeBase[]> {
  const data = await apiRequest<{ knowledgeBases: KnowledgeBase[] }>(basePath(workspaceId));
  return data.knowledgeBases;
}

export function getKnowledgeBase(workspaceId: string, id: string): Promise<KnowledgeBase> {
  return apiRequest<KnowledgeBase>(pathFor(workspaceId, id));
}

export function createKnowledgeBase(
  workspaceId: string,
  input: { name: string; description: string },
): Promise<KnowledgeBase> {
  return apiRequest<KnowledgeBase>(basePath(workspaceId), { method: "POST", body: input });
}

/** An empty description clears it. */
export function updateKnowledgeBase(
  workspaceId: string,
  id: string,
  input: { name: string; description: string },
): Promise<KnowledgeBase> {
  return apiRequest<KnowledgeBase>(pathFor(workspaceId, id), { method: "PATCH", body: input });
}

export function deleteKnowledgeBase(workspaceId: string, id: string): Promise<{ id: string }> {
  return apiRequest<{ id: string }>(pathFor(workspaceId, id), { method: "DELETE" });
}
