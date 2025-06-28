
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Activity, AlertTriangle } from 'lucide-react';

interface BiomarkerTrendsSummaryCardsProps {
  realTrendsData: {
    improving: number;
    stable: number;
    concerning: number;
    totalBiomarkers: number;
  };
}

const BiomarkerTrendsSummaryCards: React.FC<BiomarkerTrendsSummaryCardsProps> = ({ 
  realTrendsData 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-green-700">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-base font-semibold">Улучшается</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-700 mb-1">
            {realTrendsData.improving}
          </div>
          <div className="text-sm text-green-600">
            {realTrendsData.improving === 1 ? 'биомаркер' : 'биомаркеров'}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-base font-semibold">Стабильно</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-700 mb-1">
            {realTrendsData.stable}
          </div>
          <div className="text-sm text-blue-600">
            {realTrendsData.stable === 1 ? 'биомаркер' : 'биомаркеров'}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-rose-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-red-700">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <span className="text-base font-semibold">Требует внимания</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-700 mb-1">
            {realTrendsData.concerning}
          </div>
          <div className="text-sm text-red-600">
            {realTrendsData.concerning === 1 ? 'биомаркер' : 'биомаркеров'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BiomarkerTrendsSummaryCards;
