
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
    <div className="space-y-6">
      {/* Компактное размещение диаграммы и введенных данных */}
      {filledBiomarkers.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BiologicalAgeRadarChart biomarkers={biomarkers} />
          
          {/* Детальный список введенных биомаркеров */}
          <FilledBiomarkersList biomarkers={filledBiomarkers} />
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Основной контент */}
          <div className="lg:col-span-2">
            <BiomarkerCategories
              biomarkers={biomarkers}
              onValueChange={handleBiomarkerValueChange}
              healthProfile={healthProfile}
            />
          </div>
          
          {/* Боковая панель */}
          <div className="space-y-4">
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
      </div>
    </div>
  );
};

export default BiologicalAgeCalculator;
