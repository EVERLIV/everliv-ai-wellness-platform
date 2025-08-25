
import React from "react";

interface AnalyticsValueDisplayProps {
  label: string;
  value: string | number;
  className?: string;
}

const AnalyticsValueDisplay: React.FC<AnalyticsValueDisplayProps> = ({
  label,
  value,
  className = ""
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="text-sm font-medium text-secondary-foreground">
        {label}
      </label>
      <p className="text-base font-semibold text-primary">
        {value}
      </p>
    </div>
  );
};

export default AnalyticsValueDisplay;
