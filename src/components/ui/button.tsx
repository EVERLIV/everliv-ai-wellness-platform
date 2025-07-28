
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm",
        destructive: "bg-destructive text-destructive-foreground shadow-sm",
        outline: "border border-input bg-background shadow-sm",
        secondary: "bg-secondary text-secondary-foreground shadow-sm",
        ghost: "bg-transparent",
        link: "text-primary underline-offset-4",
        accent: "bg-accent text-accent-foreground shadow-sm",
      },
      size: {
        default: "h-10 px-4 py-2 min-w-[44px]",
        sm: "h-9 px-3 min-w-[36px]",
        lg: "h-11 px-8 min-w-[48px]",
        icon: "h-10 w-10",
        xs: "h-8 px-2 text-xs min-w-[32px]",
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
