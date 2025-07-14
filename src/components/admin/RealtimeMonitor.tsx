import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { realtimeManager } from '@/services/realtime/RealtimeManager';
import { Activity, Database, Users, Trash2 } from 'lucide-react';

const RealtimeMonitor: React.FC = () => {
  const [stats, setStats] = useState(realtimeManager.getStats());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshStats = () => {
    setIsRefreshing(true);
    setStats(realtimeManager.getStats());
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleCleanup = () => {
    realtimeManager.cleanup();
    refreshStats();
  };

  useEffect(() => {
    const interval = setInterval(refreshStats, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Realtime Monitor</h2>
        <div className="flex gap-2">
          <Button 
            onClick={refreshStats} 
            disabled={isRefreshing}
            variant="outline"
            size="sm"
          >
            <Activity className="h-4 w-4 mr-2" />
            {isRefreshing ? 'Обновление...' : 'Обновить'}
          </Button>
          <Button 
            onClick={handleCleanup}
            variant="destructive"
            size="sm"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Очистить все
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Активные каналы
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeChannels}</div>
            <p className="text-xs text-muted-foreground">
              Открытые WebSocket соединения
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Подписки
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubscribers}</div>
            <p className="text-xs text-muted-foreground">
              Активные подписки компонентов
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Статус
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge 
              variant={stats.activeChannels > 10 ? "destructive" : "secondary"}
              className="text-sm"
            >
              {stats.activeChannels > 10 ? 'Много каналов' : 'Оптимально'}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              Рекомендуется &lt; 10 каналов
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Активные каналы</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.channels.length === 0 ? (
              <p className="text-muted-foreground text-sm">Нет активных каналов</p>
            ) : (
              stats.channels.map((channel, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm"
                >
                  <code className="text-xs">{channel}</code>
                  <Badge variant="outline" className="text-xs">
                    active
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Рекомендации по оптимизации</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {stats.activeChannels > 10 && (
            <div className="p-3 bg-destructive/10 rounded-md">
              <p className="font-medium text-destructive">⚠️ Слишком много каналов</p>
              <p className="text-muted-foreground">
                Рекомендуется использовать меньше 10 одновременных каналов для оптимальной производительности.
              </p>
            </div>
          )}
          
          <div className="p-3 bg-blue-50 rounded-md">
            <p className="font-medium text-blue-700">💡 Советы по оптимизации:</p>
            <ul className="text-muted-foreground mt-1 space-y-1">
              <li>• Используйте фиксированные имена каналов без Date.now()</li>
              <li>• Объединяйте схожие подписки в один канал</li>
              <li>• Отписывайтесь от каналов при размонтировании компонентов</li>
              <li>• Используйте useOptimizedRealtime для переиспользования каналов</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealtimeMonitor;