
import React from 'react';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { useBiologicalAgeCalculator } from '@/hooks/useBiologicalAgeCalculator';
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!healthProfile) {
    return <NoHealthProfileAlert />;
  }

  return (
    <div className="space-y-6">
      <UserProfileDisplay healthProfile={healthProfile} />
      
      <AccuracyIndicator accuracy={currentAccuracy} />

      {connectionError && (
        <ConnectionErrorAlert 
          error={connectionError} 
          onRetry={retryCalculation} 
        />
      )}

      <BiomarkerCategories
        biomarkers={biomarkers}
        onValueChange={handleBiomarkerValueChange}
        healthProfile={healthProfile}
      />

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
  );
};

export default BiologicalAgeCalculator;
