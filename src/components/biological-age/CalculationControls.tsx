
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
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4">
          <Button
            onClick={onCalculate}
            disabled={isCalculating || currentAccuracy.current_tests < ACCURACY_LEVELS.basic.min}
            size="lg"
            className="w-full max-w-md"
          >
            {isCalculating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Рассчитываем...
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4 mr-2" />
                Рассчитать биологический возраст
              </>
            )}
          </Button>
          <p className="text-sm text-gray-600 text-center">
            Заполнено анализов: {currentAccuracy.current_tests} из {totalBiomarkers}
            <br />
            Точность расчета: {currentAccuracy.percentage}%
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalculationControls;
