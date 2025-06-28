
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, AlertTriangle, Brain } from 'lucide-react';

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

interface BiomarkerTrendItemProps {
  biomarker: BiomarkerTrend;
}

const BiomarkerTrendItem: React.FC<BiomarkerTrendItemProps> = ({ biomarker }) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'worsening':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'good':
      case 'normal':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'attention':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'risk':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'optimal': return 'Оптимально';
      case 'good': return 'Хорошо';
      case 'normal': return 'Норма';
      case 'attention': return 'Внимание';
      case 'risk': return 'Риск';
      case 'high': return 'Высокий';
      case 'low': return 'Низкий';
      default: return 'Неизвестно';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'border-green-200 bg-green-50';
      case 'worsening': return 'border-red-200 bg-red-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div 
      className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${getTrendColor(biomarker.trend)} hover:shadow-lg`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            {getTrendIcon(biomarker.trend)}
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-lg">
              {biomarker.name}
              {biomarker.isOutOfRange && (
                <AlertTriangle className="inline h-4 w-4 text-orange-500 ml-2" />
              )}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              <span className="font-medium">
                {biomarker.previousValue} → {biomarker.latestValue}
                {biomarker.unit && ` ${biomarker.unit}`}
              </span>
              {biomarker.changePercent && biomarker.changePercent > 0 && (
                <span className="ml-2 text-xs bg-white px-2 py-1 rounded-full">
                  {biomarker.trend === 'improving' ? '+' : ''}
                  {biomarker.changePercent.toFixed(1)}%
                </span>
              )}
            </div>
          </div>
        </div>
        <Badge className={`${getStatusColor(biomarker.status)} border text-xs px-3 py-1`}>
          {getStatusText(biomarker.status)}
        </Badge>
      </div>
      
      {/* ИИ рекомендации для отклонений */}
      {biomarker.aiRecommendation && (
        <div className="bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-lg p-3 mt-3">
          <div className="flex items-start gap-2">
            <div className="p-1 bg-indigo-100 rounded">
              <Brain className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-indigo-800 mb-1">
                ИИ-рекомендация:
              </div>
              <p className="text-sm text-indigo-700 leading-relaxed">
                {biomarker.aiRecommendation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BiomarkerTrendItem;
