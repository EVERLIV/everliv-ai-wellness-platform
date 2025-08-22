import React from 'react';
import { Activity, Zap, TrendingUp, Award } from 'lucide-react';

interface LifestyleHeroProps {
  userName: string;
}

export const LifestyleHero: React.FC<LifestyleHeroProps> = ({ userName }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 text-gray-800">
      {/* Более мягкий паттерн */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(100,100,100,0.05),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(120,120,120,0.03),transparent_50%)]"></div>
      
      {/* Минималистичный контент */}
      <div className="relative z-10 px-6 py-4 md:py-6">
        <div className="w-full">
          <div className="text-center">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
              Привет, {userName}! 👋
            </h1>
            <p className="text-sm text-gray-600">
              Панель управления здоровьем
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};