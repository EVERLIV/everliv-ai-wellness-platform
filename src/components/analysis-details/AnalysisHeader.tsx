
import React from "react";
import { Button } from "@/components/ui/button";
import { Activity, Calendar, Printer, Brain } from "lucide-react";

interface AnalysisHeaderProps {
  analysisType: string;
  createdAt: string;
  biomarkersCount: number;
  onPrint: () => void;
}

const AnalysisHeader: React.FC<AnalysisHeaderProps> = ({
  analysisType,
  createdAt,
  biomarkersCount,
  onPrint
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 print:bg-white print:border-none">
      <div className="container mx-auto px-4 py-8 max-w-6xl print:py-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Brain className="h-6 w-6 text-blue-600 print:h-5 print:w-5" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 print:text-2xl mb-2">
                Персональные рекомендации
              </h1>
              <p className="text-gray-600 print:text-sm">Комплексный анализ вашего здоровья</p>
            </div>
          </div>
          <Button 
            onClick={onPrint}
            className="gap-2 print:hidden"
            variant="outline"
          >
            <Printer className="h-4 w-4" />
            Печать PDF
          </Button>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm text-gray-600 print:text-xs">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 print:h-3 print:w-3" />
                <span>
                  Дата: {new Date(createdAt).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 print:h-3 print:w-3" />
                <span>Биомаркеров: {biomarkersCount}</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Тип анализа: {analysisType}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisHeader;
