import React from 'react';
import { Flame, Footprints, Heart } from 'lucide-react';

interface Ring {
  percentage: number;
  color: string;
  label: string;
  value: string;
  icon: React.ReactNode;
}

export const ActivityRings: React.FC = () => {
  const rings: Ring[] = [
    {
      percentage: 85,
      color: '#ff6b6b',
      label: 'Калории',
      value: '2,150',
      icon: <Flame className="w-5 h-5" />
    },
    {
      percentage: 67,
      color: '#4ecdc4',
      label: 'Шаги',
      value: '8,420',
      icon: <Footprints className="w-5 h-5" />
    },
    {
      percentage: 92,
      color: '#45b7d1',
      label: 'Активность',
      value: '45 мин',
      icon: <Heart className="w-5 h-5" />
    }
  ];

  const createRingPath = (percentage: number, radius: number) => {
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    return { strokeDasharray, strokeDashoffset };
  };

  return (
    <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-100">
      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">Активность сегодня</h3>
      
      <div className="flex items-center justify-center mb-4 md:mb-6">
        <div className="relative w-32 h-32 md:w-40 md:h-40">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {rings.map((ring, index) => {
              const radius = 35 - index * 8;
              const { strokeDasharray, strokeDashoffset } = createRingPath(ring.percentage, radius);
              
              return (
                <g key={index}>
                  {/* Background ring */}
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="4"
                  />
                  {/* Progress ring */}
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke={ring.color}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-out"
                  />
                </g>
              );
            })}
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-gray-900">78%</div>
              <div className="text-xs md:text-sm text-gray-500">Общий прогресс</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ring legends */}
      <div className="space-y-3">
        {rings.map((ring, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: ring.color }}
              ></div>
              <div className="flex items-center space-x-2">
                <span style={{ color: ring.color }}>{ring.icon}</span>
                <span className="text-gray-600">{ring.label}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900">{ring.value}</div>
              <div className="text-sm text-gray-500">{ring.percentage}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};