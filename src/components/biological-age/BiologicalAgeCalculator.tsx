
import React, { useState } from 'react';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { useBiologicalAgeCalculator } from '@/hooks/useBiologicalAgeCalculator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LayoutGrid, Zap } from 'lucide-react';
import BiologicalAgeWizard from './BiologicalAgeWizard';
import BiologicalAgeRadarChart from './BiologicalAgeRadarChart';
import UserProfileDisplay from './UserProfileDisplay';
import BiomarkerCategories from './BiomarkerCategories';
import AccuracyIndicator from './AccuracyIndicator';
import CalculationControls from './CalculationControls';
import BiologicalAgeResults from './BiologicalAgeResults';
import ConnectionErrorAlert from './ConnectionErrorAlert';
import LoadingSpinner from './LoadingSpinner';
import NoHealthProfileAlert from './NoHealthProfileAlert';

const BiologicalAgeCalculator = () => {
  const { healthProfile, isLoading } = useHealthProfile();
  const {
    biomarkers,
    isCalculating,
    results,
    connectionError,
    currentAccuracy,
    handleBiomarkerValueChange,
    calculateBiologicalAge,
    retryCalculation
  } = useBiologicalAgeCalculator(healthProfile);

  const [viewMode, setViewMode] = useState<'wizard' | 'classic'>('wizard');

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!healthProfile) {
    return <NoHealthProfileAlert />;
  }

  const filledBiomarkers = biomarkers.filter(b => b.status === 'filled');

  return (
    <div className="space-y-2">
      {/* View Mode Toggle - встроенный в заголовок */}
      <div className="border border-gray-200 bg-white p-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-medium text-gray-900">Режим анализа</h3>
            <p className="text-xs text-gray-600">Выберите способ ввода данных</p>
          </div>
          
          <div className="flex gap-1">
            <Button
              variant={viewMode === 'wizard' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('wizard')}
              className="flex items-center gap-1 text-xs h-7 px-2"
            >
              <Zap className="h-3 w-3" />
              Пошаговый
              <Badge variant="secondary" className="ml-1 text-xs h-4 px-1">Новый</Badge>
            </Button>
            <Button
              variant={viewMode === 'classic' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('classic')}
              className="flex items-center gap-1 text-xs h-7 px-2"
            >
              <LayoutGrid className="h-3 w-3" />
              Классический
            </Button>
          </div>
        </div>
      </div>

      {/* Компактное размещение диаграммы и данных */}
      {filledBiomarkers.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <BiologicalAgeRadarChart biomarkers={biomarkers} />
          
          {/* Компактная панель статистики */}
          <div className="border border-gray-200 bg-white p-2">
            <h4 className="text-xs font-medium text-gray-900 mb-1">Статистика</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-600">Заполнено:</span>
                <span className="font-medium ml-1">{filledBiomarkers.length}/29</span>
              </div>
              <div>
                <span className="text-gray-600">Точность:</span>
                <span className="font-medium ml-1">{currentAccuracy.percentage}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'wizard' ? (
        <div className="space-y-2">
          <BiologicalAgeWizard
            biomarkers={biomarkers}
            onValueChange={handleBiomarkerValueChange}
            healthProfile={healthProfile}
            onCalculate={calculateBiologicalAge}
            isCalculating={isCalculating}
            results={results}
            currentAccuracy={currentAccuracy}
          />
        </div>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            {/* Основной контент */}
            <div className="lg:col-span-2">
              <BiomarkerCategories
                biomarkers={biomarkers}
                onValueChange={handleBiomarkerValueChange}
                healthProfile={healthProfile}
              />
            </div>
            
            {/* Боковая панель */}
            <div className="space-y-2">
              <AccuracyIndicator accuracy={currentAccuracy} />

              {connectionError && (
                <ConnectionErrorAlert 
                  error={connectionError} 
                  onRetry={retryCalculation} 
                />
              )}

              <CalculationControls
                onCalculate={calculateBiologicalAge}
                isCalculating={isCalculating}
                currentAccuracy={currentAccuracy}
                totalBiomarkers={biomarkers.length}
              />

              {results && (
                <BiologicalAgeResults results={results} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BiologicalAgeCalculator;
