
import React, { useState } from 'react';
import { Activity, Calendar, FileText, LineChart } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProtocolProgress } from '@/components/protocol/ProtocolProgress';
import { WellbeingTracker } from '@/components/protocol/WellbeingTracker';
import { SupplementsTracker } from '@/components/protocol/SupplementsTracker';
import { EventsList } from '@/components/protocol/EventsList';
import { AnalyticsView } from '@/components/protocol/AnalyticsView';
import { useProtocolData } from '@/hooks/useProtocolData';

const ProtocolTrackingDashboard = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const { protocol, protocolDay, isLoading } = useProtocolData(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!protocol) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Протокол не найден</h2>
        <p className="text-gray-600">Запрошенный протокол не существует или вы не имеете к нему доступа.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {/* Шапка */}
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold text-blue-700">{protocol.title}</h1>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-50 rounded-full px-3 py-1 text-sm flex items-center">
              <Calendar size={16} className="mr-1 text-blue-600" />
              <span>День {protocolDay} из {protocol.duration.split(' ')[0]}</span>
            </div>
            <div className="bg-green-50 rounded-full px-3 py-1 text-sm flex items-center">
              <Activity size={16} className="mr-1 text-green-600" />
              <span>Прогресс: {protocol.completion_percentage}%</span>
            </div>
          </div>
        </div>
      </header>

      {/* Навигация */}
      <nav className="bg-white border-b border-gray-200">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="container mx-auto">
          <TabsList className="bg-transparent border-b-0">
            <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
              <Activity size={18} className="mr-2" />
              Обзор
            </TabsTrigger>
            <TabsTrigger value="supplements" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
              <Calendar size={18} className="mr-2" />
              Добавки
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
              <LineChart size={18} className="mr-2" />
              Аналитика
            </TabsTrigger>
            <TabsTrigger value="tests" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
              <FileText size={18} className="mr-2" />
              Анализы
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </nav>

      {/* Основное содержимое */}
      <main className="container mx-auto p-4">
        <TabsContent value="overview" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Прогресс по протоколу */}
            <ProtocolProgress />

            {/* Сегодняшние добавки */}
            <SupplementsTracker />

            {/* Самочувствие */}
            <WellbeingTracker />

            {/* События */}
            <EventsList />
          </div>
        </TabsContent>

        <TabsContent value="supplements" className="mt-0">
          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Календарь приема добавок</h2>
            <SupplementsTracker />
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-0">
          <AnalyticsView />
        </TabsContent>
        
        <TabsContent value="tests" className="mt-0">
          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Результаты анализов</h2>
            <div className="space-y-4">
              <div className="p-4 border border-dashed border-gray-300 rounded-lg flex justify-center items-center">
                <div className="flex flex-col items-center space-y-2">
                  <FileText className="h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-500">Загрузите результаты анализов для отслеживания прогресса</p>
                  <button className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full hover:bg-blue-100">
                    Загрузить файл
                  </button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </main>
    </div>
  );
};

export default ProtocolTrackingDashboard;
