import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

// Progress Ring Component
interface ProgressRingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
}

export const ProgressRing = ({ 
  value, 
  max = 100, 
  size = "md", 
  strokeWidth = 8,
  className,
  children 
}: ProgressRingProps) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24", 
    lg: "w-32 h-32"
  };
  
  const radius = size === "sm" ? 24 : size === "md" ? 40 : 56;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / max) * circumference;
  
  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${radius * 2 + strokeWidth * 2} ${radius * 2 + strokeWidth * 2}`}>
        {/* Background circle */}
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          stroke="hsl(var(--neutral-200))"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          stroke="hsl(var(--eva-primary))"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};

// Metric Card Component
const metricCardVariants = cva(
  "relative overflow-hidden rounded-2xl bg-eva-surface border border-neutral-200 p-6 transition-all duration-200",
  {
    variants: {
      status: {
        normal: "border-eva-normal/30 bg-gradient-to-br from-eva-normal/5 to-transparent",
        warning: "border-eva-warning/30 bg-gradient-to-br from-eva-warning/5 to-transparent",
        critical: "border-eva-critical/30 bg-gradient-to-br from-eva-critical/5 to-transparent",
        optimal: "border-eva-optimal/30 bg-gradient-to-br from-eva-optimal/5 to-transparent",
      },
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
      interactive: {
        true: "cursor-pointer hover:shadow-lg hover:-translate-y-1",
        false: "",
      },
    },
    defaultVariants: {
      status: "normal",
      size: "md",
      interactive: false,
    },
  }
);

interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof metricCardVariants> {
  title: string;
  value: string | number;
  unit?: string;
  change?: {
    value: number;
    trend: "up" | "down" | "neutral";
    period?: string;
  };
  chart?: React.ReactNode;
}

export const MetricCard = ({ 
  title, 
  value, 
  unit, 
  change, 
  chart,
  status,
  size,
  interactive,
  className,
  ...props 
}: MetricCardProps) => {
  const getTrendIcon = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up": return <TrendingUp className="w-3 h-3" />;
      case "down": return <TrendingDown className="w-3 h-3" />;
      default: return <Minus className="w-3 h-3" />;
    }
  };

  const getTrendColor = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up": return "text-eva-normal";
      case "down": return "text-eva-critical";
      default: return "text-eva-textSecondary";
    }
  };

  return (
    <div 
      className={cn(metricCardVariants({ status, size, interactive }), className)} 
      {...props}
    >
      <div className="space-y-2">
        <p className="text-sm font-medium text-eva-textSecondary">{title}</p>
        
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-eva-textPrimary">{value}</span>
          {unit && <span className="text-sm text-eva-textSecondary">{unit}</span>}
        </div>

        {change && (
          <div className={cn("flex items-center gap-1 text-sm", getTrendColor(change.trend))}>
            {getTrendIcon(change.trend)}
            <span className="font-medium">{Math.abs(change.value)}%</span>
            {change.period && <span className="text-eva-textMuted">vs {change.period}</span>}
          </div>
        )}
      </div>

      {chart && (
        <div className="mt-4">
          {chart}
        </div>
      )}
    </div>
  );
};

// Status Indicator Component
interface StatusIndicatorProps {
  status: "normal" | "warning" | "critical" | "optimal";
  label: string;
  size?: "sm" | "md";
  className?: string;
}

export const StatusIndicator = ({ status, label, size = "md", className }: StatusIndicatorProps) => {
  const statusColors = {
    normal: "bg-eva-normal",
    warning: "bg-eva-warning", 
    critical: "bg-eva-critical",
    optimal: "bg-eva-optimal",
  };

  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("rounded-full", sizeClasses[size], statusColors[status])} />
      <span className="text-sm text-eva-textSecondary">{label}</span>
    </div>
  );
};

// Health Score Component
interface HealthScoreProps {
  score: number;
  maxScore?: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const HealthScore = ({ 
  score, 
  maxScore = 10, 
  label = "Health Score", 
  size = "md",
  className 
}: HealthScoreProps) => {
  const percentage = (score / maxScore) * 100;
  
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <ProgressRing value={percentage} size={size}>
        <div className="text-center">
          <div className="text-2xl font-bold text-eva-textPrimary">{score}</div>
          <div className="text-xs text-eva-textSecondary">/{maxScore}</div>
        </div>
      </ProgressRing>
      <p className="mt-2 text-sm font-medium text-eva-textSecondary">{label}</p>
    </div>
  );
};