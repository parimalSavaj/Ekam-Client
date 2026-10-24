import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ekam — Your thinking, connected",
  description: "Bring your documents, links, and ideas into one thoughtful space.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
