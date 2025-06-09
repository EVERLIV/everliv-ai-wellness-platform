
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { biomarkersData } from "@/data/biomarkers";

interface BiomarkerDetailsProps {
  biomarkerId: string;
  onClose: () => void;
}

const BiomarkerDetails: React.FC<BiomarkerDetailsProps> = ({ 
  biomarkerId, 
  onClose 
}) => {
  const biomarker = biomarkersData[biomarkerId];
  
  if (!biomarker) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'high':
        return <TrendingUp className="h-5 w-5 text-blue-600" />;
      case 'normal':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'low':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high':
        return 'text-blue-600 bg-blue-50';
      case 'normal':
        return 'text-green-600 bg-green-50';
      case 'low':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card className="sticky top-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{biomarker.nameRu}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Текущее значение</span>
          </div>
          <div className={`flex items-center gap-2 p-3 rounded-lg ${getStatusColor(biomarker.status)}`}>
            {getStatusIcon(biomarker.status)}
            <span className="font-medium">
              {biomarker.currentValue} {biomarker.unit}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Референсные значения</h4>
          <div className="text-sm text-gray-600">
            <div>Мужчины: {biomarker.normalRangeMaleMin}-{biomarker.normalRangeMaleMax} {biomarker.unit}</div>
            <div>Женщины: {biomarker.normalRangeFemaleMin}-{biomarker.normalRangeFemaleMax} {biomarker.unit}</div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Динамика изменений</h4>
          <div className="h-20 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="w-full h-8 bg-blue-200 rounded relative">
              <div className="absolute right-2 top-1 w-2 h-6 bg-blue-600 rounded"></div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Текущее</span>
            <span>Стабильно</span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Описание</h4>
          <p className="text-sm text-gray-600">{biomarker.descriptionRu}</p>
        </div>

        {biomarker.status !== 'normal' && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Рекомендации</h4>
            <p className="text-sm text-gray-600">{biomarker.recommendationsRu}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BiomarkerDetails;
