import React from 'react';
import { Activity, Zap, TrendingUp, Award } from 'lucide-react';

interface LifestyleHeroProps {
  userName: string;
}

export const LifestyleHero: React.FC<LifestyleHeroProps> = ({ userName }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-fuchsia-500/10 rounded-3xl p-8 mb-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)]"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Profile Circle */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 p-0.5">
                <div className="w-full h-full rounded-full bg-white/90 flex items-center justify-center">
                  <Activity className="w-8 h-8 text-violet-600" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
            </div>
            
            {/* Welcome Text */}
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Привет, {userName}! 👋
              </h1>
              <p className="text-xl text-gray-600 mt-2">
                Готов к новому дню достижений?
              </p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="hidden md:flex space-x-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 mb-2">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">92%</div>
              <div className="text-sm text-gray-500">Health Score</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 mb-2">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">12.5k</div>
              <div className="text-sm text-gray-500">Steps Today</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 mb-2">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">5</div>
              <div className="text-sm text-gray-500">Goals Hit</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};