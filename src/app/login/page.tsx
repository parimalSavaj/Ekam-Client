"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient, loginWithGoogle } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { if (data) router.replace("/app"); }, [data, router]);

  async function login() {
    setBusy(true);
    setError("");
    try {
      const result = await loginWithGoogle();
      if (result.error) { setError("Google login could not start. Please try again."); setBusy(false); }
    } catch { setError("Unable to connect. Please try again."); setBusy(false); }
  }

  return <main className="auth-screen">
    <section className="auth-card">
      <Link className="brand" href="/"><Layers size={28} aria-hidden="true" /><span>ekam<b>.</b></span></Link>
      <p className="eyebrow">YOUR THINKING, CONNECTED</p>
      <h1>A little space for your ideas.</h1>
      <p>Log in to your Ekam account with Google.</p>
      <Button className="google-login" onClick={login} disabled={busy || isPending || !!data}>
        <span className="google-letter" aria-hidden="true">G</span>{busy ? "Connecting to Google..." : "Login with Google"}
      </Button>
      <p className="auth-error" role="alert">{error}</p>
      <GoogleLoginError />
      <Link className="auth-back" href="/">Back to home</Link>
    </section>
  </main>;
}

function GoogleLoginError() {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    // Read only the presence of an error; never render provider error text.
    if (new URLSearchParams(window.location.search).has("error")) {
      window.history.replaceState(null, "", "/login");
      queueMicrotask(() => setFailed(true));
    }
  }, []);
  return failed ? <p className="auth-error" role="alert">Google login was cancelled or could not finish. Please try again.</p> : null;
}
