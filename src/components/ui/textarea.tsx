import * as React from "react"
import { cn } from "@/lib/utils"

/*
 * Multi-line text field. Matches Input: 3:1 border, 16px text on small screens
 * so mobile browsers do not zoom on focus. Pair with <Label htmlFor>.
 * Only the height is user-resizable, so it can never overflow its container.
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-24 w-full min-w-0 resize-y rounded-md border border-input bg-card px-3 py-2 text-base text-foreground transition-colors placeholder:text-muted-foreground hover:border-muted-foreground focus-visible:border-ring disabled:cursor-not-allowed disabled:bg-secondary disabled:opacity-60 aria-invalid:border-error sm:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
