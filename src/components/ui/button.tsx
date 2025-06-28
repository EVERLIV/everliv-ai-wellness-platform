
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 safe-container mobile-text-wrap",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-white text-secondary border border-gray-300 hover:bg-gray-50",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        accent: "bg-secondary hover:bg-secondary/80 text-white",
      },
      size: {
        default: "min-h-[clamp(32px,8vw,44px)] px-[clamp(0.75rem,4vw,1.25rem)] py-[clamp(0.375rem,2vw,0.625rem)] text-[clamp(0.75rem,3.5vw,0.875rem)]",
        sm: "min-h-[clamp(28px,7vw,36px)] px-[clamp(0.5rem,3vw,0.75rem)] py-[clamp(0.25rem,1.5vw,0.5rem)] text-[clamp(0.7rem,3vw,0.875rem)] rounded-md",
        lg: "min-h-[clamp(40px,10vw,48px)] px-[clamp(1rem,5vw,2rem)] py-[clamp(0.5rem,2.5vw,0.75rem)] text-[clamp(0.875rem,4vw,1rem)] rounded-md",
        icon: "h-[clamp(32px,8vw,40px)] w-[clamp(32px,8vw,40px)]",
        xs: "min-h-[clamp(24px,6vw,28px)] px-[clamp(0.375rem,2vw,0.5rem)] py-[clamp(0.125rem,1vw,0.25rem)] text-[clamp(0.65rem,2.5vw,0.75rem)] rounded",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
