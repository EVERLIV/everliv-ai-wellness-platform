
import React from "react";
import { displayHealthProfileValue } from "@/utils/healthProfileUtils";

interface HealthProfileValueDisplayProps {
  value: any;
  label: string;
  type?: 'text' | 'array';
}

const HealthProfileValueDisplay: React.FC<HealthProfileValueDisplayProps> = ({ 
  value, 
  label, 
  type = 'text' 
}) => {
  const displayValue = displayHealthProfileValue(value);
  
  if (!value && value !== 0) {
    return (
      <div className="mb-4">
        <span className="text-sm font-medium text-gray-700">{label}:</span>
        <span className="text-gray-500 ml-2">Не указано</span>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <span className="text-sm font-medium text-gray-700">{label}:</span>
      <span className="ml-2">
        {type === 'array' && Array.isArray(value) ? (
          <div className="flex flex-wrap gap-1 mt-1">
            {value.map((item, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                {displayHealthProfileValue(item)}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-gray-900">{displayValue}</span>
        )}
      </span>
    </div>
  );
};

export default HealthProfileValueDisplay;
