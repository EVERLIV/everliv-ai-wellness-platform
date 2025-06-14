
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from "@/components/Header";
import MinimalFooter from "@/components/MinimalFooter";
import { useMoscowSpecialists } from '@/hooks/useMoscowSpecialists';
import { useMedicalKnowledge } from '@/hooks/useMedicalKnowledge';
import MoscowSpecialistCard from '@/components/medical-knowledge/MoscowSpecialistCard';
import LoadingState from '@/components/medical-knowledge/LoadingState';
import EmptyState from '@/components/medical-knowledge/EmptyState';
import { Users, MapPin } from 'lucide-react';

const MoscowClinics: React.FC = () => {
  const { specialists, isLoading } = useMoscowSpecialists();
  const { specializations } = useMedicalKnowledge();
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('all');

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
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Специалисты Москвы
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-6">
                Найдите лучших врачей в столице
              </p>
              <div className="flex items-center justify-center gap-8 text-blue-100">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{specialists.length} специалистов</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>Москва</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 mb-6 h-auto">
              <TabsTrigger 
                value="all" 
                className="text-sm py-2"
                onClick={() => setSelectedSpecialization('all')}
              >
                Все специалисты
              </TabsTrigger>
              {specializations.slice(0, 4).map((spec) => (
                <TabsTrigger 
                  key={spec.id}
                  value={spec.id} 
                  className="text-sm py-2"
                  onClick={() => setSelectedSpecialization(spec.id)}
                >
                  {spec.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {filteredSpecialists.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="Специалисты не найдены"
                  description="По выбранным критериям специалисты не найдены."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

            {specializations.slice(0, 4).map((spec) => (
              <TabsContent key={spec.id} value={spec.id} className="space-y-6">
                {filteredSpecialists.length === 0 ? (
                  <EmptyState
                    icon={Users}
                    title={`${spec.name} не найдены`}
                    description={`В данный момент нет доступных специалистов по направлению "${spec.name}".`}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            ))}
          </Tabs>
        </div>
      </div>

      <MinimalFooter />
    </div>
  );
};

export default MoscowClinics;
