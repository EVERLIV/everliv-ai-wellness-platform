
import React from "react";
import { TrendingUp, Activity, AlertTriangle, CheckCircle } from "lucide-react";

interface AnalyticsHeaderProps {
  healthScore: number;
  riskLevel: string;
}

const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({ healthScore, riskLevel }) => {
  const getRiskLevelIcon = (level: string) => {
    switch (level) {
      case 'low':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'medium':
        return <Activity className="h-6 w-6 text-yellow-500" />;
      case 'high':
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      default:
        return <Activity className="h-6 w-6 text-gray-500" />;
    }
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'low':
        return 'Низкий риск';
      case 'medium':
        return 'Умеренный риск';
      case 'high':
        return 'Высокий риск';
      default:
        return 'Не определен';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-b border-gray-200">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-3">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Аналитика здоровья
            </h1>
          </div>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Комплексный анализ ваших биомаркеров, персональные рекомендации и 
            консультации с ИИ-доктором EVERLIV
          </p>

          {/* Показатели здоровья */}
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 mt-8">
            <div className="flex items-center space-x-3 bg-white rounded-xl px-6 py-4 shadow-sm border">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getScoreColor(healthScore)}`}>
                  {healthScore}
                </div>
                <div className="text-sm text-gray-500">Общий балл здоровья</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-white rounded-xl px-6 py-4 shadow-sm border">
              {getRiskLevelIcon(riskLevel)}
              <div className="text-center">
                <div className="font-semibold text-gray-900">
                  {getRiskLevelText(riskLevel)}
                </div>
                <div className="text-sm text-gray-500">Уровень риска</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsHeader;
