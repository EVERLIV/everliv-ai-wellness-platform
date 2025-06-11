
import React from "react";
import { TrendingUp } from "lucide-react";

interface StatusCounts {
  optimal: number;
  attention: number;
  risk: number;
  total: number;
}

interface AnalysisCardStatsProps {
  statusCounts: StatusCounts;
  healthScore?: number;
}

const AnalysisCardStats: React.FC<AnalysisCardStatsProps> = ({
  statusCounts,
  healthScore,
}) => {
  return (
    <>
      {/* Stats */}
      {statusCounts.total > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <div className="text-sm md:text-base font-semibold text-green-700">{statusCounts.optimal}</div>
            <div className="text-xs text-green-600">Норма</div>
          </div>
          <div className="text-center p-2 bg-yellow-50 rounded-lg">
            <div className="text-sm md:text-base font-semibold text-yellow-700">{statusCounts.attention}</div>
            <div className="text-xs text-yellow-600">Внимание</div>
          </div>
          <div className="text-center p-2 bg-red-50 rounded-lg">
            <div className="text-sm md:text-base font-semibold text-red-700">{statusCounts.risk}</div>
            <div className="text-xs text-red-600">Риск</div>
          </div>
        </div>
      )}

      {/* Health Score */}
      {healthScore && (
        <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Индекс здоровья</span>
          </div>
          <span className={`text-lg font-bold ${
            healthScore >= 80 ? 'text-green-600' :
            healthScore >= 60 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {healthScore}%
          </span>
        </div>
      )}

      {/* Empty state */}
      {statusCounts.total === 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg text-center">
          <span className="text-sm text-gray-600">
            Анализ обработан
          </span>
        </div>
      )}
    </>
  );
};

export default AnalysisCardStats;
