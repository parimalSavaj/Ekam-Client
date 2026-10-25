"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

  async function perform(action: () => Promise<void>) {
    setBusy(true); setError(""); setMessage("");
    try { await action(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Something went wrong. Please try again."); }
    finally { setBusy(false); }
  }

  if (!data) return null;
  const current = data;
  return <>
    <p className="eyebrow">MAKE YOURSELF AT HOME</p><h1>Account settings</h1>
    <p className="section-description">Your profile, login, and active devices.</p>
    <p role="status" className="account-message">{message}</p><p role="alert" className="auth-error">{error}</p>
    <section className="account-panel"><h2>Your profile</h2>
      <div className="profile-summary">{current.user.image && <Image unoptimized src={current.user.image} alt="Your Google profile" width={52} height={52} className="profile-photo" />}<div><strong>{current.user.name}</strong><p>{current.user.email}</p></div></div>
      <form onSubmit={event => { event.preventDefault(); void perform(async () => {
        const trimmed = (name ?? current.user.name).trim();
        if (!trimmed || trimmed.length > 100) throw new Error("Enter a display name between 1 and 100 characters.");
        const result = await authClient.updateUser({ name: trimmed });
        if (result.error) throw new Error("Could not save your name. Please try again.");
        await refetch(); setMessage("Your display name has been saved.");
      }); }}>
        <label htmlFor="display-name">Display name</label><input id="display-name" autoComplete="name" maxLength={100} required value={name ?? current.user.name} onChange={event => setName(event.target.value)} />
        <Button type="submit" disabled={busy}>Save changes</Button>
      </form>
    </section>
    <section className="account-panel"><h2>Login method</h2><div className="account-row"><div><strong>Google</strong><p>{current.user.email}</p></div><span className="connected-badge">Connected</span></div><p className="account-note">Your Google account is your login method. Manage its email and password through Google.</p></section>
    <section className="account-panel"><div className="account-row"><h2>Active sessions</h2><Button variant="outline" disabled={busy} onClick={() => void perform(async () => {
      const result = await authClient.revokeOtherSessions();
      if (result.error) throw new Error("Could not log out other devices.");
      await loadSessions(); setMessage("Other devices have been logged out.");
    })}>Log out other devices</Button></div>
      {sessionError ? <div><p className="auth-error" role="alert">{sessionError}</p><Button variant="outline" onClick={() => void loadSessions()}>Try again</Button></div> : sessions.length === 0 ? <p>Loading sessions...</p> : <ul className="session-list">{sessions.map(session => <li key={session.id}>
        <div><strong>{session.id === current.session.id ? "This device" : "Other device"}</strong><p className="session-agent">{session.userAgent || "Browser details unavailable"}</p><small>Expires {new Date(session.expiresAt).toLocaleDateString()}</small></div>
        {session.id !== current.session.id && <Button variant="outline" disabled={busy} onClick={() => void perform(async () => {
          const result = await authClient.revokeSession({ token: session.token });
          if (result.error) throw new Error("Could not log out that device.");
          await loadSessions(); setMessage("Device logged out.");
        })}>Log out</Button>}
      </li>)}</ul>}
    </section>
    <section className="account-panel danger-panel"><h2>Delete account</h2><p>Permanently remove your Ekam profile and log out all devices. Confirm your Google account before continuing.</p><Button variant="destructive" disabled={busy} onClick={() => void perform(async () => {
      sessionStorage.setItem("ekam-delete-user", current.user.id);
      const result = await loginWithGoogle("/account?confirmDelete=1");
      if (result.error) throw new Error("Could not start Google confirmation.");
    })}>Continue with Google to delete</Button></section>
    <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}><DialogContent><DialogHeader><DialogTitle>Delete your Ekam account?</DialogTitle><DialogDescription>This permanently deletes the Ekam account for {current.user.email} and ends all its sessions. Your Google account stays intact.</DialogDescription></DialogHeader><Button variant="destructive" disabled={busy} onClick={() => void perform(async () => {
      const result = await authClient.deleteUser();
      if (result.error) throw new Error("Could not delete your account. Confirm with Google again and retry.");
      setConfirmDelete(false); router.replace("/login");
    })}>Delete permanently</Button><Button variant="outline" disabled={busy} onClick={() => setConfirmDelete(false)}>Keep my account</Button></DialogContent></Dialog>
  </>;
}
