
import React from "react";
import { Button } from "@/components/ui/button";
import { Activity, Calendar, Printer } from "lucide-react";

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
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-b border-gray-200 print:bg-white print:border-none">
      <div className="container mx-auto px-4 py-6 max-w-6xl print:py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Activity className="h-8 w-8 text-blue-600 print:h-6 print:w-6" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 print:text-2xl">
                {analysisType}
              </h1>
              <p className="text-gray-600 print:text-sm">Детальный анализ показателей</p>
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
            <span>Показателей: {biomarkersCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisHeader;
