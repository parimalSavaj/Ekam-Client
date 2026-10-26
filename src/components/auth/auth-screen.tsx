import type { ComponentProps } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/** Full-height centered stage for login and session states. Renders the page's <main>. */
export function AuthScreen({ className, ...props }: ComponentProps<"main">) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className={cn("grid min-h-dvh place-items-center bg-secondary p-4 focus-visible:outline-none sm:p-6", className)}
      {...props}
    />
  );
}

/** The single raised card on an AuthScreen. */
export function AuthCard({ className, ...props }: ComponentProps<typeof Card>) {
  return <Card className={cn("w-full max-w-110 gap-0 rounded-xl p-6 shadow-raised sm:p-10", className)} {...props} />;
}
