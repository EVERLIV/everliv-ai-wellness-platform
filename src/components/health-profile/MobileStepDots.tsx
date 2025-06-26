
import React from "react";

interface MobileStepDotsProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (stepIndex: number) => void;
}

const MobileStepDots: React.FC<MobileStepDotsProps> = ({
  currentStep,
  totalSteps,
  onStepClick
}) => {
  return (
    <div className="flex justify-center gap-2 mt-6 sm:hidden">
      {Array.from({ length: totalSteps }, (_, index) => (
        <button
          key={index}
          onClick={() => onStepClick(index)}
          className={`w-2 h-2 rounded-full transition-all ${
            index === currentStep
              ? 'bg-blue-600 w-6'
              : index < currentStep
              ? 'bg-green-500'
              : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

export default MobileStepDots;
