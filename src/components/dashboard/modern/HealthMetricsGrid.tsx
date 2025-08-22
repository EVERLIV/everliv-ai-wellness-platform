import React from 'react';
import { Heart, Droplet, Thermometer, Zap, Moon, Brain } from 'lucide-react';

interface MetricCard {
  id: string;
  title: string;
  value: string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

export const HealthMetricsGrid: React.FC = () => {
  const metrics: MetricCard[] = [
    {
      id: 'heart-rate',
      title: 'Пульс',
      value: '72',
      unit: 'уд/мин',
      trend: 'stable',
      trendValue: '+2',
      icon: <Heart className="w-6 h-6" />,
      color: '#ef4444',
      bgColor: '#fef2f2'
    },
    {
      id: 'blood-pressure',
      title: 'Давление',
      value: '120/80',
      unit: 'мм рт. ст.',
      trend: 'down',
      trendValue: '-5',
      icon: <Droplet className="w-6 h-6" />,
      color: '#3b82f6',
      bgColor: '#eff6ff'
    },
    {
      id: 'temperature',
      title: 'Температура',
      value: '36.6',
      unit: '°C',
      trend: 'stable',
      trendValue: '0',
      icon: <Thermometer className="w-6 h-6" />,
      color: '#f59e0b',
      bgColor: '#fffbeb'
    },
    {
      id: 'energy',
      title: 'Энергия',
      value: '85',
      unit: '%',
      trend: 'up',
      trendValue: '+12',
      icon: <Zap className="w-6 h-6" />,
      color: '#10b981',
      bgColor: '#ecfdf5'
    },
    {
      id: 'sleep',
      title: 'Сон',
      value: '7h 32m',
      unit: '',
      trend: 'up',
      trendValue: '+45m',
      icon: <Moon className="w-6 h-6" />,
      color: '#8b5cf6',
      bgColor: '#f5f3ff'
    },
    {
      id: 'stress',
      title: 'Стресс',
      value: '23',
      unit: '%',
      trend: 'down',
      trendValue: '-8',
      icon: <Brain className="w-6 h-6" />,
      color: '#06b6d4',
      bgColor: '#ecfeff'
    }
  ];

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-emerald-600';
      case 'down': return 'text-red-500';
      default: return 'text-slate-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '→';
    }
  };

  return (
    <div className="space-y-6 px-6 md:px-8">
      <div className="flex items-center gap-3">
        <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"></div>
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">Показатели здоровья</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="group relative bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden"
          >
            {/* Gradient overlay */}
            <div 
              className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl"
              style={{ background: `linear-gradient(135deg, ${metric.color}, ${metric.color}80)` }}
            ></div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300"
                  style={{ 
                    background: `linear-gradient(135deg, ${metric.color}15, ${metric.color}25)`,
                    border: `1px solid ${metric.color}20`
                  }}
                >
                  <span style={{ color: metric.color }} className="block">
                    {React.cloneElement(metric.icon as React.ReactElement, {
                      className: "w-6 h-6"
                    })}
                  </span>
                </div>
                
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${getTrendColor(metric.trend)} bg-white/50 border border-current/20`}>
                  <span className="text-lg font-bold">{getTrendIcon(metric.trend)}</span>
                  <span className="font-bold">{metric.trendValue}</span>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">{metric.title}</h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-800">{metric.value}</span>
                  {metric.unit && (
                    <span className="text-sm text-slate-500 font-medium">{metric.unit}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};