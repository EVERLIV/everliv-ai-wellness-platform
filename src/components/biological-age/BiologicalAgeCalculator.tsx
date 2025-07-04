
import React, { useState } from 'react';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { useBiologicalAgeCalculator } from '@/hooks/useBiologicalAgeCalculator';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    <div className="space-y-6">
      {/* View Mode Toggle */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Режим анализа</h3>
              <p className="text-sm text-gray-600">
                Выберите удобный способ ввода данных
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'wizard' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('wizard')}
                className="flex items-center gap-2"
              >
                <Zap className="h-4 w-4" />
                Пошаговый
                <Badge variant="secondary" className="ml-1">Новый</Badge>
              </Button>
              <Button
                variant={viewMode === 'classic' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('classic')}
                className="flex items-center gap-2"
              >
                <LayoutGrid className="h-4 w-4" />
                Классический
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Radar Chart for current data */}
      {filledBiomarkers.length > 0 && (
        <BiologicalAgeRadarChart biomarkers={biomarkers} />
      )}

      {viewMode === 'wizard' ? (
        <BiologicalAgeWizard
          biomarkers={biomarkers}
          onValueChange={handleBiomarkerValueChange}
          healthProfile={healthProfile}
          onCalculate={calculateBiologicalAge}
          isCalculating={isCalculating}
          results={results}
          currentAccuracy={currentAccuracy}
        />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default BiologicalAgeCalculator;
