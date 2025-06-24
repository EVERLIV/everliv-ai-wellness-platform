
import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, TrendingUp, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HealthScoreCardProps {
  healthScore: number;
  getHealthScoreColor: (score: number | null) => string;
}

const HealthScoreCard: React.FC<HealthScoreCardProps> = ({
  healthScore,
  getHealthScoreColor
}) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6 p-6 bg-gradient-to-r from-white/80 to-blue-50/50 rounded-2xl border border-white/50 shadow-lg backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-400 via-pink-500 to-red-600 rounded-2xl shadow-lg shadow-red-200/40">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-red-400 flex items-center justify-center">
              <TrendingUp className="h-3 w-3 text-red-500" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Общий балл здоровья
            </h3>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-bold ${getHealthScoreColor(healthScore)}`}>
                {healthScore.toFixed(1)}
              </span>
              <span className="text-xl text-gray-400 font-semibold">/100</span>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white/80 hover:bg-white border-blue-200 hover:border-blue-300 text-blue-700 font-medium shadow-sm"
            onClick={() => navigate('/analytics')}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Детальный анализ
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <Progress 
          value={Math.min(100, Math.max(0, healthScore))} 
          className="h-3 bg-gray-200/50"
        />
      </div>
    </div>
  );
};

export default HealthScoreCard;
