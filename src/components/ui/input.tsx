import * as React from "react"
import { cn } from "@/lib/utils"

/*
 * Single-line text field. 40px high, 3:1 border, 16px text on small screens
 * so mobile browsers do not zoom on focus. Pair with <Label htmlFor>.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full min-w-0 rounded-md border border-input bg-card px-3 py-2 text-base text-foreground transition-colors placeholder:text-muted-foreground hover:border-muted-foreground focus-visible:border-ring disabled:cursor-not-allowed disabled:bg-secondary disabled:opacity-60 aria-invalid:border-error sm:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
