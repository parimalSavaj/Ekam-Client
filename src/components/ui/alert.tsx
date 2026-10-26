import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon } from "lucide-react"
import { cn } from "@/lib/utils"

/*
 * Inline message for a result or problem. Every variant carries an icon plus
 * text so meaning never depends on color. Errors use role="alert"; other
 * variants use role="status". Pass `role` to override.
 */
const alertVariants = cva(
  "flex items-start gap-3 rounded-md border px-4 py-3 text-sm leading-6",
  {
    variants: {
      variant: {
        info: "border-info/30 bg-info-bg text-info-foreground",
        success: "border-success/30 bg-success-bg text-success-foreground",
        warning: "border-warning/30 bg-warning-bg text-warning-foreground",
        error: "border-error/30 bg-error-bg text-error-foreground",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
)

const icons = {
  info: InfoIcon,
  success: CircleCheckIcon,
  warning: TriangleAlertIcon,
  error: CircleAlertIcon,
} as const

function Alert({
  className,
  variant = "info",
  role,
  children,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  const Icon = icons[variant ?? "info"]
  return (
    <div
      data-slot="alert"
      role={role ?? (variant === "error" ? "alert" : "status")}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0 wrap-anywhere">{children}</div>
    </div>
  )
}

export { Alert, alertVariants }
