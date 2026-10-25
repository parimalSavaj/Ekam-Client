import { PlatformShell } from "@/components/auth/platform-shell";

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return <PlatformShell>{children}</PlatformShell>;
}
