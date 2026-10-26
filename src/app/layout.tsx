import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ekam — Your thinking, connected",
  description: "Bring your documents, links, and ideas into one thoughtful space.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {/* Every page's <main> carries id="main-content". */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-background"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
