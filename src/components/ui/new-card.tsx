import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const newCardVariants = cva(
  "",
  {
    variants: {
      variant: {
        base: "card-base",
        elevated: "card-elevated",
        glass: "card-glass",
        gradient: "card-gradient",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
      hover: {
        none: "",
        lift: "hover-lift",
        glow: "hover-glow",
      },
    },
    defaultVariants: {
      variant: "base",
      padding: "md",
      hover: "none",
    },
  }
);

interface NewCardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof newCardVariants> {}

const NewCard = React.forwardRef<HTMLDivElement, NewCardProps>(
  ({ variant, padding, hover, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(newCardVariants({ variant, padding, hover }), className)}
      {...props}
    />
  )
);
NewCard.displayName = "NewCard";

// Card Header
const NewCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("space-y-1.5 pb-4", className)}
      {...props}
    />
  )
);
NewCardHeader.displayName = "NewCardHeader";

// Card Title
const NewCardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-xl font-semibold leading-tight tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  )
);
NewCardTitle.displayName = "NewCardTitle";

// Card Description
const NewCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-foreground-medium leading-relaxed", className)}
      {...props}
    />
  )
);
NewCardDescription.displayName = "NewCardDescription";

// Card Content
const NewCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("space-y-4", className)}
      {...props}
    />
  )
);
NewCardContent.displayName = "NewCardContent";

// Card Footer
const NewCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center justify-between pt-4 border-t border-border", className)}
      {...props}
    />
  )
);
NewCardFooter.displayName = "NewCardFooter";

export { 
  NewCard, 
  NewCardHeader, 
  NewCardFooter, 
  NewCardTitle, 
  NewCardDescription, 
  NewCardContent,
  newCardVariants 
};