
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 safe-container badge-text-mobile",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
      size: {
        default: "px-[clamp(0.375rem,2vw,0.625rem)] py-[clamp(0.125rem,0.5vw,0.25rem)] text-[clamp(0.65rem,2.5vw,0.75rem)]",
        sm: "px-[clamp(0.25rem,1.5vw,0.5rem)] py-[clamp(0.0625rem,0.25vw,0.125rem)] text-[clamp(0.6rem,2vw,0.7rem)]",
        lg: "px-[clamp(0.5rem,2.5vw,0.75rem)] py-[clamp(0.25rem,1vw,0.375rem)] text-[clamp(0.75rem,3vw,0.875rem)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
