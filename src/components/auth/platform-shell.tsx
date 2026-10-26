"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Building, LogOut, Settings, type LucideIcon } from "lucide-react";
import { AuthCard, AuthScreen } from "@/components/auth/auth-screen";
import { Brand } from "@/components/brand";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

/** Sidebar destination. Selected state comes from aria-current so it is exposed to assistive tech. */
function SidebarLink({ href, icon: Icon, children, pathname }: { href: string; icon: LucideIcon; children: ReactNode; pathname: string }) {
  const current = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={cn(
        "flex min-h-12 items-center gap-3 rounded-md border border-transparent px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors",
        "hover:bg-secondary-hover hover:text-foreground active:bg-secondary-active active:text-foreground",
        "aria-[current=page]:border-primary-soft-border aria-[current=page]:bg-primary-soft aria-[current=page]:text-primary-soft-foreground aria-[current=page]:shadow-[inset_3px_0_0_var(--primary)]",
        "aria-[current=page]:hover:bg-primary-soft-hover aria-[current=page]:hover:text-primary-soft-foreground",
        "max-sm:flex-col max-sm:justify-center max-sm:gap-1 max-sm:px-1 max-sm:text-center max-sm:text-xs",
      )}
    >
      <Icon className="size-4.5 shrink-0" aria-hidden="true" />
      {children}
    </Link>
  );
}

export function PlatformShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
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

  if (isPending) return <AuthScreen aria-busy="true"><p className="text-muted-foreground">Opening your space...</p></AuthScreen>;
  if (error) return <AuthScreen><AuthCard>
    <h1 className="font-serif text-3xl font-normal tracking-tight">We could not connect.</h1>
    <p className="mt-3 text-muted-foreground">Your session could not be checked.</p>
    <Button className="mt-6 self-start" onClick={() => void refetch()}>Try again</Button>
  </AuthCard></AuthScreen>;
  if (!data) return <AuthScreen><p className="text-muted-foreground">Taking you to login...</p></AuthScreen>;

  return <div className="flex min-h-dvh">
    <aside className="sticky top-0 flex h-dvh w-20 shrink-0 flex-col gap-6 overflow-y-auto border-r bg-secondary px-2 py-6 sm:w-64 sm:px-5 sm:py-8">
      <Brand href="/app" label="Ekam, your space" compact className="max-sm:mx-auto" />
      <nav aria-label="Main navigation" className="grid gap-2">
        <SidebarLink href="/app" icon={BookOpen} pathname={pathname}>Your space</SidebarLink>
        <SidebarLink href="/workspaces" icon={Building} pathname={pathname}>Workspaces</SidebarLink>
        <SidebarLink href="/account" icon={Settings} pathname={pathname}>Account settings</SidebarLink>
      </nav>
      <div className="mt-auto flex items-center gap-3 max-sm:justify-center">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary-hover text-sm font-semibold" aria-hidden="true">{data.user.name.slice(0, 1).toUpperCase()}</span>
        <div className="min-w-0 wrap-anywhere max-sm:sr-only"><strong className="block text-sm font-medium">{data.user.name}</strong><small className="block text-xs text-muted-foreground">{data.user.email}</small></div>
      </div>
      <Button variant="ghost" loading={busy} onClick={logout} className="sm:justify-start max-sm:flex-col max-sm:gap-1 max-sm:px-1 max-sm:has-[>svg]:px-1 max-sm:py-2 max-sm:text-xs"><LogOut aria-hidden="true" />{busy ? "Logging out..." : "Log out"}</Button>
    </aside>
    <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 px-4 py-8 focus-visible:outline-none sm:px-8 sm:py-12 lg:px-12">
      <div className="max-w-6xl">
        {logoutError && <Alert variant="error" className="mb-6">{logoutError}</Alert>}
        {children}
      </div>
    </main>
  </div>;
}
