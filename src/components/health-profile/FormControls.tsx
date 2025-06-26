
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";

interface FormControlsProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSave: () => void;
}

const FormControls: React.FC<FormControlsProps> = ({
  isFirstStep,
  isLastStep,
  onPrevious,
  onNext,
  onSave
}) => {
  return (
    <div className="flex justify-between items-center mt-6 gap-4">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep}
        className="gap-2 min-w-[120px]"
      >
        <ChevronLeft className="h-4 w-4" />
        Назад
      </Button>

      <div className="flex gap-2">
        {!isLastStep ? (
          <Button
            onClick={onNext}
            className="gap-2 min-w-[120px] bg-blue-600 hover:bg-blue-700"
          >
            Далее
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={onSave}
            className="gap-2 min-w-[140px] bg-green-600 hover:bg-green-700"
          >
            <Save className="h-4 w-4" />
            Сохранить профиль
          </Button>
        )}
      </div>
    </div>
  );
};

export default FormControls;
