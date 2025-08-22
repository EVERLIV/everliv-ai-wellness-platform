import React from 'react';
import { Activity, Zap, TrendingUp, Award } from 'lucide-react';

interface LifestyleHeroProps {
  userName: string;
}

export const LifestyleHero: React.FC<LifestyleHeroProps> = ({ userName }) => {
  return (
    <div className="px-4 md:px-8 py-6 md:py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2 leading-tight">
            Добро пожаловать,<br className="md:hidden" />
            <span className="block md:inline"> {userName}!</span>
          </h1>
          <p className="text-base md:text-lg text-slate-600 font-normal">
            Ваша персональная панель здоровья
          </p>
        </div>
      </div>
    </div>
  );
};