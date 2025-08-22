import React from 'react';
import { Activity, Zap, TrendingUp, Award } from 'lucide-react';

interface LifestyleHeroProps {
  userName: string;
}

export const LifestyleHero: React.FC<LifestyleHeroProps> = ({ userName }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30 border-b border-slate-200/50">
      {/* Современный паттерн с анимацией */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(99,102,241,0.05),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(168,85,247,0.03),transparent_50%)]"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-violet-300/10 to-indigo-300/10 rounded-full blur-3xl animate-pulse-slow"></div>
      
      {/* Glassmorphism контент */}
      <div className="relative z-10 px-8 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-xl rounded-2xl px-6 py-4 shadow-xl border border-white/20">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight">
                  Добро пожаловать, {userName}
                </h1>
                <p className="text-slate-600 font-medium">
                  Ваша персональная панель здоровья
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};