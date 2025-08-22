import React from 'react';
import { Activity, Zap, TrendingUp, Award } from 'lucide-react';

interface LifestyleHeroProps {
  userName: string;
}

export const LifestyleHero: React.FC<LifestyleHeroProps> = ({ userName }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]"></div>
      
      {/* Content */}
      <div className="relative z-10 px-4 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Мобильная версия */}
          <div className="block md:hidden">
            <div className="text-center space-y-6">
              {/* Profile Circle */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm p-0.5">
                    <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center">
                      <Activity className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              
              {/* Welcome Text */}
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Привет, {userName}! 👋
                </h1>
                <p className="text-lg text-white/80">
                  Готов к новому дню достижений?
                </p>
              </div>
              
              {/* Mobile Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm mx-auto mb-2">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">92%</div>
                  <div className="text-sm text-white/70">Health Score</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm mx-auto mb-2">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">12.5k</div>
                  <div className="text-sm text-white/70">Шагов</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm mx-auto mb-2">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">5</div>
                  <div className="text-sm text-white/70">Целей</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Десктопная версия */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm p-0.5">
                  <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center">
                    <Activity className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div>
                <h1 className="text-4xl font-bold text-white">
                  Привет, {userName}! 👋
                </h1>
                <p className="text-xl text-white/80 mt-2">
                  Готов к новому дню достижений?
                </p>
              </div>
            </div>
            
            <div className="flex space-x-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm mb-2">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">92%</div>
                <div className="text-sm text-white/70">Health Score</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm mb-2">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">12.5k</div>
                <div className="text-sm text-white/70">Шагов сегодня</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm mb-2">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">5</div>
                <div className="text-sm text-white/70">Целей достигнуто</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};