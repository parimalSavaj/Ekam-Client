import { createAuthClient } from "better-auth/react";

const baseURL = process.env.NEXT_PUBLIC_AUTH_URL;
if (!baseURL) throw new Error("NEXT_PUBLIC_AUTH_URL is required");

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: { credentials: "include" },
});

export async function loginWithGoogle(callbackPath = "/app") {
  return authClient.signIn.social({
    provider: "google",
    callbackURL: `${window.location.origin}${callbackPath}`,
    errorCallbackURL: `${window.location.origin}/login?error=google`,
  });
}
