import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// Mobile Health Layout Component
const healthLayoutVariants = cva(
  "min-h-screen bg-eva-background",
  {
    variants: {
      variant: {
        default: "bg-eva-background",
        gradient: "bg-gradient-to-br from-eva-background via-eva-surface to-eva-background",
        pattern: "bg-eva-background bg-[radial-gradient(circle_at_30%_20%,_hsl(var(--eva-primary)/0.05)_0%,_transparent_50%)]",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "eva-mobile-padding",
        lg: "eva-mobile-padding py-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  }
);

interface HealthLayoutProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof healthLayoutVariants> {}

export const HealthLayout = ({ variant, padding, className, ...props }: HealthLayoutProps) => (
  <div className={cn(healthLayoutVariants({ variant, padding }), className)} {...props} />
);

// Health Metrics Grid Component
const healthMetricsGridVariants = cva(
  "grid w-full gap-4",
  {
    variants: {
      layout: {
        "2x2": "grid-cols-2 gap-3 sm:gap-4",
        "1x3": "grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6",
        "2x3": "grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4",
        "featured": "grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
        "compact": "grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3",
      },
      responsive: {
        true: "mobile-sm:grid-cols-1 mobile-md:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
        false: "",
      },
    },
    defaultVariants: {
      layout: "2x2",
      responsive: false,
    },
  }
);

interface HealthMetricsGridProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof healthMetricsGridVariants> {}

export const HealthMetricsGrid = ({ layout, responsive, className, ...props }: HealthMetricsGridProps) => (
  <div className={cn(healthMetricsGridVariants({ layout, responsive }), className)} {...props} />
);

// Health Header Component
interface HealthHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  avatar?: React.ReactNode;
}

export const HealthHeader = ({ 
  title, 
  subtitle, 
  action, 
  avatar, 
  className, 
  ...props 
}: HealthHeaderProps) => (
  <div className={cn("flex items-center justify-between eva-mobile-padding py-6", className)} {...props}>
    <div className="flex items-center gap-3">
      {avatar && (
        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-eva-surface border border-neutral-200">
          {avatar}
        </div>
      )}
      <div>
        <h1 className="text-xl font-bold text-eva-text-primary">{title}</h1>
        {subtitle && (
          <p className="text-sm text-eva-text-secondary mt-1">{subtitle}</p>
        )}
      </div>
    </div>
    {action && (
      <div className="flex items-center gap-2">
        {action}
      </div>
    )}
  </div>
);

// Health Section Component
const healthSectionVariants = cva(
  "eva-mobile-section",
  {
    variants: {
      background: {
        default: "bg-transparent",
        surface: "bg-eva-surface rounded-2xl eva-mobile-padding border border-neutral-200",
        gradient: "bg-gradient-to-br from-eva-surface to-white rounded-2xl eva-mobile-padding border border-neutral-200",
        glass: "eva-glass rounded-2xl eva-mobile-padding",
      },
      spacing: {
        sm: "py-4",
        md: "py-6",
        lg: "py-8",
        xl: "py-12",
      },
    },
    defaultVariants: {
      background: "default",
      spacing: "md",
    },
  }
);

interface HealthSectionProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof healthSectionVariants> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const HealthSection = ({ 
  title, 
  description, 
  action, 
  background, 
  spacing, 
  className, 
  children,
  ...props 
}: HealthSectionProps) => (
  <section className={cn(healthSectionVariants({ background, spacing }), className)} {...props}>
    {(title || description || action) && (
      <div className="flex items-center justify-between mb-6">
        <div>
          {title && (
            <h2 className="text-lg font-semibold text-eva-text-primary">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-eva-text-secondary mt-1">{description}</p>
          )}
        </div>
        {action && action}
      </div>
    )}
    {children}
  </section>
);

// Health Modal Overlay
interface HealthModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const HealthModal = ({ 
  isOpen, 
  onClose, 
  title, 
  className, 
  children, 
  ...props 
}: HealthModalProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center eva-mobile-padding bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className={cn(
          "w-full max-w-md bg-eva-surface rounded-2xl p-6 shadow-xl animate-scale-in",
          "max-h-[80vh] overflow-y-auto",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-eva-text-primary">{title}</h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-xl transition-colors"
            >
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};