"use client";

import { BookOpen } from "lucide-react";
import { PageHeader } from "@/components/platform/page-header";
import { Card, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

export default function AppPage() {
  const { data } = authClient.useSession();
  return <>
    <PageHeader eyebrow="YOUR SPACE" title={`Welcome, ${data?.user.name || "there"}.`} description="A home for your thinking." />
    <Card className="items-center gap-3 px-6 py-16 text-center">
      <BookOpen className="mb-2 size-9 text-brand" aria-hidden="true" />
      <CardTitle asChild><h2>Your next idea starts here.</h2></CardTitle>
      <p className="max-w-md text-sm text-muted-foreground">You are logged in. Notebooks and sources are coming next.</p>
    </Card>
  </>;
}
