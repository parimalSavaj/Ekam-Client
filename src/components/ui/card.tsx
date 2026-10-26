import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

/*
 * Cards are flat: 1px border, white surface, 12px radius, no resting shadow.
 * Padding comes from --card-padding (16px on phones, 24px from sm up) so header,
 * content and footer always align. Use `interactive` only when the whole card is a link or button.
 */
const cardVariants = cva(
  "flex flex-col gap-4 rounded-lg border bg-card py-(--card-padding) text-card-foreground [--card-padding:calc(var(--spacing)*4)] sm:[--card-padding:calc(var(--spacing)*6)]",
  {
    variants: {
      interactive: {
        true: "transition-[border-color,box-shadow] hover:border-input hover:shadow-raised focus-within:border-input",
        false: "",
      },
    },
    defaultVariants: { interactive: false },
  }
)

function Card({
  className,
  interactive,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ interactive }), className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-(--card-padding) has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-(--card-padding)",
        className
      )}
      {...props}
    />
  )
}

/** Renders a div. Use `asChild` with an <h2> or <h3> when the title is a heading. */
function CardTitle({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"
  return (
    <Comp
      data-slot="card-title"
      className={cn("text-lg leading-snug font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-(--card-padding)", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-(--card-padding) [.border-t]:pt-(--card-padding)", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
