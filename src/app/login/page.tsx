"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AuthCard, AuthScreen } from "@/components/auth/auth-screen";
import { Brand } from "@/components/brand";
import { Alert } from "@/components/ui/alert";
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

  return <AuthScreen>
    <AuthCard>
      <Brand className="mb-10" />
      <p className="eyebrow">YOUR THINKING, CONNECTED</p>
      <h1 className="mt-3 font-serif text-3xl leading-tight font-normal tracking-tight">A little space for your ideas.</h1>
      <p className="mt-3 text-base text-muted-foreground">Log in to your Ekam account with Google.</p>
      <Button size="lg" className="mt-6 w-full" onClick={login} loading={busy} disabled={isPending || !!data}>
        <span className="text-lg font-extrabold" aria-hidden="true">G</span>{busy ? "Connecting to Google..." : "Login with Google"}
      </Button>
      {error && <Alert variant="error" className="mt-4">{error}</Alert>}
      <GoogleLoginError />
      <Button variant="ghost" className="mt-4 self-start" asChild>
        <Link href="/"><ArrowLeft aria-hidden="true" />Back to home</Link>
      </Button>
    </AuthCard>
  </AuthScreen>;
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
  return failed ? <Alert variant="error" className="mt-4">Google login was cancelled or could not finish. Please try again.</Alert> : null;
}
