
import React from 'react';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { useBiologicalAgeCalculator } from '@/hooks/useBiologicalAgeCalculator';
import BiologicalAgeRadarChart from './BiologicalAgeRadarChart';
import BiomarkerCategories from './BiomarkerCategories';
import AccuracyIndicator from './AccuracyIndicator';
import CalculationControls from './CalculationControls';
import BiologicalAgeResults from './BiologicalAgeResults';
import ConnectionErrorAlert from './ConnectionErrorAlert';
import LoadingSpinner from './LoadingSpinner';
import NoHealthProfileAlert from './NoHealthProfileAlert';
import FilledBiomarkersList from './FilledBiomarkersList';
import BiologicalAgeHistoryCard from './BiologicalAgeHistoryCard';

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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!healthProfile) {
    return <NoHealthProfileAlert />;
  }

  const filledBiomarkers = biomarkers.filter(b => b.status === 'filled');

  return (
    <div className="space-y-4">
      {/* Компактная верхняя секция */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* Диаграмма - компактная */}
        {filledBiomarkers.length > 0 && (
          <div className="xl:col-span-1">
            <BiologicalAgeRadarChart biomarkers={biomarkers} />
          </div>
        )}
        
        {/* Детальный список введенных биомаркеров */}
        {filledBiomarkers.length > 0 && (
          <div className="xl:col-span-2">
            <FilledBiomarkersList biomarkers={filledBiomarkers} />
          </div>
        )}
        
        {/* Боковая панель с контролами */}
        <div className="xl:col-span-1 space-y-3">
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

          {/* История биологического возраста */}
          <BiologicalAgeHistoryCard />
        </div>
      </div>

      {/* Основной контент - категории биомаркеров */}
      <div>
        <BiomarkerCategories
          biomarkers={biomarkers}
          onValueChange={handleBiomarkerValueChange}
          healthProfile={healthProfile}
        />
      </div>
    </div>
  );
};

export default BiologicalAgeCalculator;
