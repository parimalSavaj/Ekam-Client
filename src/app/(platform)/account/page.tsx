"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CircleCheck } from "lucide-react";
import { PageHeader } from "@/components/platform/page-header";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient, loginWithGoogle } from "@/lib/auth-client";

type Session = NonNullable<Awaited<ReturnType<typeof authClient.listSessions>>["data"]>[number];

export default function AccountPage() {
  const router = useRouter();
  const { data, refetch } = authClient.useSession();
  const [name, setName] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionError, setSessionError] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  // Which action is running, so only that button shows a spinner while all stay disabled.
  const [pending, setPending] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const loadSessions = useCallback(async () => {
    try {
      const result = await authClient.listSessions();
      if (result.error) throw new Error("Session list failed");
      setSessions(result.data ?? []);
      setSessionError("");
    } catch { setSessionError("Could not load active sessions."); }
  }, []);

  useEffect(() => {
    if (!data) return;
    queueMicrotask(() => { void loadSessions(); });
    if (new URLSearchParams(window.location.search).get("confirmDelete") === "1") {
      const expectedUser = sessionStorage.getItem("ekam-delete-user");
      sessionStorage.removeItem("ekam-delete-user");
      window.history.replaceState(null, "", "/account");
      queueMicrotask(() => {
        if (expectedUser === data.user.id) setConfirmDelete(true);
        else setError("Please use the same Google account when confirming deletion.");
      });
    }
  }, [data, loadSessions]);

  async function perform(key: string, action: () => Promise<void>) {
    setBusy(true); setPending(key); setError(""); setMessage("");
    try { await action(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Something went wrong. Please try again."); }
    finally { setBusy(false); setPending(""); }
  }

  if (!data) return null;
  const current = data;
  return <div className="max-w-3xl">
    <PageHeader eyebrow="MAKE YOURSELF AT HOME" title="Account settings" description="Your profile, login, and active devices." />
    {(message || error) && <div className="mb-6 grid gap-3">
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="error">{error}</Alert>}
    </div>}
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader><CardTitle asChild><h2>Your profile</h2></CardTitle></CardHeader>
        <CardContent className="grid gap-5">
          <div className="flex items-center gap-4">
            {current.user.image && <Image unoptimized src={current.user.image} alt="Your Google profile" width={52} height={52} className="rounded-full" />}
            <div className="min-w-0 wrap-anywhere"><strong className="font-medium">{current.user.name}</strong><p className="text-sm text-muted-foreground">{current.user.email}</p></div>
          </div>
          <form className="grid max-w-sm gap-3" onSubmit={event => { event.preventDefault(); void perform("save", async () => {
            const trimmed = (name ?? current.user.name).trim();
            if (!trimmed || trimmed.length > 100) throw new Error("Enter a display name between 1 and 100 characters.");
            const result = await authClient.updateUser({ name: trimmed });
            if (result.error) throw new Error("Could not save your name. Please try again.");
            await refetch(); setMessage("Your display name has been saved.");
          }); }}>
            <Label htmlFor="display-name">Display name</Label>
            <Input id="display-name" autoComplete="name" maxLength={100} required value={name ?? current.user.name} onChange={event => setName(event.target.value)} />
            <Button type="submit" className="justify-self-start" disabled={busy} loading={pending === "save"}>Save changes</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle asChild><h2>Login method</h2></CardTitle></CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0 wrap-anywhere"><strong className="font-medium">Google</strong><p className="text-sm text-muted-foreground">{current.user.email}</p></div>
            <Badge variant="success"><CircleCheck aria-hidden="true" />Connected</Badge>
          </div>
          <p className="text-sm text-muted-foreground">Your Google account is your login method. Manage its email and password through Google.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle asChild><h2>Active sessions</h2></CardTitle>
          <Button variant="outline" disabled={busy} loading={pending === "revoke-others"} onClick={() => void perform("revoke-others", async () => {
            const result = await authClient.revokeOtherSessions();
            if (result.error) throw new Error("Could not log out other devices.");
            await loadSessions(); setMessage("Other devices have been logged out.");
          })}>Log out other devices</Button>
        </CardHeader>
        <CardContent>
          {sessionError ? <div className="grid justify-items-start gap-3"><Alert variant="error">{sessionError}</Alert><Button variant="outline" onClick={() => void loadSessions()}>Try again</Button></div>
            : sessions.length === 0 ? <p className="text-sm text-muted-foreground">Loading sessions...</p>
            : <ul className="divide-y divide-border border-y">{sessions.map(session => <li key={session.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div className="min-w-0"><strong className="font-medium">{session.id === current.session.id ? "This device" : "Other device"}</strong><p className="text-xs wrap-anywhere text-muted-foreground">{session.userAgent || "Browser details unavailable"}</p><small className="text-xs text-muted-foreground">Expires {new Date(session.expiresAt).toLocaleDateString()}</small></div>
              {session.id !== current.session.id && <Button variant="outline" disabled={busy} loading={pending === `revoke-${session.id}`} onClick={() => void perform(`revoke-${session.id}`, async () => {
                const result = await authClient.revokeSession({ token: session.token });
                if (result.error) throw new Error("Could not log out that device.");
                await loadSessions(); setMessage("Device logged out.");
              })}>Log out</Button>}
            </li>)}</ul>}
        </CardContent>
      </Card>

      <Card className="border-error/30">
        <CardHeader>
          <CardTitle asChild><h2>Delete account</h2></CardTitle>
          <CardDescription>Permanently remove your Ekam profile and log out all devices. Confirm your Google account before continuing.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" disabled={busy} loading={pending === "start-delete"} onClick={() => void perform("start-delete", async () => {
            sessionStorage.setItem("ekam-delete-user", current.user.id);
            const result = await loginWithGoogle("/account?confirmDelete=1");
            if (result.error) throw new Error("Could not start Google confirmation.");
          })}>Continue with Google to delete</Button>
        </CardContent>
      </Card>
    </div>

    <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete your Ekam account?</DialogTitle>
          <DialogDescription>This permanently deletes the Ekam account for {current.user.email} and ends all its sessions. Your Google account stays intact.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" disabled={busy} onClick={() => setConfirmDelete(false)}>Keep my account</Button>
          <Button variant="destructive" disabled={busy} loading={pending === "delete"} onClick={() => void perform("delete", async () => {
            const result = await authClient.deleteUser();
            if (result.error) throw new Error("Could not delete your account. Confirm with Google again and retry.");
            setConfirmDelete(false); router.replace("/login");
          })}>Delete permanently</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>;
}
