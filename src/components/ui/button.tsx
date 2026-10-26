import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2Icon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

/*
 * The only button styling in Ekam. Pick a variant and size; never restyle
 * color, radius, height or hover behavior from the call site.
 * Focus uses the global :focus-visible outline defined in globals.css.
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-center text-sm font-medium transition-colors select-none disabled:pointer-events-none disabled:opacity-50 aria-busy:cursor-progress aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // The single most important action in a view.
        default:
          "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive-hover active:bg-destructive-active",
        // Standard secondary action. The 3:1 border keeps the control visible.
        outline:
          "border border-input bg-card text-foreground hover:bg-secondary active:bg-secondary-hover aria-pressed:border-primary-soft-border aria-pressed:bg-primary-soft aria-pressed:text-primary-soft-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary-hover active:bg-secondary-active aria-pressed:bg-primary-soft aria-pressed:text-primary-soft-foreground",
        // Low-emphasis action: toolbars, navigation, dismissive actions.
        ghost:
          "text-foreground hover:bg-secondary-hover active:bg-secondary-active aria-pressed:bg-primary-soft aria-pressed:text-primary-soft-foreground",
        // Inline, text-led action that stays visibly interactive at rest.
        link:
          "text-foreground font-semibold underline decoration-primary decoration-1 underline-offset-4 hover:bg-primary-soft hover:text-primary-soft-foreground hover:decoration-primary-hover hover:decoration-2 active:bg-primary-soft-hover",
      },
      size: {
        sm: "min-h-9 px-3 py-1.5 has-[>svg]:px-2.5",
        default: "min-h-10 px-4 py-2 has-[>svg]:px-3.5",
        lg: "min-h-11 px-6 py-2 has-[>svg]:px-5",
        "icon-sm": "size-9",
        icon: "size-10",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    /** Shows a spinner, disables the button and sets aria-busy. Ignored with asChild. */
    loading?: boolean
  }

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const sharedProps = {
    "data-slot": "button",
    "data-variant": variant,
    "data-size": size,
    className: cn(buttonVariants({ variant, size, className })),
  }

  if (asChild) {
    return (
      <Slot.Root {...sharedProps} {...props}>
        {children}
      </Slot.Root>
    )
  }

  return (
    <button
      {...sharedProps}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && (
        <Loader2Icon className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
      )}
      {children}
    </button>
  )
}

export { Button, buttonVariants }
