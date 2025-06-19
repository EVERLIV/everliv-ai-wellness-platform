
import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface NavigationControlsProps {
  onSave: () => void;
  onCancel: () => void;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({
  onSave,
  onCancel
}) => {
  return (
    <div className="flex justify-between mt-8">
      <Button
        variant="outline"
        onClick={onCancel}
      >
        Назад
      </Button>

      <div className="flex gap-2">
        <Button
          onClick={onSave}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          Сохранить профиль
        </Button>
      </div>
    </div>
  );
};

export default NavigationControls;
