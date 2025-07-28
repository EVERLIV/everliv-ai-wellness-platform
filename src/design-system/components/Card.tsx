import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

const cardVariants = cva(
  "relative overflow-hidden rounded-lg transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-card border border-border shadow-sm",
        elevated: "bg-card border border-border shadow-lg hover:shadow-xl",
        glass: "bg-white/10 backdrop-blur-md border border-white/20",
        gradient: "bg-gradient-to-br from-card to-muted/50 border border-border/50",
        brand: "bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 border border-brand-primary/20",
        outline: "border-2 border-border bg-transparent",
      },
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
      hover: {
        none: "",
        lift: "hover:-translate-y-1",
        glow: "hover:shadow-glow transition-shadow",
        scale: "hover:scale-[1.02]",
      },
      interactive: {
        true: "cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      hover: "none",
      interactive: false,
    },
  }
);

interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant, size, hover, interactive, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, size, hover, interactive }), className)}
      {...props}
    />
  )
);
Card.displayName = "Card";

// Card Header
export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("space-y-2 pb-4", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

// Card Title
export const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-lg font-semibold leading-tight tracking-tight text-card-foreground",
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

// Card Description
export const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground leading-relaxed", className)}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

// Card Content
export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("space-y-4", className)}
      {...props}
    />
  )
);
CardContent.displayName = "CardContent";

// Card Footer
export const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center justify-between pt-4 border-t border-border/50", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

// Feature Card Component
interface FeatureCardProps extends CardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  action, 
  className,
  ...props 
}: FeatureCardProps) => (
  <Card 
    variant="elevated" 
    hover="lift" 
    className={cn("group", className)} 
    {...props}
  >
    <CardHeader>
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary group-hover:bg-brand-primary/20 transition-colors">
          {icon}
        </div>
      )}
      <CardTitle className="group-hover:text-brand-primary transition-colors">
        {title}
      </CardTitle>
      <CardDescription>
        {description}
      </CardDescription>
    </CardHeader>
    {action && (
      <CardFooter>
        {action}
      </CardFooter>
    )}
  </Card>
);

// Stat Card Component
interface StatCardProps extends CardProps {
  label: string;
  value: string | number;
  change?: {
    value: number;
    trend: "up" | "down" | "neutral";
  };
  icon?: React.ReactNode;
}

export const StatCard = ({ 
  label, 
  value, 
  change, 
  icon, 
  className,
  ...props 
}: StatCardProps) => (
  <Card variant="default" className={cn("", className)} {...props}>
    <CardContent className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="flex items-end gap-2">
        <p className="text-2xl font-bold text-card-foreground">{value}</p>
        {change && (
          <span
            className={cn(
              "text-xs font-medium",
              change.trend === "up" && "text-brand-success",
              change.trend === "down" && "text-brand-error",
              change.trend === "neutral" && "text-muted-foreground"
            )}
          >
            {change.trend === "up" && "↗"}
            {change.trend === "down" && "↘"}
            {change.trend === "neutral" && "→"}
            {Math.abs(change.value)}%
          </span>
        )}
      </div>
    </CardContent>
  </Card>
);