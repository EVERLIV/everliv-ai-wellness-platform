
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TestTube, RefreshCw, Zap } from 'lucide-react';
import BiomarkerTrendItem from './BiomarkerTrendItem';

interface BiomarkerTrend {
  name: string;
  latestValue: string;
  previousValue: string;
  trend: 'improving' | 'worsening' | 'stable';
  status: 'optimal' | 'good' | 'attention' | 'risk' | 'normal' | 'high' | 'low' | 'unknown';
  unit?: string;
  changePercent?: number;
  aiRecommendation?: string;
  isOutOfRange?: boolean;
}

interface BiomarkerTrendsListProps {
  biomarkerTrends: BiomarkerTrend[];
  isRefreshing: boolean;
  onRefresh: () => void;
}

const BiomarkerTrendsList: React.FC<BiomarkerTrendsListProps> = ({
  biomarkerTrends,
  isRefreshing,
  onRefresh
}) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TestTube className="h-5 w-5 text-purple-600" />
            </div>
            Динамика биомаркеров
            <Badge variant="outline" className="ml-2">
              Реал-тайм
            </Badge>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Обновить
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {biomarkerTrends.slice(0, 10).map((biomarker, index) => (
            <BiomarkerTrendItem key={index} biomarker={biomarker} />
          ))}
          
          {biomarkerTrends.length > 10 && (
            <div className="text-center text-sm text-gray-500 pt-4 border-t">
              <div className="flex items-center justify-center gap-2">
                <Zap className="h-4 w-4 text-blue-500" />
                <span>И еще {biomarkerTrends.length - 10} биомаркеров в реал-тайм мониторинге</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BiomarkerTrendsList;
