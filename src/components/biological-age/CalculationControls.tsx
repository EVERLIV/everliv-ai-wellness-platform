
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
    <div className="bg-background border-l-2 border-l-primary">
      <div className="p-4">
        <Button
          onClick={onCalculate}
          disabled={isCalculating || currentAccuracy.current_tests < ACCURACY_LEVELS.basic.min}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          size="sm"
        >
          {isCalculating ? (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border border-current border-t-transparent animate-spin"></div>
              Расчет...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Рассчитать возраст
            </div>
          )}
        </Button>
        
        <div className="mt-3 text-xs text-muted-foreground text-center space-y-1">
          <div>{currentAccuracy.current_tests} / {totalBiomarkers} анализов</div>
          <div>Точность: {currentAccuracy.percentage}%</div>
        </div>
      </div>
    </div>
  );
};

export default CalculationControls;
