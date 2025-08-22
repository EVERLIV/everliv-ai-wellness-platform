import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const evaButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-eva-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-eva-primary to-eva-primaryLight text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
        secondary: "bg-eva-surface border-2 border-eva-primary text-eva-primary hover:bg-eva-primary hover:text-white",
        outline: "border-2 border-neutral-300 bg-transparent text-eva-textPrimary hover:bg-eva-surface hover:border-eva-primary",
        ghost: "bg-transparent text-eva-textPrimary hover:bg-eva-surface",
        danger: "bg-gradient-to-r from-eva-critical to-red-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]",
        success: "bg-gradient-to-r from-eva-normal to-green-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]",
      },
      size: {
        sm: "h-9 px-4 py-2 text-sm rounded-xl min-w-[80px]",
        md: "h-11 px-6 py-3 text-sm rounded-xl min-w-[100px]",
        lg: "h-13 px-8 py-4 text-base rounded-2xl min-w-[120px]",
        icon: "h-11 w-11 rounded-xl",
        fab: "h-14 w-14 rounded-2xl shadow-lg",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

export interface EVAButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof evaButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const EVAButton = React.forwardRef<HTMLButtonElement, EVAButtonProps>(
  ({ className, variant, size, fullWidth, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    return (
      <Comp
        className={cn(evaButtonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </Comp>
    );
  }
);
EVAButton.displayName = "EVAButton";

export { EVAButton, evaButtonVariants };