
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Heart, Users, TrendingUp } from 'lucide-react';

const QuickStatsCards: React.FC = () => {
  const stats = [
    {
      title: 'Активные рекомендации',
      value: '5',
      change: '+2 за неделю',
      icon: Activity,
      color: 'text-blue-600'
    },
    {
      title: 'Показатели здоровья',
      value: '8.5/10',
      change: '+0.3 за месяц',
      icon: Heart,
      color: 'text-red-600'
    },
    {
      title: 'Выполненных чекапов',
      value: '12',
      change: '+4 за неделю',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Прогресс целей',
      value: '75%',
      change: '+15% за месяц',
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-gray-500 mt-1">
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickStatsCards;
