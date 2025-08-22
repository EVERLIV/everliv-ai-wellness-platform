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
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-500';
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
    <div className="space-y-3 md:space-y-4 px-4 md:px-0">
      <h3 className="text-base md:text-lg font-bold text-gray-900">Показатели здоровья</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="bg-white rounded-lg md:rounded-xl p-3 md:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
          >
          <div className="flex items-start justify-between mb-3 md:mb-4">
            <div
              className="p-2 md:p-3 rounded-lg md:rounded-xl"
              style={{ backgroundColor: metric.bgColor }}
            >
              <span style={{ color: metric.color }} className="block w-4 h-4 md:w-6 md:h-6">
                {React.cloneElement(metric.icon as React.ReactElement, {
                  className: "w-4 h-4 md:w-6 md:h-6"
                })}
              </span>
            </div>
              
              <div className={`flex items-center space-x-1 text-xs md:text-sm ${getTrendColor(metric.trend)}`}>
                <span>{getTrendIcon(metric.trend)}</span>
                <span>{metric.trendValue}</span>
              </div>
            </div>
            
          <div>
            <h4 className="text-xs md:text-sm font-medium text-gray-600 mb-1">{metric.title}</h4>
            <div className="flex items-baseline space-x-1">
              <span className="text-lg md:text-2xl font-bold text-gray-900">{metric.value}</span>
              {metric.unit && (
                <span className="text-xs md:text-sm text-gray-500">{metric.unit}</span>
              )}
            </div>
          </div>
          </div>
        ))}
      </div>
    </div>
  );
};