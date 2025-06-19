
import React from "react";
import { Biomarker } from "@/types/analysis";
import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";
import BiomarkerCard from "./BiomarkerCard";

interface BiomarkersListProps {
  biomarkers: Biomarker[];
}

const BiomarkersList: React.FC<BiomarkersListProps> = ({ biomarkers }) => {
  if (biomarkers.length === 0) {
    return (
      <Card className="print:border-gray-300">
        <CardContent className="p-8 print:p-4">
          <div className="text-center text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300 print:h-8 print:w-8" />
            <h3 className="text-lg font-medium mb-2 print:text-sm">Нет данных</h3>
            <p className="text-sm print:text-xs">
              В этом анализе не найдено биомаркеров для отображения
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3 print:space-y-2">
      {biomarkers.map((biomarker, index) => (
        <BiomarkerCard 
          key={index} 
          name={biomarker.name}
          value={biomarker.value}
          normalRange={biomarker.normalRange}
          status={biomarker.status}
          recommendation={biomarker.recommendation}
          detailedRecommendation={biomarker.detailedRecommendation}
        />
      ))}
    </div>
  );
};

export default BiomarkersList;
