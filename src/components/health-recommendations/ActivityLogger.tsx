
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, Activity, User, Target, CheckCircle, FileText, TrendingUp } from 'lucide-react';
import { useActivityLogger } from '@/hooks/useActivityLogger';
import { ActivityLog } from '@/types/healthRecommendations';

const ActivityLogger: React.FC = () => {
  const { getActivityLogs } = useActivityLogger();
  const logs = getActivityLogs();

  const getActionIcon = (actionType: ActivityLog['action_type']) => {
    switch (actionType) {
      case 'profile_created': return <User className="h-4 w-4" />;
      case 'recommendation_generated': return <Target className="h-4 w-4" />;
      case 'checkup_created': return <Clock className="h-4 w-4" />;
      case 'checkup_completed': return <CheckCircle className="h-4 w-4" />;
      case 'goal_selected': return <Target className="h-4 w-4" />;
      case 'data_uploaded': return <FileText className="h-4 w-4" />;
      case 'analysis_performed': return <TrendingUp className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActionColor = (actionType: ActivityLog['action_type']) => {
    switch (actionType) {
      case 'profile_created': return 'bg-blue-100 text-blue-600';
      case 'recommendation_generated': return 'bg-green-100 text-green-600';
      case 'checkup_created': return 'bg-orange-100 text-orange-600';
      case 'checkup_completed': return 'bg-emerald-100 text-emerald-600';
      case 'goal_selected': return 'bg-purple-100 text-purple-600';
      case 'data_uploaded': return 'bg-indigo-100 text-indigo-600';
      case 'analysis_performed': return 'bg-pink-100 text-pink-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getActionName = (actionType: ActivityLog['action_type']) => {
    switch (actionType) {
      case 'profile_created': return 'Профиль создан';
      case 'recommendation_generated': return 'Рекомендация создана';
      case 'checkup_created': return 'Чекап запланирован';
      case 'checkup_completed': return 'Чекап завершён';
      case 'goal_selected': return 'Цель выбрана';
      case 'data_uploaded': return 'Данные загружены';
      case 'analysis_performed': return 'Анализ выполнен';
      default: return 'Действие';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Журнал активности
        </CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p>Журнал активности пуст</p>
            <p className="text-sm">Активность будет отображаться здесь</p>
          </div>
        ) : (
          <ScrollArea className="h-80">
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-lg ${getActionColor(log.action_type)}`}>
                    {getActionIcon(log.action_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">
                        {getActionName(log.action_type)}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleString('ru-RU')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900">{log.action_description}</p>
                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <div className="mt-2 text-xs text-gray-600">
                        {Object.entries(log.metadata).map(([key, value]) => (
                          <span key={key} className="mr-3">
                            {key}: {String(value)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityLogger;
