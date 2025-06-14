
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from "@/components/Header";
import MinimalFooter from "@/components/MinimalFooter";
import { useMoscowSpecialists } from '@/hooks/useMoscowSpecialists';
import { useMedicalKnowledge } from '@/hooks/useMedicalKnowledge';
import MoscowSpecialistCard from '@/components/medical-knowledge/MoscowSpecialistCard';
import AISpecialistSearch from '@/components/medical-knowledge/AISpecialistSearch';
import LoadingState from '@/components/medical-knowledge/LoadingState';
import EmptyState from '@/components/medical-knowledge/EmptyState';
import { Users, MapPin, Search } from 'lucide-react';

const MoscowClinics: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { specialists, isLoading } = useMoscowSpecialists();
  const { specializations } = useMedicalKnowledge();
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('all');

  // Обрабатываем параметр специализации из URL
  useEffect(() => {
    const specializationParam = searchParams.get('specialization');
    if (specializationParam) {
      setSelectedSpecialization(specializationParam);
    }
  }, [searchParams]);

  const handleSpecialistSelect = (specialistId: string) => {
    console.log('Selected specialist:', specialistId);
    // TODO: Добавить навигацию к детальной странице специалиста
  };

  const filteredSpecialists = selectedSpecialization === 'all' 
    ? specialists 
    : specialists.filter(s => s.specialization_id === selectedSpecialization);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-grow pt-16">
          <LoadingState message="Загрузка специалистов..." size="lg" />
        </div>
        <MinimalFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-6 sm:py-8 md:py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">
                Специалисты Москвы
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 mb-4 sm:mb-6">
                Найдите лучших врачей в столице
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 md:gap-8 text-sm sm:text-base text-blue-100">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>{specialists.length} специалистов</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Москва</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8 max-w-7xl">
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6 h-auto">
              <TabsTrigger value="search" className="text-xs sm:text-sm py-2 flex items-center gap-1 sm:gap-2">
                <Search className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Поиск с ИИ</span>
                <span className="sm:hidden">ИИ</span>
              </TabsTrigger>
              <TabsTrigger value="all" className="text-xs sm:text-sm py-2 flex items-center gap-1 sm:gap-2">
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Все специалисты</span>
                <span className="sm:hidden">Все</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-4 sm:space-y-6">
              <AISpecialistSearch onSpecialistSelect={handleSpecialistSelect} />
            </TabsContent>

            <TabsContent value="all" className="space-y-4 sm:space-y-6">
              {/* Фильтры по специализации для мобильных */}
              <div className="block lg:hidden">
                <select 
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">Все специализации</option>
                  {specializations.slice(0, 8).map((spec) => (
                    <option key={spec.id} value={spec.id}>
                      {spec.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Фильтры для десктопа */}
              <div className="hidden lg:block">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedSpecialization('all')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedSpecialization === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Все специалисты
                  </button>
                  {specializations.slice(0, 8).map((spec) => (
                    <button
                      key={spec.id}
                      onClick={() => setSelectedSpecialization(spec.id)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedSpecialization === spec.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {spec.name}
                    </button>
                  ))}
                </div>
              </div>

              {filteredSpecialists.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="Специалисты не найдены"
                  description="По выбранным критериям специалисты не найдены."
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {filteredSpecialists.map((specialist) => (
                    <MoscowSpecialistCard
                      key={specialist.id}
                      specialist={specialist}
                      onSelect={handleSpecialistSelect}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <MinimalFooter />
    </div>
  );
};

export default MoscowClinics;
