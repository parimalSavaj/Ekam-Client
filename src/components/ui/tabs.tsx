"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Tabs as TabsPrimitive } from "radix-ui"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-[orientation=horizontal]:flex-col",
        className
      )}
      {...props}
    />
  )
}

/*
 * default: segmented control on a recessed track (settings, small switches).
 * line:    underlined tabs for page sections.
 * pill:    outlined chips with a filled selected state (content switchers).
 */
const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center text-muted-foreground group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col",
  {
    variants: {
      variant: {
        default: "h-10 gap-1 rounded-lg bg-secondary p-1",
        line: "h-10 gap-1 bg-transparent",
        pill: "h-auto gap-2 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // Shared
        "relative inline-flex flex-1 items-center justify-center gap-1.5 border border-transparent px-3 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start hover:text-foreground disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        // default: selected segment lifts to the white card surface
        "group-data-[variant=default]/tabs-list:h-8 group-data-[variant=default]/tabs-list:rounded-md group-data-[variant=default]/tabs-list:data-[state=active]:border-border group-data-[variant=default]/tabs-list:data-[state=active]:bg-card group-data-[variant=default]/tabs-list:data-[state=active]:text-foreground",
        // line: selected tab gets a primary underline
        "group-data-[variant=line]/tabs-list:h-10 group-data-[variant=line]/tabs-list:rounded-md group-data-[variant=line]/tabs-list:hover:bg-secondary-hover group-data-[variant=line]/tabs-list:data-[state=active]:text-foreground group-data-[variant=line]/tabs-list:after:absolute group-data-[variant=line]/tabs-list:after:inset-x-3 group-data-[variant=line]/tabs-list:after:bottom-0 group-data-[variant=line]/tabs-list:after:h-0.5 group-data-[variant=line]/tabs-list:after:bg-primary group-data-[variant=line]/tabs-list:after:opacity-0 group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100",
        // pill: outlined chip, selected fills with the foreground color
        "group-data-[variant=pill]/tabs-list:h-10 group-data-[variant=pill]/tabs-list:rounded-full group-data-[variant=pill]/tabs-list:border-border group-data-[variant=pill]/tabs-list:px-4 group-data-[variant=pill]/tabs-list:hover:border-input group-data-[variant=pill]/tabs-list:hover:bg-secondary-hover group-data-[variant=pill]/tabs-list:active:bg-secondary-active group-data-[variant=pill]/tabs-list:data-[state=active]:border-foreground group-data-[variant=pill]/tabs-list:data-[state=active]:bg-foreground group-data-[variant=pill]/tabs-list:data-[state=active]:text-background group-data-[variant=pill]/tabs-list:data-[state=active]:hover:border-foreground group-data-[variant=pill]/tabs-list:data-[state=active]:hover:bg-foreground/90 group-data-[variant=pill]/tabs-list:data-[state=active]:hover:text-background group-data-[variant=pill]/tabs-list:data-[state=active]:active:bg-foreground/80",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
