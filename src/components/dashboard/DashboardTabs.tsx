
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Brain, Target, BarChart3, Sparkles } from 'lucide-react';
import DashboardHealthSummary from './DashboardHealthSummary';
import QuickActionsCard from './QuickActionsCard';
import AIFeaturesSection from './AIFeaturesSection';
import AnalysisHistoryCard from './AnalysisHistoryCard';
import ProtocolRecommendations from './ProtocolRecommendations';

const DashboardTabs = () => {
  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Обзор
        </TabsTrigger>
        <TabsTrigger value="ai-recommendations" className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          AI Рекомендации
        </TabsTrigger>
        <TabsTrigger value="ai-features" className="flex items-center gap-2">
          <Brain className="h-4 w-4" />
          AI Функции
        </TabsTrigger>
        <TabsTrigger value="protocols" className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          Протоколы
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Аналитика
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DashboardHealthSummary />
          </div>
          <div className="space-y-6">
            <QuickActionsCard />
            <AnalysisHistoryCard />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="ai-recommendations">
        <ProtocolRecommendations />
      </TabsContent>

      <TabsContent value="ai-features">
        <AIFeaturesSection />
      </TabsContent>

      <TabsContent value="protocols">
        <div className="text-center py-8">
          <p className="text-gray-500">Раздел протоколов в разработке</p>
        </div>
      </TabsContent>

      <TabsContent value="analytics">
        <div className="text-center py-8">
          <p className="text-gray-500">Подробная аналитика в разработке</p>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
