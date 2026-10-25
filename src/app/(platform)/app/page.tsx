"use client";

import { BookOpen } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function AppPage() {
  const { data } = authClient.useSession();
  return <><p className="eyebrow">YOUR SPACE</p><h1>Welcome, {data?.user.name || "there"}.</h1><p className="section-description">A home for your thinking.</p><section className="account-panel empty-space"><BookOpen size={36} aria-hidden="true" /><h2>Your next idea starts here.</h2><p>You are logged in. Notebooks and sources are coming next.</p></section></>;
}
