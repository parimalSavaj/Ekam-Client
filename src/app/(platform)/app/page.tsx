"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building, Files, Library, Plus, type LucideIcon } from "lucide-react";
import { EmptyState } from "@/components/platform/empty-state";
import { LoadError } from "@/components/platform/load-error";
import { CardGridPlaceholder } from "@/components/platform/loading-placeholders";
import { PageHeader } from "@/components/platform/page-header";
import { SectionHeader } from "@/components/platform/section-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog";
import { WorkspaceCard } from "@/components/workspaces/workspace-card";
import { errorMessage } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { listWorkspaces, type Workspace } from "@/lib/workspaces-api";

const STEPS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Building, title: "Workspace", text: "One for each team or organization. What is inside stays private to it." },
  { icon: Library, title: "Knowledge base", text: "Groups the sources on one subject, so answers stay focused." },
  { icon: Files, title: "Sources", text: "The PDFs, web pages and text files you add to a knowledge base." },
];

// Enough to pick up where you left off; everything else is on the Workspaces page.
const RECENT_LIMIT = 6;

export default function AppPage() {
  const router = useRouter();
  const { data } = authClient.useSession();
  const [workspaces, setWorkspaces] = useState<Workspace[] | null>(null);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    try {
      setWorkspaces(await listWorkspaces());
    } catch (cause) {
      setError(errorMessage(cause));
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => { void load(); });
  }, [load]);

  const firstName = data?.user.name.trim().split(/\s+/)[0];
  const recent = workspaces
    ? [...workspaces].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, RECENT_LIMIT)
    : null;

  return <>
    <PageHeader
      eyebrow="YOUR SPACE"
      title={<span className="wrap-anywhere">{`Welcome, ${firstName || "there"}.`}</span>}
      description="Bring what your team knows into one place, organized so it is easy to find and ask about."
    />

    <section aria-labelledby="how-it-works" className="mb-12">
      <SectionHeader id="how-it-works" title="How Ekam is organized" />
      <Card className="gap-0 py-0">
        <ol className="grid grid-cols-1 lg:grid-cols-3">
          {STEPS.map((step, index) => <li
            key={step.title}
            className="flex gap-4 border-b p-(--card-padding) last:border-b-0 lg:border-r lg:border-b-0 lg:last:border-r-0"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-md border bg-secondary" aria-hidden="true">
              <step.icon className="size-5 text-brand" strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">Step {index + 1}</p>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
            </div>
          </li>)}
        </ol>
      </Card>
    </section>

    <section aria-labelledby="your-workspaces">
      <SectionHeader
        id="your-workspaces"
        title={recent && workspaces && workspaces.length > RECENT_LIMIT ? "Recent workspaces" : "Your workspaces"}
        actions={recent && recent.length > 0
          ? <Button variant="link" size="sm" asChild><Link href="/workspaces">All workspaces</Link></Button>
          : undefined}
      />
      {error && workspaces === null ? (
        <LoadError message={error} onRetry={() => { setError(""); void load(); }} />
      ) : recent === null ? (
        <CardGridPlaceholder label="Loading workspaces..." />
      ) : recent.length === 0 ? (
        <EmptyState
          icon={Building}
          headingLevel="h3"
          title="Start with a workspace"
          description="Create a workspace for your team, then add a knowledge base and its first sources."
          actions={<Button onClick={() => setCreating(true)}><Plus aria-hidden="true" />Create workspace</Button>}
        />
      ) : (
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recent.map(workspace => <li key={workspace.id} className="min-w-0">
            <WorkspaceCard workspace={workspace} headingLevel="h3" />
          </li>)}
        </ul>
      )}
    </section>

    <CreateWorkspaceDialog
      open={creating}
      onOpenChange={setCreating}
      onCreated={workspace => router.push(`/workspaces/${workspace.id}`)}
    />
  </>;
}
