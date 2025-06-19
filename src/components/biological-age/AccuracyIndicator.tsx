
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, CheckCircle } from 'lucide-react';
import { AccuracyLevel } from '@/types/biologicalAge';
import { ACCURACY_LEVELS } from '@/data/biomarkers';

interface AccuracyIndicatorProps {
  accuracy: AccuracyLevel;
}

const AccuracyIndicator: React.FC<AccuracyIndicatorProps> = ({ accuracy }) => {
  const getProgressValue = () => {
    if (accuracy.level === 'basic') {
      return Math.min(100, (accuracy.current_tests / ACCURACY_LEVELS.basic.min) * 100);
    } else if (accuracy.level === 'extended') {
      return Math.min(100, ((accuracy.current_tests - ACCURACY_LEVELS.basic.min) / (ACCURACY_LEVELS.extended.min - ACCURACY_LEVELS.basic.min)) * 100);
    } else {
      return Math.min(100, ((accuracy.current_tests - ACCURACY_LEVELS.extended.min) / (ACCURACY_LEVELS.comprehensive.min - ACCURACY_LEVELS.extended.min)) * 100);
    }
  };

  const getNextMilestone = () => {
    if (accuracy.current_tests < ACCURACY_LEVELS.basic.min) {
      return {
        level: 'basic',
        needed: ACCURACY_LEVELS.basic.min - accuracy.current_tests,
        total: ACCURACY_LEVELS.basic.min,
        description: 'базового расчета'
      };
    } else if (accuracy.current_tests < ACCURACY_LEVELS.extended.min) {
      return {
        level: 'extended',
        needed: ACCURACY_LEVELS.extended.min - accuracy.current_tests,
        total: ACCURACY_LEVELS.extended.min,
        description: 'расширенного анализа'
      };
    } else if (accuracy.current_tests < ACCURACY_LEVELS.comprehensive.min) {
      return {
        level: 'comprehensive',
        needed: ACCURACY_LEVELS.comprehensive.min - accuracy.current_tests,
        total: ACCURACY_LEVELS.comprehensive.min,
        description: 'максимальной точности'
      };
    }
    return null;
  };

  const nextMilestone = getNextMilestone();

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'basic':
        return 'bg-yellow-100 text-yellow-700';
      case 'extended':
        return 'bg-blue-100 text-blue-700';
      case 'comprehensive':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold">Уровень точности</h3>
        </div>
        <Badge className={getLevelColor(accuracy.level)}>
          {accuracy.description} ({accuracy.percentage}%)
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Заполнено анализов: {accuracy.current_tests}</span>
          <span>Точность: {accuracy.percentage}%</span>
        </div>
        <Progress value={accuracy.percentage} className="h-2" />
      </div>

      {/* Уровни точности */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className={`p-2 rounded text-center ${
          accuracy.current_tests >= ACCURACY_LEVELS.basic.min 
            ? 'bg-green-100 text-green-700' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          <div className="flex items-center justify-center mb-1">
            {accuracy.current_tests >= ACCURACY_LEVELS.basic.min ? (
              <CheckCircle className="h-3 w-3" />
            ) : (
              <span className="font-semibold">{ACCURACY_LEVELS.basic.min}</span>
            )}
          </div>
          <div>Базовый</div>
          <div>{ACCURACY_LEVELS.basic.percentage}%</div>
        </div>
        
        <div className={`p-2 rounded text-center ${
          accuracy.current_tests >= ACCURACY_LEVELS.extended.min 
            ? 'bg-green-100 text-green-700' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          <div className="flex items-center justify-center mb-1">
            {accuracy.current_tests >= ACCURACY_LEVELS.extended.min ? (
              <CheckCircle className="h-3 w-3" />
            ) : (
              <span className="font-semibold">{ACCURACY_LEVELS.extended.min}</span>
            )}
          </div>
          <div>Расширенный</div>
          <div>{ACCURACY_LEVELS.extended.percentage}%</div>
        </div>
        
        <div className={`p-2 rounded text-center ${
          accuracy.current_tests >= ACCURACY_LEVELS.comprehensive.min 
            ? 'bg-green-100 text-green-700' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          <div className="flex items-center justify-center mb-1">
            {accuracy.current_tests >= ACCURACY_LEVELS.comprehensive.min ? (
              <CheckCircle className="h-3 w-3" />
            ) : (
              <span className="font-semibold">{ACCURACY_LEVELS.comprehensive.min}</span>
            )}
          </div>
          <div>Полный</div>
          <div>{ACCURACY_LEVELS.comprehensive.percentage}%</div>
        </div>
      </div>

      {/* Следующая цель */}
      {nextMilestone && (
        <Card className="bg-blue-50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Следующая цель
              </span>
            </div>
            <p className="text-sm text-blue-800">
              Добавьте еще <strong>{nextMilestone.needed}</strong> анализ(ов) 
              для достижения {nextMilestone.description}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AccuracyIndicator;
