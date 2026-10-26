import { apiRequest } from "@/lib/api-client";

export type Workspace = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

const BASE_PATH = "/api/workspaces";

function pathFor(id: string): string {
  return `${BASE_PATH}/${encodeURIComponent(id)}`;
}

export async function listWorkspaces(): Promise<Workspace[]> {
  const data = await apiRequest<{ workspaces: Workspace[] }>(BASE_PATH);
  return data.workspaces;
}

export function getWorkspace(id: string): Promise<Workspace> {
  return apiRequest<Workspace>(pathFor(id));
}

export function createWorkspace(name: string): Promise<Workspace> {
  return apiRequest<Workspace>(BASE_PATH, { method: "POST", body: { name } });
}

export function renameWorkspace(id: string, name: string): Promise<Workspace> {
  return apiRequest<Workspace>(pathFor(id), { method: "PATCH", body: { name } });
}

export function deleteWorkspace(id: string): Promise<{ id: string }> {
  return apiRequest<{ id: string }>(pathFor(id), { method: "DELETE" });
}
