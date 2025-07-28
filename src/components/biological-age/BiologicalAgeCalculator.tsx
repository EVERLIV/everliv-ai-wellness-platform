
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
import ModernBiologicalAgeFlow from './ModernBiologicalAgeFlow';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-6 space-y-8">
        
        {/* Современный заголовок с статистикой */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Биологический возраст
          </h1>
          <div className="flex justify-center items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Заполнено: {filledBiomarkers.length} из {biomarkers.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Точность: {currentAccuracy.percentage}%</span>
            </div>
          </div>
        </div>

        {/* Панель точности и контролов */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AccuracyIndicator accuracy={currentAccuracy} />
              
              <div className="space-y-4">
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
              </div>

              <div className="space-y-4">
                {results && (
                  <BiologicalAgeResults results={results} />
                )}
                <BiologicalAgeHistoryCard />
              </div>
            </div>
          </div>
        </div>

        {/* Современная диаграмма статуса (если есть данные) */}
        {filledBiomarkers.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
              <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
                Профиль здоровья
              </h2>
              <BiologicalAgeRadarChart biomarkers={biomarkers} />
            </div>
          </div>
        )}

        {/* Список заполненных биомаркеров */}
        {filledBiomarkers.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
              <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
                Введенные показатели
              </h2>
              <FilledBiomarkersList biomarkers={filledBiomarkers} />
            </div>
          </div>
        )}

        {/* Интерактивная схема связей биомаркеров */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
              Интерактивная карта биомаркеров
            </h2>
            <div className="h-96">
              <ModernBiologicalAgeFlow 
                biomarkers={biomarkers}
                onValueChange={handleBiomarkerValueChange}
                healthProfile={healthProfile}
              />
            </div>
          </div>
        </div>

        {/* Основной контент - категории биомаркеров */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
              Ввод данных анализов
            </h2>
            <BiomarkerCategories
              biomarkers={biomarkers}
              onValueChange={handleBiomarkerValueChange}
              healthProfile={healthProfile}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default BiologicalAgeCalculator;
