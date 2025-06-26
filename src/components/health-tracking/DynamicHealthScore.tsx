
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDailyHealthMetrics } from '@/hooks/useDailyHealthMetrics';
import { useOptimizedHealthGoals } from '@/hooks/useOptimizedHealthGoals';
import { TrendingUp, RefreshCw, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { calculateProgress } from '@/utils/healthGoals';

const DynamicHealthScore: React.FC = () => {
  const { calculateDynamicHealthScore, todayMetrics } = useDailyHealthMetrics();
  const { activeGoal } = useOptimizedHealthGoals();
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Memoized goal progress calculation
  const goalProgress = useMemo(() => {
    if (!activeGoal || !todayMetrics) return {};

    const progress: Record<string, number> = {};
    
    if (activeGoal.goal_type === 'steps' && activeGoal.target_value) {
      progress.steps = calculateProgress(todayMetrics.steps, activeGoal.target_value);
    }
    
    if (activeGoal.goal_type === 'exercise' && activeGoal.target_value) {
      progress.exercise = calculateProgress(todayMetrics.exercise_minutes, activeGoal.target_value);
    }
    
    if (activeGoal.goal_type === 'sleep' && activeGoal.target_value) {
      progress.sleep = calculateProgress(todayMetrics.sleep_hours, activeGoal.target_value);
    }
    
    if (activeGoal.goal_type === 'water' && activeGoal.target_value) {
      progress.water = calculateProgress(todayMetrics.water_intake, activeGoal.target_value);
    }
    
    if (activeGoal.goal_type === 'stress' && activeGoal.target_value) {
      progress.stress = todayMetrics.stress_level <= activeGoal.target_value ? 100 : 
              Math.max(0, (1 - (todayMetrics.stress_level - activeGoal.target_value) / 10) * 100);
    }

    return progress;
  }, [activeGoal, todayMetrics]);

  const recalculateScore = async () => {
    setIsCalculating(true);
    try {
      const score = await calculateDynamicHealthScore();
      setHealthScore(score);
    } catch (error) {
      console.error('Error calculating score:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  useEffect(() => {
    recalculateScore();
  }, [todayMetrics]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-4">
      {/* Динамический балл здоровья */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Динамический балл здоровья
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={recalculateScore}
              disabled={isCalculating}
            >
              <RefreshCw className={`h-4 w-4 ${isCalculating ? 'animate-spin' : ''}`} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {healthScore !== null ? (
            <div className={`p-6 rounded-lg border ${getScoreBackground(healthScore)}`}>
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(healthScore)} mb-2`}>
                  {healthScore.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  Балл на основе данных за последние 7 дней
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${
                      healthScore >= 80 ? 'bg-green-500' : 
                      healthScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, healthScore)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-500">
                {isCalculating ? 'Рассчитываем балл...' : 'Нет данных для расчета'}
              </div>
              {!isCalculating && (
                <p className="text-sm text-gray-400 mt-2">
                  Добавьте ежедневные метрики для расчета балла
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Прогресс по целям */}
      {activeGoal && todayMetrics && Object.keys(goalProgress).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Прогресс по целям сегодня
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">{activeGoal.title}</h4>
                <p className="text-sm text-blue-600 mb-3">{activeGoal.description}</p>
                
                {Object.entries(goalProgress).map(([key, value]) => (
                  <div key={key} className="mb-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="capitalize">{key}</span>
                      <span>{value.toFixed(1)}%</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))}
                
                <div className="mt-4 p-3 bg-white rounded border">
                  <div className="flex justify-between text-sm">
                    <span>Общий прогресс:</span>
                    <span>{activeGoal.progress_percentage}%</span>
                  </div>
                  <Progress value={activeGoal.progress_percentage} className="h-2 mt-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DynamicHealthScore;
