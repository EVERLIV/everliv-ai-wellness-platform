
import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface NavigationControlsProps {
  currentSection: number;
  totalSections: number;
  isLoading: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSave: () => void;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({
  currentSection,
  totalSections,
  isLoading,
  onPrevious,
  onNext,
  onSave
}) => {
  const isLastSection = currentSection === totalSections - 1;

  return (
    <div className="flex justify-between mt-8">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentSection === 0}
      >
        Назад
      </Button>

      <div className="flex gap-2">
        {isLastSection ? (
          <Button
            onClick={onSave}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            Сохранить профиль
          </Button>
        ) : (
          <Button onClick={onNext}>
            Далее
          </Button>
        )}
      </div>
    </div>
  );
};

export default NavigationControls;
