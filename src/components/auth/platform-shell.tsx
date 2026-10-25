"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Layers, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function PlatformShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, isPending, error, refetch } = authClient.useSession();
  const [logoutError, setLogoutError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!isPending && !data && !error) router.replace("/login");
  }, [data, isPending, error, router]);

  async function logout() {
    setBusy(true);
    try {
      const result = await authClient.signOut();
      if (result.error) throw new Error("Logout failed");
      router.replace("/login");
    } catch { setLogoutError("Could not log out. Please try again."); setBusy(false); }
  }

  if (isPending) return <main className="auth-screen" aria-busy="true"><p>Opening your space...</p></main>;
  if (error) return <main className="auth-screen"><section className="auth-card"><h1>We could not connect.</h1><p>Your session could not be checked.</p><Button onClick={() => void refetch()}>Try again</Button></section></main>;
  if (!data) return <main className="auth-screen"><p>Taking you to login...</p></main>;

  return <div className="platform-shell">
    <aside className="platform-sidebar">
      <Link className="brand" href="/app"><Layers size={27} aria-hidden="true" /><span>ekam<b>.</b></span></Link>
      <nav aria-label="Main navigation">
        <Link href="/app"><BookOpen size={18} aria-hidden="true" />Your space</Link>
        <Link href="/account"><Settings size={18} aria-hidden="true" />Account settings</Link>
      </nav>
      <div className="sidebar-account"><span className="profile-initial" aria-hidden="true">{data.user.name.slice(0, 1).toUpperCase()}</span><div><strong>{data.user.name}</strong><small>{data.user.email}</small></div></div>
      <Button variant="ghost" disabled={busy} onClick={logout}><LogOut size={16} aria-hidden="true" />{busy ? "Logging out..." : "Log out"}</Button>
      {logoutError && <p role="alert" className="auth-error">{logoutError}</p>}
    </aside>
    <main className="platform-content">{children}</main>
  </div>;
}
