
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyAnalysisStateProps {
  onAddAnalysis: () => void;
}

const EmptyAnalysisState: React.FC<EmptyAnalysisStateProps> = ({ onAddAnalysis }) => {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <div className="text-6xl mb-4">🔬</div>
        <h3 className="text-xl font-semibold mb-2">Пока нет анализов</h3>
        <p className="text-gray-600 mb-6">
          Загрузите свой первый медицинский анализ для обработки с помощью ИИ
        </p>
        <Button 
          onClick={onAddAnalysis}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Добавить первый анализ
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyAnalysisState;
