"use client";

import { useRef } from "react";
import { Ellipsis, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ActionMenuEntry =
  | { kind: "action"; label: string; icon: LucideIcon; onSelect: () => void; destructive?: boolean; className?: string }
  | { kind: "link"; label: string; icon: LucideIcon; href: string; className?: string }
  | { kind: "separator" };

/**
 * The "More actions" button (an ellipsis) and its menu. Use it for secondary and destructive
 * actions of a page or a row; the primary action stays a visible button.
 *
 * An action runs only after the menu has closed and focus is back on the button. A dialog it
 * opens therefore returns focus to the button when it closes, as keyboard users expect.
 * Links open in a new tab.
 */
export function ActionMenu({
  label,
  entries,
  variant = "outline",
  size = "icon",
  className,
}: {
  /** Accessible name of the button, for example "Workspace actions" or "Actions for report.pdf". */
  label: string;
  entries: readonly ActionMenuEntry[];
  variant?: "outline" | "ghost";
  size?: "icon" | "icon-sm";
  className?: string;
}) {
  const pending = useRef<(() => void) | null>(null);

  return (
    // Not modal: nothing outside needs to be blocked, and a modal menu would fight the dialog it opens.
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className} aria-label={label}>
          <Ellipsis aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        onCloseAutoFocus={() => {
          // Radix moves focus back to the button right after this handler; the action runs after that.
          const run = pending.current;
          pending.current = null;
          if (run) queueMicrotask(run);
        }}
      >
        {entries.map((entry, index) => {
          if (entry.kind === "separator") return <DropdownMenuSeparator key={`separator-${index}`} />;
          if (entry.kind === "link") {
            return <DropdownMenuItem key={entry.label} asChild className={entry.className}>
              <a href={entry.href} target="_blank" rel="noopener noreferrer">
                <entry.icon aria-hidden="true" />{entry.label}<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </DropdownMenuItem>;
          }
          return <DropdownMenuItem
            key={entry.label}
            variant={entry.destructive ? "destructive" : "default"}
            className={entry.className}
            onSelect={() => { pending.current = entry.onSelect; }}
          >
            <entry.icon aria-hidden="true" />{entry.label}
          </DropdownMenuItem>;
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
