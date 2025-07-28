
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
    <div className="bg-background border-l-2 border-l-primary/20">
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary"></div>
          <h3 className="text-sm font-medium text-foreground">Уровень точности</h3>
          <div className="ml-auto text-xs text-muted-foreground">
            {accuracy.percentage}%
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Заполнено: {accuracy.current_tests}</span>
            <span>{accuracy.description}</span>
          </div>
          <Progress value={accuracy.percentage} className="h-1" />
        </div>

        {/* Минималистичные уровни */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className={`p-2 text-center border-l-2 ${
            accuracy.current_tests >= ACCURACY_LEVELS.basic.min 
              ? 'border-l-green-500 bg-green-500/5' 
              : 'border-l-muted bg-muted/20'
          }`}>
            <div className="font-medium text-foreground">{ACCURACY_LEVELS.basic.min}</div>
            <div className="text-muted-foreground">Базовый</div>
          </div>
          
          <div className={`p-2 text-center border-l-2 ${
            accuracy.current_tests >= ACCURACY_LEVELS.extended.min 
              ? 'border-l-blue-500 bg-blue-500/5' 
              : 'border-l-muted bg-muted/20'
          }`}>
            <div className="font-medium text-foreground">{ACCURACY_LEVELS.extended.min}</div>
            <div className="text-muted-foreground">Расширенный</div>
          </div>
          
          <div className={`p-2 text-center border-l-2 ${
            accuracy.current_tests >= ACCURACY_LEVELS.comprehensive.min 
              ? 'border-l-purple-500 bg-purple-500/5' 
              : 'border-l-muted bg-muted/20'
          }`}>
            <div className="font-medium text-foreground">{ACCURACY_LEVELS.comprehensive.min}</div>
            <div className="text-muted-foreground">Полный</div>
          </div>
        </div>

        {/* Следующая цель */}
        {nextMilestone && (
          <div className="border-l-2 border-l-primary bg-primary/5 p-3">
            <div className="flex items-center gap-2 text-xs text-primary font-medium mb-1">
              <TrendingUp className="h-3 w-3" />
              Следующая цель
            </div>
            <p className="text-xs text-muted-foreground">
              +{nextMilestone.needed} для {nextMilestone.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccuracyIndicator;
