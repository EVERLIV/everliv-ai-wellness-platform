
import React from 'react';
import Header from '@/components/Header';
import DailyTrackingForm from '@/components/health-tracking/DailyTrackingForm';
import HealthGoalsManager from '@/components/health-tracking/HealthGoalsManager';
import DynamicHealthScore from '@/components/health-tracking/DynamicHealthScore';
import MinimalFooter from '@/components/MinimalFooter';
import { Activity } from 'lucide-react';

const HealthTracking = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="pt-16 flex-grow">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Activity className="h-8 w-8 text-blue-600" />
              Трекинг здоровья
            </h1>
            <p className="text-gray-600">
              Отслеживайте свое здоровье каждый день и достигайте поставленных целей
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Основная колонка с формой трекинга */}
            <div className="lg:col-span-2 space-y-8">
              <DailyTrackingForm />
              <HealthGoalsManager />
            </div>

            {/* Боковая панель с динамическим баллом и прогрессом */}
            <div className="lg:col-span-1">
              <DynamicHealthScore />
            </div>
          </div>
        </div>
      </div>
      <MinimalFooter />
    </div>
  );
};

export default HealthTracking;
