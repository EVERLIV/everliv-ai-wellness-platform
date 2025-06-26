
import React from 'react';
import { Activity, TrendingUp, AlertTriangle } from 'lucide-react';

interface AnalyticsPageHeaderProps {
  healthScore: number;
  riskLevel: string;
}

const AnalyticsPageHeader: React.FC<AnalyticsPageHeaderProps> = ({
  healthScore,
  riskLevel
}) => {
  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'низкий':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'средний':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'высокий':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'низкий':
        return <TrendingUp className="h-4 w-4" />;
      case 'высокий':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">
            Персональная аналитика здоровья
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Комплексный анализ вашего здоровья на основе данных ИИ
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            {/* Балл здоровья */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 min-w-[200px]">
              <div className="text-sm text-blue-100 mb-2">Балл здоровья</div>
              <div className={`text-3xl font-bold ${getScoreColor(healthScore)}`}>
                {healthScore}/100
              </div>
            </div>

            {/* Уровень риска */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 min-w-[200px]">
              <div className="text-sm text-blue-100 mb-2">Уровень риска</div>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getRiskColor(riskLevel)}`}>
                {getRiskIcon(riskLevel)}
                {riskLevel}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPageHeader;
