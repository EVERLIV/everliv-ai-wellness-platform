
import React from 'react';
import { TestTube } from 'lucide-react';
import { useBiomarkerTrends } from '@/hooks/useBiomarkerTrends';
import BiomarkerTrendsSummaryCards from './biomarker-trends/BiomarkerTrendsSummaryCards';
import BiomarkerTrendsList from './biomarker-trends/BiomarkerTrendsList';

interface BiomarkerTrendsOverviewProps {
  trendsAnalysis: {
    improving: number;
    worsening: number;
    stable: number;
  };
}

const BiomarkerTrendsOverview: React.FC<BiomarkerTrendsOverviewProps> = ({ trendsAnalysis }) => {
  const {
    biomarkerTrends,
    isLoading,
    isRefreshing,
    realTrendsData,
    handleRefresh
  } = useBiomarkerTrends();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (biomarkerTrends.length === 0) {
    return (
      <div className="text-center py-8">
        <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Недостаточно данных для анализа трендов
        </h3>
        <p className="text-gray-600">
          Загрузите минимум 2 анализа для отслеживания динамики биомаркеров
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BiomarkerTrendsSummaryCards realTrendsData={realTrendsData} />
      <BiomarkerTrendsList 
        biomarkerTrends={biomarkerTrends}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
      />
    </div>
  );
};

export default BiomarkerTrendsOverview;
