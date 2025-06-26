
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity, CheckCircle, Target, FileText } from 'lucide-react';

const RecentActivityFeed: React.FC = () => {
  const activities = [
    {
      id: '1',
      type: 'checkup_completed',
      title: 'Чекап выполнен',
      description: 'Анализ крови на витамины',
      time: '2 часа назад',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: '2',
      type: 'recommendation_created',
      title: 'Новая рекомендация',
      description: 'Увеличить потребление витамина D',
      time: '5 часов назад',
      icon: Target,
      color: 'text-blue-600'
    },
    {
      id: '3',
      type: 'goal_updated',
      title: 'Цель обновлена',
      description: 'Прогресс по улучшению сна: 80%',
      time: '1 день назад',
      icon: Activity,
      color: 'text-purple-600'
    },
    {
      id: '4',
      type: 'data_uploaded',
      title: 'Данные загружены',
      description: 'Результаты анализов добавлены',
      time: '2 дня назад',
      icon: FileText,
      color: 'text-orange-600'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Последняя активность
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-3">
            {activities.map((activity) => {
              const IconComponent = activity.icon;
              return (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <IconComponent className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm text-gray-900">
                        {activity.title}
                      </h4>
                      <Badge variant="secondary" className="text-xs">
                        {activity.time}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecentActivityFeed;
