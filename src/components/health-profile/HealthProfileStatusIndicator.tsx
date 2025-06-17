
import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface HealthProfileStatusIndicatorProps {
  isComplete: boolean;
  completionPercentage: number;
  size?: "sm" | "md" | "lg";
  showPercentage?: boolean;
}

const HealthProfileStatusIndicator: React.FC<HealthProfileStatusIndicatorProps> = ({
  isComplete,
  completionPercentage,
  size = "md",
  showPercentage = false
}) => {
  const getStatusConfig = () => {
    if (completionPercentage >= 90) {
      return {
        variant: "default" as const,
        color: "bg-green-500 text-white border-green-500",
        icon: CheckCircle,
        text: "Заполнен",
        bgColor: "bg-green-50",
        textColor: "text-green-700"
      };
    } else if (completionPercentage >= 50) {
      return {
        variant: "secondary" as const,
        color: "bg-yellow-500 text-white border-yellow-500",
        icon: AlertCircle,
        text: "Частично заполнен",
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-700"
      };
    } else {
      return {
        variant: "destructive" as const,
        color: "bg-red-500 text-white border-red-500",
        icon: XCircle,
        text: "Не заполнен",
        bgColor: "bg-red-50",
        textColor: "text-red-700"
      };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2"
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant={config.variant}
        className={`${sizeClasses[size]} flex items-center gap-1.5 ${config.color}`}
      >
        <IconComponent className={iconSizes[size]} />
        <span>{config.text}</span>
        {showPercentage && (
          <span className="font-medium">({completionPercentage}%)</span>
        )}
      </Badge>
    </div>
  );
};

export default HealthProfileStatusIndicator;
