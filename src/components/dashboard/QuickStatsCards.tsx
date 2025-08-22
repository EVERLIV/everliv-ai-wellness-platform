
import React from 'react';
import { MetricCard } from '@/design-system/components/HealthMetrics';
import { HealthMetricsGrid } from '@/design-system/components/HealthLayout';
import { Activity, Heart, Users, TrendingUp } from 'lucide-react';

const QuickStatsCards: React.FC = () => {
  const stats = [
    {
      title: 'Активные рекомендации',
      value: 5,
      status: 'normal' as const,
      change: { value: 2, trend: 'up' as const, period: 'неделя' },
      icon: <Activity className="w-5 h-5" />,
    },
    {
      title: 'Показатели здоровья',
      value: '8.5/10',
      status: 'optimal' as const,
      change: { value: 3, trend: 'up' as const, period: 'месяц' },
      icon: <Heart className="w-5 h-5" />,
    },
    {
      title: 'Выполненных чекапов',
      value: 12,
      status: 'normal' as const,
      change: { value: 4, trend: 'up' as const, period: 'неделя' },
      icon: <Users className="w-5 h-5" />,
    },
    {
      title: 'Прогресс целей',
      value: '75%',
      status: 'warning' as const,
      change: { value: 15, trend: 'up' as const, period: 'месяц' },
      icon: <TrendingUp className="w-5 h-5" />,
    }
  ];

  return (
    <HealthMetricsGrid layout="2x2" className="md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <MetricCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          status={stat.status}
          change={stat.change}
          interactive
          chart={
            <div className="flex justify-center mt-2 text-eva-primary">
              {stat.icon}
            </div>
          }
        />
      ))}
    </HealthMetricsGrid>
  );
};

export default QuickStatsCards;
