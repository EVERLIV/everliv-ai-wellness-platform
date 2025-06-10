
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Biomarker {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'optimal' | 'good' | 'attention' | 'risk';
  trend: 'up' | 'down' | 'stable';
  lastMeasured: string;
}

interface BiomarkersListProps {
  biomarkers: Biomarker[];
  selectedBiomarker: string | null;
  onSelectBiomarker: (id: string) => void;
}

const BiomarkersList: React.FC<BiomarkersListProps> = ({
  biomarkers,
  selectedBiomarker,
  onSelectBiomarker
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'attention':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'risk':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'Оптимально';
      case 'good':
        return 'Хорошо';
      case 'attention':
        return 'Внимание';
      case 'risk':
        return 'Риск';
      default:
        return 'Не определен';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-gray-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-500" />
          Биомаркеры
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {biomarkers.map((biomarker) => (
            <div
              key={biomarker.id}
              onClick={() => onSelectBiomarker(biomarker.id)}
              className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                selectedBiomarker === biomarker.id 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-gray-900 mb-1">
                    {biomarker.name}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-semibold text-gray-900">
                      {biomarker.value}
                    </span>
                    <span className="text-sm text-gray-500">
                      {biomarker.unit}
                    </span>
                    {getTrendIcon(biomarker.trend)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(biomarker.lastMeasured).toLocaleDateString('ru-RU')}
                  </p>
                </div>
                <div className="ml-3">
                  <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(biomarker.status)}`}>
                    {getStatusText(biomarker.status)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {biomarkers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Нет данных о биомаркерах</p>
            <p className="text-sm mt-1">
              Загрузите результаты анализов для получения детальной аналитики
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BiomarkersList;
