
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface BiomarkerPreview {
  name: string;
  value: string;
  category: string;
  categoryTitle: string;
  impact: 'high' | 'medium' | 'low';
  impactDescription: string;
}

interface AnalysisPreviewProps {
  biomarkers: BiomarkerPreview[];
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

const AnalysisPreview: React.FC<AnalysisPreviewProps> = ({
  biomarkers,
  onConfirm,
  onCancel,
  isProcessing = false
}) => {
  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'medium': return <TrendingDown className="h-4 w-4 text-yellow-500" />;
      case 'low': return <Minus className="h-4 w-4 text-green-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const categorizedBiomarkers = biomarkers.reduce((acc, biomarker) => {
    if (!acc[biomarker.category]) {
      acc[biomarker.category] = {
        title: biomarker.categoryTitle,
        markers: []
      };
    }
    acc[biomarker.category].markers.push(biomarker);
    return acc;
  }, {} as Record<string, { title: string; markers: BiomarkerPreview[] }>);

  return (
    <div className="space-y-4">
      <div className="text-center py-4">
        <h3 className="text-lg font-semibold mb-2">Предпросмотр результатов анализа</h3>
        <p className="text-sm text-gray-600">
          Найдено {biomarkers.length} показателей в {Object.keys(categorizedBiomarkers).length} категориях
        </p>
      </div>

      <div className="max-h-96 overflow-y-auto space-y-4">
        {Object.entries(categorizedBiomarkers).map(([category, data]) => (
          <Card key={category}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{data.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {data.markers.map((marker, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{marker.name}</div>
                    <div className="text-xs text-gray-600">{marker.value}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${getImpactColor(marker.impact)}`}>
                      <div className="flex items-center gap-1">
                        {getImpactIcon(marker.impact)}
                        {marker.impactDescription}
                      </div>
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-2 pt-4 border-t">
        <button
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Отмена
        </button>
        <button
          onClick={onConfirm}
          disabled={isProcessing}
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isProcessing ? 'Добавляем...' : 'Добавить показатели'}
        </button>
      </div>
    </div>
  );
};

export default AnalysisPreview;
