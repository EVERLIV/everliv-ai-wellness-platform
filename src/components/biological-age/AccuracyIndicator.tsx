
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
    <div className="border border-gray-200 bg-white">
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <Target className="h-3 w-3 text-blue-600" />
            <h3 className="bio-text-small font-medium">Уровень точности</h3>
          </div>
          <Badge className={getLevelColor(accuracy.level)} variant="secondary">
            {accuracy.description} ({accuracy.percentage}%)
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between bio-text-caption">
            <span>Заполнено анализов: {accuracy.current_tests}</span>
            <span>Точность: {accuracy.percentage}%</span>
          </div>
          <Progress value={accuracy.percentage} className="h-1" />
        </div>

        {/* Уровни точности */}
        <div className="grid grid-cols-3 gap-1 bio-text-caption mt-3">
          <div className={`p-2 border text-center ${
            accuracy.current_tests >= ACCURACY_LEVELS.basic.min 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-gray-50 text-gray-600 border-gray-200'
          }`}>
            <div className="flex items-center justify-center mb-1">
              {accuracy.current_tests >= ACCURACY_LEVELS.basic.min ? (
                <CheckCircle className="h-2 w-2" />
              ) : (
                <span className="bio-text-caption">{ACCURACY_LEVELS.basic.min}</span>
              )}
            </div>
            <div className="bio-text-caption">Базовый</div>
            <div className="bio-text-caption">{ACCURACY_LEVELS.basic.percentage}%</div>
          </div>
          
          <div className={`p-2 border text-center ${
            accuracy.current_tests >= ACCURACY_LEVELS.extended.min 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-gray-50 text-gray-600 border-gray-200'
          }`}>
            <div className="flex items-center justify-center mb-1">
              {accuracy.current_tests >= ACCURACY_LEVELS.extended.min ? (
                <CheckCircle className="h-2 w-2" />
              ) : (
                <span className="bio-text-caption">{ACCURACY_LEVELS.extended.min}</span>
              )}
            </div>
            <div className="bio-text-caption">Расширенный</div>
            <div className="bio-text-caption">{ACCURACY_LEVELS.extended.percentage}%</div>
          </div>
          
          <div className={`p-2 border text-center ${
            accuracy.current_tests >= ACCURACY_LEVELS.comprehensive.min 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-gray-50 text-gray-600 border-gray-200'
          }`}>
            <div className="flex items-center justify-center mb-1">
              {accuracy.current_tests >= ACCURACY_LEVELS.comprehensive.min ? (
                <CheckCircle className="h-2 w-2" />
              ) : (
                <span className="bio-text-caption">{ACCURACY_LEVELS.comprehensive.min}</span>
              )}
            </div>
            <div className="bio-text-caption">Полный</div>
            <div className="bio-text-caption">{ACCURACY_LEVELS.comprehensive.percentage}%</div>
          </div>
        </div>

        {/* Следующая цель */}
        {nextMilestone && (
          <div className="bg-blue-50 border border-blue-200 mt-3">
            <div className="p-2">
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="h-3 w-3 text-blue-600" />
                <span className="bio-text-caption font-medium text-blue-900">
                  Следующая цель
                </span>
              </div>
              <p className="bio-text-caption text-blue-800">
                Добавьте еще <strong>{nextMilestone.needed}</strong> анализ(ов) 
                для достижения {nextMilestone.description}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccuracyIndicator;
