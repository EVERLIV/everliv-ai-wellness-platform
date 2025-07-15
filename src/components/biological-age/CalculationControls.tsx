
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';
import { AccuracyLevel } from '@/types/biologicalAge';
import { ACCURACY_LEVELS } from '@/data/biomarkers';

interface CalculationControlsProps {
  onCalculate: () => void;
  isCalculating: boolean;
  currentAccuracy: AccuracyLevel;
  totalBiomarkers: number;
}

const CalculationControls: React.FC<CalculationControlsProps> = ({
  onCalculate,
  isCalculating,
  currentAccuracy,
  totalBiomarkers
}) => {
  return (
    <div className="border border-gray-200 bg-white">
      <div className="p-3">
        <div className="flex flex-col items-center space-y-3">
          <Button
            onClick={onCalculate}
            disabled={isCalculating || currentAccuracy.current_tests < ACCURACY_LEVELS.basic.min}
            size="sm"
            className="w-full max-w-md"
          >
            {isCalculating ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                Рассчитываем...
              </>
            ) : (
              <>
                <TrendingUp className="h-3 w-3 mr-2" />
                Рассчитать биологический возраст
              </>
            )}
          </Button>
          <p className="text-xs text-gray-600 text-center">
            Заполнено анализов: {currentAccuracy.current_tests} из {totalBiomarkers}
            <br />
            Точность расчета: {currentAccuracy.percentage}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default CalculationControls;
