
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

const MedicalDataDisclaimer = () => {
  return (
    <Card className="border-blue-200 bg-blue-50/30 mt-8">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Info className="h-3 w-3 text-blue-600" />
          </div>
          <div className="text-xs text-blue-700 leading-relaxed">
            <strong className="text-blue-800">О качестве данных:</strong> Информация основана на рекомендациях ВОЗ, ESC/EAS, российских клинических рекомендациях 2023-2024 гг. 
            Расширенная база биомаркеров с оптимальными диапазонами, возрастными группами, детальной клинической значимостью и современными референсными значениями.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalDataDisclaimer;
