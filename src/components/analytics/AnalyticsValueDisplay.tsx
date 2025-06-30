
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
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <p className="text-base font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
};

export default AnalyticsValueDisplay;
